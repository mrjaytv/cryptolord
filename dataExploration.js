// Trying to replicate dataExploration.ipynb in Javascript using Danfo.js.
// Proof of concept.
const plotConfig = { responsive: true };

document.addEventListener("DOMContentLoaded", () => {
  dfd
    .readCSV(
      "https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv"
      // "https://raw.githubusercontent.com/plotly/datasets/master/2011_february_us_airport_traffic.csv"
    )
    .then((df) => {
      df.print();

      console.log(df.columns);
      // console.log(df["long"]);

      const layout = {
        title: {
          text: "Time series plot of AAPL open and close points",
          x: 0,
        },
        legend: {
          bgcolor: "#fcba03",
          bordercolor: "#444",
          borderwidth: 1,
          font: { family: "Arial", size: 10, color: "#fff" },
        },
        width: 1000,
        yaxis: {
          title: "AAPL open points",
        },
        xaxis: {
          title: "Date",
        },
      };

      const config = {
        columns: ["AAPL.Open", "AAPL.Close"], //columns to plot
        displayModeBar: true,
        displaylogo: false,
      };
      df.plot("samplePlot").line({ layout, config });
    });

  dfd
    .readJSON(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1`
    )
    .then((df) => {
      df = df.dropNa();

      const getFirst = (arr) => arr[0];
      const getSecond = (arr) => arr[1];

      df.addColumn("timestamp", df["prices"].apply(getFirst), {
        inplace: true,
      });
      df["prices"] = df["prices"].apply(getSecond);
      df["market_caps"] = df["market_caps"].apply(getSecond);
      df["total_volumes"] = df["total_volumes"].apply(getSecond);
      df.print();

      const layout = {
        title: {
          text: "BTC Price Last 24 Hours",
          x: 0,
        },
        legend: {
          bgcolor: "#fcba03",
          bordercolor: "#444",
          borderwidth: 1,
          font: { family: "Arial", size: 10, color: "#fff" },
        },
        width: 1000,
        yaxis: {
          title: "Price",
        },
        xaxis: {
          title: "Time",
        },
      };

      df["prices"]
        .plot("samplePlot2")
        .line({ layout, config: { responsive: true } });
    });
});
