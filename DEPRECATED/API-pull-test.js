const axios = require("axios");
axios
  .get(
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1"
  )
  .then((response) => {
    console.log(response.data);
  });
const d = new Date();
console.log(d.getTime());
