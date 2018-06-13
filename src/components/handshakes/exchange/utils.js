function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const getDistanceFromLatLonInKm = (_lat1, _lon1, _lat2, _lon2) => {
  const lat1 = parseFloat(_lat1, 10);
  const lon1 = parseFloat(_lon1, 10);
  const lat2 = parseFloat(_lat2, 10);
  const lon2 = parseFloat(_lon2, 10);
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad above
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const getErrorMessageFromCode = (error) => {
  let result = ''
  const messageFromApi = error.response?.data?.message;
  const code = error.response?.data?.code;
  const codeInt = parseInt(code, 10);
  switch (codeInt) {
    case -4: case -5: case -6: case -201: case -202: case -203: case -204:
    case -305: case -306: case -307: case -308: case -311:
      result = 'Sorry Ninja. Something went wrong. Come back soon.';
      break;
    case -312:
      result = 'Oh no! You cancelled your offer. You will not be able to make orders for 4 hours. Sorry'
      break;
    case -313:
      result = 'You already have a listing! To change your rates, please cancel your current listing.'
      break;
    case -314:
      result = 'Looks like that listing has been deleted.'
      break;
    case -315:
      result = 'Sorry ninja, someone else got there first.'
      break;
    case -1:
      result = 'Oops! Something went wrong. Come back soon.'
      break;
    case -3:
      result = 'It looks like that token is invalid.'
      break;
    case -301:
      result = 'You are already a ninja.'
      break;
    case -302:
      result = 'Sorry, that ninja does not exist.'
      break;
    case -303:
      result = 'It looks like you have reached your credit card limit.'
      break;
    case -309:
      result = 'You already have a listing! To change your rates, please cancel your current listing.'
      break;
    default:
      result = messageFromApi || 'Oops! Something went wrong.';
  }
  return result;
}

