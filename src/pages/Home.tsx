import qs from "qs";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProductType } from "../@types/ProductType";
import { useAppDispatch, useAppSelector } from "../hooks";
import { sortArray } from "../constants";
//redux
import { setFilters } from "../redux/filters/slice";
import { fetchData } from "../redux/product/asyncActions";
import { filterSelector, sortSelector } from "../redux/filters/selectors";
import { productSelector } from "../redux/product/selectors";
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
  const { name, sortby, order } = useAppSelector(sortSelector);
  const { items, status } = useAppSelector(productSelector);
  //query url params
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        page,
        category,
        sortby,
        order,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [category, sortby, order, page, search]);

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      let name;
      sortArray.forEach((el) => {
        if (el.sortby === params.sortby && el.order === params.order)
          name = el.name;
      });
      dispatch(setFilters({ ...params, name }));
      isSearch.current = true;
    }
  }, []);

  useEffect(() => {
    dispatch(
      fetchData({ sort: { name, sortby, order }, category, search, page })
    );
    window.scrollTo(0, 0);
  }, [category, sortby, order, page, search]);

  const skeletons = [...new Array(4)].map((_, index) => (
    <PizzaSkeleton key={index} />
  ));
  const pizzas = items.map((pizza: ProductType) => (
    <PizzaBlock key={pizza.id} {...pizza} />
  ));

  return (
    <div className="content">
      <div className="container">
        <div className="content__top">
          <Categories />
          <Sort />
        </div>
        {status === "error" ? (
          <Notification
            headline={"Произошла ошибка "}
            paragraph1={"К сожалению, не удалось получить питсы."}
            paragraph2={"Попробуйте повторить попытку позже."}
          />
        ) : (
          <>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
              {status === "success" ? pizzas : skeletons}
            </div>
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
