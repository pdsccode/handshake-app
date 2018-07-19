export const loadMatches = (payload = {}) => {
  return {
    type: 'PREDICTION:LOAD_MATCHES',
    ...payload,
  };
};

export const loadHandShakes = (payload = {}) => {
  return {
    type: 'PREDICTION:LOAD_HANDSHAKES',
    ...payload,
  };
};
