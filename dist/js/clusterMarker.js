
let path = "./data/"+ $("#fileData").val();  

settingupCanvas();
$(document).on('click', '#launch', function() {  
    /*d3.csv(path, function(data) {
        console.log("CSV",data);
        //initCluster(data,map);
    });  */

    d3.json("data/RMincident.json", function(data) {
      
      
      triggerClusterIncident(data,map)

      map.on('moveend', () => {  
        triggerClusterIncident(data,map);        
                  
      });
      map.getView().on('change:resolution', () => {
        triggerClusterIncident(data,map);      

        
    });

    map.getView().on('change:center', () => {
      triggerClusterIncident(data,map);      
            
    }); 


    });  

    function triggerClusterIncident(data,map){
            $(".d3Marker").remove();   
          let ploatingData = incidentJSONParser(data,map)
          initCluster(ploatingData,map.getView().getZoom());
          //console.log("JSON2",data);
    }


});


function settingupCanvas(){
  let svg_html1 = '<svg id="d3svg2" class="ol-overlay-container ol-selectable d3jsRDS" width="'+$("#map").width()+'" height="'+$("#map").height()+'" style="width: 100%; height: 100%; position: absolute; top:0px; left:0px;"></svg>';
  $(".ol-overlaycontainer").append(svg_html1); //here we append the d3svg in openlayer continer

  let svg_html2 = '<svg id="d3svg" class="ol-overlay-container ol-selectable d3jsRDS" width="'+$("#map").width()+'" height="'+$("#map").height()+'" style="width: 100%; height: 100%; position: absolute; top:0px; left:0px;"></svg>';
  $(".ol-overlaycontainer").append(svg_html2); //here we append the d3svg in openlayer continer

}

function incidentJSONParser(data,map){
      let resultData = [];
      let allLabel = [];
      let coordMaxMin = { "lat":[], "long":[]};

      data["features"].forEach(function(row,index){
        //console.log(row)
        let coords = svgProjection(row["geometry"]["coordinates"][0],row["geometry"]["coordinates"][1]);
        if(coords[0]>0 && coords[1]>0){
              resultData.push({
                "long":row["geometry"]["coordinates"][0],
                "lat":row["geometry"]["coordinates"][1],
                "Response_Date": row["properties"]["news_date"],
                "news_date": row["properties"]["news_date"],
                "content": row["properties"]["content"],
                "title": row["properties"]["title"],
                "label": row["properties"]["title"],
                "r":1,
                "x": coords[0],
                "y": coords[1]
            });
            if(allLabel.indexOf(row["properties"]["title"])==-1){
              allLabel.push(row["properties"]["title"]);
            }
            coordMaxMin["lat"].push(row["geometry"]["coordinates"][1]);
            coordMaxMin["long"].push(row["geometry"]["coordinates"][0]);
        }//end of if
        
      });
      
      coordMaxMin["xMinMax"]=[Math.min.apply(null,coordMaxMin["long"]),Math.max.apply(null,coordMaxMin["long"])];
      coordMaxMin["yMinMax"]=[Math.min.apply(null,coordMaxMin["lat"]),Math.max.apply(null,coordMaxMin["lat"])];

      //console.log(allLabel);
      //console.log(coordMaxMin);

      let zoom = map.getView().getZoom();

      let gs = zoom>17 ? 10000 :
              zoom>=16 ? 40 :
              zoom>=15 ? 20 :
              zoom>=14 ? 12 :
              zoom>=13 ? 12 :
              zoom>=12 ? 6 :
              zoom>= 11 ? 5 : 1;

      return   clustering(resultData,coordMaxMin,gs,gs);

      Array.prototype.max = function() {
        return Math.max.apply(null, this);
      };
      
      Array.prototype.min = function() {
        return Math.min.apply(null, this);
      };

      function clustering(resultData,coordMaxMin,xGrid,yGrid){
            let clusters = {}, endResultCluster = [];
            let dx = xGrid/(coordMaxMin["xMinMax"][1]-coordMaxMin["xMinMax"][0]);
            let dy = yGrid/(coordMaxMin["yMinMax"][1]-coordMaxMin["yMinMax"][0]);

            resultData.forEach(function(row,index){
                      let xg = (row["long"]-coordMaxMin["xMinMax"][0])*dx,
                      yg = (row["lat"]-coordMaxMin["yMinMax"][0])*dy;
                      let spatialIndex = parseInt(xg)+"-"+parseInt(yg);
                      //console.log(spatialIndex);
                      if(!clusters.hasOwnProperty(spatialIndex)){
                          clusters[spatialIndex]={"children":[],"longSum":0,"latSum":0};
                      }
                      clusters[spatialIndex]["children"].push(row);
                      clusters[spatialIndex]["longSum"]+=row["long"];
                      clusters[spatialIndex]["latSum"]+=row["lat"];                  
            });

            
            
            for(let spatialIndex in clusters){

            let row = clusters[spatialIndex];  

              row["xAvg"]=(row["longSum"]/row["children"].length);
              row["yAvg"]=(row["latSum"]/row["children"].length);          
              
              let coords = svgProjection(row["xAvg"],row["yAvg"]);

              endResultCluster.push(
                {
                  "long":(row["longSum"]/row["children"].length),
                  "lat":(row["latSum"]/row["children"].length),
                  "r":row["children"].length,
                  "children":row["children"],                  
                  "x":coords[0],
                  "y":coords[1]
                }
              )
                    
            };
            console.log(endResultCluster);
            return endResultCluster;
      }
} //end of JSON parser

