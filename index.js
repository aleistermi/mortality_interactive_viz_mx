

//const domReady = require('domready');
// import {select} from '/d3-selection';
// import {interpolateInferno} from '/d3-scale-chromatic';
// import {scaleLinear} from '/d3-scale';
// "/node_modules/moment/src/moment.js";
Promise.all([
  d3.json('./suicides.json'),
  d3.json('./mx_geojson.geojson')
]).then(function (data){
  myVis(data)
})

function myVis([data,geodata]) {
  console.log(data, geodata)
  // basic plot configurations
  let highlightedState = 0
  const height = 600;
  const width = 600;
  const margin = {top: 50, left: 50, right: 50, bottom: 50};

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.bottom - margin.top;
  const colorRange = ['#F09D51', '#E77971', '#BF678B', '#85618F','#4E587B', '#2F4858', '#BC9B39','#879536',
                      '#528B41', '#007E50', '#006F5F', '#9E724D', '#FFBFBC', '#FF8887', '#C35355', '#BD6D94',
                      '#ED808A','#FF9F77', '#0088E8','#5B84B1', '#E5EFFD', '#D5CABD', '#574142', '#A65BA6',
                      '#A1A551', '#C33C4A', '#A7B31E','#F3AA69', '#007F83','#2F4858', '#00605D', '#427037'];

  const projection = d3.geoAlbers()
  const geoGenerator = d3.geoPath(projection);
  projection.fitExtent([[0, 0], [650, 500]], geodata);

  // X SCALE, years
  const x_scale = d3.scaleBand()
    .domain(data.map((row)=>row.year_death))
    .range([margin.right, plotWidth]);
  // Y SCALE, rate
  var max_y_domain = d3.max(data, function(d) { return Math.max(d.rate)} );
  const y_scale = d3.scaleLinear()
      .domain([0,max_y_domain]) //
    	.range([plotHeight,0]);

  const xAxis = d3.axisBottom()
  .scale(x_scale);
  const yAxis = d3.axisRight(y_scale);


  var line = d3.line()
      .x(function(d) {

        return x_scale(d.year_death);
      }) // set the x values for the line generator
      .y(function(d) { return y_scale(d.rate); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX); // apply smoothing to the line

  const svg_chart = d3.select(".main")
        	.append("svg") // why  do we append after we define svg?
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top}) `)

  xAxis.tickValues([1998, 2003, 2008, 2013, 2017,]);
  svg_chart.append("g")
      .attr("class", "x axis")
      //.attr("transform", "translate(0," + height + ")")
      .attr("transform", "translate(0, 500)")
      .call(xAxis); // Create an axis component with d3.axisBottom
  xAxis.tickSize(0);
  yAxis.tickSize(5);
  yAxis.ticks(5);
  xAxis.ticks(0);

  svg_chart.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(500,0)")
     .call(yAxis);

  // svg_chart.append("path")
  //     .datum(data) // Binds data to the line
  //     .attr("class", "line") // Assign a class for styling
  //     .attr("d", line(data))
  //     .attr("fill", "none")// Calls the line generator
  //     .attr("stroke", '#2171b5');
  //     .attr("id", "container1");

//var state = svg.createElement("stateid");
let lines = svg_chart.append("g")
      .attr("class", "lines");

const lines_data = data.reduce((acc, row) => {

  if (!acc[row.state_name]){
     acc[row.state_name]=[] ;
}
acc[row.state_name].push(row);
return acc;
},{});
console.log(lines_data);
// lines.selectAll(".state-line")
//        .data(Object.values(lines_data)).enter()
//        // .append("g")
//        // .attr("class", "state-line")
//        // .attr("state_id",(data) => (data.cve_edo))
//        .append("path")
//        .attr("class", "state-line")
//        .attr("d", d => line((d)))
//        .attr("stroke", (d, i) => i % 2 ? 'red' : '#2171b5')
//        .attr("fill", "none");
//        .on(“mouseout”, function(d) {
//            svg.select(“.title-text”).remove();
//          })


  const svg_map = d3.select(".main")
          .append("svg")
          .attr("width", 820)
          .attr("height", 800)
          .attr("id", "mapcontainer")
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top}) `);

