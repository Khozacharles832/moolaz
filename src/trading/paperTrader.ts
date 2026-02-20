import { prisma } from "../db/prisma";
import { calculateRisk } from "./riskEngine";
import { calculateLotSize } from "./positionSizing";

type TradeSide = "buy" | "sell";

export async function openTrade(
  type: "buy" | "sell",
  price: number
) {
  const account = await prisma.account.findFirst();

  if (!account) {
    throw new Error("Account not initialized");
  }

  const risk = calculateRisk(type, price);

  const lotSize = calculateLotSize(
    account.balance,
    1, // risk 1%
    price,
    risk.stopLoss
  );

  const trade = await prisma.trade.create({
    data: {
      type: type === "buy" ? "BUY" : "SELL",
      entry: price,
      stopLoss: risk.stopLoss,
      takeProfit: risk.takeProfit,
      lotSize,
      status: "OPEN",
    },
  });

  console.log(
    `[OPEN] ${type.toUpperCase()} @ ${price}
     SL: ${risk.stopLoss}
     TP: ${risk.takeProfit}
     LOT: ${lotSize}`
  );

  return trade;
}