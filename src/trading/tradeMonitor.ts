import { prisma } from "../db/prisma";

export async function monitorTrades(price: number) {
  const openTrades = await prisma.trade.findMany({
    where: { status: "OPEN" },
  });

  for (const trade of openTrades) {
    let shouldClose = false;
    const exit = price;

    if (trade.type === "BUY") {
      if (price <= trade.stopLoss) shouldClose = true;
      if (price >= trade.takeProfit) shouldClose = true;
    }

    if (trade.type === "SELL") {
      if (price >= trade.stopLoss) shouldClose = true;
      if (price <= trade.takeProfit) shouldClose = true;
    }

    if (shouldClose) {
      const priceDiff =
        trade.type === "BUY"
          ? exit - trade.entry
          : trade.entry - exit;

      const lot = trade.lotSize ?? 0;

      const profit =
        (priceDiff / 0.0001) * 10 * lot;

      // 🔐 DRAW DOWN LOGIC STARTS HERE

      const account = await prisma.account.findUnique({
        where: { id: 1 },
      });

      if (!account || !account.isTrading) {
        console.log("Trading disabled due to drawdown");
        continue; // use continue instead of return
      }

      const currentPeak = account.peakBalance ?? account.balance;
      const newBalance = account.balance + profit;
      const newPeak = Math.max(currentPeak, newBalance);

      const drawdown =
        (newPeak - newBalance) / newPeak;

      const MAX_DRAWDOWN = 0.1;

      await prisma.account.update({
        where: { id: 1 },
        data: {
          balance: newBalance,
          equity: newBalance,
          peakBalance: newPeak,
          isTrading: drawdown < MAX_DRAWDOWN,
        },
      });

      // 🔐 DRAW DOWN LOGIC ENDS HERE

      await prisma.trade.update({
        where: { id: trade.id },
        data: {
          exit,
          profit,
          status: "CLOSED",
          closedAt: new Date(),
        },
      });

      console.log(
        `[CLOSE] Trade ${trade.id} @ ${exit} | PnL: ${profit.toFixed(2)}`
      );
    }
  }
}