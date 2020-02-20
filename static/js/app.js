
function getPlot(id) {
    // pull in json file 
    d3.json("../../samples.json").then((file)=> {
        console.log(file)
  
        let wfreq = file.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // filter data by ID 
        let samples = file.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // Show the top 10 values 
        let samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // 10 otu IDs for the plot OTU and then reverse it 
        let OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // format OTU IDs
        let OTU_id = OTU_top.map(d => "OTU " + d)
  
      //   console.log(`OTU IDS: ${OTU_id}`)
  
  
        // Assign labels 
        let labels = samples.otu_labels.slice(0, 10);
  
      //   console.log(`Sample Values: ${samplevalues}`)
      //   console.log(`Id Values: ${OTU_top}`)
        // create trace variable for the plot
        let trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // assign data variable
        let data = [trace];
  
        // create layout 
        let layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // create bar chart 
        Plotly.newPlot("bar", data, layout);
  
        //console.log(`ID: ${samples.otu_ids}`)
      
        // create bubble chart 
        let trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // chart layout
        let layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // assign data1 variable 
        let data1 = [trace1];
  
        // create bubble chart 
        Plotly.newPlot("bubble", data1, layout_b); 
  
    
  
        let data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "cyan" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                  ]}
              
          }
        ];
        let layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  
// pull in the appropriate data 
function getInfo(id) {
    // from the json file 
    d3.json("../../samples.json").then((data)=> {
        
    
        let metadata = data.metadata;

        console.log(metadata)

        // filter by ID 
        let result = metadata.filter(meta => meta.id.toString() === id)[0];

        
        let demographicInfo = d3.select("#sample-metadata");
        
        // clear the demographic info panel each time before moving on to the next ID pull
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create change event function
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    let dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("../../samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // display and plot data 
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();