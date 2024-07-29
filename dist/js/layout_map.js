
let regionInfo =[
  {
    "averageSpeed":[80,90],
    "totalVolume":[99000,100000],
    "totalEnergyComsumption":[10000,11000],
    "name":"Memphis",
    "tabColor": ["btn btn-danger","#dc3545",["#f4bec3","#dc3545"]],
    "coords":[-90.04871878146162, 35.1663323807343] 
  },
  {
   "averageSpeed":[90,60],
   "totalVolume":[120000,120000],
   "totalEnergyComsumption":[30000,23000],
   "name":"Nashville",
   "tabColor": ["btn btn-primary","#007bff",["#b3d7ff","#007bff"]],
   "coords":[-86.78278307543015, 36.172424058130886]
 },
 {
  "averageSpeed":[55,60],
  "totalVolume":[120000,130000],
  "totalEnergyComsumption":[9000,10000],
  "name":"Chattanooga",
  "tabColor": ["btn btn-info","#17a2b8",["#bbeff7","#17a2b8"]],
  "coords":  [-85.30903117520155, 35.05102032822734]
},
 {
   "averageSpeed":[80,60],
   "totalVolume":[13000,12000],
   "totalEnergyComsumption":[25000,23000],
   "name":"Knoxville",
   "tabColor": ["btn btn-success","#28a745",["#c1f0cc","#28a745"]],
   "coords":[-83.93632563874935, 35.97868750904742]
 }
]; 

//Memphis, Nashville, Chattanooga, Knoxville

let mapReference = mapSetUp('map');
regionalTabGeneration(regionInfo);
addCorridorLayer(mapReference);
datePicker();

function datePicker(){
  $('.datepicker1').datepicker({
    uiLibrary: 'bootstrap',
    dateFormat: 'm/dd/yyyy'
  });

  $('.datepicker2').datepicker({
    uiLibrary: 'bootstrap',
    dateFormat: 'm/dd/yyyy'
  });


  //https://gijgo.com/datepicker/example/bootstrap
}
 

function addCorridorLayer(map){

  /*let sourceJson = new ol.source.GeoJSON({
    projection : 'EPSG:4326',
    url: 'data\vector\corridorArea2.json'
  });*/

  var sourceJson2 = new ol.source.Vector({
        url: 'data/vector/corridorArea2.geojson',
        format: new ol.format.GeoJSON(),
     
  });

  console.log(ol.source)
   var layer = new ol.layer.Vector({
        title: 'added Layer',
        source: sourceJson2,
        style: new ol.style.Style({ fill: new ol.style.Fill({color: 'rgba(255,0,0,0.2)'})  })
    });

    map.addLayer(layer);
}

//settingupCanvas();
//mapD3GraphToMap (mapReference,regionInfo); 



function settingupCanvas(){
  let svg_html1 = '<svg id="d3svg2" class="ol-overlay-container ol-selectable d3jsRDS" width="'+$("#map").width()+'" height="'+$("#map").height()+'" style="width: 100%; height: 100%; position: absolute; top:0px; left:0px;"></svg>';
  $(".ol-overlaycontainer").append(svg_html1); //here we append the d3svg in openlayer continer
}



function mapD3GraphToMap (map,data){

  map.on('moveend', () => {  
    $(".d3mapping").remove();
    triggerD3Mapping(); 
  });
  map.getView().on('change:resolution', () => {
    $(".d3mapping").remove();
    triggerD3Mapping(); 
  });

  map.getView().on('change:center', () => {
    $(".d3mapping").remove();
    triggerD3Mapping();     
  }); 

  function triggerD3Mapping(){
    data.forEach(function(item,idex){
       console.log(item)
        //d3jsRoseBarChart(map,"#d3svg2",item);
        d3jsRoseBarChart2(map,"#d3svg2",item);
    });
  }
    


}



function regionalTabGeneration(regionInfo){

 
    $(".regionTabs").empty();
    regionInfo.forEach(function(item,index){
    
        let tabStyle = "height:100%; border-style: solid;font-size:15px;  ";
        //col-sm-2 col-md-2 col-lg-2 offset-sm-1 offset-md-1 offset-lg-1 eachRegionTab
        let tempTab = '<div class="col-sm-3 col-md-3 col-lg-3 eachRegionTab'+item["tabColor"][0]+'" align="center" style="'+tabStyle+'">'
        +'<b>'+item['name']+'</b>'
        +'<div> Average Speed:'+item['averageSpeed'][0]+'</div>'
        +'<div> Total Volume:'+item['totalVolume'][0]+'</div>'
        +'<div> Energy Consumed:'+item['totalEnergyComsumption'][0]
        +'</div>'
        '</div>';
       
        $(".regionTabs").append(tempTab);
    });
    

}


