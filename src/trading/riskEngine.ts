const PIP = 0.0001;

const STOP_PIPS = 15;
const TAKE_PIPS = 30;

export function calculateRisk(
  type: "buy" | "sell",
  entry: number
) {
  if (type === "buy") {
    return {
      stopLoss: entry - STOP_PIPS * PIP,
      takeProfit: entry + TAKE_PIPS * PIP,
    };
  }

  // sell
  return {
    stopLoss: entry + STOP_PIPS * PIP,
    takeProfit: entry - TAKE_PIPS * PIP,
  };
}