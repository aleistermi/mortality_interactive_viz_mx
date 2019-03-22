
// Names for states
const states = ['Aguascalientes','Baja California','Baja California Sur','Campeche', 'Chiapas','Chihuahua','Coahuila','Colima',
                'CDMX','Durango','Guanajuato','Guerrero','Hidalgo','Jalisco','México','Michoacán','Morelos',
                'Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa',
                'Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'];
// I did not use the palette at the end, but just in case...
const palette2 = ['#40004b','#762a83','#9970ab','#c2a5cf','#e7d4e8','#d9f0d3','#a6dba0','#5aae61','#1b7837','#00441b',
'#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#67001f','#b2182b','#d6604d','#f4a582','#fddbc7',
'#d1e5f0','#92c5de','#4393c3','#842282','#053061','#bababa','#878787','#4d4d4d','#1a1a1a', '#8e0152','#c51b7d','#de77ae']
// Nor this function
const colorMap = states.reduce((acc, row, idx) => {
  acc[row] = palette2[idx];
  return acc;
}, {})

// Data
Promise.all([
  d3.json('./nationalsuicides.json'),
  d3.json('./mx_geojson2.geojson')
]).then(function (data){
  myVis(data)
})

// Function to create visualization
function myVis([data,geodata]) {
  // Plot configurations
  const height = 500;
  const width = 600;
  const margin = {top: 80, left: 50, right: 75, bottom: 20};

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.bottom - margin.top;
  const state_abb=["AGS","BC","BCS","CAMP","CHIS","CHIH","COAH","COL","CDMX","DUR","GTO","GUE","HGO","JAL","MICH",
                  "MOR","MEX","NAY","NL","OAX","PUE","QUER","QROO","SLP","SIN","SON","TAB","TAM","TLAX","VER","YUC","ZAC"]

  var dict_names={}
  for (i = 0; i < 32; i++) {
   dict_names[`${i+1}`] = state_abb[i];
  }
  var dict_longnames={}
  for (i = 0; i < 32; i++) {
   dict_longnames[`${i+1}`] = states[i];
  }

  // Geographic Data
  const projection = d3.geoAlbers()
  const geoGenerator = d3.geoPath(projection);
  projection.fitExtent([[0, 0], [650, 500]], geodata);
  projection.fitSize([650,500],geodata);

  // Line chart
  // X SCALE , years
  const x_scale = d3.scaleBand()
    .domain(data.map((row)=>row.year_death))
    .range([margin.right, plotWidth + 50]);
  // Y SCALE, rate
  var max_y_domain = d3.max(data, function(d) { return Math.max(d.rate)} );
  const y_scale = d3.scaleLinear()
      .domain([0,max_y_domain]) //
    	.range([plotHeight,0]);

  const xAxis = d3.axisBottom()
  .scale(x_scale);
  xAxis.tickValues([1998, 2003, 2008, 2013, 2017])
  xAxis.tickSize(8);
  xAxis.ticks(5);

  const yAxis = d3.axisRight(y_scale);
  yAxis.tickSize(8);
  yAxis.ticks(5);

  function state_name (data) {return data.state_name};

  // SVG for chart
  const svg_chart = d3.select(".main")
        	.append("svg")
            .attr("width", width + margin.left + margin.right +50)
            .attr("height", height + margin.top + margin.bottom )
          .append("g")
          .attr("id", "main_g")
          .attr("transform", `translate(${margin.left}, ${margin.top}) `)

  svg_chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,400)")
      .call(xAxis);

  // todo` once the chart is back, look at the css style for the ticks, write a css style display none for the
  svg_chart.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(555,0)")
     .call(yAxis);

  svg_chart
     .append('text')
     .attr('class', 'label')
     .attr('x', 300)
     .attr('y', 430)
     .attr('text-anchor', 'right')
     .attr('font-size', 15)
     .attr('font-family', 'Karla')
     .attr('font-weight', 'bold')
     .text("Year");
  svg_chart
  .append('text')
        .attr("class", "label")
        .attr("y",  600)
        .attr("x", -plotHeight/2 - 100)
        .attr('text-anchor', 'right')
        .attr('font-size', 14)
        .attr("transform", "rotate(-90)")
        .attr('font-weight', 'bold')
        .text("Rate per 100K inhabitants")

  // Function to draw lines (FROM here https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89#index.html)
  var line = d3.line()
            .x(function(d) {
              return x_scale(d.year_death);
            })
            .y(function(d) { return y_scale(d.rate); }) // set the y values for the line generator
            .curve(d3.curveMonotoneX); // apply smoothing to the line


  let lines = svg_chart.append("g")
      .attr("class", "lines");

  // Transform data to have an array
  const lines_data = data.reduce((acc, row) => {
  if (!acc[row.state_name]){
     acc[row.state_name]=[] ;
   }

  acc[row.state_name].push(row);
  return acc;
  },{});

