require('dotenv').config();
const axios = require('axios');

const tensorClient = axios.create({
  baseURL: 'https://tensor.production-public.tubi.io',
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  },
});

(async () => {
  try {
    const data = await tensorClient.get('/api/v3/homescreen');
    console.log('data!!', data);
  } catch (error) {
    console.error('error!!', error);
  }
})();

module.exports = {
  tensorClient,
};
