export const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) =>  {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

// export const getDistanceFromLatLonInMi = (lat1, lon1, lat2, lon2, unit) => {
//   var radlat1 = Math.PI * lat1/180;
//   var radlat2 = Math.PI * lat2/180;
//   var radlon1 = Math.PI * lon1/180;
//   var radlon2 = Math.PI * lon2/180;
//   var theta = lon1-lon2;
//   var radtheta = Math.PI * theta/180;
//   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//   dist = Math.acos(dist);
//   dist = dist * 180/Math.PI;
//   dist = dist * 60 * 1.1515;
//   if (unit=="K") { dist = dist * 1.609344; }
//   if (unit=="N") { dist = dist * 0.8684; }
//   return dist;
// }

export const deg2rad = deg => {
  return deg * (Math.PI/180);
}

export const km2mi = km => 0.62137 * km;