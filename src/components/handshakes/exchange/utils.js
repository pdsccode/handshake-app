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

