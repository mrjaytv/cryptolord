// Pulling JSON using CoinGecko
// Transforming the DataFrame using Danfo.js from Tensorflow.
// Finally plotting the data using Plotly.js.

document.addEventListener("DOMContentLoaded", () => {
  dfd
    .readJSON(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1"
    )
    .then((df) => {
      df.print();
      console.log(df.values);
      df.dropNa();
      df.addColumn(
        "timestamp",
        df.values.map((arr) => arr[0][0]),
        { inplace: true }
      );
      df.addColumn(
        "prices",
        df.values.map((arr) => arr[0][1])
      );
      df.addColumn(
        "market_caps",
        df.values.map((arr) => arr[1][1])
      );
      df.addColumn(
        "total_volumes",
        df.values.map((arr) => arr[2][1])
      );
      let dt = df.values.map((timestamp) => new Date(timestamp[3]));
      df.addColumn(
        "Date",
        dt, //convert timestamp to Date object),
        // toDateTime(dt);
        { inplace: true }
      );

      df.print();

      df["prices"]
        .plot("samplePlot2")
        .line({ layout, config: { responsive: true } });
    });

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
});
