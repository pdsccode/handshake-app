// import { createSelector } from 'reselect';

export const eventSelector = (state) => state.prediction.events;

export const isLoading = (state) => {
  if (!state.prediction._meta) return true;
  return state.prediction._meta.isFetching;
};

export const showedLuckyPoolSelector = (state) => {
  return state.ui.showedLuckyPool;
};

export const queryStringSelector = (state) => {
  return state.router.location.search;
};

