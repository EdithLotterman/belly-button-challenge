// Create function to build plots
function buildPlots(id) {

    // Fetch the JSON data and console log it
    d3.json("./data/samples.json").then(function(data) {
        console.log(data)

        // Find index of sample id in samples
        let samples = data.samples
        let sampleDict = {}
        Object.keys(samples[0]).forEach(k => {
            sampleDict[k] = samples.map(o => o[k])
        });
        let sampleIds = sampleDict.id
        let x = sampleIds.indexOf(id)
        
        // Map otu_ids and sample_values into an object
        let sampleList = []

        for (let i = 0; i < data.samples[x].otu_ids.length; i++) {
            let id = data.samples[x].otu_ids[i];
            let value = data.samples[x].sample_values[i];
            let label = data.samples[x].otu_labels[i];
            sampleList.push({"id": id, "value": value, "label": label})
        };

        // Slice top ten and reverse
        topTen = sampleList.slice(0, 10);
        topTen.reverse()

        // Populate bar chart
            let trace1 = {
                x: topTen.map((bacteria) => {return bacteria.value}),
                y: topTen.map((bacteria) => {return `OTU ${bacteria.id}`}),
                text: topTen.map((bacteria) => {return bacteria.label}),
                type: 'bar',
                orientation: 'h'
            };

        // Data array
        let dataTrace1 = [trace1];

        // Format bar chart
        let layout1 = {
            
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            } 
        };

        // Render the bar chart to the div tag with id "bar"
        Plotly.newPlot("bar", dataTrace1, layout1);

        // Populate bubble chart
        let trace2 = {
            x: sampleList.map((bacteria) => {return bacteria.id}),
            y: sampleList.map((bacteria) => {return bacteria.value}),
            text: sampleList.map((bacteria) => {return bacteria.label}),
            mode: "markers",
            marker: {
            size: sampleList.map((bacteria) => {return bacteria.value}),
                color: sampleList.map((bacteria) => {return bacteria.id}),
                colorscale: 'Earth'
            },
        };

        // Data array
        let dataTrace2 = [trace2];

        // Format chart
        let layout2 = {

            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the bubble chart to the div tag with id "bubble"
        Plotly.newPlot("bubble", dataTrace2, layout2); 

    });
};

// Populate metadata
function getMetadata(id)  {

    // Retrieve data
    d3.json("./data/samples.json").then(function(data) {

        // Find index of sample id in metadata
        let metadata = data.metadata  
        let metadataDict = {}
        Object.keys(metadata[0]).forEach(k => {
            metadataDict[k] = metadata.map(o => o[k])
        });

        let metadataIds = metadataDict.id

        // map integers to strings inside metadata array 
        let string = metadataIds.toString()
        let metaStringIds = string.split(',')
        let y = metaStringIds.indexOf(id)

        // Select correct metadata
        let displayMeta = metadata[y]

        // select demographic panel to put data
        let metadataInfo = d3.select("#sample-metadata");
            
        // empty the demographic info panel each time before getting new id info
        metadataInfo.html("");

        // populate metadata in the Demographic Info panel
        Object.entries(displayMeta).forEach((key) => {
            metadataInfo.append("h5").text(key[0] + ": " + key[1] + "\n"); 
        });
    });
} 

//  Create function to hcange data when drop-down changes
function optionChanged(id) {
    buildPlots(id);
    getMetadata(id);
};

//  Create initialization function
function init() {
    
    // select dropdown menu
    let dropDown = d3.select("#selDataset");
    
    // Fetch the JSON data
    d3.json("./data/samples.json").then((data)=> {
    
        // pull data for drop-downs
        let dropDownData = data.names;

        // populate sample names in the dropdwown menu
        dropDownData.forEach(function(id) {
            dropDown.append("option").text(id).property("value");
        });

        // call the function to display the data and the plots to the page
        buildPlots(dropDownData[0]);
        getMetadata(dropDownData[0]);
    });
};

init()

