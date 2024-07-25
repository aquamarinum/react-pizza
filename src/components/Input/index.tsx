import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearch } from "../../redux/slices/filterSlice";

const Input: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const onChangeInput = (query: string) => {
    setSearchValue(query);
  };
  const onClearInput = () => {
    setSearchValue("");
    if (inputRef.current) inputRef.current.focus();
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearch(searchValue));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);
  return (
    <div className="search_input">
      <div className="search-icon">
        <img src="img/search.png" alt="search-icon" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Поиск пиццы..."
        onChange={(e) => onChangeInput(e.target.value)}
        value={searchValue}
      />
      {searchValue.length > 0 && (
        <div className="close-icon" onClick={onClearInput}>
          <img src="img/close.png" alt="close-icon" />
        </div>
      )}
    </div>
  );
};

export default Input;