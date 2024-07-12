require('dotenv').config();
const axios = require('axios');

const tensorClient = axios.create({
  baseUrl: 'http://tensor.production-public.tubi.io',
  header: {
    Authorization: 'Bearer token',
  },
});
