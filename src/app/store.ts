import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice.ts";
import currencyPopupReducer from "../features/currency-popup/currencyPopupVisibilitySlice.ts";
import portfolioReducer from "../features/portfolio/portfolioSlice.ts";

export const store = configureStore({
  reducer: {
    currencyPopupVisibility: currencyPopupReducer,
    portfolio: portfolioReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;