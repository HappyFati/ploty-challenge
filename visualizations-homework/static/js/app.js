function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
  }

  
function bubbleChart(data) {
    let x = data.otu_ids;
    let y = data.sample_values;
    let markersize = data.sample_values;
    let markercolors = data.otu_ids;
    let textvalues = data.otu_labels;
  
    let trace =[{
      x: x,
      y: y,
      mode: 'markers',
      marker: {
        size: markersize,
        color: markercolors,
      },
      text: textvalues
    }];
  
    let layout ={
      title:"<b> Belly Button Bacteria </b>",
      xaxis: {
        title: 'OTU ID',
      },
      yaxis: {
        title: 'Sample Value'
      },
      width:1100,
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
    };
  
    Plotly.newPlot('bubble', trace, layout, {responsive: true});
  }
  
  function barChart(data) {
    let x = data.otu_ids.slice(0,10);
    let y = data.sample_values.slice(0,10);
    let markercolors = data.otu_ids;
    let text = data.otu_labels;
  
    let trace =[{
      x: x,
      y: y,
      type: 'bar',
      text: text,
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 0.6,
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }
      }
    }];
  
    let layout ={
      title:"<b> Belly Button Top 10 Samples </b>",
      orientation = 'h',
    };

    Plotly.newPlot('bar', trace , layout, {responsive: true});
}
  
  function buildCharts(sample) {

    d3.json(`/samples/${sample}`).then( data =>{
      // ## Bar Chart ##
      barChart(data);
      // ## Bubble Chart ##
      bubbleChart(data);
    });

   
}

  function init() {
  
    var selector = d3.select("#selDataset");
  
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
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();