var mongoose = require("mongoose");
var axios = require("axios");

const MONGO_CONNECTION_STRING =
  "mongodb+srv://cryptolord:cryptolordpass@cluster0.0tmx0.mongodb.net/cryptoland?retryWrites=true&w=majority";

// Do some calculations to determine the last 30 days
let last30days = [];
let today = new Date(Date.now()).getTime();
// set today to midnight
today = new Date(today).setHours(0, 0, 0, 0);
let tonight = new Date(today).setHours(23, 59, 59, 999);
for (let i = 0; i < 30; i++) {
  const date = {
    today: Date.parse(new Date(today - i * 24 * 60 * 60 * 1000)),
    tonight: Date.parse(new Date(tonight - i * 24 * 60 * 60 * 1000)),
  };
  // console.log(date.toLocaleDateString());
  last30days.push(date);
}

const getData = async (coinid, currency) => {
  mongoose
    .connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");

      // console.log(JSON.stringify(last30days));
      // console.log(fromdate, todate);
      for (i = 0; i < last30days.length; i++) {
        let fromdate = last30days[i].today;
        let todate = last30days[i].tonight;

        // if (fromdate == today) {
        //   console.log(`this is today`);
        //   fetchdataAPIMarketChartToday(coinid, currency);
        // }
        Data.findOne({
          coinid: coinid,
          currency: currency,
          fromdate: fromdate,
          todate: todate,
        })
          .then((result) => {
            if (result == null) {
              console.log(
                "No data found in MongoDB, fetching from API instead"
              );
              fetchdataAPI(coinid, currency, fromdate, todate);
              //   if (i == 0) {
              //     fetchdataAPIMarketChartToday(coinid, currency);
              //   }
            } else {
              console.log(
                `Found a document result from MongoDB: ${result._id},\nQuery: ${result.currency}, ${result.coinid}, ${result.fromdate}, ${result.todate}`
              );
              if (result.fromdate == undefined) {
                console.log("BAD DATA FOUND, DELETING FROM DB");
                Data.deleteOne({
                  coinid: coinid,
                  currency: currency,
                  fromdate: fromdate,
                  todate: todate,
                }).then((result) => {
                  console.log(
                    result.deletedCount
                      ? (`Deleted document successfully:`, result)
                      : "No document found to delete"
                  );
                });
              } else {
                return result;
              }
            }
          })
          .catch((e) => {
            console.log(
              "Error connecting to MongoDB Atlas... Exiting now...",
              e
            );
          })
          .then((result) => {
            // console.log(result);
            return result;
          });
      }
    });
};
//Call This function to get the data from the database or from the API, trying the database first
getData("bitcoin", "usd");
// getData("solana", "usd");
// getData("ethereum", "usd");

//This function is called by the server to get the data from the API and transfers it to the database
const fetchdataAPI = async (coinid, currency, fromdate, todate) => {
  let fetchURL = `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart/range?vs_currency=${currency}&from=${parseInt(
    fromdate / 1000
  )}&to=${parseInt(todate / 1000)}`;
  // let fetchURL = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1';

  axios
    .get(fetchURL)
    .then(function (response) {
      if (response.data.prices[0] == undefined) {
        console.log(`Failed to find data, was returned: `, response.data);
      } else {
        return onAPIFetchSuccess(coinid, currency, fromdate, todate, response);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const fetchdataAPIMarketChartToday = async (coinid, currency) => {
  //   let fetchURL = `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart/range?vs_currency=${currency}&days=1`;
  let fetchURL = `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart?vs_currency=${currency}&days=1`;

  axios
    .get(fetchURL)
    .then(function (response) {
      if (response.data.prices[0] == undefined) {
        console.log(`Failed to find data, was returned: `, response.data);
      } else {
        onAPIFetchSuccess(coinid, currency, today, tonight, response).then();
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
var Data = mongoose.model("MarketHistory", repSchema);

function onAPIFetchSuccess(coinid, currency, fromdate, todate, response) {
  var data = new Data();
  data.data = response.data;
  data.datakeys = Object.keys(response.data);
  data.coinid = coinid;
  data.currency = currency;
  data.fromdate = fromdate;
  data.todate = todate;
  data.timeinterval = response.data.prices.length;

  return data
    .save()
    .then((result) => {
      console.log("Inserted new documents successfully", result);
    })
    .catch((e) => {
      console.log(e);
    });
}
