import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calcPercentage, formatNumber } from "../../common/utils.ts";
import { TickerStreamData } from "../../common/types.ts";

export interface IPortfolioItem {
  baseAsset: string;
  symbol: string;
  amount: number;
  lastPrice: number;
  usdAmount: number;
  priceChangePercent: number;
  portfolioPercentage: number;
}

interface PortfolioState {
  portfolioItems: IPortfolioItem[];
}

const initialState: PortfolioState = {
  portfolioItems: [],
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    portfolioItemAdded(state: PortfolioState, action: PayloadAction<IPortfolioItem>) {
      const payloadItem = action.payload;
      const portfolioItems = state.portfolioItems;

      const item = portfolioItems.find((item) => item.baseAsset === payloadItem.baseAsset);

      if (item) {
        const itemIdx = portfolioItems.indexOf(item);

        if (itemIdx > -1) {
          portfolioItems[itemIdx].amount += payloadItem.amount;
        }
      } else {
        portfolioItems.push(payloadItem);
      }

      const totalAmount: number = portfolioItems
        .map((v) => v.amount)
        .reduce((a, b) => a + b);

      portfolioItems.forEach((item) => {
        item.portfolioPercentage = calcPercentage(item.amount, totalAmount);
      });
    },
    portfolioItemUpdated(state: PortfolioState, action: PayloadAction<TickerStreamData>) {
      const portfolioItems = state.portfolioItems;
      const { lastPrice, priceChangePercent, symbol } = action.payload;

      const item = portfolioItems.find((item) => item.symbol.toLowerCase() === symbol);

      if (item) {
        const itemIdx = portfolioItems.indexOf(item);

        if (itemIdx > -1) {
          portfolioItems[itemIdx].lastPrice = Number(formatNumber(lastPrice));
          portfolioItems[itemIdx].priceChangePercent = priceChangePercent;
          portfolioItems[itemIdx].usdAmount = lastPrice * portfolioItems[itemIdx].amount;
        }
      }
    },
    portfolioItemDeleted(state: PortfolioState, action: PayloadAction<number>) {
      const idx = action.payload;
      state.portfolioItems.splice(idx, 1);
    },
  },
  selectors: {
    selectPortfolioItems: (state) => state.portfolioItems,
  },
});

export default portfolioSlice.reducer;

export const {
  portfolioItemAdded,
  portfolioItemUpdated,
  portfolioItemDeleted,
} = portfolioSlice.actions;

export const { selectPortfolioItems } = portfolioSlice.selectors;