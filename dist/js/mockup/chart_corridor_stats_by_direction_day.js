var directionColors = {
    'North': '#29adcb',
    'East': '#ff7f00', 
    'South': '#984ea3',
    'West': '#a65628',
};

renderStatsByDirectionInterface();

function renderStatsByDirectionInterface(){

    $(".datepicker1").val("02/12/2020");

    // d3.csv("data/hourly/stats_per_direction_hour.csv", function(error, data) {
    // d3.csv("data/daily/daily_stats_no_filters.csv", function(error, data) {
    // d3.csv("data/daily/stats_per_direction_day.csv", function(error, data) {
    d3.csv("data/daily/daily_stats_no_filter.csv", function(error, data) {
        let byDate = parseData(data);

        //mock up mod
        /*
        $(".datepicker1").change(function(){
            //triggerByChange();   
        });        
        triggerByChange();*/

        function triggerByChange(){
            let dataOfDate = byDate[$(".datepicker1").val()];
            $(".highchartCorridorIntersectionSpeeds").remove();
            let htmlContainerSpeed = '<div class="col-md-4 border highchartCorridorIntersectionSpeeds" id="corridor-intersection-speeds"></div>';
            $(".highchartCorridorGridSmartContainer").append(htmlContainerSpeed);
            renderSpeedsByDirectionCorridorChart('corridor-intersection-speeds', dataOfDate);

            
            //mock 
            $(".highchartCorridorIntersectionVolumes").remove();
            let htmlContainerVolume = '<div class="col-md-4 border highchartCorridorIntersectionVolumes" id="corridor-intersection-volumes"></div>';
            $(".highchartCorridorGridSmartContainer").append(htmlContainerVolume); 
            renderVolumesByDirectionCorridorChart('corridor-intersection-volumes', dataOfDate) 
            
        }
    });        

    function parseData(inputData){
        let byDate={};
        let fields = ['time', 'mean', '5', '95', 'stddev', 'count'];
        let directions = ['north', 'south', 'east', 'west'];
        let intersections = ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'];
        inputData.forEach(function(item, index){ 
            let mm = item.date.split("/")[0]< 10 ? "0"+(item.date.split("/")[0]) : item.date.split("/")[0];
                  
            let parsedDate = mm +"/"+item.date.split("/")[1]+"/20"+item.date.split("/")[2];
                  
            if(!byDate.hasOwnProperty(parsedDate)){
                byDate[parsedDate]={}
            }
            for(directionID in directions){
                if(!byDate[parsedDate].hasOwnProperty(directions[directionID])){
                    byDate[parsedDate][directions[directionID]]=[]
                }
                for(fieldID in fields){
                    if(!byDate[parsedDate][directions[directionID]].hasOwnProperty(fields[fieldID])){
                        byDate[parsedDate][directions[directionID]][fields[fieldID]]=[null, null, null, null, null, null]
                    }
                    for(intersectionID in intersections){
                        intersectionIndex = intersections.indexOf(intersections[intersectionID])
                        conversionToFormat(byDate[parsedDate][directions[directionID]][fields[fieldID]], item, intersectionIndex, intersections[intersectionID], directions[directionID], fields[fieldID]);
                    }
                }
            }
        });
        return byDate;

        function conversionToFormat(arrays, item, intersectionIndex, intersection, direction, field){
            if(item['intersection'] === intersection){
                columnKey = direction+'_'+field;
                if(field === 'time'){
                    columnKey = 'time';
                }
                arrays[intersectionIndex] = Number(item[columnKey]);         
            }
        }//end of conversion
    }        
}      

function renderVolumesByDirectionCorridorChart(intersectionID, inputdata){
  
    intersectionName = intersectionID.split("-")[0].replace("_"," ");

    fieldName = 'count';
    Highcharts.chart(intersectionID, {
        title: {
            text: 'Corridor Counts'
        },
        yAxis: {
            title: {
                text: 'Arrival counts'
            }
        },
        xAxis: {
            title:  {
                text: "Intersections along the corridor"
            },
            accessibility: {
                rangeDescription: 'Intersections along the corridor from West to East'
            },
            categories: ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'],
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true
                },
            connectNulls: true
            },
        },
        series: [{
            name: 'North',
            data: inputdata['north'][fieldName],
            color: directionColors['North']
        }, {
            name: 'South',
            data: inputdata['south'][fieldName],
            color: directionColors['South']
        }, {
            name: 'East',
            data: inputdata['east'][fieldName],
            color: directionColors['East']
        }, {
            name: 'West',
            data: inputdata['west'][fieldName],
            color: directionColors['West']
        }],
        credits: {
            text: 'Data: GridSmart (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });

}
function renderSpeedsByDirectionCorridorChart(chartID, inputdata){
  
    chartName = chartID.split("-")[0].replace("_"," ");

    fieldName = 'mean';
    Highcharts.chart(chartID, {
        title: {
            text: 'Corridor Speeds'
        },
        yAxis: {
            title: {
                // text: yAxisTitle
                text: 'Speed (mph)'
            }
        },
        xAxis: {
            title:  {
                text: "Intersections along the corridor"
            },
            accessibility: {
                rangeDescription: 'Intersections along the corridor from West to East'
            },
            categories: ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'],
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true
                },
            connectNulls: true
            }
        },
        series: [{
            name: 'North',
            data: inputdata['north'][fieldName],
            color: directionColors['North']
        }, {
            name: 'South',
            data: inputdata['south'][fieldName],
            color: directionColors['South']
        }, {
            name: 'East',
            data: inputdata['east'][fieldName],
            color: directionColors['East']
        }, {
            name: 'West',
            data: inputdata['west'][fieldName],
            color: directionColors['West']
        }],

    });
}