const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create a function for all visualizations
function plotCharts(selectedValue) {

    d3.json(url).then( function(data) {
        
        // Populate dropdown menu
        let dropDownValues = d3.select("#selDataset");

        // Retrieve previous selection if available
        let previousDropDownValue = dropDownValues.property("value");
        
        // Clear dropdown menu before each iteration
        dropDownValues.html("");

        // Repopulate dropdown menu
        data.names.forEach(function(name){
            dropDownValues.append("option").text(name).property("value", name)
        });

        // If previous selection exists, display it in the dropdown
        if (previousDropDownValue) {
            dropDownValues.property("value", previousDropDownValue);
        }

        // Name functions for later use that contain sample data and ids
        let selectedData = data.samples.find(data => data.id == selectedValue);
        console.log("Selected Data", selectedData);

        let sampleValues = selectedData.sample_values;
        console.log("Sample Values",sampleValues);

        let topTenOtuValues = sampleValues.slice(0,10).reverse();
        console.log("Top Ten Sample Values",topTenOtuValues);

        let topTenOtuID = selectedData.otu_ids.slice(0,10).map(out_id => `OTU ${out_id}`).reverse();
        console.log("Top Ten OTU IDs",topTenOtuID);

        let toptenOtuLabels = selectedData.otu_labels.slice(0,10).reverse();
        console.log("Top Ten OTU Labels",toptenOtuLabels);
                              
        let selectedMetadata = data.metadata.find(data => data.id == selectedValue);
        console.log("Selected Metadata", selectedMetadata);

        // Create the horizontal bar chart
        var trace1 = {
            x : topTenOtuValues,
            y : topTenOtuID,
            type: "bar",
            text: toptenOtuLabels,
            orientation: "h"
        };

        var barData = [trace1];

        var barLayout = {
            title:"Top Ten OTUs Found in Patient: " + selectedValue,
            xaxis: {
                title: "Sample Values",
            },
            showlegend: false,
            height: 400,
            width: 900
        };
        
        Plotly.newPlot('bar', barData, barLayout);

        // Create the bubble chart
        var trace2 = {
            x: selectedData.otu_ids,
            y: sampleValues,
            text: selectedData.otu_labels,
            mode: 'markers',
            marker: {
              color: selectedData.otu_ids,
              colorscale: 'Viridis',
              size: sampleValues.map(value => value * 0.5)
            }
          };
          
        var bubbleData = [trace2];
          
        var bubbleLayout = {
            title: 'All OTUs found in Patient: ' + selectedValue,
            xaxis: {
                title: {
                    text:"OTU ID"
                }
            },
            showlegend: false,
            height: 400,
            width: 900
          };
          
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        // Show patient metadata
        let patientMetadata = d3.select("#sample-metadata").html("");

        Object.entries(selectedMetadata).forEach(([key, value])=>{
            patientMetadata.append("h5").text(`${key}: ${value}`)
        });
    });
}

// Default Dashboard so that it will populate
plotCharts(940)

// Function for changing the selected patient number in plotCharts automatically
function optionChanged(selectedValue){
    plotCharts(selectedValue)
};
