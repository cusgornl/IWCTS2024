var directionColors = {
    'North': '#29adcb',
    'East': '#ff7f00', 
    'South': '#984ea3',
    'West': '#a65628',
};

renderThruArrivalsOnColorInterface();

function renderThruArrivalsOnColorInterface(){

    $(".datepicker1").val("02/12/2020");
    $(".colorselection").val("red");
    $(".displaymodeselection").val("counts");

    d3.csv("data/daily/arrival_by_color_all_traffic_day_percent.csv", function(error, data) {
        let lightColor = 'red';
        let displayMode = 'counts';
        let byDate = parseData(data, displayMode);

        $(".datepicker1").change(function(){
            triggerByChange();   
        });
        $(".colorselection").change(function(){
            triggerByChange(); 
        });
        $(".displaymodeselection").change(function(){
            triggerByChange();   
        });
        triggerByChange();
        function triggerByChange(){
            let dataOfDate = byDate[$(".datepicker1").val()];
            let lightColor = $(".colorselection").val();
            let displayMode = $(".displaymodeselection").val();
            $(".highchartCorridorArrivalsOnColorByDirection").remove();
            //modification here
            let htmlContainer = '<div class="col-md-12 border highchartCorridorArrivalsOnColorByDirection" id="corridor-color"></div>';
            $(".highchartCorridorGridSmartContainer").append(htmlContainer);
            renderCorridorArrivalsOnColorChart('corridor-color', lightColor, displayMode, dataOfDate);       
        }
    });        

    function parseData(inputData, displayMode){
        let byDate={};
        let fields = ['time', 'red', 'yellow', 'green', 'no_color', 'percent_red', 'percent_yellow', 'percent_green', 'percent_no_color'];
        let directions = ['north', 'south', 'east', 'west']
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
                columnKey = field+'_'+direction;
                if(field === 'time'){
                    columnKey = 'time';
                }
                arrays[intersectionIndex] = Number(item[columnKey]);         
            }
        }//end of conversion
    }        
}      

//this needs modivication
//mockup mod
function renderCorridorArrivalsOnColorChart(chartID, lightColor, displayMode, inputdata){
    yAxisTitle = 'Arrival counts';
    if(displayMode === 'percent'){
        yAxisTitle = 'Arrivals in %'
    }
    fieldName = lightColor;
    if(displayMode === 'percent'){
        fieldName = 'percent_'+fieldName;
    }
    Highcharts.chart(chartID, {
        title: {
            text: 'EPI Situational Awareness'
            //text: 'Corridor Arrivals on '+lightColor[0].toUpperCase()+lightColor.slice(1)
        },
        yAxis: {
            title: {
                text: yAxisTitle
            }
        },
        xAxis: {
            title:  {
                text: "Intersections along the corridor"
            },
            accessibility: {
                rangeDescription: 'Intersections along the corridor from West to East'
            },
            categories: ['Amin Dr', 'I-75 S', 'I-75 N', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'],
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
            //name: 'North',
            name: 'Cases',
            data: inputdata['north'][fieldName],
            color: directionColors['North']
        }, {
            //name: 'South',
            name: 'Vaccines',
            data: inputdata['south'][fieldName],
            color: directionColors['South']
        }
        //mockup mod
        /* {
            name: 'East',
            data: inputdata['east'][fieldName],
            color: directionColors['East']
        }, {
            name: 'West',
            data: inputdata['west'][fieldName],
            color: directionColors['West']
        }*/
    ],

    });

}