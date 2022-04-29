const { type } = require("os");
const axios = require("axios");
let bodyParser = require("body-parser");
let express = require("express");
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const fs = require("fs");

const { MongoClient } = require("mongodb");
const { appendFile } = require("fs");

// console.log(Date.parse("2019-01-01"));
// const d = new Date(1546300800000);
// console.log(d.toLocaleDateString());

let today = Date.now();
today = new Date(today);
// console.log(typeof today);
// console.log(today.toLocaleDateString());

// The last 30 days.
const thirtyDays = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
// console.log(thirtyDays.toLocaleDateString());

// Make a loop that prints out the last 30 days.
let last30days = [];
for (let i = 0; i < 30; i++) {
  const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
  // console.log(date.toLocaleDateString());
  last30days.push(Date.parse(date));
}
console.log(last30days);

const fetchdata = async (coinid, currency, fromdate, todate, client) => {
  let url = `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart/range?vs_currency=${currency}&from=${parseInt(
    fromdate / 1000
  )}&to=${parseInt(todate / 1000)}`;
  // console.log(url);
  axios
    .get(
      url
      // `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart?vs_currency=usd&days=1`
    )
    .then((response) => {
      createOneListing(client, response.data);
      console.log(response.data);
    });
};

// fs.writeFile("./my.json", JSON.stringify(documents), function (err) {
//   if (err) {
//     console.error("Crap happens");
//   }
// });

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

// create a function that inserts a listing into the mongoDB database cryptoland and listings collection
async function createOneListing(client, newListing){
  const result = await client.db("cryptoland").collection('listings').insertOne(newListing);
  console.log(result);
};

// create a function that inserts multiple listings into the mongoDB database cryptoland and listings collection
const createMultipleListings = async (client, newListings) => {
  const result = await client.db("cryptoland").collection('listings').insertMany(newListings);
  console.log(result);
};

async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri =
    "mongodb+srv://cryptolord:cryptolordpass@cluster0.0tmx0.mongodb.net/crytoland?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    //Connect to mongodb cluster and insert data into cryptoland database with listings collection
    await client.connect();
    console.log("Connected to MongoDB cluster");
    await listDatabases(client);
    await createOneListing(client, fetchdata("bitcoin", "usd", last30days[2], last30days[30], client));

    await createOneListing(client, {
      coinid: "bitcoin",
      currency: "usd",
      fromdate: Date.parse("2019-01-01"),
      todate: Date.parse("2019-01-31"),
    });
    await createMultipleListings(client, [
      {
        coinid: "bitcoin",
        currency: "usd",
        fromdate: Date.parse("2019-01-01"),
        todate: Date.parse("2019-01-31"),
      },
      {
        coinid: "bitcoin",
        currency: "usd",
        fromdate: Date.parse("2019-02-01"),
        todate: Date.parse("2019-02-28"),
      },
    ]);

    // try {
    //   // Pull data from API
    // // var documents = [];
    // for (let i = 0; i < last30days.length; i++) {
    //   // console.log(typeof documents)
    //     await fetchdata("bitcoin", "usd", last30days[i + 1], last30days[i], client)
    //   };
    // } catch (e){console.log(e)}

    // console.log(documents);

    // await createMultipleListings(client, documents);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
main().catch(console.error);
