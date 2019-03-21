const states = ['Aguascalientes','Baja California','Baja California Sur','Campeche', 'Chiapas','Chihuahua','Coahuila','Colima',
                'CDMX','Durango','Guanajuato','Guerrero','Hidalgo','Jalisco','México','Michoacán','Morelos',
                'Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa',
                'Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'];

const palette2 = ['#40004b','#762a83','#9970ab','#c2a5cf','#e7d4e8','#d9f0d3','#a6dba0','#5aae61','#1b7837','#00441b',
'#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#67001f','#b2182b','#d6604d','#f4a582','#fddbc7',
'#d1e5f0','#92c5de','#4393c3','#842282','#053061','#bababa','#878787','#4d4d4d','#1a1a1a', '#8e0152','#c51b7d','#de77ae']

const colorMap = states.reduce((acc, row, idx) => {
  acc[row] = palette2[idx];
  return acc;
}, {})
console.log(colorMap)


Promise.all([
  // d3.json('./suicides.json'),
  d3.json('./nationalsuicides.json'),
  d3.json('./mx_geojson2.geojson')
]).then(function (data){
  myVis(data)
})

function myVis([data,geodata]) {
  console.log(data, geodata)
  // basic plot configurations
  const height = 600;
  const width = 600;
  const margin = {top: 150, left: 50, right: 50, bottom: 20};

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.bottom - margin.top;
  const colorRange = ['#F09D51', '#E77971', '#BF678B', '#85618F','#4E587B', '#2F4858', '#BC9B39','#879536',
                      '#528B41', '#007E50', '#006F5F', '#9E724D', '#FFBFBC', '#FF8887', '#C35355', '#BD6D94',
                      '#ED808A','#FF9F77', '#0088E8','#5B84B1', '#E5EFFD', '#D5CABD', '#574142', '#A65BA6',
                    '#A1A551', '#C33C4A', '#A7B31E','#F3AA69', '#007F83','#2F4858', '#00605D', '#427037'];
  const palette=  ["#FF3333" , "#FA422C" ,  "#F55225", "#F0621E", "#EB7217" ,"#E68211",
                                        "#E1910A", "#CA920E", "#AD8F15", "#918C1B" , "#758922", "#588729","#3C8430",
                                         "#2F813F", "#2C7E54", "#2A7B69", "#27787E", "#257593","#2272A8", "#2F7AB9", "#5391C5",
                                         "#76A7D1", "#9ABEDD", "#BED5E9","#E2ECF5", "#FAFAFA", "#E6E6E6", "#D1D1D1", "#BDBDBD", "#A8A8A8","#949494",
                                          "#808080"]




 const state_abb=["AGS","BC","BCS","CAMP","CHIS","CHIH","COAH","COL","CDMX","DUR","GTO","GUE","HGO","JAL","MICH",
                  "MOR","MEX","NAY","NL","OAX","PUE","QUER","QROO","SLP","SIN","SON","TAB","TAM","TLAX","VER","YUC","ZAC"]
var dict_colors={}
 var i = 0
 for (i = 0; i < 32; i++) {
  dict_colors[`${i+1}`] = palette2[i];
}
var dict_names={}
for (i = 0; i < 32; i++) {
 dict_names[`${i+1}`] = state_abb[i];
}
var dict_longnames={}
for (i = 0; i < 32; i++) {
 dict_longnames[`${i+1}`] = states[i];
}
 console.log(dict_colors)
 console.log(dict_names)

 // A color scale: one color for each group


  const projection = d3.geoAlbers()
  const geoGenerator = d3.geoPath(projection);
  console.log(geoGenerator.centroid(geodata))
  projection.fitExtent([[0, 0], [650, 500]], geodata);
  projection.fitSize([750,560],geodata);


  // X SCALE, years
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
  const yAxis = d3.axisRight(y_scale);


  function state_name (data) {return data.state_name}; // apply smoothing to the line

  const svg_chart = d3.select(".main")
        	.append("svg") // why  do we append after we define svg?
            .attr("width", width + margin.left + margin.right +50)
            .attr("height", height + margin.top + margin.bottom )
          .append("g")
          .attr("id", "main_g")
          .attr("transform", `translate(${margin.left}, ${margin.top}) `)

  xAxis.tickValues([1998, 2003, 2008, 2013, 2017]);
  svg_chart.append("g")
      .attr("class", "x axis")
      //.attr("transform", "translate(0," + height + ")")
      .attr("transform", "translate(0, 430)")
      .call(xAxis); // Create an axis component with d3.axisBottom
  xAxis.tickSize(0);
  yAxis.tickSize(5);
  yAxis.ticks(5);
  xAxis.ticks(4);
  // todo` once the chart is back, look at the css style for the ticks, write a css style display none for the
  svg_chart.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(571,0)")
     .call(yAxis);
  svg_chart
     .append('text')
     .attr('class', 'label')
     .attr('x', 300)
     .attr('y', 470)
     .attr('text-anchor', 'right')
     .attr('font-size', 14)
     .attr('font-family', 'Karla')
     .attr('font-weight', 'bold')
     .text("Year");
  svg_chart
  .append('text')
        .attr("class", "label")
        .attr("y",  610)
        .attr("x", -plotHeight/2 - 100)
        .attr('text-anchor', 'right')
        .attr('font-size', 14)
        .attr("transform", "rotate(-90)")
        .attr('font-weight', 'bold')
        .text("Rate per 100K inhabitants")




var line = d3.line()
            .x(function(d) {
              return x_scale(d.year_death);
            }) // set the x values for the line generator
            .y(function(d) { return y_scale(d.rate); }) // set the y values for the line generator
            .curve(d3.curveMonotoneX); // apply smoothing to the line

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
console.log(lines_data ) //d3.select(this).attr('id')


lines_data['Aguascalientes'].abbrev="AGS";lines_data['Baja California'].abbrev="BC";lines_data['Baja California Sur'].abbrev="BCS";
lines_data['Campeche'].abbrev="CAMP";lines_data['Coahuila'].abbrev="COAH";lines_data['Colima'].abbrev="COL";lines_data['Chiapas'].abbrev="CHIS";
lines_data['Chihuahua'].abbrev="CHIH";lines_data['Distrito Federal'].abbrev="CDMX";lines_data['Durango'].abbrev="DUR";lines_data['Guanajuato'].abbrev="GTO";
lines_data['Guerrero'].abbrev="GUER";lines_data['Hidalgo'].abbrev="HGO";lines_data['Jalisco'].abbrev="JAL";lines_data['México'].abbrev="MEX";
lines_data['Michoacán'].abbrev="MICH";lines_data['Morelos'].abbrev="MOR";lines_data['Nayarit'].abbrev="NAY";lines_data['Nuevo León'].abbrev="NL";
lines_data['Oaxaca'].abbrev="OAX";lines_data['Puebla'].abbrev="PUE";lines_data['Querétaro'].abbrev="QUER";lines_data['Quintana Roo'].abbrev="QROO";
lines_data['San Luis Potosí'].abbrev="SLP";lines_data['Sinaloa'].abbrev="SIN";lines_data['Sonora'].abbrev="SON";lines_data['Tabasco'].abbrev="TAB";
lines_data['Tamaulipas'].abbrev="TAMP";lines_data['Tlaxcala'].abbrev="TLAX";lines_data['Veracruz'].abbrev="VER";lines_data['Yucatán'].abbrev="YUC"
lines_data['Zacatecas'].abbrev="ZAC";lines_data['National'].abbrev="NAT";




// for (i = 0; i < 32; i++) {
//  lines_data[i]['abrev'] = state_abb[i];
// }
// console.log(lines_data[0])
var myColor = d3.scaleOrdinal()
  .domain(Array.from({length: 33}, (v, k) => k+1))
  .range(Array.from(palette2));

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


lines.selectAll(".myLabels")
       .data(Object.values(lines_data)) // https://www.d3-graph-gallery.com/graph/connectedscatter_multi.html
       .enter()
         .append('g')
         .append("text")
           .datum(function(d) {return {name: d["abbrev"], value: d[19]['rate'], year: d[19]['year_death'], id:d[19]['cve_edo'] }; }) // keep only the last value of each time serie
           .attr("transform", function(d) { return "translate(" + x_scale(d.year)  + "," + y_scale(d.value) + ")"; }) // Put the text at the position of the last point
           .attr("x", 3) // shift the text a bit more right
           .attr("y", 5) // shift the text a bit more right
           .attr("id", function(d){return `state-label-${(d.id)}`;})
          .text(function(d) { return d.name; })
           .attr ("fill", "none")
           //.attr("fill", function(d){ return myColor(d.id) })
           .style("font-size", 15);


  const svg_map = d3.select(".main")
          .append("svg")
          .attr("width", 860)
          .attr("height", 800)
          .attr("id", "mapcontainer")
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top}) `);

  d3.select("#main_g")
          .selectAll("#state-path-33")
          .attr("stroke", "red")
          .attr("stroke-width", 4)
          .style("stroke-dasharray", ("3, 3"))
          .attr("stroke-opacity", .8);
  d3.select("#main_g")
            .selectAll("#state-label-33")
            .attr("fill", "red")

var tooltip = d3.select("body").append("main")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

// function mouseover(){
//   tooltip.transition()
//     .duration(200)
//     .style("opacity", .9);
// }
//
// function mousemove(d){
//     tooltip.html(d['properties']["CVE_ENT"]  + "<br />"  + d['properties']["CVE_ENT"] + " HELLOWORLD")
//       .style("left", (d3.event.pageX) + "px")
//       .style("top", (d3.event.pageY - 50) + "px");
// }
//
// function mouseout(){
//     tooltip.transition()
//       .duration(500)
//       .style("opacity", 0);
// }
//console.log(svg_map.selectAll(".text").data(geodata.features).append("text"))
console.log(geodata)
// var label = svg_map.selectAll("text")
//                        .data(geodata.features)
//                        .enter()
//                        .append("text")
//                          .attr("class", "label")
//                          .attr("transform", function(d) {
// return "translate(" + geoGenerator.centroid(d)  + ")"; })
//                          .text(function(d) { return  d['properties']["Rate_2017"] } ) // keep only the last value of each time serie
//
//                          .attr("fill", "black")
//                          .attr("text-anchor", "middle")
//                          .attr("opacity", ".4")
//                          .attr("id", function(d){return `label-id-${(d.id)}`;})
                           // .on("mouseover", mouseover)
                           // .on("mousemove", mousemove)
                           // .on("mouseout", mouseout);
 // var rectangulo = svg_map.selectAll("rect")
 //                        .data(geodata.features)
 //                        .enter()
 //                        .append("rect")
 //                          //.attr("transform", function(d) { return "translate(" + geoGenerator.centroid(d) + ")"; })
 //                          .attr("transform", function(d){return `translate (${geoGenerator.centroid(d)[0] -5}, ${geoGenerator.centroid(d)[1]-20})`})
 //                          .attr("width", 70)
 //                          .attr("height", 40)
 //                          .attr("class", "rect")
 //                          .style("fill", "white")
 //                          .attr("opacity", ".9");

var green =  ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"]
var blue  = [ '#d2e2f0','#90b8da','#4d8dc3', '#2171b5']
var orange = ['#ffffd4','#fed98e','#fe9929','#cc4c02']
 var color = d3.scaleThreshold()
 		.domain([4.3, 6.9, 7.5, 12])
 		.range(blue);
var stateshapes = svg_map.selectAll(".state")
          .data(geodata.features)
          .enter()
          .append('path')
            .attr("d", geoGenerator)
            .attr("id", function(d) { return Number(d['properties']["CVE_ENT"])}  )
            .attr("state-name", function(d) { return (d['properties']["NOM_ENT"])}  )
            .attr('stroke', 'black')
            .attr('fill', function(d) { console.log(color(d['properties']["Rate_2017"]));
			           return color(d['properties']["Rate_2017"])})
            .attr("opacity", ".7")
            // .attr("attr", function(geodata) {
            //   //console.log()
            //   let att= ""
            //   if (geodata['properties']['Rate_2017']<=4.3) {
            //     att+= "First_quartile"}
            //   else if (geodata['properties']['Rate_2017']>4.3 && geodata['properties']['Rate_2017']<=6) {
            //     att+= "Second_quartile"}
            //     else if (geodata['properties']['Rate_2017']>6 && geodata['properties']['Rate_2017']<=7.5) {
            //       att+= "Third_quartile"}
            //       else if (geodata['properties']['Rate_2017']>7.5) {att+= "Fourth_quartile"}
            //       return att
            //   }
            // )





            // .on("mouseout", mouseout)
            //.attr("fill-opacity",".8")
            // .on("mouseover", d3.select(this)
            //   .attr("stroke", "black")
            //
            // )
            //
            // .on("mouseout", function(d){
            //   d3.select(this)
            //   .attr("stroke", "black")
            // })
            .on("click", function(d){
              //console.log(this)
              var id = d3.select(this).attr('id') //seleccionar el id del estado seleccionado
              var activeClass = "active"; //https://jaketrent.com/post/d3-class-operations/
              var alreadyIsActive = d3.select(this).classed(activeClass);
              console.log(alreadyIsActive)
              // d3.select(this).
              // attr('fill', dict_colors[d3.select(this).attr('id')]);
              d3.select(this)
              .classed(activeClass, !alreadyIsActive);
              console.log(this);
              d3.select(this)
              .attr("fill", d=> alreadyIsActive? color(d['properties']["Rate_2017"]): "grey")
              .attr("stroke", "white")
              .attr("fill-opacity", ".8")

              //console.log(id)
              d3.select("#main_g").selectAll(`#state-path-${id}`)
              .attr("stroke", alreadyIsActive? "#D3D3D3" : color(d['properties']["Rate_2017"]))
              .attr("stroke-width", alreadyIsActive? 1 : 3.5)

              .attr("stroke-opacity", alreadyIsActive? 0: .8);
              //console.log(d3.select("#main_g").selectAll(`#state-path-${id}`)).style("fill", function(d){ return myColor(d.id) })

              d3.select("#main_g")
                .selectAll(`#state-label-${id}`)
                .attr("fill", alreadyIsActive ? "#FF000000" : "black" )

              });
