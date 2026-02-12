export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

let price = 1.1000;

export function getMockCandle(): Candle {
  const move = (Math.random() - 0.5) * 0.001;

  const open = price;
  const close = price + move;
  const high = Math.max(open, close) + Math.random() * 0.0002;
  const low = Math.min(open, close) - Math.random() * 0.0002;

  price = close;

  return {
    time: Date.now(),
    open,
    high,
    low,
    close
  };
}