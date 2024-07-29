
let htmlContainer = `  
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct0"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct1"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct2"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct3"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct4"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct5"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct6"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct7"></div>
                      <div class="col-md-3 col-sm-6  d3matrix" id="ct8"></div>
                      `;




let intersectionOptions = ["Gunbarrel Rd & Hamilton Place Blvd","Gunbarrel Rd & McCutcheon Rd","Shallowford Rd & I-75 NB","Shallowford Rd & I-75 SB",
"Shallowford Rd & Lifestyle Way","Shallowford Rd & Napier Rd & Hamilton Place Blvd",
"Shallowford Rd & Shallowford Village Dr & Amin Dr"];
let dateOptions = ["2019-04-01","2019-04-02","2019-04-03","2019-04-04","2019-04-05","2019-04-06","2019-04-07"]; 
let timeOptions = ["EarlyMorning","Morning","fullday","G","Mid-Day","Evening","Night","PG","R","V"]; 


$(document).on('change', '.selection', function() {
$(".d3ChordChart").remove();
let dataUrl = "data/"+$("#intersection").val()+"/"+$("#date").val()+"_"+$("#time").val()+".json";
console.log(dataUrl);
renderChart("#ct1",dataUrl);

});


$(document).on('click', '.compareIntersection', function() {
$(".d3ChordChart").remove();
intersectionOptions.forEach(function(item,index){
let dataUrl = "data/"+item+"/"+$("#date").val()+"_"+$("#time").val()+".json";
renderChart("#ct"+index,dataUrl);
$("#ct"+index).append("<h5 class='d3ChordChart titleStyle'>"+item+"</h5>")
})
});

$(document).on('click', '.compareDate', function() {
$(".d3ChordChart").remove();
dateOptions.forEach(function(item,index){
let dataUrl = "data/"+$("#intersection").val()+"/"+item+"_"+$("#time").val()+".json";
renderChart("#ct"+index,dataUrl);
$("#ct"+index).append("<h5 class='d3ChordChart titleStyle'>"+item+"</h5>")
})
});

$(document).on('click', '.compareTime', function() {
$(".d3ChordChart").remove();
timeOptions.forEach(function(item,index){
let dataUrl = "data/"+$("#intersection").val()+"/"+$("#date").val()+"_"+item+".json";
renderChart("#ct"+index,dataUrl);
$("#ct"+index).append("<h5 class='d3ChordChart titleStyle'>"+item+"</h5>")
})
});



appendOptions('#intersection',intersectionOptions);
appendOptions('#date',dateOptions);
appendOptions('#time',timeOptions);

function appendOptions(selectId,options){
options.forEach(function(item,index){
$(selectId).append(' <option value="'+item+'">'+item+'</option>');
})

}



renderChart("#ct1","matrix.json");


function renderChart(containerId, dataUrL){
var width = 350,
height = 350,
outerRadius = Math.min(width, height) / 2 - 10,
innerRadius = outerRadius - 24;

var arc = d3.svg.arc()
.innerRadius(innerRadius)
.outerRadius(outerRadius);

var layout = d3.layout.chord()
.padding(.05)
.sortSubgroups(d3.descending)
.sortChords(d3.ascending);
// end from https://bl.ocks.org/1wheel/1e86c34932980874eb5f

var path = d3.svg.chord()
.radius(innerRadius);

var svg = d3.select(containerId).append("svg")
.attr("class", "d3ChordChart")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("id", "circle")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("circle")
.attr("r", outerRadius);

d3.csv("directions.csv", function(directions) {
d3.json(dataUrL, function(matrix) {

// Compute the chord layout.
layout.matrix(matrix);

// Add a group per neighborhood.
var group = svg.selectAll(".group")
.data(layout.groups)
.enter().append("g")
.attr("class", "group")
.on("mouseover", mouseover);

// Add a mouseover title for the arc
group.append("title").text(function(d, i) {
return directions[i].name + ": " + Math.round(d.value) + " vehicles";
});

// Add the group arc.
var groupPath = group.append("path")
.attr("id", function(d, i) { return "group" + i; })
.attr("d", arc)
.style("fill", function(d, i) { return directions[i].color; })
.style("opacity", 0.9)
.style("stroke", function(d, i) { return directions[i].color; })
.style("stroke-width", "1px")
.style("stroke-opacity", 1.0);

// Add a text label and adapt locations
var groupText = group.append("text")
.attr("x", 10)
.attr("dy", 17);

// styling for arc
groupText.append("textPath")
.attr("xlink:href", function(d, i) { return "#group" + i; })
.attr("font-weight", "bold")
.attr("font-size", 14)
.text(function(d, i) { return directions[i].name; });

// Remove the labels that don't fit. :(
groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
.remove();


// Add the chords.
var chord = svg.selectAll(".chord")
.data(layout.chords)
.enter().append("path")
.attr("class", "chord")
.style("fill", function(d) { return directions[d.source.index].color; })
.style("opacity", 0.45)
.style("stroke", function(d) { return directions[d.source.index].color; })
// .style("stroke-width", "2px")
.style("stroke-opacity", 1.0)
.attr("d", path);

// Add an elaborate mouseover title for each chord.
chord.append("title").text(function(d) {
return directions[d.source.index].name
+ " → " + directions[d.target.index].name
+ ": " + Math.round(d.source.value)
+ "\n" + directions[d.target.index].name
+ " → " + directions[d.source.index].name
+ ": " + Math.round(d.target.value);
});

function mouseover(d, i) {
chord.classed("fade", function(p) {
return p.source.index != i
&& p.target.index != i;
});
}
});
});
}