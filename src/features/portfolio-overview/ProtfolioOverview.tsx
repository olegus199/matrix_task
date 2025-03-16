import styles from "./PortfolioOverview.module.scss";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks-redux.ts";
import CurrencyPopup from "../currency-popup/CurrencyPopup.tsx";
import {
  currencyPopupVisibilityChanged,
  selectCurrencyPopupVisibility,
} from "../currency-popup/currencyPopupVisibilitySlice.ts";
import { selectPortfolioItems } from "../portfolio/portfolioSlice.ts";
import PortfolioItem, { PortfolioTableHeader } from "../portfolio/PortfolioItem.tsx";

const PortfolioOverview: FC = () => {
  const isVisible = useAppSelector(selectCurrencyPopupVisibility);
  const portfolio = useAppSelector(selectPortfolioItems);
  const dispatch = useAppDispatch();

  function handleAddButtonClick() {
    dispatch(currencyPopupVisibilityChanged(true));
  }

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