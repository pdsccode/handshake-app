import _ from 'lodash';

export const hasEmail = (state) => {
  if (_.isEmpty(state.user.profile)) return null;
  return !!state.user.profile.email;
};

export const eventSelector = (state) => state.prediction.events;

export const reportSelector = (state) => state.reports.list || [];

export const shareEventSelector = (state) => state.ui.shareEvent;
