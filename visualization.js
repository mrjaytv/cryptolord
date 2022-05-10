var mongoose = require("mongoose");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fastcsv = require("fast-csv");
const ws = fs.createWriteStream("fastcsv.csv");

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

      Data.find(search)
        .then((result) => {
          // console.log(result[0]);
          // USING JSON2CSV
          const json2csvParser = new Json2csvParser({ header: false });
          const csvData = json2csvParser.parse(result);
          fs.writeFile("data.csv", csvData, (err) => {
            if (err) throw err;
            console.log("File written successfully!");
          });
          // USING CSV-WRITER
          // const csvWriter = createCsvWriter({
          //   path: "data.csv",
          //   header: [
          //     { id: "_id", title: "_id" },
          //     { id: "high", title: "high" },
          //     { id: "low", title: "low" },
          //     { id: "open", title: "open" },
          //     { id: "close", title: "close" },
          //     { id: "time", title: "time" },
          //     { id: "volumefrom", title: "volumefrom" },
          //     { id: "volume", title: "volume" },
          //     { id: "date", title: "date" },
          //   ],
          // });
          // csvWriter
          //   .writeRecords(result)
          //   .then(() =>
          //     console.log(
          //       "Write to bezkoder_mongodb_csvWriter.csv successfully!"
          //     )
          //   );
          // USING FAST-CSV
          // fastcsv
          //   .write(result, { headers: true })
          //   .on("finish", function () {
          //     console.log(
          //       "Write to bezkoder_mongodb_fastcsv.csv successfully!"
          //     );
          //   })
          //   .pipe(ws);
          // return result;
        })
        .catch((e) => {
          console.log("Error connecting to MongoDB Atlas... Exiting now...", e);
        });
    });
};
//Call This function to get the data from the database or from the API, trying the database first

getData("BTC", "USD"); //.then((result) => {

//Here we create the schema for the data
var repSchema = mongoose.Schema({
  any: {},
});
var Data = mongoose.model("cryptoindicator", repSchema);
