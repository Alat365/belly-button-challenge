// Link to data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initializing dashboard
function init() {

    // Selecting the dropdown menu from html
    let dropdownMenu = d3.select("#selDataset");

    // Retrieving and populating data for dropdown menu
    d3.json(url).then((data) => {
      
        // Setting variable for the sample names
        let names = data.names;

        // Adding samples to dropdown menu
        names.forEach((id) => {
            dropdownMenu.append("option").text(id).property("value",id);
        });

        // Set the first sample from the list
        let firstSample = names[0];

        // Build the initial plots
        metadataTable(firstSample);
        barChart(firstSample);
        bubbleChart(firstSample);
  });
};

// Function that populates metadata info
function metadataTable(sample) {

    // Retrieving and populating metadata
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filtering to selected sample
        let value = metadata.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Adding data to the panel as key/value pairs
        Object.entries(valueData).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").html(`<strong>${key}</strong>: ${value}`);
        });
  });
};

// Bar Chart Function
function barChart(sample) {

    // Retrieving Data for bar chart
    d3.json(url).then((data) => {

        // Retrieving Data
        let sampleInfo = data.samples;

        // Filtering to selected sample
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Results for top 10 OTUs
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id} `).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h",
            marker: {
                color: ["#e0ffe0", "#c2ffc2", "#a3ffa3", "#85ff85", "#66ff66",
                    "#4cd94c", "#33b233", "#198c19", "#0a660a", "#004d00"]
            }
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function bubbleChart(sample) {

    // Retrieving data for bubble chart
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filtering to selected sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Viridis"
            }
        };
        
        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        
        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout);
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Call all functions 
    metadataTable(value);
    barChart(value);
    bubbleChart(value);
};

// Call the initialize function
init();