svg_map.selectAll(".state")
          .data(geodata.features)
          .enter()
          .append('path')
            .attr("d", geoGenerator)
            .attr("id", "container1")
            .attr('class', 'state')
            .attr('stroke', 'white')
            .attr('fill', "#2171b5")
            .on("click", function(data){
              console.log(data.properties.CVE_ENT);
              d3.select(this).attr("fill-opacity",".4");
              lines.selectAll(".state-line")
                     .data(Object.values(lines_data)).enter()
                     // .append("g")
                     //.attr("class", "state-line")
                     // .attr("state_id",(data) => (data.cve_edo))
                     .append("path")
                     .attr("class", "state-line")
                     .attr("d", d => line((d)))
                     // .attr("d",function (geodata,data,d){ if (data.cve_edo===geodata.CVE_ENT){
                     //   line((d))
                     // }})
                     .attr("stroke", '#2171b5')
                     //.attr("stroke", (d,i) => i % 2 ? 'red' : '#2171b5')

                     .attr("fill", "none");
                     // .on(“mouseout”, function(d) {
                     //     svg.select(“.title-text”).remove();
                     //   })
              console.log(this)
              // svg_chart.append("path")
              // .datum(data) // Binds data to the line
              // .attr("class", "line") // Assign a class for styling
              // .attr("d", line(data))
              // .attr("fill", "none")// Calls the line generator
              // .attr("stroke", '#2171b5');
            })

    // done: function(data) {
    //           data.svg_map.selectAll('.datamaps-subunit').on('click', function(geography) {
    //               var m = {};
    //               m[geography.id] = '#000000';
    //               datamap.updateChoropleth(m);
    //           });
    //         }
            /* Add line into SVG */
     // var line = d3.line()
     //   .x(d => xScale(d.Time))
     //   .y(d => yScale(d.FLFP));
     //
     // let lines = svg.append(‘g’)
     //   .attr(‘class’, ‘lines’);
     //
     // lines.selectAll(‘.line-group’)
     //   .data(data).enter()
     //   .append(‘g’)
     //   .attr(‘class’, ‘line-group’)
     //   .on(“mouseover”, function(d, i) {
     //       svg.append(“text”)
     //         .attr(“class”, “title-text”)
     //         .style(“fill”, Regcolor(i))
     //         .text(d.name)
     //         .attr(“text-anchor”, “middle”)
     //         .attr(“x”, (width-margin)/2)
     //         .attr(“y”, 5);
     //     })
     //   .on(“mouseout”, function(d) {
     //       svg.select(“.title-text”).remove();
     //     })
     //   .append(‘path’)
     //   .attr(‘class’, ‘line’)
     //   .attr(‘d’, d => line(d.values))
     //   .style(‘stroke’, (d, i) => Regcolor(i))
     //   .style(‘opacity’, lineOpacity)
     //   .on(“mouseover”, function(d) {
     //       d3.selectAll(‘.line’)
     //           .style(‘opacity’, otherLinesOpacityHover);
     //       d3.selectAll(‘.circle’)
     //           .style(‘opacity’, circleOpacityOnLineHover);
     //       d3.select(this)
     //         .style(‘opacity’, lineOpacityHover)
     //         .style(“stroke-width”, lineStrokeHover)
     //         .style(“cursor”, “pointer”);
     //     })
     //   .on(“mouseout”, function(d) {
     //       d3.selectAll(“.line”)
     //           .style(‘opacity’, lineOpacity);
     //       d3.select(this)
     //         .style(“stroke-width”, lineStroke)
     //         .style(“cursor”, “none”);
     //     });




            // .on("click", function(){
            //   d3.select(this).
            //   style("fill", "#2171b5");});
  // svg_map.append("g")
  //     .attr("class", "x axis")
  //     //.attr("transform", "translate(0," + height + ")")
  //     .attr("transform", "translate(200, 0)")
  //     .attr("class", "nothing")
  //     //.attr("transform", "translate(0," + 100  + ")")
  //     .attr("transform", "translate(49,0)")
  //     .call(yAxis);

    //  .call(xAxis);


//
  // svg.selectAll(".dot")
  //     .data(data)
  //   .enter().append("circle") // Uses the enter().append() method
  //     .attr("class", "dot") // Assign a class for styling
  //     .attr("cx", function(d) { return x_scale(d.year_death) })
  //     .attr("cy", function(d) { return yScale(d.rate) })
  //     .attr("r", 5)
  //       .on("mouseover", function(a, b, c) {
  //   			console.log(a)
  //         this.attr('class', 'focus')
  // 		})
  //       .on("mouseout", function() {  })
   // Create an axis component with d3.axisLeft
  // const circles = svg.selectAll('.circ').data(data);
  //const states = Object.keys(groups);

