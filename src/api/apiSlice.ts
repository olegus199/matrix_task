import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CryptoMarketDataExcerpt, CryptoMarketDataResponse } from "../common/types.ts";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.binance.com/api/v3" }),
  endpoints: (builder) => ({
    getTickerPrice: builder.query<CryptoMarketDataExcerpt[], void>({
      query: () => "/ticker/24hr?",
      transformResponse: (response: CryptoMarketDataResponse[]) => {
        return response.filter((v) => v.symbol.endsWith("USDT"))
          .map((v) => ({
            symbol: v.symbol,
            baseAsset: v.symbol.replace("USDT", ""),
            quoteAsset: "USDT",
            lastPrice: parseFloat(v.lastPrice),
            priceChangePercent: parseFloat(v.priceChangePercent),
          }));
      },
    }),
  }),
});

export const { useGetTickerPriceQuery } = apiSlice;