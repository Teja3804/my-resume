// Stockfish (this build) reports UCI_Elo range 1320-3190. Below that floor we
// approximate weaker play with a low Skill Level instead, since UCI_Elo can't
// go lower.
const ELO_FLOOR = 1320;

export const OPPONENT_RATINGS = [800, 1000, 1200, 1500, 1800, 2000, 2200, 2500];

export const DEFAULT_RATING = 1500;

export function strengthForRating(rating) {
  if (rating >= ELO_FLOOR) {
    return {
      rating,
      limitStrength: true,
      elo: Math.min(rating, 3190),
      moveTimeMs: Math.round(350 + (rating - ELO_FLOOR) * 0.9),
    };
  }
  // Below the engine's Elo floor: fall back to Skill Level + a short clock,
  // scaled linearly from 0 (800) to 4 (just under the floor).
  const skillLevel = Math.max(0, Math.round(((rating - 800) / (ELO_FLOOR - 800)) * 4));
  return {
    rating,
    limitStrength: false,
    skillLevel,
    moveTimeMs: 200 + skillLevel * 20,
  };
}

export function ratingLabel(rating) {
  if (rating < 1000) return `${rating} · Beginner`;
  if (rating < 1400) return `${rating} · Casual`;
  if (rating < 1700) return `${rating} · Club player`;
  if (rating < 2000) return `${rating} · Advanced`;
  if (rating < 2300) return `${rating} · Expert`;
  return `${rating} · Master`;
}
