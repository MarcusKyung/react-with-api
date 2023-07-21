import React, { useEffect, useReducer } from 'react';
import topStoriesReducer from './../reducers/top-stories-reducer';
import { getTopStoriesFailure, getTopStoriesSuccess } from './../actions/index';

const initialState = { //create initial state for useReducer hook.
  isLoaded: false,
  topStories: [],
  error: null
};

function TopStories () {
  const [state, dispatch] = useReducer(topStoriesReducer, initialState); //initialize useReducer hook


  useEffect(() => {
    fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${process.env.REACT_APP_API_KEY}`) //Fetch returns a promise object. If resolved we go to .then chain, if rejected we go to catch block
      .then(response => {
          if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
          } else {
            return response.json()
          }
        })
      .then((jsonifiedResponse) => {
          const action = getTopStoriesSuccess(jsonifiedResponse.results) //create action and dispatch it
          dispatch(action);
        })
      .catch((error) => {
          const action = getTopStoriesFailure(error.message)
          dispatch(action);
      });
    }, [])


  // we destructure error, isLoaded, and topStories from the state variable.
  const { error, isLoaded, topStories } = state;


  if (error) {
    return <h1>Error: {error}</h1>;
  } else if (!isLoaded) {
    return <h1>...Loading...</h1>;
  } else {
    return (
      <React.Fragment>
        <h1>Top Stories</h1>
        <ul>
          {topStories.map((article, index) => //map takes two arguments, a callback function and an index
            <li key={index}>
              <h3>{article.title}</h3>
              <p>{article.abstract}</p>
              <p><em>{article.byline}</em></p>
              <p>{article.geo_facet[1]}</p>
            </li>
          )}
        </ul>
      </React.Fragment>
    );
  }
}

export default TopStories;
  