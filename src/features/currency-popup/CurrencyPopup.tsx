import styles from "./CurrencyPopup.module.scss";
import { FC, useActionState, useEffect, useRef, useState } from "react";
import { useGetTickerPriceQuery } from "../../api/apiSlice.ts";
import { CryptoMarketDataExcerpt } from "../../common/types.ts";
import { useAppDispatch } from "../../app/hooks-redux.ts";
import { currencyPopupVisibilityChanged } from "./currencyPopupVisibilitySlice.ts";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import * as React from "react";
import Spinner from "../../UI/Spinner.tsx";
import { IPortfolioItem, portfolioItemAdded } from "../portfolio/portfolioSlice.ts";

const MAX_ITEMS = 20;

const CurrencyPopup: FC = () => {
  const { data: cryptoMarketData = [], isFetching, isError, error } = useGetTickerPriceQuery();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState<CryptoMarketDataExcerpt[]>([]);
  const [searchTerms, setSearchTerms] = useState("");
  const [selectedCurrencyItem, setSelectedCurrencyItem] = useState<CryptoMarketDataExcerpt | null>(
    null,
  );
  const [currencyAmount, setCurrencyAmount] = useState("");

  const [submitState, formAction] = useActionState<undefined>(submitAction, undefined);

  const popupContentRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLLIElement>(null);

  function submitAction(): undefined {
    if (selectedCurrencyItem) {
      const { baseAsset, priceChangePercent, lastPrice, symbol } = selectedCurrencyItem;
      const portfolioItem: IPortfolioItem = {
        baseAsset,
        symbol,
        amount: parseInt(currencyAmount),
        portfolioPercentage: 0,
        priceChangePercent,
        lastPrice,
        usdAmount: lastPrice * parseInt(currencyAmount),
      };
      dispatch(portfolioItemAdded(portfolioItem));
    }
  }

  function handleCurrencyAmountInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target;
    const numVal = value.length === 0 ? 0 : parseInt(value);

    if (value.length !== 0 && isNaN(numVal)) {
      return;
    }

    setCurrencyAmount(numVal.toString());
  }

  function handleCancelButtonClick(): void {
    setCurrencyAmount("");
    setSelectedCurrencyItem(null);
  }

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchTerms(e.target.value);
  }

  function handleShowMore(): void {
    setPaginatedData((prev) => [
      ...prev,
      ...cryptoMarketData.slice(page * MAX_ITEMS, (page + 1) * MAX_ITEMS),
    ]);

    setPage((prev) => prev + 1);
  }

  function handleCurrencyClick(idx: number): void {
    const item = paginatedData[idx];
    setSelectedCurrencyItem(item);
  }

  // Observer logic to add more items to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Don't upload more if searching trough currencies
        if (entry.isIntersecting && !searchTerms) {
          handleShowMore();
        }
      },
      { threshold: 1 },
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [paginatedData.length, searchTerms]);

  // Handle paginatedData init set
  useEffect(() => {
    if (cryptoMarketData.length > 0) {
      setPaginatedData(cryptoMarketData.slice(0, MAX_ITEMS));
    }
  }, [cryptoMarketData]);

  // Handle popup closure
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupContentRef.current) {
        if (!popupContentRef.current.contains(e.target as Node)) {
          dispatch(currencyPopupVisibilityChanged(false));
        }
      }
    }

    function handleEscClick(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dispatch(currencyPopupVisibilityChanged(false));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscClick);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscClick);
    };
  }, []);

  // Handle currency search
  useEffect(() => {
    if (searchTerms) {
      const filtered = cryptoMarketData.filter(
        (v) => v.baseAsset.toLowerCase().includes(searchTerms.toLowerCase()));
      setPaginatedData(filtered);
    } else {
      setPaginatedData(cryptoMarketData.slice(0, page * MAX_ITEMS));
    }
  }, [searchTerms]);

  return (
    <div className={`${styles.popup_bg} `}>
      <div
        ref={popupContentRef}
        className={styles.popup_content}
      >
        <div className={styles.header}>
          <p className={styles.title}>Выберите валюту</p>
          <FaXmark
            onClick={() => dispatch(currencyPopupVisibilityChanged(false))}
            className={styles.close_icon}
          />
        </div>

        <div className={styles.input_container}>
          <label htmlFor="search">
            <FaMagnifyingGlass className={styles.search_icon} />
          </label>
          <input
            type="search"
            id="search"
            value={searchTerms}
            onChange={handleSearchInputChange}
            placeholder="Поиск валюты"
            className={styles.search_input}
          />
        </div>

        <p className={styles.crypto_label}>Криптовалюты</p>
        {isError && (
          <div>Error occurred: {error?.toString()}</div>
        )}
        <ul
          style={{ overflow: isFetching ? "hidden" : "scroll" }}
          className={styles.crypto_list}
        >
          {isFetching &&
              <li>
                <Spinner />
              </li>
          }
          {paginatedData.map((d, idx) => (
            <li
              key={idx}
              ref={idx === paginatedData.length - 1 ? lastItemRef : null}
              onClick={() => handleCurrencyClick(idx)}
              className={styles.li}
            >
              <p className={styles.crypto_name}>{d.baseAsset}</p>
              <p className={styles.price}>${d.lastPrice}</p>
              <p
                className={`${styles.price_change} ${d.priceChangePercent < 0
                && styles.negative_change} ${d.priceChangePercent > 0 && styles.positive_change}`}
              >
                {d.priceChangePercent > 0 && "+"}{d.priceChangePercent}%
              </p>
            </li>
          ))}
        </ul>

        {selectedCurrencyItem && (
          <div className={styles.add_currency_group}>
            <p className={styles.selected_currency}>Валюта: {selectedCurrencyItem.baseAsset}</p>
            <form className={styles.amount_form}>
              <input
                type="text"
                value={currencyAmount}
                onChange={handleCurrencyAmountInputChange}
                placeholder="Количество"
                className={styles.amount_input}
              />
              <div className={styles.action_buttons}>
                <button
                  type="button"
                  onClick={handleCancelButtonClick}
                  className={`${styles.action_button} ${styles.button_cancel}`}
                >
                  Отмена
                </button>
                <button
                  formAction={formAction}
                  className={`${styles.action_button} ${styles.button_submit}`}
                  disabled={!currencyAmount}
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyPopup;