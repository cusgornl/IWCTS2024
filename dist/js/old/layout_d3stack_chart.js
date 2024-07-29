
d3_stacked_chart(".chartHolder1","Average Speed");
d3_stacked_chart(".chartHolder2","Total Volume");

function d3_stacked_chart(containerClassId,chartTitle){
//https://bl.ocks.org/veltman/raw/0f7ed47d7839ba0afa8d23414aeb8933/
       
        var margin = { top: 20, right: 20, bottom: 30, left: 30 },
        width =  $(containerClassId).width() - margin.left - margin.right,
        height =  $(containerClassId).height() - margin.top - margin.bottom,
        random = d3.randomNormal(0, 3),

        ////Nashville  Knoxville    Memphis   Chattanooga
        turtles = ["Nashville", "Knoxville", "Memphis", "Chattanooga"],
        colors = ["#007bff", "#28a745", "#dc3545", "#17a2b8"];

        let chartClassId=containerClassId.replace(".","")+"d3stack",
        chartClassIdArea=containerClassId.replace(".","")+"d3stackArea";
        $(containerClassId).empty();
        $(containerClassId).append("<spam>"+chartTitle+"</spam><svg class='"+chartClassId.replace(".","")+"'  width='"+width+"' height='"+height+"'></svg>")

      var svg = d3.select("."+chartClassId).append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

      var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);
        

      var series = svg.selectAll(chartClassIdArea)
      .data(turtles)
      .enter()
      .append("g")
      .attr("class", chartClassIdArea); 

      series.append("path")
      .attr("fill", (d, i) => colors[i]);

      /*series.append("text")
      .attr("dy", 5)
      .text(d => d);*/

    

      var xg = svg.append("g")
      .attr("class", "axis x")
      .attr("transform", "translate(0 " + height + ")");

      var yg = svg.append("g")
      .attr("class", "axis y");

      var stack = d3.stack().keys(turtles);

      var line = d3.line()
      .curve(d3.curveMonotoneX);

      randomize();

      function randomize() {

      var data = [];

      // Random walk
      for (var i = 0; i < 40; i++) {
        data[i] = {};
        turtles.forEach(function(turtle){
          data[i][turtle] = Math.max(0, random() + (i ? data[i - 1][turtle] : 20));
        });
      }

      var stacked = stack(data);

      x.domain([0, data.length - 1]);
      y.domain([0, d3.max(stacked[stacked.length - 1].map(d => d[1]))]);

      series.data(stacked)
        .select("path")
        .attr("d", getPath);

        //below is the label
      series.select("text")
        .classed("hidden", false)
        .datum(getBestLabel)
        .classed("hidden", d => !d)
        .filter(d => d)
        .attr("x", d => d[0])
        .attr("y", d => d[1]);
        

      xg.call(d3.axisBottom(x).tickSizeOuter(0));
      yg.call(d3.axisLeft(y).tickSizeOuter(0));

      setTimeout(randomize, 15000);

      }

      function getPath(area) {
      var top = area.map((f, j) => [x(j), y(f[1])]),
          bottom = area.map((f, j) => [x(j), y(f[0])]).reverse();

      return line(top) + line(bottom).replace("M", "L") + "Z";
      }

      // Could do this in linear time ¯\_(ツ)_/¯
      function getBestLabel(points) {

      var bbox = this.getBBox(),
          numValues = Math.ceil(x.invert(bbox.width + 20)),
          bestRange = -Infinity,
          bestPoint;

      for (var i = 1; i < points.length - numValues - 1; i++) {

        var set = points.slice(i, i + numValues),
            floor = d3.min(set, d => y(d[0])),
            ceiling = d3.max(set, d => y(d[1]));

        if (floor - ceiling > bbox.height + 20 && floor - ceiling > bestRange) {
          bestRange = floor - ceiling;
          bestPoint = [
            x(i + (numValues - 1) / 2),
            (floor + ceiling) / 2
          ];
        }
      }

      return bestPoint;

      }
}