//Source for this code:  http://bl.ocks.org/dougdowson/9832019
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

console.log(geodata.features[0])


svg_map.append('rect')
.attr('class', 'First_quartile')
.attr('height', 18)
.attr('width', 18)
.attr('x', 55)
.attr('y', 450)
.attr("stroke", "black");

svg_map.append('rect')
.attr('class', 'rect Second_quartile')
.attr('height', 18)
.attr('width', 18)
.attr('x', 55)
.attr('y', 480)
.attr("stroke", "black");

svg_map.append('rect')
.attr('class', 'rect Third_quartile')
.attr('height', 18)
.attr('width', 18)
.attr('x', 55)
.attr('y', 510)
.attr("stroke", "black");

svg_map.append('rect')
.attr('class', 'rect Fourth_quartile')
.attr('height', 18)
.attr('width', 18)
.attr('x', 55)
.attr('y', 540)
.attr("stroke", "black");

svg_map
.append('text')
.attr('class', 'label')
.attr('x', 55)
.attr('y', 420)
.attr('text-anchor', 'right')
.attr('font-size', 18)
.attr('font-family', 'Karla')
.attr('font-weight', 'bold')
.text("Rates of Suicide");

svg_map
.append('text')
.attr('class', 'label')
.attr('x', 55)
.attr('y', 420)
.attr('text-anchor', 'right')
.attr('font-size', 18)
.attr('font-family', 'Karla')
.attr('font-weight', 'bold')
.attr("dy", "1em")
.text("(State Quartiles)")

