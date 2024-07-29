


function d3jsRoseBarChart(map,containClassId,eachItem){

        var width = 200,
        height = 200,
        barHeight = height / 2 - 40;

        var formatNumber = d3.format(".2f");
        //d3.format("s")
        //d3.format(".2f")

        var color = d3.scaleOrdinal()
        .range(eachItem["tabColor"][2]);
        
        //.range(["#ccb3ff","#FAD64B"]);
        let textColor = eachItem["tabColor"][1];

        var data = [
          {
            "name": "Speed",
            "value": eachItem["averageSpeed"][1]/eachItem["averageSpeed"][0],
           
          },
          {
            "name": "Volume",
            "value": eachItem["totalVolume"][1]/eachItem["totalVolume"][0],
           
          },
          {
            "name": "Energy",
            "value": eachItem["totalEnergyComsumption"][1]/eachItem["totalEnergyComsumption"][0],
            
          }
        ];


        let long = eachItem["coords"][0],
        lat = eachItem["coords"][1];
        let svgCoord = svgProjection(map,long,lat);

        let svg = d3.select(containClassId).append("g")
        .attr("width", width)
        .attr("height", height)
        .attr('class','d3mapping')
        //.append("g")
        .attr("transform", "translate(" + svgCoord[0] + "," + svgCoord[1] + ")");

      

        data.sort(function(a,b) { return b.value - a.value; });

        var extent = [0, d3.max(data, d=>d.value)];
        var barScale = d3.scaleLinear()
        .domain(extent)
        .range([0, barHeight]);

        var keys = data.map(function(d,i) { return d.name; });
        var numBars = keys.length;
        //console.log(data)
        
        // X scale
        var x = d3.scaleLinear()
        .domain(extent)
        .range([0, -barHeight]);

        // X axis
        var xAxis = d3.axisBottom(barScale)
        .ticks(3).tickFormat(formatNumber);
        /*
        var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(3)
        .tickFormat(formatNumber);
        */
       console.log()

        // Inner circles
        var circles = svg.selectAll("circle")
        .data(x.ticks(5))
        .enter().append("circle")
        .attr("r", function(d) {return barScale(d);})
        .style("fill", "none")
        //.style("stroke", "black")
        //.style("stroke-dasharray", "2,2")
        .style("stroke-width",".5px");
        
        // Create arcs
        var arc = d3.arc()
        .startAngle(function(d,i) { 
          var a = (i * 2 * Math.PI) / numBars;
          var b = ((i + 1) * 2 * Math.PI) / numBars;
          var d = (b-a) / 4;
          var x = a+d;
          var y = b-d;
          
          return x;//(i * 2 * Math.PI) / numBars; 
        })
        .endAngle(function(d,i) { 
          var a = (i * 2 * Math.PI) / numBars;
          var b = ((i + 1) * 2 * Math.PI) / numBars;
          var d = (b-a) / 4;
          var x = a+d;
          var y = b-d;
          return y;//((i + 1) * 2 * Math.PI) / numBars; 
        })
        .innerRadius(0);
        
        // Render colored arcs
        var segments = svg.selectAll("path")
        .data(data)
        .enter().append("path")
        .each(function(d) { d.outerRadius = 0; })
        .style("fill", function (d) { return color(d.name); })
        .attr("d", arc);
        
        // Animate segments (this one doesn't work)    
        segments.transition()
        .ease(d3.easeElastic)  //this sytax is for d3v4 only
        .duration(1000).delay(function(d,i) {return (25-i)*50;})
        .attrTween("d", function(d,index) {
          var i = d3.interpolate(d.outerRadius, barScale(+d.value));       
          let res = function(t) { d.outerRadius = i(t); return arc(d,index); }
          return res;
        });

        
        // Outer circle
        svg.append("circle")
        .attr("r", barHeight)
        .classed("outer", true)
        .style("fill", "none")
        //.style("stroke", "black")
        .style("stroke-width",".5px");
        
        // Apply x axis
        svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

        // Labels
        var labelRadius = barHeight * 1.025;

        var labels = svg.append("g")
          .classed("labels", true);

        labels.append("def")
          .append("path")
          .attr("id", "label-path")
          .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

        labels.selectAll("text")
          .data(keys)
          .enter().append("text")
          .style("text-anchor", "middle")
          .style("font-weight","bold")
          .style("font-size","15px")
          .style("fill", function(d, i) { 
               return "black";})
          .append("textPath")
          .attr("xlink:href", "#label-path")
          .attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
          .text(function(d) {return d.toUpperCase(); });

}

