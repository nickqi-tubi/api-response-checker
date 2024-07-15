require('dotenv').config();
const axios = require('axios');

const SERVICES = ['account', 'crm', 'epg', 'lishi', 'search', 'tensor', 'user-queue'];

const genClient = (service) =>
  axios.create({
    baseURL: `https://${service}.production-public.tubi.io`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });

const clients = SERVICES.reduce((acc, service) => {
  acc[service] = genClient(service);
  return acc;
}, {});

module.exports = {
  SERVICES,
  clients,
};
