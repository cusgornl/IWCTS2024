
var div_id="#dtw";

let fullwidth = $(window).width();

var margin = {top: 50, right: 20, bottom: 60, left: 90},
    width =  fullwidth - margin.left - margin.right,
    height = "300" - margin.top - margin.bottom;

	//console.log(width+" "+height);
	
var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
	.ticks(d3.time.hours,24)
	//makes the xAxis ticks a little longer than the xMinorAxis ticks
    .tickSize(10)
    .orient("bottom");

var xMinorAxis = d3.svg.axis()
    .scale(x)
	.ticks(d3.time.hours,12)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var div = d3.select(div_id).append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

var svg = d3.select(div_id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//The format in the CSV, which d3 will read
var parseDate = d3.time.format("%Y-%m-%d %X");

//format for tooltip
//https://github.com/mbostock/d3/wiki/Time-Formatting
//var formatTime = d3.time.format("%e %b");
var formatTime = d3.time.format("%e %b %-I:%M %p");
var formatCount = d3.format(",");

// function for the y grid lines
function make_y_axis() {
  return d3.svg.axis()
      .scale(y)
      .orient("left")
      //.ticks(5)
}

//reading in CSV which contains data
d3.csv("data/test_data2.csv", function(error, data) {
 


//taken from http://bl.ocks.org/mbostock/3887118
//and http://www.d3noob.org/2013/01/change-line-chart-into-scatter-plot.html
//creating a group(g) and will append a circle and 2 lines inside each group


draw_series({"data":data,"x":"date_time2","y":"test2"}); 
draw_series({"data":data,"x":"date_time","y":"total_km","linecolor":"red"}); 

draw_dtw({"data":data,"svg":svg,"series":[["date_time","total_km"],["date_time2","test2"]]}); 


appending_axis(); 
$(".domain").remove();

});

function draw_series(options){	
	let data = options["data"];
	let line_color = options["linecolor"] || "steelblue";

	 data.forEach(function(d) {
		//console.log(d.date_time)
		d[options["x"]+"_d"] = parseDate.parse(d[options["x"]]);
		//console.log(d[options["x"]+"_d"]+" ---"+d[options["x"]]);
		d[options["y"]] = +d[options["y"]];
		//console.log(d[options["y"]]);
	  });
	
	
	
	var line = d3.svg.line()
		.x(function(d) {     return x(d[options["x"]+"_d"]); })
		.y(function(d) {     return y(d[options["y"]]); });
	
	  
	  //using imported data to define extent of x and y domains
	  x.domain(d3.extent(data, function(d) { return  d[options["x"]+"_d"]; }));
	  y.domain(d3.extent(data, function(d) { return d[options["y"]]; }));
	// Draw the y Grid lines
		/*svg.append("g")            
			.attr("class", "grid")
			.call(make_y_axis()
				.tickSize(-width, 0, 0)
				.tickFormat("")
			)  */
	svg.append("path")
		  .datum(data)
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke", line_color)
          .style("fill", "none");
		  
	

	var g = svg.selectAll()
			.data(data).enter().append("g");

	   //The markers on the line
		 g.append("circle")
			 //circle radius is increased
			.attr("r", 4.5)
			.attr("cx", function(d) { return x( d[options["x"]+"_d"]); })
			.attr("cy", function(d) { return y(d[options["y"]]); });
	   
	  console.log("test");
	  //The horizontal dashed line that appears when a circle marker is moused over
		 g.append("line")
			.attr("class", "x")
			//.attr("id", "dashedLine")
			.style("stroke", "steelblue")
			.style("stroke-dasharray", "3,3")
			.style("opacity", 0)
			.attr("x1", function(d) { return x( d[options["x"]+"_d"]); })
			.attr("y1", function(d) { return y(d[options["y"]]); })
				//d3.min gets the min date from the date x-axis scale				
			.attr("x2", function(d) { return x(d3.min(x))|| x(d[options["x"]+"_d"])})  //return x(d3.min(x)); })
			.attr("y2", function(d) { return y(d[options["y"]]); });
		console.log("test2");
	  //The vertical dashed line that appears when a circle marker is moused over
		g.append("line")
			.attr("class", "y")
			//.attr("id", "dashedLine")
			.style("stroke", "steelblue")
			.style("stroke-dasharray", "3,3")
			.style("opacity", 0)
			.attr("x1", function(d) { return x( d[options["x"]+"_d"]); })
			.attr("y1", function(d) { return y(d[options["y"]]); })
				.attr("x2", function(d) {return x( d[options["x"]+"_d"]); })
			.attr("y2", height);
		
	   //circles are selected again to add the mouseover functions
		 g.selectAll("circle")
				.on("mouseover", function(d) {		
				div.transition()		
				   .duration(200)		
				   .style("opacity", .9);	
				div.html(formatCount(d[options["y"]]) + " feet" + "<br/>" + formatTime( d[options["x"]+"_d"]))	
				   .style("left", (d3.event.pageX - 20) + "px")
					 .style("top", (d3.event.pageY + 6) + "px");
				  //selects the horizontal dashed line in the group
					  d3.select(this.nextElementSibling).transition()		
					.duration(200)		
					.style("opacity", .9);
				//selects the vertical dashed line in the group
					  d3.select(this.nextElementSibling.nextElementSibling).transition()		
					.duration(200)		
					.style("opacity", .9);	
				})	
					
		  .on("mouseout", function(d) {		
				div.transition()		
				   .duration(500)		
				   .style("opacity", 0);

					  d3.select(this.nextElementSibling).transition()		
					.duration(500)		
					.style("opacity", 0);

					  d3.select(this.nextElementSibling.nextElementSibling).transition()		
					.duration(500)		
					.style("opacity", 0);	
			});
}

function draw_dtw(options){
	let data = options["data"],svg=options["svg"];
	let series = options["series"];	
	let result={"y_values":{},"fields":[],"x_values":{}};
	
	series.forEach(function(s) { //going through each series combination and create time-hasing for each value
		let sx=s[0], sy=s[1];
		result["fields"].push(sy);
				
		data.forEach(function(d) {
			if(!result["y_values"].hasOwnProperty(sy)){
				result["y_values"][sy]=[];	
				result["y_values"][sy].push(d[sy]);			
			}else{
				result["y_values"][sy].push(d[sy]);
			}
			if(!result["x_values"].hasOwnProperty(sx)){
				result["x_values"][sx]=[];	
				result["x_values"][sx].push(parseDate.parse(d[sx]));			
			}else{
				result["x_values"][sx].push(parseDate.parse(d[sx]));
			} 
		});
	});

    
	var distFunc = function( a, b ) {
		return Math.abs( a - b );
	};
	
	var dtw = new DynamicTimeWarping(result["y_values"][result["fields"][0]], result["y_values"][result["fields"][1]], distFunc);
	var dist = dtw.getPath();

    
	
	dist.forEach(function(each_d) {
		 //[ 0, 0 ], [ 1, 1 ], [ 1, 2 ], [ 1, 3 ], [ 2, 4 ], [ 3, 4 ], [ 4, 4 ] ]
		let node_series_element1=each_d[0]; //
		let node_series_element2=each_d[1];
		
		let x1=data[node_series_element1][series[0][0]],
		y1=data[node_series_element1][series[0][1]],
		x2=data[node_series_element2][series[1][0]],
		y2=data[node_series_element2][series[1][1]];
		
		x.domain(d3.extent(result["x_values"][series[0][0]], function(d) { return d; }));
		
		x11=x(parseDate.parse(x1));
		x.domain(d3.extent(result["x_values"][series[1][0]], function(d) { return d; }));
		x22=x(parseDate.parse(x2));
		y.domain(d3.extent(result["y_values"][series[0][1]], function(d) { return d; }));
		y11=y(y1);	
		y.domain(d3.extent(result["y_values"][series[1][1]], function(d) { return d; }));
		y22=y(y2);
		
		var temp_data=[[x11,y11],[x22,y22]];
	
        
				
		/*temp_data.forEach(function(d) { 			
			d[0] = parseDate.parse(d[0]);			
		});		*/		
		//console.log(temp_data);
		var line2 = d3.svg.line()
		.x(function(d) {  return (d[0]); })
		.y(function(d) {   return (d[1]); });
				
		//x.domain(d3.extent(data, function(d) { return  parseDate.parse(d["date_time"]); }));
		//y.domain(d3.extent(data, function(d) { return d["test2"]; }));
				
		svg.append("path")
		  .datum(temp_data)
		  .attr("class", "ll")
		  .attr("d", line2)
		  .style("stroke", "black")
			.style("stroke-dasharray", "3,3")
			.style("opacity", 1);
			
			
		//http://bl.ocks.org/d3noob/7030f35b72de721622b8
	});
 
	
	/*
		 
	//using imported data to define extent of x and y domains
	x.domain(d3.extent(data, function(d) { return  d[options["x"]+"_d"]; }));
	y.domain(d3.extent(data, function(d) { return d[options["y"]]; }));	
	svg.append("path")
		  .datum(data)
		  .attr("class", "line")
		  .attr("d", line)
		  .style("stroke", line_color);*/
	
}
	
	
	
	
function unify_time(options){	
	let data = options["data"];	
	let series = options["series"];	
	console.log(data);
	var result={"x_time":{},"y_values":{},"combine_time_series":{}};
	
	series.forEach(function(s) { //going through each series combination and create time-hasing for each value
		let sx=s[0], sy=s[1];
		data.forEach(function(d) {
			if(!result["x_time"].hasOwnProperty(sx)){
				result["x_time"][sx]=[d[sx]];				
			}else{
				result["x_time"][sx].push(d[sx]);
			}
			if(!result["y_values"].hasOwnProperty(sy)){
				result["y_values"][sy]={};	
				result["y_values"][sy][d[sx]]=d[sy];				
			}else{
				result["y_values"][sy][d[sx]]=d[sy];
			}
			if(!result["x_time"].hasOwnProperty("time_combine")){
				result["x_time"]["time_combine"]=[d[sx]];				
			}else{
				if(result["x_time"]["time_combine"].indexOf(d[sx])==-1){
					result["x_time"]["time_combine"].push(d[sx]);
				}				
			}			
		});
	});
	result["x_time"]["time_combine"].sort(function(a,b){
	  return parseDate.parse(a) - parseDate.parse(b);	  
	});
	
	series.forEach(function(s) {
		let sy=s[1];
		if(!result["combine_time_series"].hasOwnProperty(sy)){
				result["combine_time_series"][sy]=[];				
			}else{
				
			}	
		current_solid_index=-1;
		result["x_time"]["time_combine"].forEach(function(t){ 
			let t_index=result["x_time"]["time_combine"].indexOf(t), current_index=(result["combine_time_series"][sy].length-1);			
			if(result["y_values"][sy].hasOwnProperty(t)){
				result["combine_time_series"][sy].push({"time_ax":t,"value":result["y_values"][sy][t]});
				current_solid_index=t_index;
			}else{								 
				if(current_solid_index==-1 || current_solid_index==(result["y_values"][sy].length-1)){ //first element in the array
					result["combine_time_series"][sy].push({"time_ax":t,"value":0});
				}else{
					result["combine_time_series"][sy].push({"time_ax":t,"value":"tbd"});
				}				
			}
		});	
	});	
	series.forEach(function(s2) {
		let sy=s2[1];
		result["combine_time_series"][sy].forEach(function(rval){
			current_index=result["combine_time_series"][sy].indexOf(rval);
			if(rval["value"]=="tbd"){
				let current_time=rval["time_ax"];
				let previous_soild_val=result["combine_time_series"][sy][current_index-1];
				let temp_index= current_index+1;				
				
				if(temp_index<result["combine_time_series"][sy].length-1){
					while(result["combine_time_series"][sy][temp_index]["value"]=="tbd"){
					temp_index++;
					}
					let next_soild_val=result["combine_time_series"][sy][temp_index];
					
					console.log(current_time+" "+previous_soild_val["time_ax"]+" "+next_soild_val["time_ax"]);
					console.log((current_time-previous_soild_val["time_ax"])+" "+(next_soild_val["time_ax"]-previous_soild_val["time_ax"])+" "+(next_soild_val["value"]-previous_soild_val["value"]));
					rval["value"]= next_soild_val["value"]-((parseDate.parse(current_time)-parseDate.parse(previous_soild_val["time_ax"]))/(parseDate.parse(next_soild_val["time_ax"])-parseDate.parse(previous_soild_val["time_ax"])))*(next_soild_val["value"]-previous_soild_val["value"]);					
				}else{
					rval["value"]=0;
				}
				
				}			
		
		});		
	});
	console.log(result);
	return result["combine_time_series"];
	
	
}

		
		
function appending_axis(){
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	    .selectAll(".tick text")
      .call(wrap, 35);

svg.append("g")
    .attr("class","xMinorAxis")
    .attr("transform", "translate(0," + height + ")")
    .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
    .call(xMinorAxis)
    .selectAll("text").remove();

//http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html
svg.append("text")      // text label for the x-axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom)
        .style("text-anchor", "middle")
        .text("Date");

svg.append("text")      // text label for the y-axis
        .attr("y",30 - margin.left)
        .attr("x",50 - (height / 2))
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .style("font-size", "16px")
        .text("stage (feet)");

//http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
svg.append("text")      // text label for chart Title
        .attr("x", width / 2 )
        .attr("y", 0 - (margin.top/2))
        .style("text-anchor", "middle")
		.style("font-size", "16px") 
        .style("text-decoration", "underline") 
        .text("Dynamic Time Warping");


svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    //text label for the y-axis inside chart
    /*
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", "16px") 
      .style("background-color","red")
      .text("road length (km)");
    */
}


//http://bl.ocks.org/mbostock/7555321
//This code wraps label text if it has too much text
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

