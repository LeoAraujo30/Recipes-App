import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import isFavorite from '../images/whiteHeartIcon.svg';
import notFavorite from '../images/blackHeartIcon.svg';

const copy = require('clipboard-copy');

function RecipeInProgress({ pageActual, id, drinks, meals }) {
  const [pageState, setPage] = useState({ page: '' });
  const [recipeState, setRecipe] = useState({ recipe: [] });
  const [redirectState, setRedirect] = useState({ redirect: false });
  const [markedState, setMarked] = useState({ marked: false });
  const [favoriteState, setFavorite] = useState({ favoriteIcon: false });
  const [finishState, setFinish] = useState({ isDisabled: true });
  const [copyState, setCopy] = useState({ copyed: false });

  useEffect(() => {
    const page = pageActual.includes('Foods') ? 'foods' : 'drinks';
    const pag = drinks.length > 0;
    const recipes = pag ? drinks : meals;
    const recipe = recipes.find((elm) => (
      (page === foods) ? elm.idMeal === id : elm.idDrinks === id
    ));
    const obj = localStorage.getItem('inProgressRecipes');
    if (recipe === obj) setMarked({ marked: true });

    setRecipe({ recipe });
    setPage({ page });
  }, []);

  // useEffect(() => {
  //   const { marked } = markedState;
  //   if (marked) {
  //     setFinish((prevState) => ({ isDisabled: !prevState.isDisabled }));
  //   }
  // });

  const ingredientBox = () => {
    const { recipe } = recipeState;

    setMarked((prevState) => ({ marked: !prevState.marked }));
    localStorage.setItem('inProgressRecipes', recipe);
  };

  const toggleFavorite = () => {
    setFavorite((prevState) => ({ favoriteIcon: !prevState.favoriteIcon }));
  };

  const toggleFinish = () => {
    setRedirect({ redirect: true });
  };

  const getUrl = () => {
    const url = window.location.href;
    const urlProgress = url.slice(0, url.lastIndexOf('/'));
    return urlProgress;
  };

  const handleShare = () => {
    const input = document.createElement('input');
    const lik = document.getElementById('share');
    input.focus();
    input.select();
    // navigator.clipboard.writeText(getUrl());
    copy.writeText(getUrl());
    lik.style.display = 'block';
    setTimeout(() => { lik.style.display = 'none'; }, Number('1500'));
    setCopy({ copyed: true });
  };

  const { recipe } = recipeState;
  const { page } = pageState;
  const { redirect } = redirectState;
  const { marked } = markedState;
  const { favoriteIcon } = favoriteState;
  const { isDisabled } = finishState;
  const { copyed } = copyState;

  return (
    <div>
      {
        recipe.map((elm, i) => (
          <div key={ (page === 'foods') ? elm.idMeal : elm.idDrinks }>
            <img
              src={
                (page === 'foods')
                  ? elm.strMealThumb
                  : elm.strDrinkThumb
              }
              alt="recipePhoto"
              data-testid="recipe-photo"
            />

            <span data-testid="recipe-title">
              {(page === 'foods')
                ? elm.strMeal
                : elm.strDrink}
            </span>

            <div id="share">

              { copyed && (<h1>Link copied!</h1>)}

              <button
                type="button"
                data-testid="share-btn"
                onClick={ handleShare }
              >
                <img src={ shareIcon } alt="share-btn" />
              </button>
            </div>

            <button
              type="button"
              data-testid="favorite-btn"
              onClick={ toggleFavorite }
            >
              <img
                src={
                  (favoriteIcon) ? isFavorite : notFavorite
                }
                alt="favorite-btn"
              />
            </button>

            <span data-testid="recipe-category">{elm.strCategory}</span>

            <div
              data-testid={ `${i}-ingredient-step` }
            >
              <span>
                { marked === true ? (

                  <s>{elm.strIngredient.concat(i)}</s>
                ) : (
                  elm.strIngredient.concat(i)
                )}
              </span>

              <input
                type="checkbox"
                value={ marked }
                onChange={ ingredientBox }
              />
            </div>
            <span data-testid="instructions">{elm.strInstructions}</span>
            <button
              type="button"
              data-testid="finish-recipe-btn"
              disabled={ isDisabled }
              onClick={ toggleFinish }
            >
              FINISH
            </button>
          </div>
        ))
      }
      {redirect && <Redirect to="/done-recipes" />}
    </div>

  );
}

RecipeInProgress.propTypes = {
  meals: propTypes.arrayOf(propTypes.objectOf(propTypes.string)).isRequired,
  drinks: propTypes.arrayOf(propTypes.objectOf(propTypes.string)).isRequired,
  id: propTypes.arrayOf(propTypes.objectOf(propTypes.string)).isRequired,
  pageActual: propTypes.string.isRequired,
};

const mapStateToProps = ({ recipeReducer: { meals, drinks } }) => ({ meals, drinks });

export default connect(mapStateToProps)(RecipeInProgress);
