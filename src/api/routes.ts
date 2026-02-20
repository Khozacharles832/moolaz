import { monitorTrades } from "../trading/tradeMonitor";
import { FastifyInstance } from "fastify";
import { getMockCandle } from "../market/feed";
import { detectLevels } from "../strategy/supportResistance";
import { openTrade } from "../trading/paperTrader";
import { prisma } from "../db/prisma";

import type { Candle as MarketCandle } from "../market/feed";

const candles: MarketCandle[] = [];

export function setupRoutes(app: FastifyInstance) {
  app.get("/tick", async () => {
    try {
      // 1. Generate candle (mock for now)
      const candle = getMockCandle();

      // 2. Keep in-memory history (for analysis)
      candles.push(candle);

      if (candles.length > 300) {
        candles.shift();
      }

      // 3. Save candle to DB
      await prisma.candle.create({
        data: {
          time: new Date(candle.time),
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        },
      });

      // 4. Detect levels
      const levels = detectLevels(candles);

      const price = candle.close;
      await monitorTrades(price);

      // 5. Trading logic (paper trades)
      for (const support of levels.support) {
        if (Math.abs(price - support.price) <= 0.0002) {
          await openTrade("buy", price);
        }
      }

      for (const resistance of levels.resistance) {
        if (Math.abs(price - resistance.price) <= 0.0002) {
          await openTrade("sell", price);
        }
      }

        // TEMP TEST: open trade every 20 ticks
/*if (candles.length % 20 === 0) {
  await openTrade(
    Math.random() > 0.5 ? "buy" : "sell",
    price
  );
}*/

      // 6. Return state
      return {
        candle,
        levels,
        status: "ok",
      };
    } catch (error) {
      app.log.error(error);

      return {
        status: "error",
        message: "Failed to process tick",
      };
    }
  });
}