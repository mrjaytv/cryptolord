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

  Plotly.newPlot(
    "samplePlot",
    [{ x: tetColorPalette, y: 0, type: "bar" }],
    {
      title: "Colors of Pieces",
      height: 300,
      automargin: true,
      xaxis: { title: "Color" },
      yaxis: { title: "Count" },
    },
    plotConfig
  );
});
