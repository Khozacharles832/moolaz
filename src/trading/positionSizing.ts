const PIP = 0.0001;
const PIP_VALUE_PER_LOT = 10; // EURUSD standard lot

export function calculateLotSize(
  balance: number,
  riskPercent: number,
  entry: number,
  stopLoss: number
) {
  const riskAmount = balance * (riskPercent / 100);

  const stopDistance = Math.abs(entry - stopLoss);
  const stopPips = stopDistance / PIP;

  const lotSize = riskAmount / (stopPips * PIP_VALUE_PER_LOT);

  return parseFloat(lotSize.toFixed(2));
}