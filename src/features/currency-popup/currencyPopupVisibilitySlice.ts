import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { portfolioItemAdded } from "../portfolio/portfolioSlice.ts";

interface CurrencyPopupVisibilityState {
  isVisible: boolean;
}

const initialState: CurrencyPopupVisibilityState = {
  isVisible: false,
};

const currencyPopupVisibilitySlice = createSlice({
  name: "currencyPopupVisibility",
  initialState,
  reducers: {
    currencyPopupVisibilityChanged(
      state: CurrencyPopupVisibilityState, action: PayloadAction<boolean>) {
      state.isVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(portfolioItemAdded, (state) => {
      state.isVisible = false;
    });
  },
  selectors: {
    selectCurrencyPopupVisibility: (state) => state.isVisible,
  },
});

export default currencyPopupVisibilitySlice.reducer;

export const { currencyPopupVisibilityChanged } = currencyPopupVisibilitySlice.actions;

export const { selectCurrencyPopupVisibility } = currencyPopupVisibilitySlice.selectors;