svg_map
  .append('text')
  .attr('class', 'label')
  .attr('x', 80)
  .attr('y', 465)
  .attr('text-anchor', 'right')
  .attr('font-size', 16)
  .attr('font-family', 'Karla')
  .text("< 4.3");

svg_map
 .append('text')
 .attr('class', 'label')
 .attr('x', 80)
 .attr('y', 495)
 .attr('text-anchor', 'right')
 .attr('font-size', 16)
 .attr('font-family', 'Karla')
 .text("4.3 < X < 6.9");
svg_map
.append('text')
.attr('class', 'label')
.attr('x', 80)
.attr('y', 525)
.attr('text-anchor', 'right')
.attr('font-size', 16)
.attr('font-family', 'Karla')
.text("6.9 < X < 7.5");
svg_map
.append('text')
.attr('class', 'label')
.attr('x', 80)
.attr('y', 555)
.attr('text-anchor', 'right')
.attr('font-size', 16)
.attr('font-family', 'Karla')
.text("> 7.5");

svg_map.append('text')
              .attr('class', 'title')
              .attr('x', 0)
              .attr('y', 5  )
              .attr('text-anchor', 'center')
              .attr('font-size', 28)
              .attr('font-family', 'Karla')
              .text("Geographic Distribution of Suicide Occurences 2017") ;
svg_chart.append('text')
          .attr('class', 'title')
          .attr('x', 0)
          .attr('y', height -50  )
          .attr('text-anchor', 'center')
          .attr('font-size', 28)
          .attr('font-family', 'Karla')
          .text("Evolution of Suicide Occurences 1998-2017") ;
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
              //
