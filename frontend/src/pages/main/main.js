import { useEffect, useMemo, useState } from "react";
import { ProductCard, Pagination, Search } from "./components";
import { debounce } from "../../utils";
import { request } from "../../utils";
import styles from "./main.module.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { ROLE } from "../../constants";
import { CategoryFilter, Loader, PriceFilter } from "../../components"; // Импортируем Loader

const PAGINATION_LIMIT = 10;

export const Main = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.roleId);

  const handleShopClick = () => {
    if (userRole === ROLE.GUEST) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  useEffect(() => {
    setIsLoading(true);

    let url = `/products?search=${encodeURIComponent(searchPhrase)}&page=${page}&limit=${PAGINATION_LIMIT}`;
    
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (category) url += `&category=${category}`;
    
    request(url,
      "GET"
    )
      .then((res) => {
        if (res?.data) {
          setProducts(res.data.products || []);
          setLastPage(res.data.lastPage || 1);
        } else {
          setProducts([]);
          setLastPage(1);
        }
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setProducts([]);
        setLastPage(1);
      })
      .finally(() => {
        setIsLoading(false); // Скрываем лоадер после завершения запроса
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, shouldSearch, minPrice, maxPrice, category]);

    const applyFilter = () => {
    setPage(1);
    setShouldSearch((prev) => !prev);
  };

  const startDelayedSearch = useMemo(
    () =>
      debounce(() => {
        setShouldSearch((prev) => !prev);
        setPage(1);
      }, 800),
    []
  );

  const onSearch = ({ target }) => {
    setSearchPhrase(target.value);
    startDelayedSearch();
  };
  
  return (
    <div>
      {isLoading && <Loader />} {/* Добавляем лоадер */}
      
      <div className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Explore the Universe</h1>
          <p className={styles.subtitle}>
            Books, telescopes, and more for astronomy enthusiasts.
          </p>
          <Search searchPhrase={searchPhrase} onChange={onSearch} />
          <button className={styles.shopButton} onClick={handleShopClick}>
            Shop Now
          </button>
        </section>
        <section className={styles.secondHero}>
          <div className={styles.secondTitle}>Filters:</div>
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            applyFilter={applyFilter}
          />

          <CategoryFilter
              category={category}
              setCategory={setCategory}
              applyFilter={applyFilter}
            />
          </section>

        <section className={styles.products}>
          {!isLoading && products.length > 0 ? ( // Показываем продукты только после загрузки
            products.map(({ id, name, price, imageUrl }) => (
              <ProductCard
                key={id}
                id={id}
                name={name}
                price={price}
                imageUrl={imageUrl}
              />
            ))
          ) : !isLoading ? ( // Показываем "No products" только после загрузки
            <div className={styles.noProducts}>No products found</div>
          ) : null}
        </section>
      </div>
      
      {!isLoading && lastPage > 1 && products.length > 0 && ( // Показываем пагинацию только после загрузки
        <Pagination page={page} lastPage={lastPage} setPage={setPage} />
      )}
    </div>
  );
};