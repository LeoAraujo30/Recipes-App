import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchRecipeMeals, fetchRecipeDrinks } from '../services/fetchApi';
import style from '../styles/header.module.scss';

function SearchBar({ makeSearchMeals, makeSearchDrinks, pageActual, searchByBarOn }) {
  const [state, setState] = useState({ inputSearch: '' });
  const [typeState, setType] = useState({ type: '' });
  const [pageState, setPage] = useState({ page: '' });

  const ENDPOINST = {
    foods: {
      ingredient: 'https://www.themealdb.com/api/json/v1/1/filter.php?i=',
      name: 'https://www.themealdb.com/api/json/v1/1/search.php?s=',
      firstLetter: 'https://www.themealdb.com/api/json/v1/1/search.php?f=',
    },
    drinks: {
      ingredient: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=',
      name: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=',
      firstLetter: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=',
    },
  };

  useEffect(() => {
    const page = pageActual.includes('Foods') ? 'foods' : 'drinks';
    setPage({ page });
  }, []);

  const makeFetchApi = () => {
    const { inputSearch } = state;
    const { type } = typeState;
    const { page } = pageState;
    if (type === 'firstLetter' && inputSearch.length > 1) {
      global.alert('Your search must have only 1 (one) character');
    } else if (page === 'foods') {
      searchByBarOn();
      const endpoint = ENDPOINST.foods[type].concat(inputSearch);
      makeSearchMeals(endpoint);
    } else {
      searchByBarOn();
      const endpoint = ENDPOINST.drinks[type].concat(inputSearch);
      makeSearchDrinks(endpoint);
    }
  };

  const setChanges = ({ target }) => {
    setType({
      ...typeState,
      type: target.value,
    });
  };

  const { inputSearch } = state;
  const { type } = typeState;
  const {
    containerSearch,
    searchInput,
    containerRadiosSearch,
    radiosSearch,
    btnSearch,
  } = style;

  return (
    <form className={ containerSearch }>
      <input
        type="text"
        data-testid="search-input"
        className={ searchInput }
        value={ inputSearch }
        onChange={ ({ target }) => setState({ ...state, inputSearch: target.value }) }
      />

      <div className={ containerRadiosSearch }>

        <label htmlFor="ingredient-search-radio">
          <input
            type="radio"
            name="typeSearch"
            data-testid="ingredient-search-radio"
            id="ingredient-search-radio"
            value="ingredient"
            onChange={ setChanges }
            className={ radiosSearch }
          />
          Ingredient
        </label>

        <label htmlFor="name-search-radio">
          <input
            type="radio"
            name="typeSearch"
            data-testid="name-search-radio"
            id="name-search-radio"
            value="name"
            onChange={ setChanges }
            className={ radiosSearch }
          />
          Name
        </label>

        <label htmlFor="first-letter-search-radio">
          <input
            type="radio"
            name="typeSearch"
            data-testid="first-letter-search-radio"
            id="first-letter-search-radio"
            value="firstLetter"
            onChange={ setChanges }
            className={ radiosSearch }
          />
          First Letter
        </label>
      </div>

      <button
        type="button"
        data-testid="exec-search-btn"
        disabled={ type.length === 0 || inputSearch.length === 0 }
        onClick={ makeFetchApi }
        className={ btnSearch }
      >
        SEARCH
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  makeSearchMeals: PropTypes.func.isRequired,
  makeSearchDrinks: PropTypes.func.isRequired,
  pageActual: PropTypes.string.isRequired,
  searchByBarOn: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  makeSearchMeals: (endpoint) => dispatch(fetchRecipeMeals(endpoint)),
  makeSearchDrinks: (endpoint) => dispatch(fetchRecipeDrinks(endpoint)),
});

export default connect(null, mapDispatchToProps)(SearchBar);