function svgProjection(x,y){
      let bound_array = map.getView().calculateExtent(map.getSize());                
      let topLeft = ol.proj.toLonLat([bound_array[0],bound_array[3]]),
      bottomRight = ol.proj.toLonLat([bound_array[2],bound_array[1]]);
      let dxMap= Math.abs(topLeft[0]-bottomRight[0])/$("#map").width(); 
      let dyMap= Math.abs(topLeft[1]-bottomRight[1])/$("#map").height();
      let pixleX= (x-topLeft[0])/dxMap;
      let pixleY= -(y-topLeft[1])/dyMap;

      return [pixleX,pixleY];

}



        //let zoomLevel = map.getView().getZoom();

function initCluster(dataRaw,zoomLevel){


    let svg = d3.select("#d3svg");
    let svg2 = d3.select("#d3svg");

    //let svg = d3.select("svg");
    // Basic parameters:
    let width = +svg.attr("width");
    let height = +svg.attr("height");
    let tau = 2 * Math.PI;
  
  
    
    // Tiles Projection Setup:
    let tileProjection = d3.geoMercator()
      .scale(1/tau)
      .translate([0,0]);
      
      
      let colorFunction = {
        "ACC4-MVC Entrapment":"#ff5500",
        "ACC1-MVC Injuries":"#eda24c",
        "ACC2-MVC No Injuries":"#c6d986",
        "ACC3-MVC Unknown Injuries":"#b2b2b2",
        "WEATHERHAZARD":"#f3da1a",
        "ACCIDENT":"#b4071a",
        "JAM":"#f3961a",    
        "ROADCLOSE":"#ff0000",
        "UNKNOWN":"#32bbbe",       
      };
    
      drawCluster(dataRaw,svg,zoomLevel,colorFunction);

  

            
    

    function zoomLevelDisplay(zoom){
        return  zoom>=17 ? [2,5,15] :
                zoom>=16 ? [4,5,7] :
                zoom>=15 ? [6,3,5] :
                zoom>=14 ? [8,1.5,3] :
               zoom>=13 ? [10,1.5,2] :
              zoom>=12 ? [20,1,1] :
              zoom>=11 ? [30,1,0.7] :
               zoom>=10 ? [40,0.5,0.5] : [20,0.7,0.2]

    }

    //d3js function for draw
    function drawCluster(data,svg,zoomLevel,colorFunction) {

            

            let rLimit = zoomLevelDisplay(zoomLevel)[0];
            let rScale = zoomLevelDisplay(zoomLevel)[1];
            let rScalePie = zoomLevelDisplay(zoomLevel)[2];
            
            data.forEach(function(d,i){
                  let pieResult = getChildrenInfo(d["children"]);
                  //console.log(d.r);
                  if(d.r<=1){                   
                    drawCircle(d,svg,rScale);          
                  }else{
                    
                    pieRing (pieResult,d,svg,rScalePie,colorFunction);
                    numberText(d,svg);
                  }
            });

            function drawCircle(d,svg,rScale){

              let logoList = {
                "WEATHERHAZARD":"data/logo/waze-hazard-icon.svg",
              "ACCIDENT":"data/logo/waze-accident-icon.svg",
              "JAM":"data/logo/waze-jam-icon.svg"  
            }
              let circles = svg.selectAll("img").data([0]) .enter()   
              .append("svg:image")
                 .attr("xlink:href",function(){
                 // return "data/logo/waze-accident-icon.svg" //logoList[d["children"][0]["lable"]];
                  return logoList[d["children"][0]["lable"]];
                 })             
                 
                .attr("class","d3Marker")
                .attr("width", 20)
               .attr("height", 20)
                .attr("x", function(){ 
              
                  return d.x
                })
              .attr("y", function(){        
                return d.y}
                )              
             
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

    function drawMarkerofCluster(d,svg){
          console.log("kkkkkkka")
            let logoList = {
              "WEATHERHAZARD":"data/logo/waze-hazard-icon.svg",
            "ACCIDENT":"data/logo/waze-accident-icon.svg",
            "JAM":"data/logo/waze-jam-icon.svg"  
          }
            let circles = svg.selectAll("img").data([0]) .enter()   
            .append("svg:image")
              .attr("xlink:href",function(){                
                return logoList[d["label"]];
                
              })             
              
              .attr("class","d3Marker onhover")
              .attr("width", 20)
            .attr("height", 20)
              .attr("x", function(){ 
            
                return (d.x-10)
              })
            .attr("y", function(){        
              return (d.y-10)}
              )              
          
      }


     // drawCluster
    function getChildrenInfo(children){
      let coordList = [], problemTypes={};
      if(typeof(children)=="undefined"){
        return [];
      }
      //console.log("L",children.length);
      //console.log(children);
      children.forEach(function(item,index){
        
        coordList.push([Number(item["x"]),Number(item["y"])]); 
            
        if(!problemTypes.hasOwnProperty(item["label"])){
          problemTypes [item["label"]]=0
        }else{
          problemTypes [item["label"]]+=1;
        }
        
      });
      //console.log(problemTypes); 
      let pts = hull(coordList, $("#radius").val() || 50);
      console.log(children);
      return [pts,problemTypes];
    } //end of get child info

    

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

      function pieRing (dataRaw,d,svg,rScalePie,colorFunction) {
       
        let x=d.x,y=d.y,r=d.r,children=d["children"],
        textId="text-"+d["Latitude"]+"-"+d["Longitude"];
        
        dataRaw=dataRaw[1];
        //color = d3.scale.category20c(); 
        let data1 = [];
        color =  d3.schemeCategory20c; 
        let localObj={}
      
        for(let i in dataRaw){
          
          localObj[i]={"label":i,"value":dataRaw[i]+1};      
        }
      
        
        for(let j in colorFunction){
          if(localObj.hasOwnProperty(j)){
            data1.push(localObj[j]);
          }
        }

        //createLegend(colorFunction);


                let wh = r*rScalePie>55 ? r*rScalePie : 55;
                let w = wh;                        
                let h = wh;    
                let outerRadius=w/2;
                let innerRadius=0;
    

        let visContainer = svg.append("g")
                .attr("class","d3Marker")
                .attr("transform", function () {  
                  //console.log(ring["coordinates"][0]);                        
                  
                  return "translate("+ 
                  (x-w/2) +","+ 
                  (y-h/2) +")"
                })
                .on("mouseover", function(d){
                  //console.log(this);
                  d3.selectAll(".d3Marker").style("opacity", 0.3);
                  d3.selectAll("#"+textId).style("opacity", 0.5);
                  d3.select(this)
                  .style("opacity", 0.5);
                  let results = getChildrenInfo(children);
                  //d3.selectAll("#"+textId).style("fill","white");
                  children.forEach(function(d,i){                    
                    drawMarkerofCluster(d,svg);
                  });


                  /*d3DrawPolygon(results,svg);                 
                  for(let i in d){
                    let id = d[i]['label'].split('-MVC ');
                    let value = d[i]['value'];
                    $("#"+id).html(value);
                    //console.log("#"+id,value)
                  }*/
              
    
            }) .on("mouseleave", function(d){ 
               
              d3.selectAll(".d3Marker").style("opacity", 1);
                    $(".onhover").remove();
                    d3.select(this)                    
                   .style("opacity", 1.0) 
                  //.attr("stroke-width", '0px') ; 
                  d3.selectAll("#"+textId).style("fill","black");  
                  for(let i in d){
                    let id = d[i]['label'].split('-MVC ');
                   
                    $("#"+id).html("");
                  }
            });

        let vis = visContainer                    
            .data([data1])                 
                .attr("width", w)          
                .attr("height", h)
            .append("svg:g")               
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")  
    
        let arc = d3.arc()              
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);
    
        let pie = d3.pie()          
            .value(function(d) { return d.value; });    
    
        let arcs = vis.selectAll("g.slice")    
            .data(pie)                         
            .enter()                           
                .append("svg:g")              
                    .attr("class", "slice")                  
                    ;  
    
            arcs.append("svg:path")
                    .attr("fill", function(d, i) {
                      //return color(i)
                    
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
                .style("pointer-events", "none")                      
                .text(function(d, i) { return data1[i]["value"]; });  //here is the numbering of the pie chart

    }
    
    

    function createDict(data){
      let dict= {};
      data.forEach(function(item,index){
          let coordIndex = item["Latitude"]+"-"+item["Longitude"];
          if(!dict.hasOwnProperty(coordIndex)){
            dict[coordIndex]=item
          }
        });
      return dict;
    }


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

}//end of create cluster




