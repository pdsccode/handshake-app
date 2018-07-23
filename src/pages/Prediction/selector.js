// import { createSelector } from 'reselect';

export const eventSelector = (state) => state.prediction.events;

let showedLuckyPool = false;

export const isLoading = (state) => {
  if (!state.prediction._meta) return true;
  return state.prediction._meta.isFetching;
};

export const showedLuckyPoolSelector = (state) => {
  return state.ui.showedLuckyPool;
};

