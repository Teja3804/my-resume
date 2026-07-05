const ENGINE_URL = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/engine/stockfish.js`;

/**
 * Thin UCI wrapper around the Stockfish web worker. Only one search runs at a
 * time; callers must await goBestMove() before issuing another command.
 */
export class StockfishClient {
  constructor() {
    this.worker = new Worker(ENGINE_URL);
    this.queue = Promise.resolve();
    this.ready = new Promise((resolve) => {
      this._resolveReady = resolve;
    });
    this.worker.onmessage = (e) => {
      if (e.data === "uciok") this.send("isready");
      if (e.data === "readyok") this._resolveReady();
    };
    this.send("uci");
  }

  send(cmd) {
    this.worker.postMessage(cmd);
  }

  async init() {
    await this.ready;
  }

  async setStrength({ elo, limitStrength, skillLevel }) {
    await this.ready;
    this.send(`setoption name UCI_LimitStrength value ${limitStrength}`);
    if (limitStrength) {
      this.send(`setoption name UCI_Elo value ${elo}`);
    } else {
      this.send(`setoption name Skill Level value ${skillLevel}`);
    }
  }

  runExclusive(fn) {
    const result = this.queue.then(fn, fn);
    this.queue = result.catch(() => undefined);
    return result;
  }

  /** Run a search on a position and resolve with the best move + evaluation. */
  goBestMove(fen, opts = {}, onInfo) {
    return this.runExclusive(async () => {
      await this.ready;
      return new Promise((resolve) => {
        let best = { cp: 0, pvUci: [], depth: 0 };

        const handler = (e) => {
          const line = e.data;
          if (line.startsWith("info") && line.includes("score")) {
            const parsed = parseInfoLine(line);
            if (parsed) {
              best = { ...best, ...parsed };
              onInfo?.({ ...parsed, raw: line });
            }
          } else if (line.startsWith("bestmove")) {
            const parts = line.split(" ");
            best.bestMoveUci = parts[1];
            this.worker.removeEventListener("message", handler);
            resolve(best);
          }
        };
        this.worker.addEventListener("message", handler);

        this.send(`position fen ${fen}`);
        if (opts.depth) {
          this.send(`go depth ${opts.depth}`);
        } else {
          this.send(`go movetime ${opts.moveTimeMs ?? 500}`);
        }
      });
    });
  }

  stop() {
    this.send("stop");
  }

  destroy() {
    this.worker.terminate();
  }
}

function parseInfoLine(line) {
  const tokens = line.split(" ");
  const result = { pvUci: [] };
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "depth") result.depth = Number(tokens[i + 1]);
    if (tokens[i] === "score" && tokens[i + 1] === "cp") {
      result.cp = Number(tokens[i + 2]);
      result.mate = undefined;
    }
    if (tokens[i] === "score" && tokens[i + 1] === "mate") {
      result.mate = Number(tokens[i + 2]);
      result.cp = result.mate > 0 ? 10000 - result.mate : -10000 - result.mate;
    }
    if (tokens[i] === "pv") {
      result.pvUci = tokens.slice(i + 1);
      result.bestMoveUci = result.pvUci[0];
      break;
    }
  }
  if (result.cp === undefined) return null;
  return result;
}
