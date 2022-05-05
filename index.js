function print_hello_world() {
  console.log("Hello world!")
}

// this is working because of the import in the html file
// https://socket.io/docs/v4/client -installation/#standalone -build
const socket = io()

socket.on("connect", () => {
  console.log("Connected to the webserver.")
})
socket.on("disconnect", () => {
  console.log("Disconnect from the webserver.")
})

socket.on("visualisation", (obj) => {
  var values = Object.keys(obj).map(function(key) {return obj[key].avg;});
  let min = d3.min(values)
  let max = d3.max(values)
  let domain = [min, max];
  let nBin = 50; //number of bins
  //console.log(d3.min(values))
  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#histogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis: scale and draw:
  const x = d3.scaleLinear()
      .domain(domain)
      .range([0, width]);
  //add the x-axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  // Y axis: initialization
  const y = d3.scaleLinear()
      .range([height, 0]);
  const yAxis = svg.append("g")

  // A function that builds the graph for a specific value of bin
  //feature of changing the number of bins isn't implemented yet
  //problems with the visibility of the input field
  function update(nBin) {
    // set the parameters for the histogram
    const histogram = d3.histogram()
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(nBin)); // then the numbers of bins
    // And apply this function to data to get the bins
    const bins = histogram(values);
    // Y axis: update now that we know the domain
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    yAxis
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));
    // Join the rect with the bins data
    const u = svg.selectAll("rect")
        .data(bins)
    // Manage the existing bars and eventually the new ones:
    u
      .join("rect") // Add a new rect for each new elements
      .transition() // and apply changes to all of them
      .duration(1000)
        .attr("x", 1)
        .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")
  }

  // Initialize with 20 bins
  update(nBin)
  // Listen to the button -> update if user change it
  d3.select("#nBin").on("input", function() {
    update(+this.value);
  });

  const b = document.getElementById("nBin");
  if (b.style.display === "none") {
    b.style.display = "none";
  } else {
    x.style.display = "block";
  }


  // append the bar rectangles to the svg element
  // svg.selectAll("rect")
  //     .data(bins)
  //     .enter()
  //     .append("rect")
  //       .attr("x", 1)
  //       .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
  //       .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
  //       .attr("height", function(d) { return height - y(d.length); })
  //       .style("fill", "#69b3a2")
})

// socket.on("example_data", (obj) => {
//   console.log(obj)
// })

// function request_example_data() {
//   socket.emit("get_example_data", {example_parameter : "hi"})
// }

function paintHistogram() {
  socket.emit("paint_histogram", {example_parameter : "hi"})

  //button for changing number of bins => doesn't work yet
  // const b = document.getElementById("nBin");
  // if (b.style.display === "none") {
  //   b.style.display = "block";
  // } else {
  //   x.style.display = "none";
  // }
}

