import { Candle } from "../market/feed";

export interface Level {
  price: number;
  touches: number;
}

const TOLERANCE = 0.0003;
const MIN_TOUCHES = 3;

export function detectLevels(candles: Candle[]): {
  support: Level[];
  resistance: Level[];
} {
  const supports: Level[] = [];
  const resistances: Level[] = [];

  for (let i = 1; i < candles.length - 1; i++) {
    const prev = candles[i - 1];
    const curr = candles[i];
    const next = candles[i + 1];

    // Swing low (support)
    if (curr.low < prev.low && curr.low < next.low) {
      registerLevel(supports, curr.low);
    }

    // Swing high (resistance)
    if (curr.high > prev.high && curr.high > next.high) {
      registerLevel(resistances, curr.high);
    }
  }

  return {
    support: supports.filter(l => l.touches >= MIN_TOUCHES),
    resistance: resistances.filter(l => l.touches >= MIN_TOUCHES)
  };
}

function registerLevel(levels: Level[], price: number) {
  const level = levels.find(
    l => Math.abs(l.price - price) <= TOLERANCE
  );

  if (level) {
    level.touches++;
  } else {
    levels.push({ price, touches: 1 });
  }
}