// Some Brute force here :(
lines_data['Aguascalientes'].abbrev="AGS";lines_data['Baja California'].abbrev="BC";lines_data['Baja California Sur'].abbrev="BCS";
lines_data['Campeche'].abbrev="CAMP";lines_data['Coahuila'].abbrev="COAH";lines_data['Colima'].abbrev="COL";lines_data['Chiapas'].abbrev="CHIS";
lines_data['Chihuahua'].abbrev="CHIH";lines_data['Distrito Federal'].abbrev="CDMX";lines_data['Durango'].abbrev="DUR";lines_data['Guanajuato'].abbrev="GTO";
lines_data['Guerrero'].abbrev="GUER";lines_data['Hidalgo'].abbrev="HGO";lines_data['Jalisco'].abbrev="JAL";lines_data['México'].abbrev="MEX";
lines_data['Michoacán'].abbrev="MICH";lines_data['Morelos'].abbrev="MOR";lines_data['Nayarit'].abbrev="NAY";lines_data['Nuevo León'].abbrev="NL";
lines_data['Oaxaca'].abbrev="OAX";lines_data['Puebla'].abbrev="PUE";lines_data['Querétaro'].abbrev="QUER";lines_data['Quintana Roo'].abbrev="QROO";
lines_data['San Luis Potosí'].abbrev="SLP";lines_data['Sinaloa'].abbrev="SIN";lines_data['Sonora'].abbrev="SON";lines_data['Tabasco'].abbrev="TAB";
lines_data['Tamaulipas'].abbrev="TAMP";lines_data['Tlaxcala'].abbrev="TLAX";lines_data['Veracruz'].abbrev="VER";lines_data['Yucatán'].abbrev="YUC"
lines_data['Zacatecas'].abbrev="ZAC";lines_data['National'].abbrev="NAT";


// Draw lines
lines.selectAll(".state-line")
       .data(Object.values(lines_data)).enter()
       .append("path")
       .attr("class", "state-line")
       .attr("d", d => line((d)))
       .attr("stroke", '#D3D3D3')
       .attr("id", function(d){return `state-path-${Number(d[0]["cve_edo"])}`;}
         )
      .attr("name", function(d){return (d[0]["state_name"]);}
           )
      .attr( "abbreviation", function(d){return (d['abbrev']);})
        .attr("class", "inactive")
        .attr("stroke-opacity", 0)
       .attr("fill", "none")
       .attr("stroke-width", 1)
       ;
