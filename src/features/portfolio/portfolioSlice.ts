import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calcPercentage } from "../../common/utils.ts";

export interface IPortfolioItem {
  baseAsset: string;
  quoteAsset: string;
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

export const { portfolioItemAdded, portfolioItemDeleted } = portfolioSlice.actions;

export const { selectPortfolioItems } = portfolioSlice.selectors;