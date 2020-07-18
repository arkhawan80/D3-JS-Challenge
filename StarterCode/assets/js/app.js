var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append('div')
    .classed('chart', true);

  //append an svg element to the chart 
  var svg = svg.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);
    
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


    svg.append("g").attr("class", "xgroup");
    svg.append("g").attr("class", "ygroup");
  
    var ygroup = d3.select(".ygroup")
    var xgroup = d3.select(".xgroup")
  
  // Create axes labels
  ygroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity")
    .attr("data-axis", "y")
    .attr("data-name", "obesity");

    // ygroup.append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y",  margin.left - 60)
    // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .attr("class", "axisText")
    // .text("Poverty")
    // .attr("data-axis", "y")
    // .attr("data-name", "poverty");;

  xgroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
    .attr("class", "axisText")
    .text("Income")
    .attr("data-axis", "x")
    .attr("data-name", "income");;
  

  // xgroup.append("text")
  //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  //   .attr("class", "axisText")
  //   .text("Age")
  //   .attr("data-axis", "x")
  //   .attr("data-name", "age");

    function plot(xaxis, yaxis){
      // Import Data
      d3.csv("assets/data/data.csv").then(function(censusData) {
      
      


// function used for updating y-scale var upon click on axis label
    function yScale(data, yaxis) {
      // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[yaxis]) * 0.8,
    d3.max(data, d => d[yaxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

function renderyaxes(yLinearScale, chosenYaxis) {
  var leftAxis = d3.axisLeft(yLinearScale);

  chosenYaxis.transition()
    .duration(1000)
    .call(leftAxis);

  return chosenYaxis;
}

// function used for updating x-scale var upon click on axis label
function xScale(data, xaxis) {
  
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[xaxis]) * 0.8,
      d3.max(data, d => d[xaxis]) * 1.2
    ])
    .range([height, 0]);

  return xLinearScale;

}

function renderxaxes(xLinearScale, chosenXaxis) {
  var bottomAxis = d3.axisBottom(xLinearScale);

  chosenXaxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return chosenXaxis;
}

  var xLinearScale = xScale(censusData, xaxis);
  var yLinearScale = yScale(censusData, yaxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // renderxaxes(xLinearScale, xaxis)
  // renderyaxes(yLinearScale, yaxis)

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data[yaxis] = +data[yaxis];
      data[xaxis] = +data[xaxis];
      // console.log(data.obesity)
    });
    


    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(censusData, d => d[xaxis])])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d[yaxis])])
      .range([height, 0]);

    // // Step 3: Create axis functions
    // // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[xaxis]))
    .attr("cy", d => yLinearScale(d[yaxis]))
    .attr("r", "15")
    .attr("fill", "darkblue")
    .attr("opacity", ".5")
    
    // .append("text")
    .text(function(d){ return d.abbr;})
    .attr("x", function(data){
      return xLinearScale(data[xaxis]);
  })
    .attr("y", function(data) {
      return yLinearScale(data[yaxis]);
  });

          
    // append Initial Text
    var textGroup = chartGroup.selectAll('.stateText')
    .data(censusData)
    .enter()
    .append('text')
    .classed('stateText', true)
    .attr('x', d => xLinearScale(d[xaxis]))
    .attr('y', d => yLinearScale(d[yaxis]))
    .attr('dy', 3)
    .attr('font-size', '10px')
    .text(function(d){return d.abbr}); 



    var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function (d) {
      return `${d.abbr}<br>${label} ${d[xaxis]}`;
    });



    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return `${d.state }<br>${yaxis}: ${d[yaxis]}<br>${xaxis}: ${d[xaxis]}<br>`;
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
    
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
})
     
    
  .catch(function(error) {
    console.log(error);
  })};

  plot("income", "obesity")

  // var xaxis = "income"
  // var yaxis = "obesity"
  //   d3.selectAll(".axisText").on("click", function(){
  //     var self = d3.select(this);
  //     var axis = self.attr("data-axis")
  //     var name = self.attr("data-name")
      
  //     if(axis == "x"){
  //       xaxis = name
  //     }
  //     else{
  //       yaxis = name
  //     }
  //     plot(xaxis, yaxis)
  //     console.log(xaxis, yaxis)
  //   })
  




  