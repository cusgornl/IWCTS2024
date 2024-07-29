// initialize the map object, passing it the id of the div where we want the map to go
  //setView is a method to center the initial map view in the middle of Iowa (latitude 42, longitude -93, and zoom level 7)
  var map = L.map('map',{ layers: [new L.esri.basemapLayer("Streets")]}).setView([42, -93], 7);
   

  // load GeoJSON from an external file
$.getJSON("data/tweetdata_json.json",function(data){

  // add GeoJSON layer to the map once the file is loaded'
  var tweetIcon = L.icon({
    iconUrl: 'data/image/tweet.png', 
    iconSize: [30,30]
  });

  var tweets = L.geoJson(data,{
    pointToLayer: function(feature,latlng){
         var marker = L.marker(latlng,{icon: tweetIcon});
         marker.bindPopup(feature.properties.message + '<br/>' + feature.properties.username + '<br/>' + feature.properties.date);
         return marker;
     }
  });
  map.fitBounds(tweets.getBounds());   
  var clusters = L.markerClusterGroup();
  clusters.addLayer(tweets);
  map.addLayer(clusters);
});