// Create labels that will be placed at the end of the line
lines.selectAll(".myLabels")
       .data(Object.values(lines_data)) // Source: https://www.d3-graph-gallery.com/graph/connectedscatter_multi.html
       .enter()
         .append('g')
         .append("text")
           .datum(function(d) {return {name: d["abbrev"], value: d[19]['rate'], year: d[19]['year_death'], id:d[19]['cve_edo'] }; }) // keep only the last value of each time serie
           .attr("transform", function(d) { return "translate(" + x_scale(d.year)  + "," + y_scale(d.value) + ")"; }) // Put the text at the position of the last point
           .attr("x", 3)
           .attr("y", 5)
           .attr("id", function(d){return `state-label-${(d.id)}`;})
          .text(function(d) { return d.name; })
           .attr ("fill", "none")
           .style("font-size", 15);

 // SVG for map
  const svg_map = d3.select(".main")
          .append("svg")
          .attr("width", 860)
          .attr("height", 800)
          .attr("id", "mapcontainer")
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top}) `);

// This is the line for the national rate
  d3.select("#main_g")
          .selectAll("#state-path-33")
          .attr("stroke", "red")
          .attr("stroke-width", 4)
          .style("stroke-dasharray", ("3, 3"))
          .attr("stroke-opacity", .8);
// And its label
  d3.select("#main_g")
            .selectAll("#state-label-33")
            .attr("fill", "red")

// Add a tooltip for mouseover
var tooltip = d3.select("body").append("main")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

// I was playing with these colors for the choropleth
var green =  ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"]
var blue  = [ '#d2e2f0','#90b8da','#4d8dc3', '#2171b5']
var orange = ['#ffffd4','#fed98e','#fe9929','#cc4c02']
 var color = d3.scaleThreshold()
 		.domain([4.3, 6.9, 7.5, 12]) // These are the thresolds for quantiles. Should be in a function
 		.range(blue);

var stateshapes = svg_map.selectAll(".state")
          .data(geodata.features)
          .enter()
          .append('path')
            .attr("d", geoGenerator)
            .attr("id", function(d) { return Number(d['properties']["CVE_ENT"])}  )
            .attr("state-name", function(d) { return (d['properties']["NOM_ENT"])}  )
            .attr('stroke', 'black')
            .attr('fill', function(d) { 
			           return color(d['properties']["Rate_2017"])})
            .attr("opacity", ".7")
            .on("click", function(d){
              var id = d3.select(this).attr('id')
              var activeClass = "active"; // Source for this part https://jaketrent.com/post/d3-class-operations/
              var alreadyIsActive = d3.select(this).classed(activeClass);

              d3.select(this)
              .classed(activeClass, !alreadyIsActive);
              d3.select(this)
              .attr("fill", d=> alreadyIsActive? color(d['properties']["Rate_2017"]): "grey")
              .attr("stroke", "white")
              .attr("fill-opacity", ".8")

              //console.log(id)
              d3.select("#main_g").selectAll(`#state-path-${id}`)
              .attr("stroke", alreadyIsActive? "#D3D3D3" : color(d['properties']["Rate_2017"]))
              .attr("stroke-width", alreadyIsActive? 1 : 3.5)

              .attr("stroke-opacity", alreadyIsActive? 0: .8);
              d3.select("#main_g")
                .selectAll(`#state-label-${id}`)
                .attr("fill", alreadyIsActive ? "#FF000000" : "black" )
              });
// Show the historic ranking with mouseover
//Source for this part of the code:  http://bl.ocks.org/dougdowson/9832019
stateshapes.on("mouseover", function(d) {
			tooltip.transition()
			.duration(250)
			.style("opacity", .7);
			tooltip.html(
			"<p><strong>" + dict_longnames[d['properties']['NOM_ENT']] + "</strong></p>" +
			"<table><tbody><tr><td class='wide'>Ranking 1998:</td><td>" + d['properties']['Ranking_19'] + "</td></tr>" +
			"<tr><td>Ranking 2017:</td><td>" + d['properties']['Ranking_20'] + "</td></tr>" +
			"<tr><td>Rate 2017:</td><td>" + (d['properties']['Rate_2017']).toFixed(1) + "</td></tr></tbody></table>"
			)
			.style("left", (d3.event.pageX + 15) + "px")
			.style("top", (d3.event.pageY - 28) + "px");

    d3.select(this)
    .attr("stroke", "white")
    .attr("fill-opacity", ".9")}
  )
		.on("mouseout", function(d) {
			tooltip.transition()
			.duration(250)
			.style("opacity", 0);
      d3.select(this)
      .attr("stroke", "black")
      .attr("fill-opacity", ".8")});

