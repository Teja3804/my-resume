"use client";

import { useEffect, useRef, useState } from "react";
import { StockfishClient } from "./stockfishClient";

/** Owns one Stockfish worker for the lifetime of the calling component. */
export function useStockfishInstance() {
  const clientRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const client = new StockfishClient();
    clientRef.current = client;
    client.init().then(() => setReady(true));
    return () => {
      client.destroy();
      clientRef.current = null;
    };
  }, []);

  return { client: clientRef, ready };
}
