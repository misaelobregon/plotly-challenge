function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  var metadataURL = `/metadata/${sample}`;
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(metadataURL).then(function(sample){
      var sampleData = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
      sampleData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(function([key,value]){
        var row = sampleData.append("p");
        row.text(`${key}:${value}`)
    })
  });
}
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  var plotData = `/samples/${sample}`;
    // Build a Bubble Chart using the sample data
    d3.json(plotData).then(function(data){
      var x_axis = data.otu_ids;
      var y_axis = data.sample_values;
      var size = data.sample_values;
      var color = data.otu_ids;
      var texts = data.otu_labels;

      var bubble = {
        x: x_axis,
        y: y_axis,
        text: texts,
        mode: `markers`,
        marker: {
          size: size,
          color: color
        }
      };
  
      var data = [bubble];
      var layout = {
        title: "Belly Button Bacteria",
        xaxis: {title: "OTU ID"}
      };
      Plotly.newPlot("bubble", data, layout);

    // Build a Pie Chart
    d3.json(plotData).then(function(data){
      var value =data.sample_values.slice(0,10);
      var label = data.otu_ids.slice(0,10);
      var display = data.otu_labels.slice(0,10);
      console.log(label);
      var pie_chart = [{
        values: value,
        labels: label,
        hovertext: display,
        type: "pie"
      }];
      console.log(label);
      Plotly.newPlot('pie',pie_chart);
    });
  });
};

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