//Create legend for choropleth
svg_map.append('rect')
      .attr('class', 'First_quartile')
      .attr('height', 18)
      .attr('width', 18)
      .attr('x', 55)
      .attr('y', 340)
      .attr("stroke", "black");

svg_map.append('rect')
      .attr('class', 'rect Second_quartile')
      .attr('height', 18)
      .attr('width', 18)
      .attr('x', 55)
      .attr('y', 370)
      .attr("stroke", "black");

svg_map.append('rect')
        .attr('class', 'rect Third_quartile')
        .attr('height', 18)
        .attr('width', 18)
        .attr('x', 55)
        .attr('y', 400)
        .attr("stroke", "black");

svg_map.append('rect')
      .attr('class', 'rect Fourth_quartile')
      .attr('height', 18)
      .attr('width', 18)
      .attr('x', 55)
      .attr('y', 430)
      .attr("stroke", "black");

svg_map.append('text')
    .attr('class', 'label')
    .attr('x', 55)
    .attr('y', 300)
    .attr('text-anchor', 'right')
    .attr('font-size', 18)
    .attr('font-family', 'Karla')
    .attr('font-weight', 'bold')
    .text("Rates of Suicide");

svg_map.append('text')
    .attr('class', 'label')
    .attr('x', 55)
    .attr('y', 300)
    .attr('text-anchor', 'right')
    .attr('font-size', 18)
    .attr('font-family', 'Karla')
    .attr('font-weight', 'bold')
    .attr("dy", "1em")
    .text("(State Quartiles)")

svg_map.append('text')
    .attr('class', 'label')
    .attr('x', 80)
    .attr('y', 355)
    .attr('text-anchor', 'right')
    .attr('font-size', 16)
    .attr('font-family', 'Karla')
    .text("< 4.3");

svg_map.append('text')
   .attr('class', 'label')
   .attr('x', 80)
   .attr('y', 385)
   .attr('text-anchor', 'right')
   .attr('font-size', 16)
   .attr('font-family', 'Karla')
   .text("4.3 < X < 6.9");

svg_map.append('text')
  .attr('class', 'label')
  .attr('x', 80)
  .attr('y', 415)
  .attr('text-anchor', 'right')
  .attr('font-size', 16)
  .attr('font-family', 'Karla')
  .text("6.9 < X < 7.5");

svg_map.append('text')
  .attr('class', 'label')
  .attr('x', 80)
  .attr('y', 445)
  .attr('text-anchor', 'right')
  .attr('font-size', 16)
  .attr('font-family', 'Karla')
  .text("> 7.5");

svg_map.append('text')
  .attr('class', 'title')
  .attr('x', 0)
  .attr('y', 0  )
  .attr('text-anchor', 'center')
  .attr('font-size', 28)
  .attr('font-family', 'Karla')
  .text("Geographic Distribution of Suicide Occurrences 2017") ;

svg_chart.append('text')
  .attr('class', 'title')
  .attr('x', 0)
  .attr('y', height -20  )
  .attr('text-anchor', 'center')
  .attr('font-size', 28)
  .attr('font-family', 'Karla')
  .text("Evolution of Suicide Occurrences 1998-2017") ;

svg_map.append('text')
                .attr('class', 'x_axis_label')
                .attr('x', (10))
                .attr('y',  height  )
                .attr('text-anchor', 'right')
                .attr('font-size', 10)
                .attr('font-family', 'Karla')
                .attr('text-anchor', 'middle')
                .text("Source: INEGI, CONAPO") ;
}
