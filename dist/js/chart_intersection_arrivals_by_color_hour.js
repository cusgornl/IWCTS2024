var lightColors = {
    'R': '#a71007',
    'Y': '#fbe707',
    'G': '#29adcb',
    '?': '#aaaaaa',
}

renderArrivalsByColorInterface();

function renderArrivalsByColorInterface(){

    $(".datepicker1").val("02/12/2020");
    $(".displaymodeselection").val("counts");
    let displayMode = $(".displaymodeselection").val();

    d3.csv("data/hourly/arrival_by_color_all_traffic_hour_percent.csv", function(error, data) {
        let byDate = parseData(data, displayMode);

        $(".datepicker1").change(function(){
            triggerByChange();   
        });
        $(".displaymodeselection").change(function(){ 
            triggerByChange();   
        });
        triggerByChange();
        function triggerByChange(){
            let dataOfDate = byDate[$(".datepicker1").val()];
            let displayMode = $(".displaymodeselection").val();
            $(".highchartArrivalsByColor").remove();
            
            let intersectionOrder = ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'];
            for(var intersectionIndex in intersectionOrder){
                let intersection = intersectionOrder[intersectionIndex];
              
                
                if(dataOfDate.hasOwnProperty(intersection)){
                    let htmlContainer = `
                                    <div class="col-md-2">                                
                                    <div class="highchartArrivalsByColor border" id='`+intersection.replace(" ","_")+`-color-stacked'></div> 
                                    </div>
                                    `;
                     $(".highchartArrivalsByColorContainer").append(htmlContainer);
                    renderArrivalsByColorChart(intersection.replace(" ","_")+'-color-stacked',dataOfDate[intersection], displayMode);    
                }else{
                    let htmlContainer = `
                                        <div class="col-md-2" >                                    
                                        <div class="highchartArrivalsByColor border"  style="height:100%" id='`+intersection.replace(" ","_")+`-color-stacked'>
                                        <p style="margin-top:50%; text-align: center;" >No Data</p>
                                        </div> 
                                        </div>
                                        `;
                    $(".highchartArrivalsByColorContainer").append(htmlContainer);

                }
                   
            }
        }
    });

        

    function parseData(inputData, displayMode){
        let byDate={};
        let fields = ['time', 'red', 'yellow', 'green', 'no_color', 'total'];
        inputData.forEach(function(item, index){ 
            let mm = item.date.split("/")[0]< 10 ? "0"+(item.date.split("/")[0]) : item.date.split("/")[0];
                  
            let parsedDate = mm +"/"+item.date.split("/")[1]+"/20"+item.date.split("/")[2];
                  
            if(!byDate.hasOwnProperty(parsedDate)){
                byDate[parsedDate]={}
            }
            if(!byDate[parsedDate].hasOwnProperty(item["intersection"])){
                byDate[parsedDate][item["intersection"]]=[]
            }
            for(fieldID in fields){
                if(!byDate[parsedDate][item["intersection"]].hasOwnProperty(fields[fieldID])){
                    byDate[parsedDate][item["intersection"]][fields[fieldID]]=[]
                }
                conversionToFormat(byDate[parsedDate][item["intersection"]][fields[fieldID]], item, fields[fieldID], displayMode);
            }
        });
        return byDate;

        function conversionToFormat(arrays, item, field){
            arrays.push(Number(item[field]));
        }//end of conversion
    }        
}

function renderArrivalsByColorChart(intersectionID, inputdata, displayMode){
  
    intersectionName = intersectionID.split("-")[0].replace("_"," ");
    
    let stackType = 'normal'; // normal or percent
    if(displayMode === 'percent'){
        stackType = 'percent';
    }
    yAxisTitle = 'Arrival counts';
    if(displayMode === 'percent'){
        yAxisTitle = 'Arrivals in %'
    }
    Highcharts.chart(intersectionID, {
        chart: {
            type: 'area'
        },
        plotOptions: {
            area: {
                stacking: stackType
            }
        },
        title: {
            text: 'Arrivals by Traffic Light Color'
        },
        yAxis: {
            title: {
                text: null//yAxisTitle
            },
            accessibility: {
                rangeDescription: yAxisTitle
            },
        },
        xAxis: {
            title:  {
                text: "Time of Day"
            },
            accessibility: {
                rangeDescription: 'Time of ay for the entire day'
            },
            categories: inputdata['time']
        },
        legend:{
            // x: -10,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            },
            area: {
                stacking: stackType,
                lineWidth: 1,
            }
        },
        series: [{
            
            name: 'Red',
            data: inputdata['red'],
            color: lightColors['R']
        }, {
            name: 'Yellow',
            data: inputdata['yellow'],
            color: lightColors['Y']
        }, {
            name: 'Green',
            data: inputdata['green'],
            color: lightColors['G']
        }, {
            name: 'Error',
            data: inputdata['no_color'],
            color: lightColors['?']
        }],
        credits: {
            text: 'Data: GridSmart (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });

}