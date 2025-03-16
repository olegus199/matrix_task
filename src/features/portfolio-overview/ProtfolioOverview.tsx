import styles from "./PortfolioOverview.module.scss";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks-redux.ts";
import CurrencyPopup from "../currency-popup/CurrencyPopup.tsx";
import {
  currencyPopupVisibilityChanged,
  selectCurrencyPopupVisibility,
} from "../currency-popup/currencyPopupVisibilitySlice.ts";
import { portfolioItemUpdated, selectPortfolioItems } from "../portfolio/portfolioSlice.ts";
import PortfolioItem, { PortfolioTableHeader } from "../portfolio/PortfolioItem.tsx";
import { TickerStreamData } from "../../common/types.ts";

const PortfolioOverview: FC = () => {
  const isVisible = useAppSelector(selectCurrencyPopupVisibility);
  const portfolio = useAppSelector(selectPortfolioItems);
  const dispatch = useAppDispatch();

  const symbols = portfolio.map((item) => item.symbol.toLowerCase());

  function handleAddButtonClick() {
    dispatch(currencyPopupVisibilityChanged(true));
  }

  useEffect(() => {
    symbols.forEach((symbol) => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${symbol}@ticker`);

      ws.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        const payload: TickerStreamData = {
          symbol,
          lastPrice: eventData.data.c,
          priceChangePercent: eventData.data.P,
        };
        dispatch(portfolioItemUpdated(payload));
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
      };
    });

    localStorage.setItem("portfolioItems", JSON.stringify(portfolio));
  }, [symbols]);

  return (
    <main className={styles.main_section}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.h2}>
            Portfolio overview
          </h2>
          <button
            onClick={handleAddButtonClick}
            className={styles.add_button}
          >
            Добавить актив
          </button>
        </div>
        <ul className={styles.portfolio_list}>
          {portfolio.length === 0 ? (
            <div className={styles.no_items_msg}>Добавтье ваш первый актив</div>
          ) : (
            <>
              <PortfolioTableHeader />
              {portfolio.map((item, idx) => (
                <PortfolioItem
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </>
          )}
        </ul>
      </div>
      {isVisible && (
        <CurrencyPopup />
      )}
    </main>
  );
};

export default PortfolioOverview;