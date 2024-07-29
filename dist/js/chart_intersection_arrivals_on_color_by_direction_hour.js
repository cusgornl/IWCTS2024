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

    d3.csv("data/hourly/arrival_by_color_all_traffic_hour_percent.csv", function(error, data) {
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
            $(".highchartThruArrivalsColorDirection").remove();
            $(".highchartThruArrivalOnColorByDirectionContainer").empty();
            
            let intersectionOrder = ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'];
            for(var intersectionIndex in intersectionOrder){
                let intersection = intersectionOrder[intersectionIndex];
              
                
                if(dataOfDate.hasOwnProperty(intersection)){
                    let htmlContainer = `
                            <div class="col-md-2">                           
                            <div class="border highchartThruArrivalsColorDirection" id='`+intersection.replace(" ","_")+`-color'></div> 
                            </div>
                            `;
                     $(".highchartThruArrivalOnColorByDirectionContainer").append(htmlContainer);
                     renderThruArrivalsOnColorChart(intersection.replace(" ","_")+'-color', dataOfDate[intersection], lightColor, displayMode);    
                }else{
                    let htmlContainer = `
                            <div class="col-md-2" >                                    
                            <div class="highchartThruArrivalsColorDirection border" id='`+intersection.replace(" ","_")+`-color' style="height:100%">
                            <p style="margin-top:50%; text-align: center;" >No Data</p>
                            </div> 
                            </div>
                            `;
                    $(".highchartThruArrivalOnColorByDirectionContainer").append(htmlContainer);

                }
                   
            }
        }
    });        

    function parseData(inputData){
        let byDate={};
        let fields = ['time', 'red', 'yellow', 'green', 'no_color', 'percent_red', 'percent_yellow', 'percent_green', 'percent_no_color'];
        let directions = ['north', 'south', 'east', 'west']
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
            columnKey = field+'_'+direction;
            if(field === 'time'){
                columnKey = 'time';
            }
            arrays.push(Number(item[columnKey]));
        }//end of conversion
    }        
}      


function renderThruArrivalsOnColorChart(chartID, inputdata, lightColor, displayMode){
  
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
            text: 'Arrivals on '+lightColor[0].toUpperCase()+lightColor.slice(1)
        },
        yAxis: {
            title: {
                text: null//yAxisTitle
            }
        },
        xAxis: {
            title:  {
                text: "Time of Day"
            },
            accessibility: {
                rangeDescription: 'Time of day for the entire day'
            },
            categories: inputdata['north']['time']
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