import { FastifyInstance } from "fastify";
import { getMockCandle } from "../market/feed";
import { detectLevels } from "../strategy/supportResistance";
import { openTrade, trades } from "../trading/paperTrader";

const candles: any[] = [];

export function setupRoutes(app: FastifyInstance) {

  app.get("/tick", async () => {
    const candle = getMockCandle();
    candles.push(candle);

    if (candles.length > 200) candles.shift();

    const levels = detectLevels(candles);

    const price = candle.close;

    levels.support.forEach(l => {
      if (Math.abs(price - l.price) < 0.0002) {
        openTrade("buy", price);
      }
    });

    levels.resistance.forEach(l => {
      if (Math.abs(price - l.price) < 0.0002) {
        openTrade("sell", price);
      }
    });

    return {
      candle,
      levels,
      trades
    };
  });
}