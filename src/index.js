require('dotenv').config();
const axios = require('axios');

const genClient = (service) =>
  axios.create({
    baseURL: 'https://tensor.production-public.tubi.io',
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });

const clients = ['account', 'tensor', 'search'].reduce((acc, service) => {
  acc[service] = genClient(service);
  return acc;
}, {});

module.exports = {
  clients,
};
