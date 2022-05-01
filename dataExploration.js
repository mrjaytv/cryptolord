// Trying to replicate dataExploration.ipynb in Javascript using Danfo.js.
// Proof of concept.
document.addEventListener("DOMContentLoaded", () => {
  dfd
    .readCSV(
      "https://raw.githubusercontent.com/plotly/datasets/master/2011_february_us_airport_traffic.csv"
    )
    .then((df) => {
      df.print();
    });
});
