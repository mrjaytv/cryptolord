var mongoose = require("mongoose");
var axios = require("axios");

process.on("unhandledRejection", (reason, promise) => {
  console.log("Reason: ", reason, "promise: ", promise);
});

//All calls out of the server
connectionString =
  "mongodb+srv://cryptolord:cryptolordpass@cluster0.0tmx0.mongodb.net/cryptoland?retryWrites=true&w=majority";
// connectionString = `mongodb+srv://${user}:${password}@${url}?retryWrites=true`;
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    // console.log(last30days[2]);

    let fromdate = last30days[3];
    let todate = last30days[2];

    Data.findOne({
      coinid: "bitcoin",
      currency: "usd",
      fromdate: fromdate,
      todate: todate,
    }).then((result) => {
      if (result == null) {
        console.log("No data found in MongoDB, fetching from API instead");
        fetchdataAPI("bitcoin", "usd", fromdate, todate);
      } else {
        console.log(
          `Found a document result: ${result._id}, ${result.currency}, ${result.coinid}, ${result.fromdate}, ${result.todate}`
          //   result
        );
      }
    });
  })
  .catch((e) => {
    console.log("Error connecting to MongoDB Atlas... Exiting now...", e);
  });

//This function is called by the server to get the data from the API and transfers it to the database
const fetchdataAPI = async (coinid, currency, fromdate, todate) => {
  let fetchURL = `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart/range?vs_currency=${currency}&from=${parseInt(
    fromdate / 1000
  )}&to=${parseInt(todate / 1000)}`;
  // let fetchURL = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1';

  axios
    .get(fetchURL)
    .then(function (response) {
      onAPIFetchSuccess(coinid, currency, fromdate, todate, response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

let last30days = [];
for (let i = 0; i < 30; i++) {
  let today = new Date(Date.now()).getTime();
  // set today to midnight
  today = new Date(today).setHours(0, 0, 0, 0);
  const date = new Date(today - i * 24 * 60 * 60 * 1000);
  // console.log(date.toLocaleDateString());
  last30days.push(Date.parse(date));
}

//Here we create the schema for the data
var repSchema = mongoose.Schema({
  coinid: String,
  currency: String,
  fromdate: Number,
  todate: Number,
  datakeys: Array,
  data: Object,
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

  //   console.log(Object.keys(data));
  Object.keys(data).forEach(function (key) {
    // console.log(JSON.stringify(data[key]));
  });

  data
    .save()
    .then((result) => {
      console.log("Inserted new documents successfully", result);
    })
    .catch((e) => {
      console.log(e);
    });
}
