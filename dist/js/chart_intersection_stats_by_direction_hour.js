var directionColors = {
    'North': '#29adcb',
    'East': '#ff7f00', 
    'South': '#984ea3',
    'West': '#a65628',
};

renderStatsByDirectionInterface();

function renderStatsByDirectionInterface(){

    $(".datepicker1").val("02/12/2020");

    d3.csv("data/hourly/hourly_stats_no_filter.csv", function(error, data) {
        let byDate = parseData(data);

        $(".datepicker1").change(function(){
            triggerByChange();   
        });
        triggerByChange();

        function triggerByChange(){
            let dataOfDate = byDate[$(".datepicker1").val()];
            let displayMode = $(".displaymodeselection").val();
            $(".highchartIntersectionSpeedsByDirection").remove();
            $(".highchartIntersectionVolumesByDirection").remove();
            
            let intersectionOrder = ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'];
            for(var intersectionIndex in intersectionOrder){
                let intersection = intersectionOrder[intersectionIndex];
              
                
                if(dataOfDate.hasOwnProperty(intersection)){
                    let htmlContainerSpeed = `
                            <div class="col-md-2">                             
                            <div class="border highchartIntersectionSpeedsByDirection" id='`+intersection.replace(" ","_")+`-intersection-speeds'></div> 
                            </div>
                            `;
                     $(".highchartIntersectionSpeedsByDirectionContainer").append(htmlContainerSpeed);
                     renderSpeedsByDirectionIntersectionChart(intersection.replace(" ","_")+'-intersection-speeds', dataOfDate[intersection]);  

                    let htmlContainerVolume = `
                            <div class="col-md-2">                                  
                            <div class="border highchartIntersectionSpeedsByDirection" id='`+intersection.replace(" ","_")+`-intersection-volumes'></div> 
                            </div>
                            `;
                 
                     $(".highchartIntersectionVolumesByDirectionContainer").append(htmlContainerVolume); 
                     renderVolumesByDirectionIntersectionChart(intersection.replace(" ","_")+'-intersection-volumes', dataOfDate[intersection]); 
                    
                    

                }else{
                    let htmlContainerSpeed = `
                            <div class="col-md-2" >
                         
                            <div class="highchartIntersectionSpeedsByDirection border" style="height:100%" >
                            <p style="margin-top:50%; text-align: center;" >No Data</p>
                            </div> 
                            </div>
                            `;
                    let htmlContainerVolume =`
                            <div class="col-md-2" >
                
                            <div class="highchartIntersectionSpeedsByDirection border" style="height:100%" >
                            <p style="margin-top:50%; text-align: center;" >No Data</p>
                            </div> 
                            </div>
                            `;

                    $(".highchartIntersectionSpeedsByDirectionContainer").append(htmlContainerSpeed);
                    $(".highchartIntersectionVolumesByDirectionContainer").append(htmlContainerVolume); 
                    

                }
                   
            }
        }
    });        

    function parseData(inputData){
        let byDate={};
        let fields = ['time', 'mean', '5', '95', 'stddev', 'count'];
        let directions = ['north', 'south', 'east', 'west'];
        inputData.forEach(function(item, index){ 
            let mm = item.date.split("/")[0]< 10 ? "0"+(item.date.split("/")[0]) : item.date.split("/")[0];
                  
            let parsedDate = mm +"/"+item.date.split("/")[1]+"/20"+item.date.split("/")[2];
                  
            if(!byDate.hasOwnProperty(parsedDate)){
                byDate[parsedDate]={}
            }
            if(!byDate[parsedDate].hasOwnProperty(item["intersection"])){
                byDate[parsedDate][item["intersection"]]=[]
            }
            for(directionID in directions){
                if(!byDate[parsedDate][item["intersection"]].hasOwnProperty(directions[directionID])){
                    byDate[parsedDate][item["intersection"]][directions[directionID]]=[]
                }
                for(fieldID in fields){
                    if(!byDate[parsedDate][item["intersection"]][directions[directionID]].hasOwnProperty(fields[fieldID])){
                        byDate[parsedDate][item["intersection"]][directions[directionID]][fields[fieldID]]=[]
                    }
                    conversionToFormat(byDate[parsedDate][item["intersection"]][directions[directionID]][fields[fieldID]], item, directions[directionID], fields[fieldID]);
                }
            }
        });
        return byDate;

        function conversionToFormat(arrays, item, direction, field){
            columnKey = direction+'_'+field;
            if(field === 'time'){
                columnKey = 'time';
            }
            arrays.push(Number(item[columnKey]));
        }//end of conversion
    }        
}      


function renderSpeedsByDirectionIntersectionChart(intersectionID, inputdata){
  
    intersectionName = intersectionID.split("-")[0].replace("_"," ");

    fieldName = 'mean';
    Highcharts.chart(intersectionID, {
        title: {
            text: 'Speeds (mph)'
        },
        yAxis: {
            title: {
                text: null//'Speed (mph)'
            }
        },
        xAxis: {
            title:  {
                text: "Time of Day"
            },
            accessibility: {
                rangeDescription: 'Time of day for the entire day'
            },
            categories: inputdata['north']['time'],
            // tickInterval: 5,
            // min: 0,
            // max: 23,
            // startOnTick: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
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
function renderVolumesByDirectionIntersectionChart(intersectionID, inputdata){
  
    intersectionName = intersectionID.split("-")[0].replace("_"," ");

    fieldName = 'count';
    Highcharts.chart(intersectionID, {
        title: {
            text: 'Arrival Counts'
        },
        yAxis: {
            title: {
                text: null//'Arrival counts'
            }
        },
        xAxis: {
            title:  {
                text: "Time of Day"
            },
            accessibility: {
                rangeDescription: 'Time of day for the entire day'
            },
            categories: inputdata['north']['time'],
            // tickInterval: 5,
            // min: 0,
            // max: 23,
            // startOnTick: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
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
        credits: {
            text: 'Data: GridSmart (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });

}