import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProductType } from "../@types/ProductType";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateCart } from "../utils/updateCart";
import { getCart } from "../utils/getCart";
import { getQuery } from "../utils/getQuery";
import { parseQuery } from "../utils/parseQuery";
//redux
import { setCartData } from "../redux/cart/slice";
import { setFilters } from "../redux/filters/slice";
import { FetchStatus } from "../redux/product/types";
import { cartSelector } from "../redux/cart/selectors";
import { fetchData } from "../redux/product/asyncActions";
import { productSelector } from "../redux/product/selectors";
import { filterSelector, sortSelector } from "../redux/filters/selectors";
//components
import Sort from "../components/Sort";
import Pagination from "../components/Pagination";
import Categories from "../components/Categories";
import PizzaBlock from "../components/PizzaBlock";
import Notification from "../components/Notification";
import PizzaSkeleton from "../components/PizzaBlock/skeleton";

function Home() {
  console.log("*--Home");
  //redux
  const { category, search, page } = useAppSelector(filterSelector);
  const { name, sortby } = useAppSelector(sortSelector);
  const { items, status } = useAppSelector(productSelector);
  const { cart, totalCount, totalPrice } = useAppSelector(cartSelector);
  //query url params
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      console.log("useEffect #1 -- if");
      updateCart({ cart, totalCount, totalPrice });
    } else {
      console.log("useEffect #1 -- else");
      dispatch(setCartData(getCart("react-pizza-cart")));
    }
  }, [totalCount]);

  useEffect(() => {
    if (isMounted.current) {
      console.log("useEffect #2");
      navigate(getQuery(category, sortby, page));
    }
    isMounted.current = true;
  }, [category, sortby, page]);

  useEffect(() => {
    if (window.location.search) {
      console.log("useEffect #3");
      dispatch(setFilters(parseQuery(window.location.search)));
    }
  }, []);

  useEffect(() => {
    console.log("useEffect #4");
    dispatch(fetchData({ sort: { name, sortby }, category, search, page }));
    window.scrollTo(0, 0);
  }, [category, sortby, page, search]);

  const getProductCount = (title: string) => {
    let counter = 0;
    for (let i = 0; i < cart.length; i++)
      if (cart[i].title === title) counter += cart[i].count;
    return counter;
  };

  const skeletons = [...new Array(4)].map((_, index) => (
    <PizzaSkeleton key={index} />
  ));
  const pizzas = items.map((pizza: ProductType) => (
    <PizzaBlock
      key={pizza.id}
      {...pizza}
      count={getProductCount(pizza.title)}
    />
  ));

  return (
    <div className="content">
      <div className="container">
        <div className="content__top">
          <Categories />
          <Sort />
        </div>
        {status === FetchStatus.ERROR ? (
          <Notification
            headline={"Произошла ошибка "}
            paragraph1={"К сожалению, не удалось получить питсы."}
            paragraph2={"Попробуйте повторить попытку позже."}
          />
        ) : (
          <>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
              {status === FetchStatus.SUCCESS ? pizzas : skeletons}
            </div>
            {status === FetchStatus.SUCCESS && <Pagination />}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
