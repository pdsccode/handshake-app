export const hasEmail = (state) => !!state.auth.profile.email;

export const eventSelector = (state) => state.prediction.events;

export const reportSelector = (state) => state.reports.list || [];
