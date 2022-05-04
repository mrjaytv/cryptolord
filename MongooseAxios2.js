var mongoose = require("mongoose");
var axios = require("axios");

const MONGO_CONNECTION_STRING =
  "mongodb+srv://cryptolord:cryptolordpass@cluster0.0tmx0.mongodb.net/cryptoland?retryWrites=true&w=majority";

const getData = async (coinsymb, currencySymb, todate = 0) => {
  mongoose
    .connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");

      search = {
        coinid: coinsymb,
        currency: currencySymb,
      };
      if (todate != 0) {
        search.todate = todate;
      }

      Data.findOne(search)
        .then((result) => {
          if (result == null) {
            console.log("No data found in MongoDB, fetching from API instead");
            fetchdataAPI(coinsymb, currencySymb, todate);
          } else {
            console.log(
              `Found a document result from MongoDB: ${result._id},\nQuery: ${result.coinid}, ${result.currency}, ${result.todate}`,
              `\nNow searching for older data using fromdate: ${result.fromdate}`
            );
            getData(result.coinid, result.currency, result.fromdate);
          }
        })
        .catch((e) => {
          console.log("Error connecting to MongoDB Atlas... Exiting now...", e);
        });
    });
};
//Call This function to get the data from the database or from the API, trying the database first
getData("BTC", "USD");

//This function is called by the server to get the data from the API and transfers it to the database
const fetchdataAPI = async (
  coinsymb = "BTC",
  currencySymb = "USD",
  todate = 0
) => {
  let api_key =
    "92ea2cffe73e189909a7ad2a7a3095ebe83a9dddb6baf10c587cc0c0e5c7a58f";
  let fetchURL = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${coinsymb}&tsym=${currencySymb}&limit=2000&api_key=${api_key}`;

  if (todate != 0) {
    fetchURL += `&toTs=${todate}`;
  }

  console.log(fetchURL);

  axios
    .get(fetchURL)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(`Failed to find data, was returned: `, response);
      } else {
        return onAPIFetchSuccess(coinsymb, currencySymb, response.data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

//Here we create the schema for the data
var repSchema = mongoose.Schema({
  coinid: String,
  currency: String,
  fromdate: Number,
  todate: Number,
  datakeys: Array,
  data: Object,
  timeinterval: Number,
});
var Data = mongoose.model("CryptoCompare", repSchema);

function onAPIFetchSuccess(coinsymb, currencySymb, response) {
  response = response.Data;
  console.log(response.Data[0]);
  var data = new Data();
  data.data = response.Data;
  data.datakeys = Object.keys(response.Data[0]);
  data.coinid = coinsymb;
  data.currency = currencySymb;
  data.fromdate = response.TimeFrom;
  data.todate = response.TimeTo;
  data.timeinterval = response.Data.length;

  return data
    .save()
    .then((result) => {
      console.log(`Inserted new documents successfully, 
      \nQuery: ${result.coinid}, ${result.currency}, ${result.todate},
      \nnow searching for older data using fromdate: ${result.fromdate}`);
      getData(result.coinid, result.currency, result.fromdate);
    })
    .catch((e) => {
      console.log(e);
    });
}
