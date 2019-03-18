

Promise.all([
  d3.json('./suicides.json'),
  d3.json('./mx_geojson.geojson')
]).then(function (data){
  myVis(data)
})

function myVis([data,geodata]) {
  console.log(data, geodata)
  // basic plot configurations
  const height = 600;
  const width = 600;
  const margin = {top: 50, left: 50, right: 50, bottom: 50};

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.bottom - margin.top;
  const colorRange = ['#F09D51', '#E77971', '#BF678B', '#85618F','#4E587B', '#2F4858', '#BC9B39','#879536',
                      '#528B41', '#007E50', '#006F5F', '#9E724D', '#FFBFBC', '#FF8887', '#C35355', '#BD6D94',
                      '#ED808A','#FF9F77', '#0088E8','#5B84B1', '#E5EFFD', '#D5CABD', '#574142', '#A65BA6',
                    '#A1A551', '#C33C4A', '#A7B31E','#F3AA69', '#007F83','#2F4858', '#00605D', '#427037'];

const palette2 = ['#40004b','#762a83','#9970ab','#c2a5cf','#e7d4e8','#d9f0d3','#a6dba0','#5aae61','#1b7837','#00441b',
'#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#67001f','#b2182b','#d6604d','#f4a582','#fddbc7',
'#d1e5f0','#92c5de','#4393c3','#2166ac','#053061','#bababa','#878787','#4d4d4d','#1a1a1a', '#8e0152','#c51b7d','#de77ae']
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
  dict_colors[`${i+1}`] = colorRange[i];
}
var dict_names={}
for (i = 0; i < 32; i++) {
 dict_names[`${i+1}`] = state_abb[i];
}
 console.log(dict_colors)
 console.log(dict_names)

 // A color scale: one color for each group


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


  function state_name (data) {return data.state_name}; // apply smoothing to the line

  const svg_chart = d3.select(".main")
        	.append("svg") // why  do we append after we define svg?
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("id", "main_g")
          .attr("transform", `translate(${margin.left}, ${margin.top}) `)

  xAxis.tickValues([1998, 2003, 2008, 2013, 2017]);
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
     .attr("transform", "translate(550,0)")
     .call(yAxis);
  svg_chart
     .append('text')
     .attr('class', 'label')
     .attr('x', 272)
     .attr('y', 530)
     .attr('text-anchor', 'right')
     .attr('font-size', 14)
     .attr('font-family', 'Karla')
     .attr('font-weight', 'bold')
     .text("Year");
  svg_chart
  .append('text')
        .attr("class", "label")
        .attr("y",  577)
        .attr("x", -plotHeight/2 - 50)
        .attr('text-anchor', 'right')
        .attr('font-size', 14)
        .attr("transform", "rotate(-90)")
        .attr('font-weight', 'bold')
        .text("Rate per 100K inhabitants")
  svg_chart.append('text')
        .attr('class', 'x_axis_label')
        .attr('x', (450))
        .attr('y',  height )
        .attr('text-anchor', 'right')
        .attr('font-size', 10)
        .attr('font-family', 'Karla')
        .attr('text-anchor', 'middle')
        .text("Source: INEGI, CONAPO") ;

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

lines_data['Aguascalientes'].abbrev="AGS"
lines_data['Baja California'].abbrev="BC"
lines_data['Baja California Sur'].abbrev="BC"
lines_data['Campeche'].abbrev="CAMP"
lines_data['Coahuila'].abbrev="COAH"
lines_data['Colima'].abbrev="COL"
lines_data['Chiapas'].abbrev="CHIS"
lines_data['Chihuahua'].abbrev="CHIH"
lines_data['Distrito Federal'].abbrev="CDMX"
lines_data['Durango'].abbrev="DUR"
lines_data['Guanajuato'].abbrev="GTO"
lines_data['Guerrero'].abbrev="GUER"
lines_data['Hidalgo'].abbrev="HGO"
lines_data['Jalisco'].abbrev="JAL"
lines_data['México'].abbrev="MEX"
lines_data['Michoacán'].abbrev="MICH"
lines_data['Morelos'].abbrev="MOR"
lines_data['Nayarit'].abbrev="NAY"
lines_data['Nuevo León'].abbrev="NL"
lines_data['Oaxaca'].abbrev="OAX"
lines_data['Puebla'].abbrev="PUE"
lines_data['Querétaro'].abbrev="QUER"
lines_data['Quintana Roo'].abbrev="QROO"
lines_data['San Luis Potosí'].abbrev="SLP"
lines_data['Sinaloa'].abbrev="SIN"
lines_data['Sonora'].abbrev="SON"
lines_data['Tabasco'].abbrev="TAB"
lines_data['Tamaulipas'].abbrev="TAMP"
lines_data['Tlaxcala'].abbrev="TLAX"
lines_data['Veracruz'].abbrev="VER"
lines_data['Yucatán'].abbrev="YUC"
lines_data['Zacatecas'].abbrev="ZAC"



