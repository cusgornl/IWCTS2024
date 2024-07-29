
let path = "./data/"+ $("#fileData").val();  


$(document).on('click', '#launch', function() {  
    /*d3.csv(path, function(data) {
        console.log("CSV",data);
        //initCluster(data,map);
    });  */

    d3.json("data/RMincident.json", function(data) {
      
      data = incidentJSONParser(data)
      initCluster(data,map);
      console.log("JSON",data);
    });  


});

function incidentJSONParser(data){
      let resultData = [];
      data["features"].forEach(function(row,index){
        //console.log(row)
        resultData.push({
            "long":row["geometry"]["coordinates"][0],
            "lat":row["geometry"]["coordinates"][1],
            "Response_Date": row["properties"]["news_date"],
            "news_date": row["properties"]["news_date"],
            "content": row["properties"]["content"],
            "title": row["properties"]["title"]           
        })
      });
      return  resultData;
}





          $(document).on('change', '#fileData', function() {       
              let path = "./data/"+ $("#fileData").val();  
              d3.csv(path, function(data) {
                  $(".reglcav").remove();
                  //console.log(data)
                  
                  initCluster(data,map);
              });   
          })

        

function initCluster(dataRaw,map){
    var canvas = '<canvas id="reglcav" class="reglcav ol-overlay-container ol-selectable sumoVis" width="'+$("#map").width()+'" height="'+$("#map").height()+'" style="width: 100%; height: 100%; position: absolute; top:0px; left:0px;"></canvas>';
    $( ".ol-overlaycontainer" ).prepend(canvas);

    var svg_html = '<svg id="d3svg2" class="ol-overlay-container ol-selectable d3jsRDS" width="'+$("#map").width()+'" height="'+$("#map").height()+'" style="width: 100%; height: 100%; position: absolute; top:0px; left:0px;"></svg>';
    $(".ol-overlaycontainer").append(svg_html); //here we append the d3svg in openlayer continer

    var svg_html = '<svg id="d3svg" class="ol-overlay-container ol-selectable d3jsRDS" width="'+$("#map").width()+'" height="'+$("#map").height()+'" style="width: 100%; height: 100%; position: absolute; top:0px; left:0px;"></svg>';
    $(".ol-overlaycontainer").append(svg_html); //here we append the d3svg in openlayer continer


    var dict = createDict(dataRaw);
    // Canvas and SVG:
    var canvas = d3.select("#reglcav");
    var svg = d3.select("#d3svg");
    var svg2 = d3.select("#d3svg2");
    var ctx = canvas.node().getContext("2d");
    //var svg = d3.select("svg");
    // Basic parameters:
    var width = +canvas.attr("width");
    var height = +canvas.attr("height");
    var tau = 2 * Math.PI;
    var baseScale = 960/tau;
    var center = ol.proj.toLonLat(map.getView().getCenter()) ; // [-75.5, 38];   
    
    // Tiles Projection Setup:
    var tileProjection = d3.geoMercator()
      .scale(1/tau)
      .translate([0,0]);
      
      
    var tileCenter = tileProjection(center);  
      
    // Geographic Projection Setup:
    var geoProjection = d3.geoMercator()
      .scale(baseScale)
      .center(tileProjection.invert([0,0]))
      .translate([0,0]);
    
    
    
    //d3.csv("data/jul_sep2019f.csv", function(data) {
    //d3.csv("data/jul_sep2019f.csv").then(function(data) {  
      // Set up nodes:
      data=resetNodes(dataRaw,map); // initialize
      
        
      // Set up clusterer
      let currZoom = map.getView().getZoom();
      let clusterTickCounter=0
      var cluster = d3.cluster()
        .nodes(data)         
        .on("tick", ticked);
        //console.log(cluster);
        /*setTimeout(function(){ 
            drawCluster(data,svg);
         }, 3000);*/
        
        
        
        map.getView().on('change:resolution', () => {
            //pannedZoom(data,map,currZoom);  
            $("#reglcav").hide();   
            $(".d3Marker").remove();  
            //console.log(map.getView().getZoom());
            
        });
    
        map.getView().on('change:center', () => {
            //pannedZoom(data,map,currZoom);
            //zoomed(map);
            $("#reglcav").hide();
            $(".d3Marker").remove(); 
                
        });  
       
        map.on('moveend', () => {  
          $(".d3Marker").remove(); 
            zoomed(map,currZoom,dataRaw); 
            //pannedZoom(data,map,currZoom)

            
            setTimeout(function(){ $("#reglcav").show();   }, 100);
            //pannedZoom(data,map,currZoom);           
        });
    
        function pannedZoom(data,map,currZoom){
            if(currZoom!=map.getView().getZoom() )
           {
            currZoom = map.getView().getZoom();
            zoomed(map,currZoom,dataRaw) ;
           }
           else{
            panned(dataRaw,map)
           }
        }
    
        
      // Call the zoom:
      /*
      canvas.call(zoom)
        .call(zoom.transform, d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(1 << 15)
        .translate(-tileCenter[0], -tileCenter[1]));*/
    
        
      //
      // Zoom Functionality:
      //
      function zoomed(map,currZoom,dataRaw) {
        // stop cluster:
        cluster.stop();
        console.log('zoomed2');
        let data = resetNodes(dataRaw,map);
        //console.log(data);
          cluster.nodes(data)
            .alpha(1)
    
       cluster.restart();	  
      }
    
      function panned(data,map) {
        //console.log(data);
        console.log('panned');
        let changeData = resetNodes(data,map);
        //console.log(changeData);
        changeData.forEach(function(node) {    
         
            //drawCircle(node);
          })    
      }
    
      // 
      // Tick functionality
      //
      function ticked(x,y) {
        //clear();		
        // Update cluster nodes:
        
        clusterTickCounter+=1;
        // draw still active nodes: draw on canvas
        
       /* data.filter(function(d) { return d.r != 0; })
          .forEach(function(d){
            //drawClusterSingle([d],svg);
          });
         */
         if(clusterTickCounter%10==0){
          this.nodes(data.filter(function(d) { return d.r != 0; }))
          //console.log(data.length);
          drawCluster(data,svg,dict,map,svg2);
         }
          
          
          //attribute(); // tile attribution
      }  
    //})  //end of csv
        
    function resetNodes(nodes,map){
        //d3svg
        let result=[]

        nodes.forEach(function(node,index) {       
            var p = geoProjection([+node.long,+node.lat]);
            let bound_array = map.getView().calculateExtent(map.getSize());                
            let topLeft = ol.proj.toLonLat([bound_array[0],bound_array[3]]),
            bottomRight = ol.proj.toLonLat([bound_array[2],bound_array[1]]);
    
            let dx= Math.abs(topLeft[0]-bottomRight[0])/$("#map").width(); 
            let dy= Math.abs(topLeft[1]-bottomRight[1])/$("#map").height();
            let pixleX= (node.long-topLeft[0])/dx;
            let pixleY= -(node.lat-topLeft[1])/dy;
    
            node.x = pixleX;
            node.y = pixleY;
            node.r = 2;
            node.a = Math.PI * node.r * node.r;	
            node.collided = false;
            node.count = 1;    
            if(pixleX>0 && pixleX < $("#map").width() && pixleY>0 && pixleY<$("#map").height()){
              result.push(node)
            }
            
        })

        
        
        
        return result;
    }
    
    
    
    function drawCircle(d) {   
      
      if(d.r>50) {
        //console.log(d);  
      }
        //ctx.clearRect(0, 0, $("reglcav").width, $("reglcav").height);
        ctx.fillStyle = d.collided ? ( d.r > 20 ? "#FF5733" : "#f79340"  ) : "#f5e764";
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
        if(d.r > 20){
            ctx.globalAlpha = 0.6;
        } else{
            ctx.globalAlpha = 0.8;
        }       
        ctx.fill(); 
        
        if(d.r > 10) drawText(d);
    }

    function zoomLevelDisplay(zoom){
        return  zoom>17 ? [0,5,20] :
                zoom>16 ? [2,5,15] :
                zoom>15 ? [3,3,13] :
                zoom>14 ? [4,1.5,8] :
               zoom>13 ? [6,1.5,8] :
              zoom>12 ? [10,1,4] :
               zoom>10 ? [20,0.7,2] : [20,0.7,2]

    }

    //d3js function for draw
    function drawCluster(data,svg,dict,map,svg2) {

            let zoomLevel = map.getView().getZoom();
            let rLimit = zoomLevelDisplay(zoomLevel)[0];
            let rScale = zoomLevelDisplay(zoomLevel)[1];
            let rScalePie = zoomLevelDisplay(zoomLevel)[2];
            $(".d3Marker").remove(); 
            data.forEach(function(d,i){
                  let result = getChildrenInfo(d["children"],dict);
                  
                  if(d.r<rLimit){
                    drawCircle(d,svg2,rScale);          
                  }else{
                    
                    pieRing (result,d,svg,rScalePie);
                    numberText(d,svg);
                  }
            });

            function drawCircle(d,svg,rScale){

              let colorFunction = {
                "ACC4-MVC Entrapment":"#ff5500",
                "ACC1-MVC Injuries":"#eda24c",
                "ACC2-MVC No Injuries":"#c6d986",
                "ACC3-MVC Unknown Injuries":"#b2b2b2"          
              };

                  
                  let circles = svg    
                    .append("circle")
                      .attr("class","d3Marker")
                //.style("stroke", "gray")
                .style("fill", function(){
                  //console.log(d);
                  if(d.count>1){
                    return d.collided ? ( d.r > 20 ? "#FF5733" : "#ffff66"  ) : "#cc9900";
                  }else{                
                    //return "#805e00";
                    return colorFunction[d["Problem"]];
                  }
                  
                })
                .style("stroke", function(){
                  //console.log(d);
                  return "#805e00";
                })
                .attr("r", function(){
                  //console.log(d);
                  if(d.count>1){
                    
                    return d.r*rScale;
                  }else{
                    
                    return 1*rScale*3;
                  }
                 

                })
                .attr("cx", function(){ 
                    return d.x
                  })
                .attr("cy", function(){        
                  return d.y}
                  )
                  .on("mouseover", function(){
                        //console.log(this);
                        d3.select(this)
                        .style("opacity", 0.1); 
                        let result = getChildrenInfo(d["children"],dict);  
                        d3DrawPolygon(result,svg);
                        //console.log(result);

                  }) .on("mouseleave", function(){ 
                          $(".onhover").remove();
                          d3.select(this)
                        .style("opacity", 1.0)
                        //.attr("stroke-width", '0px');

                  });
      }

      function numberText(d,svg){
        svg.append("text") //center tex
            .attr("class","d3Marker")
            .attr("id","text-"+d["Latitude"]+"-"+d["Longitude"])
            .attr("font-size","19px")
            .attr("font-weight","bold")
            .style("fill","black")
            .attr("x", function(){ 
              return d.r>30 ? d.x-d.r*1/3 :d.x-d.r*1.25/2;
            })
            .attr("y", function(){        
              return d.y+5}
              )
              .style("z-index", "999")  
            .attr("pointer-events","none")      
            .text(  function(){        
              return d.count} );
      }
 
        //data = data.filter(function(d) { return d.r > 20; })
    
         

      
    } // drawCluster

     // drawCluster
    function getChildrenInfo(children,dict){
      let coordList = [], problemTypes={};
      if(typeof(children)=="undefined"){
        return [];
      }
      //console.log("L",children.length);
      children.forEach(function(item,index){
        coordList.push([Number(dict[item]["x"]),Number(dict[item]["y"])]); 
            
        if(!problemTypes.hasOwnProperty(dict[item]["Problem"])){
          problemTypes [dict[item]["Problem"]]=0
        }else{
          problemTypes [dict[item]["Problem"]]+=1;
        }
        
      });
      //console.log(problemTypes); 
      var pts = hull(coordList, $("#radius").val() || 50);
      return [pts,problemTypes];
    }

    function d3DrawPolygon(data,svg){
      let textString = data[0].join(" ");
      //
      //console.log(textString);
      $(".d3polygon").remove();
      svg.append("polygon")
      .attr("points", textString)
      .attr("class", "d3polygon onhover d3Marker")   
      .style("fill", "none")   
      .style("stroke", "#2299cc")
      .style("opacity", 1)   
      .style("stroke-width", "5px")
      .style("z-index", "990") ;

    }

      function pieRing (dataRaw,d,svg,rScalePie) {
        let x=d.x,y=d.y,r=d.r,children=d["children"],
        textId="text-"+d["Latitude"]+"-"+d["Longitude"];
        dataRaw=dataRaw[1];
        //color = d3.scale.category20c(); 
        let data1 = [];
        color =  d3.schemeCategory20c; 
        let localObj={}
      
        for(var i in dataRaw){
          localObj[i]={"label":i,"value":dataRaw[i]};
          //data1.push({"label":i,"value":dataRaw[i]});
        }
      
        
        let colorFunction = {
          "ACC4-MVC Entrapment":"#ff5500",
          "ACC1-MVC Injuries":"#eda24c",
          "ACC2-MVC No Injuries":"#c6d986",
          "ACC3-MVC Unknown Injuries":"#b2b2b2"          
        };
        for(var j in colorFunction){
          if(localObj.hasOwnProperty(j)){
            data1.push(localObj[j]);
          }
        }

        createLegend(colorFunction);



                var w = r*rScalePie;                        
                var h = r*rScalePie;    
            
                var outerRadius=w/2;
                var innerRadius=0;
    

        var visContainer = svg.append("g")
                .attr("class","d3Marker")
                .attr("transform", function () {  
                  //console.log(ring["coordinates"][0]);                        
                  
                  return "translate("+ 
                  (x-w/2) +","+ 
                  (y-h/2) +")"
                })
                .on("mouseover", function(d){
                  //console.log(this);
                  d3.selectAll(".d3Marker").style("opacity", 0.5);
                  d3.selectAll("#"+textId).style("opacity", 1);
                  d3.select(this)
                  .style("opacity", 1);
                  let results = getChildrenInfo(children,dict);
                  //d3.selectAll("#"+textId).style("fill","white");
                  d3DrawPolygon(results,svg); 
                  console.log(d);
                  for(var i in d){
                    let id = d[i]['label'].split('-MVC ');
                    let value = d[i]['value'];
                    $("#"+id).html(value);
                    console.log("#"+id,value)
                  }
              
    
            }) .on("mouseleave", function(d){ 
               
              d3.selectAll(".d3Marker").style("opacity", 1);
                    $(".onhover").remove();
                    d3.select(this)                    
                   .style("opacity", 1.0) 
                  //.attr("stroke-width", '0px') ; 
                  d3.selectAll("#"+textId).style("fill","black");  
                  for(var i in d){
                    let id = d[i]['label'].split('-MVC ');
                   
                    $("#"+id).html("");
                  }
            });

        var vis = visContainer                    
            .data([data1])                 
                .attr("width", w)          
                .attr("height", h)
            .append("svg:g")               
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")  
    
        var arc = d3.arc()              
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);
    
        var pie = d3.pie()          
            .value(function(d) { return d.value; });    
    
        var arcs = vis.selectAll("g.slice")    
            .data(pie)                         
            .enter()                           
                .append("svg:g")              
                    .attr("class", "slice")                  
                    ;  
    
            arcs.append("svg:path")
                    .attr("fill", function(d, i) {
                      //return color(i)
                      //console.log(d);
                      return colorFunction[d["data"]["label"]] /*color(i);*/
                    } )
                    .style("stroke", function(){
                      //console.log(d);
                      return "#805e00";
                    })
                    .attr("d", arc);                                   
    
            arcs.append("svg:text")                                  
                    .attr("transform", function(d) {                 
                    d.innerRadius = innerRadius;
                    d.outerRadius = outerRadius;
                    return "translate(" + arc.centroid(d) + ")";       
                })
                .attr("text-anchor", "middle")                        
                .text(function(d, i) { return data[i].label; });  

    }
    
    function drawText(d) {
        if(d.r > 10){
            ctx.font = d.r + "px Arial";
                }
        if(d.r > 20){
            ctx.font = d.r / 2 + "px Arial";
        }
        
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(d.count,d.x,d.y+d.r/9); 
    }
    function clear() {
        ctx.clearRect(0, 0, width, height);
    }
    
    function stringify(scale, translate) {
      var k = scale / 256, r = scale % 1 ? Number : Math.round;
      return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
    }

    function createDict(data){
      var dict= {};
      data.forEach(function(item,index){
          let coordIndex = item["Latitude"]+"-"+item["Longitude"];
          if(!dict.hasOwnProperty(coordIndex)){
            dict[coordIndex]=item
          }
        });
      return dict;
    }

}//end of create cluster




function createLegend(legend){
 
let legendStyle = ""; 
addLegendForSmallMap(legend,legendStyle);
function addLegendForSmallMap(legendData,legendStyleb){
$(".tempLegend").remove();
let itemNum = Object.keys(legend).length;
let legendHeight = itemNum * 20 + 80+"px";
let content = "";
for(let i in legend){
    content+=`<tr><td style="margin:10px"><div style="width:20px;margin-left:5px; border-radius: 50%; border:1px solid #808080; height:20px;background-color:`+legend[i]+`;"> 
              <div style="width:200px;margin-left:35px;top: -50px;">`+i.split("-MVC ")[1]+`</div></div></td>
              <td class='tableResult' id='`+i.split("-MVC ")[0]+`' style="float:right"</td></tr>`; 

    }
    
let legendStyle= " height:" + legendHeight + ";width:270px; background-color:white;overflow:hidden;font-size:20px;border-style: solid;border-color: #808080;border-width:0.5px;"+legendStyleb;
$(".legendContain").append("<table class='tempLegend' style='"+legendStyle+"'>"+content+"</table>");
} 
}