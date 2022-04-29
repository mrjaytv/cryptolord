const { type } = require("os");
const axios = require("axios");
let bodyParser = require("body-parser");
let express = require("express");
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const fs = require("fs");

// console.log(Date.parse("2019-01-01"));
// const d = new Date(1546300800000);
// console.log(d.toLocaleDateString());

let today = Date.now();
today = new Date(today);
console.log(typeof today);
console.log(today.toLocaleDateString());

// The last 30 days.
const thirtyDays = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
console.log(thirtyDays.toLocaleDateString());

// Make a loop that prints out the last 30 days.
let last30days = [];
for (let i = 0; i < 30; i++) {
  const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
  console.log(date.toLocaleDateString());
  last30days.push(Date.parse(date));
}
console.log(last30days);

const fetchdata = async (coinid, currency, fromdate, todate) => {
  let url = `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart/range?vs_currency=${currency}&from=${parseInt(
    fromdate / 1000
  )}&to=${parseInt(todate / 1000)}`;
  console.log(url);
  axios
    .get(
      url
      // `https://api.coingecko.com/api/v3/coins/${coinid}/market_chart?vs_currency=usd&days=1`
    )
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
};
// Pull data from API
documents = [];
for (let i = 0; i < last30days.length; i++) {
  fetchdata("bitcoin", "usd", last30days[i + 1], last30days[i]).then((data) => {
    documents.push(data);
  });
}
// fs.writeFile("./my.json", JSON.stringify(documents), function (err) {
//   if (err) {
//     console.error("Crap happens");
//   }
// });

const { MongoClient } = require("mongodb");
const { appendFile } = require("fs");

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

const createMultipleListings = async (client, newListings) => {
  const db = client.db("crytoland");
  const collection = db.collection("listings");
  const result = await collection.insertOne(newListings);
  console.log(result.insertedCount);
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
    await client.connect();
    // Make the appropriate DB calls
    await listDatabases(client);
    await createMultipleListings(client, documents);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
main().catch(console.error);
