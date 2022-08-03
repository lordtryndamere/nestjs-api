import * as request from 'request-promise';
export const findUserLocationByAddress = (
  userAddress: string,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log(userAddress);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${userAddress}&key=${process.env.GOOGLE_API_KEY}`;
    request(url, (error, response, body) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      const data = JSON.parse(body);
      if (data.status === 'OK') {
        resolve(data.results[0].geometry.location);
      } else {
        reject(data.status);
      }
    });
  });
};
