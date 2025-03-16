import styles from "./PortfolioItem.module.scss";
import { FC } from "react";
import { IPortfolioItem, portfolioItemDeleted } from "./portfolioSlice.ts";
import { formatNumber } from "../../common/utils.ts";
import { useAppDispatch } from "../../app/hooks-redux.ts";

interface PortfolioItemProps {
  item: IPortfolioItem;
  idx: number;
}

const PortfolioItem: FC<PortfolioItemProps> = ({ item, idx }) => {
  const dispatch = useAppDispatch();

  return (
    <li
      onClick={() => dispatch(portfolioItemDeleted(idx))}
      className={`${styles.portfolio_row} ${styles.table_content_row}`}
    >
      <p className={styles.item_cell}>
        {item.baseAsset}
      </p>
      <p className={styles.item_cell}>
        {formatNumber(item.amount)}
      </p>
      <p className={styles.item_cell}>
        ${formatNumber(item.lastPrice)}
      </p>
      <p
        className={styles.item_cell}
      >
        ${formatNumber(item.usdAmount)}
      </p>
      <p
        className={`${styles.item_cell} ${item.priceChangePercent > 0 && styles.positive_change} 
        ${item.priceChangePercent < 0 && styles.negative_change}`}
      >
        {item.priceChangePercent > 0 && "+"}{item.priceChangePercent}%
      </p>
      <p className={styles.item_cell}>
        {item.portfolioPercentage}%
      </p>
    </li>
  );
};

export default PortfolioItem;

export const PortfolioTableHeader: FC = () => {
  return (
    <li className={`${styles.portfolio_header} ${styles.portfolio_row}`}>
      <p className={styles.item_cell}>
        Валюта
      </p>
      <p className={styles.item_cell}>
        Количество
      </p>
      <p className={styles.item_cell}>
        Цена
      </p>
      <p
        className={styles.item_cell}
      >
        Общая ст-ть (USD)
      </p>
      <p className={styles.item_cell}>
        Изм. за 24ч.
      </p>
      <p
        className={styles.item_cell}
      >
        % портфеля
      </p>
    </li>
  );
};