// circles.enter()
//   .append('circle')
//   .attr("r", 8)
//   .attr("cx", function(d){ return x_scale(d.year_death) })
//   .attr("cy", function(d){ return y_scale(d.rate) })
//   //.attr('fill', "#4C64E8");

  // svg.append('g')
  //   .call(d3.axisBottom(x_scale))
  //   .attr('transform', `translate(0, ${plotHeight})`);
  // svg.append('g').call(d3.axisRight(y_scale));
  // svg.append('g').call(d3.axisLeft(y_scale))
  // .call (d3.axisRight(y_scale)).attr('transform', `translate(${plotHeight},0) `);
  //   svg.append('g')
  //     .call(d3.axisTop(x_scale))


// ADD LABELS. How could I create a function that varies attr, x, y ans text
//         svg.append('rect')
//         .attr('class', 'rect very_low')
//         .attr('height', 15)
//         .attr('width', 15)
//         .attr('x', 25)
//         .attr('y', 450);
//
//         svg.append('rect')
//         .attr('class', 'rect low')
//         .attr('height', 15)
//         .attr('width', 15)
//         .attr('x', 25)
//         .attr('y', 470);
//
//         svg.append('rect')
//         .attr('class', 'rect high')
//         .attr('height', 15)
//         .attr('width', 15)
//         .attr('x', 25)
//         .attr('y', 490);
//
//         svg.append('rect')
//         .attr('class', 'rect very_high')
//         .attr('height', 15)
//         .attr('width', 15)
//         .attr('x', 25)
//         .attr('y', 510);
// // ADD text. How can I do this with a function too?
//
// svg
// .append('text')
// .attr('class', 'label')
// .attr('x', 25)
// .attr('y', 435)
// .attr('text-anchor', 'right')
// .attr('font-size', 14)
// .attr('font-family', 'Karla')
// .attr('font-weight', 'bold')
// .text("Degree of Marginalization");
//
//    svg
//   .append('text')
//   .attr('class', 'label')
//   .attr('x', 47)
//   .attr('y', 461)
//   .attr('text-anchor', 'right')
//   .attr('font-size', 13)
//   .attr('font-family', 'Karla')
//   .text("Very Low");
//
//   svg
//  .append('text')
//  .attr('class', 'label')
//  .attr('x', 47)
//  .attr('y', 481)
//  .attr('text-anchor', 'right')
//  .attr('font-size', 13)
//  .attr('font-family', 'Karla')
//  .text("Low");
//  svg
// .append('text')
// .attr('class', 'label')
// .attr('x', 47)
// .attr('y', 501)
// .attr('text-anchor', 'right')
// .attr('font-size', 13)
// .attr('font-family', 'Karla')
// .text("High");
// svg
// .append('text')
// .attr('class', 'label')
// .attr('x', 47)
// .attr('y', 521)
// .attr('text-anchor', 'right')
// .attr('font-size', 13)
// .attr('font-family', 'Karla')
// .text("Very High");
//
//  // ADD AXIS TITLES, LABELS AND SOURCING
//
//  svg
//  .append('text')
//  .attr('class', 'x_axis_label')
//  .attr('x', (plotWidth-margin.right)/2)
//  .attr('y',  -22)
//  .attr('text-anchor', 'right')
//  .attr('font-size', 11)
//  .attr('font-family', 'Karla')
//  .attr('font-weight', 'bold')
//  .attr('text-anchor', 'middle')
//  .text("Rate of Suicides (#/100K)") ;
//
//
//  svg.append('text')
//     .attr("class", "y_axis_label")
//     .attr("y",-width +15)
//     .attr("x", height/2 - 60)
//     .attr('text-anchor', 'right')
//     .attr('font-size', 11)
//     .attr("transform", "rotate(90)")
//     .attr('font-weight', 'bold')
//     .text("% Expenditure on Alcohol")
//
//     svg.append('text')
//     .attr('class', 'x_axis_label')
//     .attr('x', (47))
//     .attr('y',  height )
//     .attr('text-anchor', 'right')
//     .attr('font-size', 9)
//     .attr('font-family', 'Karla')
//     .attr('text-anchor', 'middle')
//     .text("Source: INEGI, CONAPO, ENIGH 2008") ;

    }