function mapSetUp(mapContainerID){
 
layerGroups = {
  "layersOSM":new ol.layer.Group({
          layers: [
              new ol.layer.Tile({
                  source: new ol.source.OSM()
              })
          ]
      }),           
  "layersArcGIS-sate": new ol.layer.Group({
          layers: [
          new ol.layer.Tile({
              source: new ol.source.XYZ({
            attributions: ['Powered by Esri',
                          'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
            attributionsCollapsible: false,
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 23
          }) 
            })
          ]
      }),
      "Stamen-toner":new ol.layer.Group({
          layers: [
                    new ol.layer.Tile({
                  source: new ol.source.Stamen({
                    layer: 'toner'
                  })
                })                    
          ]
      }),
      "Stamen-terrainWater":new ol.layer.Group({
          layers: [
              new ol.layer.Tile({
                      source: new ol.source.Stamen({
                        layer: 'watercolor'
                      })
                    }),
                    new ol.layer.Tile({
                  source: new ol.source.Stamen({
                    layer: 'terrain-labels'
                  })
                }),               
          ]
      }),  
      "Stamen-terrain":new ol.layer.Group({
          layers: [
              new ol.layer.Tile({
                      source: new ol.source.Stamen({
                        layer: 'terrain'
                      })
                    }),
                    new ol.layer.Tile({
                  source: new ol.source.Stamen({
                    layer: 'terrain-labels'
                  })
                }),               
          ]
      }),
      "Stamen-tb":new ol.layer.Group({
          layers: [
              new ol.layer.Tile({
                      source: new ol.source.Stamen({
                        layer: 'toner-background'
                      })
                    }),                                           
          ]
      }),
      "Stamen-tl":new ol.layer.Group({
          layers: [
              new ol.layer.Tile({
                      source: new ol.source.Stamen({
                        layer: 'toner-lite'
                      })
                    }),                                           
          ]
      }),
      "arcGIS-Dark": new ol.layer.Group({
          layers: [
          new ol.layer.Tile({
              source: new ol.source.XYZ({
            attributions: ['Powered by Esri',
                          'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
            attributionsCollapsible: false,
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 23
          }) 
            })
          ]
      }),       

      "googleLayerSatellite": new ol.layer.Tile({
        title: "Google Satellite",
        source: new ol.source.TileImage({ url: 'http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}' })
      }),

      "googleLayerOnlyRoad": new ol.layer.Tile({
          title: "Google Road without Building",
          source: new ol.source.TileImage({ url: 'http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}' }),
      }),

      "googleLayerUydu":new ol.layer.Tile({ source: new ol.source.TileImage({ url: 'http://mt1.google.com/vt/lyrs=m@113&hl=en&&x={x}&y={y}&z={z}' })}),

      "googleLayerUydu2":new ol.layer.Tile({
                  visible: false,
                  preload: Infinity,
                  source: new ol.source.TileImage({
                      maxZoom: 19,
                      wrapX: true,
                      url: `https://www.google.de/maps/vt/pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e1!3i762!3m9!2s${this.language}!3s${this.country}!5e1105!12m1!1e4!12m1!1e47!12m1!1e3!4e0!5m1!1e0`

                  })
                      })
                      
        }

  var map = new ol.Map({
        target: mapContainerID,
        layers: [
          layerGroups["Stamen-terrain"]
        ],
        //controls: [],
        interactions: ol.interaction.defaults({mouseWheelZoom:false}),
        view: new ol.View({
          center: ol.proj.fromLonLat([-85.15600416596897, 35.042406713638]),          
          zoom: 16,
          rotation: -Math.PI* 0.75 / 6,
         
        })
      });
      
  map.setLayerGroup(layerGroups[$("#basemap").val()]);

  map.on('click', function (evt) {
    var coord = map.getCoordinateFromPixel(evt.pixel);
    console.info(ol.proj.toLonLat(coord));
  });

  

  $(document).on('change', '#basemap', function() {  
       console.log(layerGroups[$("#basemap").val()]);
       console.log($("#basemap").val())
        map.setLayerGroup(layerGroups[$("#basemap").val()]);
        
  })

  

  function setMapType(layer) {
    
          map.setLayerGroup(layer);
     
  }

  return map;

}//end of map setup

       