interface Trade {
  type: "buy" | "sell";
  entry: number;
  time: number;
}

export const trades: Trade[] = [];

export function openTrade(type: "buy" | "sell", price: number) {
  trades.push({
    type,
    entry: price,
    time: Date.now()
  });

  console.log("Paper trade:", type, price);
}