function d3jsRoseBarChart2(map,containClassId,eachItem){ 
  console.log("callsed");

  var data = [
    {
      "name": "Speed",
      "value": eachItem["averageSpeed"][1]/eachItem["averageSpeed"][0],
     
    },
    {
      "name": "Volume",
      "value": eachItem["totalVolume"][1]/eachItem["totalVolume"][0],
     
    },
    {
      "name": "Energy",
      "value": eachItem["totalEnergyComsumption"][1]/eachItem["totalEnergyComsumption"][0],      
    }
  ];
  var width = 150,
  height = 150;

  let long = eachItem["coords"][0],
  lat = eachItem["coords"][1];
  let svgCoord = svgProjection(map,long,lat);

  let svg_g = d3.select(containClassId).append("g")
  .attr("width", width)
  .attr("height", height)
  .attr('class','d3mapping')
  .attr("transform", "translate(" + svgCoord[0] + "," + svgCoord[1] + ")");

  let barHeight =100,
   formatNumber = d3.format(".2f");
   var color = d3.scaleOrdinal()
   .range(eachItem["tabColor"][2]);
  //let data = eachDataItem.properties.speed;

   //data.sort(function(a,b) { return b.value - a.value; });
   var extent = d3.extent(data, function(d) { return d.value; });
   var barScale = d3.scaleLinear()
       .domain(extent)
       .range([0, barHeight]);
   var keys = data.map(function(d,i) { return d.name; });
   var numBars = keys.length;
   var x = d3.scaleLinear()
       .domain(extent)
       .range([0, -barHeight]);
  /* var xAxis = d3.svg.axis()
       .scale(x).orient("left")
       .ticks(5)
       .tickFormat(formatNumber);     */
   var xAxis = d3.axisLeft(x)
      .ticks(5).tickFormat(formatNumber);
       

   var arc = d3.arc()
       .startAngle(function(d,i) { return (i * 2 * Math.PI) / numBars; })
       .endAngle(function(d,i) { return ((i + 1) * 2 * Math.PI) / numBars; })
       .innerRadius(0);  
   var segments = svg_g.selectAll("path")
           .data(data)
         .enter().append("path")
           .each(function(d) { d.outerRadius = 0; })
           /*.style("fill", function (d) { 
              return d.value > 100 ? "#00ffff" : 
              d.value > 90 ? "#00ff51" : 
              d.value > 80 ? "#a2ff00" : 
              d.value > 70 ? "#eeff00" :
              d.value > 60 ? "#ff6200" : "#ff6200";
               })*/
               .style("fill", function (d) { return color(d.name); })
           .attr("d", arc);
     var circles = svg_g.selectAll("circle")
           .data(x.ticks(3))
         .enter().append("circle")
           .attr("r", function(d) {return barScale(d);})
           .style("fill", "none")
           .style("stroke", "black")
           .style("stroke-dasharray", "2,2")
           .style("stroke-width","1.5px");
   segments.transition().ease(d3.easeElastic).duration(5000).delay(function(d,i) {return (25-i)*100;})
           .attrTween("d", function(d,index) {
             var i = d3.interpolate(d.outerRadius, barScale(+d.value));
             return function(t) { d.outerRadius = i(t); return arc(d,index); };
           });
   svg_g.append("circle")
       .attr("r", barHeight)
       .classed("outer", true)
       .style("fill", "none")
       .style("stroke", "black")
       .style("stroke-width","1.5px");
   var lines = svg_g.selectAll("line")
       .data(keys)
     .enter().append("line")
       .attr("y2", -barHeight - 20)
       .style("stroke", "black")
       .style("stroke-width",".5px")
       .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });
       svg_g.append("g")
     .attr("class", "x axis")
     .call(xAxis);
   // Labels
   var labelRadius = barHeight * 1.025;
   var labels = svg_g.append("g")
       .classed("labels", true);
   labels.append("def")
         .append("path")
         .attr("id", "label-path")
         .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");
   labels.selectAll("text")
         .data(keys)
       .enter().append("text")
         .style("text-anchor", "middle")
         .style("font-weight","bold")
         .style("font-size", "12px")
         .style("fill", function(d, i) {return "black";})  //text label
         .append("textPath")
         .attr("xlink:href", "#label-path")
         .attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
         .text(function(d) {return d.toUpperCase(); });
}


function svgProjection(map,x,y){
  console.log(map);
  let bound_array = map.getView().calculateExtent(map.getSize());                
  let topLeft = ol.proj.toLonLat([bound_array[0],bound_array[3]]),
  bottomRight = ol.proj.toLonLat([bound_array[2],bound_array[1]]);
  let dxMap= Math.abs(topLeft[0]-bottomRight[0])/$("#map").width(); 
  let dyMap= Math.abs(topLeft[1]-bottomRight[1])/$("#map").height();
  let pixleX= (x-topLeft[0])/dxMap;
  let pixleY= -(y-topLeft[1])/dyMap;

  return [pixleX,pixleY];

}