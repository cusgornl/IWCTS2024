var phaseColors = {
    'phase_0': '#a71007',
    'phase_1': '#f7dd57',
    'phase_2': '#d78f4f',
    'phase_3': '#6b47ad',
    'phase_4': '#146d81',
    'phase_5': '#d1ac81',
    'phase_6': '#d5650f',
    'phase_7': '#00a9d4',
    'phase_8': '#7af4da',
    'phase_9': '#73a567',
}

renderThroughputByPhaseInterface();

function renderThroughputByPhaseInterface(){

    $(".datepicker1").val("02/12/2020");
    $(".displaymodeselection").val("counts");
    let displayMode = $(".displaymodeselection").val();

    d3.csv("data/hourly/throughput_by_phase_hour.csv", function(error, data) {
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
            $(".highchartThroughputByPhase").remove();
            
            let intersectionOrder = ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'];
            for(var intersectionIndex in intersectionOrder){
                let intersection = intersectionOrder[intersectionIndex];
              
                
                if(dataOfDate.hasOwnProperty(intersection)){
                    let htmlContainer = `
                                    <div class="col-md-2">                                
                                    <div class="highchartThroughputByPhase border" id='`+intersection.replace(" ","_")+`-color-stacked'></div> 
                                    </div>
                                    `;
                     $(".highchartThroughputByPhaseContainer").append(htmlContainer);
                    renderThroughputByPhaseChart(intersection.replace(" ","_")+'-color-stacked',dataOfDate[intersection], displayMode);    
                }else{
                    let htmlContainer = `
                                        <div class="col-md-2" >                                    
                                        <div class="highchartThroughputByPhase border"  style="height:100%" id='`+intersection.replace(" ","_")+`-color-stacked'>
                                        <p style="margin-top:50%; text-align: center;" >No Data</p>
                                        </div> 
                                        </div>
                                        `;
                    $(".highchartThroughputByPhaseContainer").append(htmlContainer);

                }
            }
        }
    });

        

    function parseData(inputData, displayMode){
        let byDate={};
        let fields = ['time', 'eventphase', 'description', 'count', 'throughput'];
        inputData.forEach(function(item, index){ 
            console.log(item['intersection']);
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
                if(fields[fieldID] === 'count' || fields[fieldID] === 'throughput'){
                    for(phaseNumber in [0,1,2,3,4,5,6,7,8,9]){
                       if(!byDate[parsedDate][item["intersection"]][fields[fieldID]].hasOwnProperty('phase_'+phaseNumber)){
                            byDate[parsedDate][item["intersection"]][fields[fieldID]]['phase_'+phaseNumber] =[]
                        }
                        fullFieldID = fields[fieldID] + '_phase_' + phaseNumber;
                        conversionToFormat(byDate[parsedDate][item["intersection"]][fields[fieldID]]['phase_'+phaseNumber], item, fullFieldID, displayMode);
                    }
                }
                else{
                    conversionToFormat(byDate[parsedDate][item["intersection"]][fields[fieldID]], item, item["intersection"], fields[fieldID], displayMode);
                }
            }
        });
        console.log('test', byDate);
        return byDate;

        function conversionToFormat(arrays, item, intersection, field){
            if(field === 'description'){
                arrays.push(item[field]);
            }
            else{
                arrays.push(Number(item[field]));
            }
            
        }//end of conversion
    }        
}

function renderThroughputByPhaseChart(intersectionID, inputdata, displayMode){
    // console.log(inputdata);
  
    intersectionName = intersectionID.split("-")[0].replace("_"," ");
    
    let stackType = 'normal'; // normal or percent
    if(displayMode === 'percent'){
        stackType = 'percent';
    }
    yAxisTitle = 'Throughput per minute';
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
            text: 'Throughput by Phase'
        },
        yAxis: {
            title: {
                text: yAxisTitle
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
            
            name: 'All red',
            data: inputdata['throughput']['phase_0'],
            color: phaseColors['phase_0']
        }, {
            name: '1',
            data: inputdata['throughput']['phase_1'],
            color: phaseColors['phase_1']
        }, {
            name: '2',
            data: inputdata['throughput']['phase_2'],
            color: phaseColors['phase_2']
        }, {
            name: '3',
            data: inputdata['throughput']['phase_3'],
            color: phaseColors['phase_3']
        }, {
            name: '4',
            data: inputdata['throughput']['phase_4'],
            color: phaseColors['phase_4']
        }, {
            name: '5',
            data: inputdata['throughput']['phase_5'],
            color: phaseColors['phase_5']
        }, {
            name: '6',
            data: inputdata['throughput']['phase_6'],
            color: phaseColors['phase_6']
        }, {
            name: '7',
            data: inputdata['throughput']['phase_7'],
            color: phaseColors['phase_7']
        }, {
            name: '8',
            data: inputdata['throughput']['phase_8'],
            color: phaseColors['phase_8']
        }, {
            name: '9',
            data: inputdata['throughput']['phase_9'],
            color: phaseColors['phase_9']
        }],
        credits: {
            text: 'Data: GridSmart (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });

}