console.log(lines_data['Aguascalientes']['abbrev'])

// for (i = 0; i < 32; i++) {
//  lines_data[i]['abrev'] = state_abb[i];
// }
// console.log(lines_data[0])
var myColor = d3.scaleOrdinal()
  .domain(Array.from({length: 32}, (v, k) => k+1))
  .range(Array.from(palette2));
//console.log(Array.from({length: 32}, (v, k) => k+1))
//console.log(Object.keys(lines_data))

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
        .attr("stroke-opacity", .2)
       .attr("fill", "none")
       .attr("stroke-width", 1);


lines.selectAll(".myLabels")
       .data(Object.values(lines_data))
       .enter()
       //.attr("otracosa", function(d){return `state-label-${Number(d[0]["cve_edo"])}`;})
         .append('g')
         .append("text")
           //.datum(function(d) {return {name: d[0]["state_name"], value: d[19]['rate'], year: d[19]['year_death'] }; }) // keep only the last value of each time serie
           .datum(function(d) {return {name: d["abbrev"], value: d[19]['rate'], year: d[19]['year_death'], id:d[19]['cve_edo'] }; }) // keep only the last value of each time serie
           .attr("transform", function(d) { return "translate(" + x_scale(d.year )  + "," + y_scale(d.value) + ")"; }) // Put the text at the position of the last point
           .attr("x", 3) // shift the text a bit more right
           .attr("y", 5) // shift the text a bit more right
           .attr("id", function(d){return `state-label-${(d.id)}`;})
          .text(function(d) { return d.name; })
           .attr ("fill", "none")
           //.attr("fill", function(d){ return myColor(d.id) })
           .style("font-size", 15);


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
            .attr("id", function(d) { return Number(d['properties']["CVE_ENT"])}  )
            // .attr('class', 'highlight')
            .attr("state-name", function(d) { return (d['properties']["NOM_ENT"])}  )
            .attr('stroke', 'white')
            .attr('fill', "#2171b5")
            .attr("fill-opacity",".4")
            .on("click", function(d){
              //console.log(this)
              var id = d3.select(this).attr('id') //seleccionar el id del estado seleccionado
              var activeClass = "active"; //https://jaketrent.com/post/d3-class-operations/
              var alreadyIsActive = d3.select(this).classed(activeClass);
              // d3.select(this).
              // attr('fill', dict_colors[d3.select(this).attr('id')]);
              d3.select(this)
              .classed(activeClass, !alreadyIsActive);
              console.log(this);
              //console.log()

              console.log(id)
              d3.select("#main_g").selectAll(`#state-path-${id}`)
              .attr("stroke", alreadyIsActive? "#D3D3D3" : myColor([d3.select(this).attr('id')]))
              .attr("stroke-width", alreadyIsActive? 1 : 3.5)
              .attr("stroke-opacity", alreadyIsActive? .2: .8);
              //console.log(d3.select("#main_g").selectAll(`#state-path-${id}`)).style("fill", function(d){ return myColor(d.id) })

              d3.select("#main_g").selectAll(`#state-label-${id}`).attr("fill", alreadyIsActive? "#FF000000" : function(d){ return myColor(d.id) })
              //.attr("fill", function(d){ return myColor(d.id) })


              //console.log(d3.select(this).attr('state-name'))
              //d3.select("#main_g").selectAll(`#state-path-${id}`).attr("stroke", alreadyIsActive? "#D3D3D3" : dict_colors[d3.select(this).attr('id')])//.classed(activeClass);

              //d3.select("#main_g").selectAll("text").attr("stroke", alreadyIsActive? "transparent" : 'red')//.classed(activeClass);

              // this
              // .append('text')
              // .attr('class', 'label')
              // .attr('x', 47)
              // .attr('y', 461)
              // .attr('text-anchor', 'right')
              // .attr('font-size', 13)
              // .attr('font-family', 'Karla')
              // .text("Very Low");
              });

              //


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













    }
