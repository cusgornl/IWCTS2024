

var directionColorsOccupancyCount = {
    'I-75SB': '#235ae3',
    "I-75NB": "#1dbe1d",
    "ShallowfordRd+I-75NB":"#1dbe1d",
    "ShallowfordRd+I-75SB":"#235ae3",
    "Shallowford Rd bridge WB":'#a65628',
    "Shallowford Rd bridge EB":'#ff7f00'
};


var GSarragenment = [
    [ "09/21/2020","10/05/2020", "Difference" ],
    [ "09/22/2020","10/06/2020", "Difference"  ],
    [ "09/23/2020","10/07/2020", "Difference"  ],
    [ "09/24/2020","10/08/2020", "Difference"  ]
];

var WZarragenment = [
    [ "09/21/2020","10/05/2020", "Difference" ],
    [ "09/22/2020","10/06/2020", "Difference"  ],
    [ "09/23/2020","10/07/2020", "Difference"  ],
    [ "09/24/2020","10/08/2020", "Difference"  ]
];


gridSmartOccupancyCount();

function gridSmartOccupancyCount(){

    //$(".datepicker1").val("02/12/2020");

    d3.csv("data/anne_new_data2/gridsmart_2020-09-21_10-08.csv", 
    function(error, data) {
        let dataByDate = 
        parseDataGridSmartOcc(data,["time","occupancyCount","occupancyPercent"]);

        renderInContainer (".gridSmartOccupancyCountContainer",
                            dataByDate,"corridorCompareGridsmartOccCount",
                            ["occupancyCount"],GSarragenment,["ShallowfordRd+I-75NB","ShallowfordRd+I-75SB"],4);
        
        renderInContainer (".gridSmartOccupancyPercentContainer",
        dataByDate,"corridorCompareGridsmartOccPercent",
        ["occupancyPercent"],GSarragenment,["ShallowfordRd+I-75NB","ShallowfordRd+I-75SB"],4);

        

    });   
    d3.csv("data/anne_new_data2/waze_2020-09-21_10-08.csv",
     function(error, data) {
        let dataByDate2 = 
        parseDataGridSmartOcc(data,[
            "time","current travel time",
            "historic travel time","current average speed","historic average speed"]);
            console.log("dataByDate!!!!",dataByDate2);

            renderInContainer (".wazeAvgTravelTimeContainer",
            dataByDate2,"corridorCompareEaze",
            ["current travel time"],GSarragenment,["Shallowford Rd bridge WB","Shallowford Rd bridge EB"],4);

            renderInContainer (".wazeCurrentSpeedContainer",
            dataByDate2,"corridorCompareEaze",
            ["current average speed"],GSarragenment,["Shallowford Rd bridge WB","Shallowford Rd bridge EB"],4);


            /*
            renderInContainer (".wazeCurrentHistorySpeedContainer",
            dataByDate2,"corridorCompareEaze",
            ["current average speed","historic average speed"],GSarragenment2,["Shallowford Rd bridge WB","Shallowford Rd bridge EB"],12);
*/

    });
    //"current travel time"	
    //historic travel time	
    //current average speed	
    //historic average speed

    
// wazeCurrentTravelTimeContainer wazeAvgTravelTimeContainer
        function renderInContainer (containerId,dataByDate,idTitle,fields,arragenment,twoDirections,layoutCol){
           //console.log("byDate GSM",dataByDate,arragenment);
            $(containerId).empty();
            arragenment.forEach(function(item,index){
                item.forEach(function(item2,index2){
                    let dateForDIvId=
                    item2.replace("/","_").replace("/","_")+"_"+index;

                    $(containerId).append(
                        `<div class="col-md-`+layoutCol+` border">
                        <div align="center">`+item2+`</div>`+
                        `<div class=" 
                        highchartcorridorCompareGridsmartOccCount" 
                        style=""
                        id="`+idTitle+`_`+dateForDIvId+`">                    
                        </div></div>`
                    );
                    if(["diff","Difference"].indexOf(item2)==-1){ //this means item2 is a date
                        if(dataByDate.hasOwnProperty(item2)){
                            
                            //console.log(fields[0]);
                           let types = "line";
                            if(fields[0]== "occupancyCount"){
                                types = "scatter";
                            }

                            if(fields.length==1){
                                dataOfDate = dataByDate[ item2 ];                            
                                renderGridSmartOccCountStats(
                                 idTitle+'_'+dateForDIvId, 
                                dataOfDate, fields[0],types,twoDirections,1);                    
                           
                            }
                        }else{
                            $('#'+idTitle+'_'+dateForDIvId).append(
                            `
                            <div style="
                                top: 50%;
                                position: absolute;
                                width: 100%;
                                text-align: center;
                            ">No Data</div>`
                    );
                        }//end of else
    
                    }else{  //here we plot difference
                        //console.log("-------",item[0],
                       //item[1])
                       if(fields.length==1){
                            let diffData = 
                            calculateDifferenceData(dataByDate,item[0],
                                item[1],fields[0]);
                      
                            renderGridSmartOccCountStats(
                                idTitle+'_'+dateForDIvId,  
                                diffData, fields[0],'area',twoDirections,1);  
                       }
                                //line  column  area 
                       // }                  
                    }
                });
            });
        }  //renderInContainer end

       

        function calculateDifferenceData(dataByDate,date1,date2,field){
                //console.log("date1",dataByDate[date1]);
                //console.log("date2",dataByDate[date2]);
                let res = {};
                for(let eachDir in dataByDate[date1]){
                    res[eachDir]={};
                    res[eachDir][field]=[];
                    res[eachDir]["time"]=[];
                    let data1 = dataByDate[date1][eachDir];
                    //console.log()
                    let data2 = dataByDate[date2][eachDir];
                    //console.log("data1A",data1);
                    data1[field].forEach(function(item,index){
                        let diff=
                        item- data2[field][index];
                        res[eachDir][field].push(diff);  
                        res[eachDir]["time"].push(data2["time"][index]);                   
                    });
                }
                return res;
        }

        

    function parseDataGridSmartOcc(inputData,fields){
        let byDate={};
        //let fields = ['time', 'avg_speed', 'avg_travel_time', 'mpg'];
        //let fields = ["time","occupancyCount","occupancyPercent"];
        //


        inputData.forEach(function(item, index){ 
            let mm = item.date.split("/")[0]< 10 ? "0"+(item.date.split("/")[0]) : item.date.split("/")[0];
            let dd = item.date.split("/")[1]< 10 ? "0"+(item.date.split("/")[1]) : item.date.split("/")[1];

            let parsedDate = mm +"/"+dd+"/"+item.date.split("/")[2];
                             
            if(!byDate.hasOwnProperty(parsedDate)){
                byDate[parsedDate]={}
            }
            if(!byDate[parsedDate].hasOwnProperty(item["name"])){
                byDate[parsedDate][item["name"]]=[]
            }
            for(fieldID in fields){
                if(!byDate[parsedDate][item["name"]].hasOwnProperty(fields[fieldID])){
                    byDate[parsedDate][item["name"]][fields[fieldID]]=[]
                }
                conversionToFormat(byDate[parsedDate][item["name"]][fields[fieldID]], item, fields[fieldID]);
            }            
        });
        //console.log("byDatebyDate",byDate);
        return byDate;

        function conversionToFormat(arrays, item, field){
        	if(field === 'avg_travel_time'){
        		arrays.push(Number(item[field])/60);
        	}
        	else if (field === 'time'){
        		arrays.push(item[field]);
        	} else {
                arrays.push(Number(item[field]));
            }
        }//end of conversion
    }        //end of parseDate
}      

//chartType 
function renderGridSmartOccCountStats(chartID, inputdata, 
          fieldName,chartType,
          twoDirections,plotVariableType){
    
    /*
    let times_in_format0 = ['15:45', ' ', ' ', '15:48', ' ', ' ', '15:51', '15:52', '15:53', '15:54', '15:55', '15:56', '15:57', '15:58', '15:59',
    '16:00', '16:01', '16:02', '16:03', '16:04', '16:05', '16:06', '16:07', '16:08', '16:09', '16:10', '16:11', '16:12', '16:13', '16:14',
    '16:15', '16:16', '16:17', '16:18', '16:19', '16:20', '16:21', '16:22', '16:23', '16:24', '16:25', '16:26', '16:27', '16:28', '16:29',
    '16:30', '16:31', '16:32', '16:33', '16:34', '16:35', '16:36', '16:37', '16:38', '16:39', '16:40', '16:41', '16:42', '16:43', '16:44',
    '16:45', '16:46', '16:47', '16:48', '16:49', '16:50', '16:51', '16:52', '16:53', '16:54', '16:55', '16:56', '16:57', '16:58', '16:59',
    '17:00', '17:01', '17:02', '17:03', '17:04', '17:05', '17:06', '17:07', '17:08', '17:09', '17:10', '17:11', '17:12', '17:13', '17:14',
    '17:15', '17:16', '17:17', '17:18', '17:19', '17:20', '17:21', '17:22', '17:23', '17:24', '17:25', '17:26', '17:27', '17:28', '17:29',
    '17:30', '17:31', '17:32', '17:33', '17:34', '17:35', '17:36', '17:37', '17:38', '17:39', '17:40', '17:41', '17:42', '17:43', '17:44',
    '17:45', '17:46', '17:47', '17:48', '17:49', '17:50', '17:51', '17:52', '17:53', '17:54', '17:55', '17:56', '17:57', '17:58', '17:59',
    '18:00', '18:01', '18:02', '18:03', '18:04', '18:05', '18:06', '18:07', '18:08', '18:09', '18:10', '18:11', '18:12', '18:13', '18:14',
    '18:15', '18:16', '18:17', '18:18', '18:19', '18:20', '18:21', '18:22', '18:23', '18:24', '18:25', '18:26', '18:27', '18:28', '18:29',
    '18:30', '18:31', '18:32', '18:33', '18:34', '18:35', '18:36', '18:37', '18:38', '18:39', '18:40', '18:41', '18:42', '18:43', '18:44',
    '18:45', '18:46', '18:47', '18:48', '18:49', '18:50', '18:51', '18:52', '18:53', '18:54', '18:55', '18:56', '18:57', '18:58', '18:59',
    '19:00', '19:01', '19:02', '19:03', '19:04', '19:05', '19:06', '19:07', '19:08', '19:09', '19:10', '19:11', '19:12', '19:13', '19:14',
    '19:15'];*/
    let times_in_format0 = ['15:45', '15:46', '15:47', '15:48', '15:49', '15:50', '15:51', '15:52', '15:53', '15:54', '15:55', '15:56', '15:57', '15:58', '15:59',
    '16:00', '16:01', '16:02', '16:03', '16:04', '16:05', '16:06', '16:07', '16:08', '16:09', '16:10', '16:11', '16:12', '16:13', '16:14',
    '16:15', '16:16', '16:17', '16:18', '16:19', '16:20', '16:21', '16:22', '16:23', '16:24', '16:25', '16:26', '16:27', '16:28', '16:29',
    '16:30', '16:31', '16:32', '16:33', '16:34', '16:35', '16:36', '16:37', '16:38', '16:39', '16:40', '16:41', '16:42', '16:43', '16:44',
    '16:45', '16:46', '16:47', '16:48', '16:49', '16:50', '16:51', '16:52', '16:53', '16:54', '16:55', '16:56', '16:57', '16:58', '16:59',
    '17:00', '17:01', '17:02', '17:03', '17:04', '17:05', '17:06', '17:07', '17:08', '17:09', '17:10', '17:11', '17:12', '17:13', '17:14',
    '17:15', '17:16', '17:17', '17:18', '17:19', '17:20', '17:21', '17:22', '17:23', '17:24', '17:25', '17:26', '17:27', '17:28', '17:29',
    '17:30', '17:31', '17:32', '17:33', '17:34', '17:35', '17:36', '17:37', '17:38', '17:39', '17:40', '17:41', '17:42', '17:43', '17:44',
    '17:45', '17:46', '17:47', '17:48', '17:49', '17:50', '17:51', '17:52', '17:53', '17:54', '17:55', '17:56', '17:57', '17:58', '17:59',
    '18:00', '18:01', '18:02', '18:03', '18:04', '18:05', '18:06', '18:07', '18:08', '18:09', '18:10', '18:11', '18:12', '18:13', '18:14',
    '18:15', '18:16', '18:17', '18:18', '18:19', '18:20', '18:21', '18:22', '18:23', '18:24', '18:25', '18:26', '18:27', '18:28', '18:29',
    '18:30', '18:31', '18:32', '18:33', '18:34', '18:35', '18:36', '18:37', '18:38', '18:39', '18:40', '18:41', '18:42', '18:43', '18:44',
    '18:45', '18:46', '18:47', '18:48', '18:49', '18:50', '18:51', '18:52', '18:53', '18:54', '18:55', '18:56', '18:57', '18:58', '18:59',
    '19:00', '19:01', '19:02', '19:03', '19:04', '19:05', '19:06', '19:07', '19:08', '19:09', '19:10', '19:11', '19:12', '19:13', '19:14',
    '19:15'];

    let times_in_format=[];
    let data1 = [];
    let data2 = [];
            /*
    times_in_format0.forEach(function(item,index){
        data1.push(     
            "2018-06-15T"+item+":00",
            inputdata[twoDirections[1]][fieldName][index]
           )
        data2.push(     
            "2018-06-15T"+item+":00",
            inputdata[twoDirections[0]][fieldName][index]
           )
        times_in_format.push( "2018-06-15T"+item+":00");
    })*/

     
    

    chartName = chartID.split("-")[0].replace("_"," ");
	chartTitle = '',
    yAxisTitle = '',
    attributions = '';
    if(fieldName === 'avg_speed') {
    	chartTitle = 'SR-153 to Ashford Dr Speeds';
        yAxisTitle = 'Average Speed (mph)';
        attributions = 'GridSmart (CDOT)';

    }
    else if(fieldName === 'avg_travel_time'){
    	chartTitle = 'SR-153 to Ashford Dr Travel Times';
        yAxisTitle = 'Travel time (minutes)';
        attributions = 'GridSmart (CDOT)';

        
    }
    else if(fieldName === 'mpg'){
    	chartTitle = 'SR-153 to Ashford Rd Fuel Use';
        yAxisTitle = 'mpg';
        attributions = 'GridSmart (CDOT)';
    }
    else if(fieldName === 'occupancyCount'){
    	chartTitle = 'Occupancy Count';
        yAxisTitle = 'Count';
        attributions = 'Data: GridSmart (CDOT)';
    }
    else if(fieldName === 'occupancyPercent'){ 
    	chartTitle = 'Occupancy Percent';
        yAxisTitle = 'Percent';
        attributions = 'Data:GridSmart (CDOT)';
    }
    else if(fieldName === 'current average speed'){
    	chartTitle = 'Current Average Speed';
        yAxisTitle = 'Speed (mph)';
        attributions = 'Data: Waze Corridors (CDOT)'
    }
    else if(fieldName === 'current travel time'){
    	chartTitle = 'Current Travel Time';
        yAxisTitle = 'Time';
        attributions = 'Data: Waze Corridors (CDOT)'
    }

    if(typeof(inputdata)=="undefined"){
        console.log(inputdata);
        return false;
    }


    //"occupancyPercent" "current average speed" "current travel time"

    //console.log("inputdata");
    let plotOptionsList ={
                "scatter":{
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.x}  , {point.y}  '
                        }
                    }
                },
                "line":{
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                "area":{
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                }

                
    };

    let yAxisOption = ["occupancyPercent"].indexOf(fieldName)!=-1 ? 
     {
        title: {
            text: yAxisTitle
        },
        max:100      
        
    }:
    {
        title: {
            text: yAxisTitle
        }       
    }

    let plotOptions = plotOptionsList[chartType];
    
    if(plotVariableType==1){
        Highcharts.chart(chartID, {
            chart: {
                type: chartType //line  column  area 'scatter'
                //chartType
            },
            title: {
                text: chartTitle
            },
            exporting: { enabled: false }, 
            yAxis: yAxisOption,
            
            xAxis: {
                title:  {
                    text: "Time of Day"
                },
                accessibility: {
                    rangeDescription: 'Intersections along the corridor from West to East'
                },
                tickInterval:30,
                categories: times_in_format0
            },
            plotOptions: plotOptions,
            series: [{ 
                name: twoDirections[1].replace("+"," + ").replace("bridge","Bridge"),
                data: inputdata[twoDirections[1]][fieldName],
                color: directionColorsOccupancyCount[twoDirections[1]]
            }, {
                name: twoDirections[0].replace("+"," + ").replace("bridge","Bridge"),
                data: inputdata[ twoDirections[0]][fieldName],
                color: directionColorsOccupancyCount[ twoDirections[0]]
            }],
            credits: {
                text: attributions,
                //href: 'http://www.chattanooga.gov/transportation'
            },
    
        });
        /*console.log(
            inputdata[twoDirections[1]][fieldName],
            inputdata[ twoDirections[0]][fieldName],
            times_in_format
        );*/

    }//end of plotoption 1
    if(plotVariableType==2){
        Highcharts.chart(chartID, {
            chart: {
                type: chartType //line  column  area 'scatter'
                //chartType
            },
            title: {
                text: chartTitle
            },
            exporting: { enabled: false }, 
            yAxis: yAxisOption,
            xAxis: {
                title:  {
                    text: "Time of Day"
                },
                accessibility: {
                    rangeDescription: 'Time of day for the entire day'
                },
                               
                data: inputdata[twoDirections[0]]['time'] // this is corrupt, no time in there.
            },
            plotOptions: plotOptions,
            series: [{
                name: twoDirections[1].slice(-2),
                data: inputdata[twoDirections[1]][fieldName],
                color: directionColorsOccupancyCount[twoDirections[1]]
            }, {
                name: twoDirections[0].slice(-2),
                data: inputdata[ twoDirections[0]][fieldName],
                color: directionColorsOccupancyCount[ twoDirections[0]]
            }],
            credits: {
                text: attributions,
               // href: 'http://www.chattanooga.gov/transportation'
            },
    
        });
    }
    
} // renderGridSmartOccCountStats

    function renderWazeHourlyStatsDifferences(chartID, inputdata, fieldName){
    chartName = chartID.split("-")[0].replace("_"," ");
    chartTitle = ''
    yAxisTitle = ''
    if(fieldName === 'avg_speed') {
        chartTitle = 'Speed Differences';
        yAxisTitle = 'Speed (mph)<br>  positive = second is faster <br> negative = first is faster ';
    }
    else if(fieldName === 'avg_travel_time'){
        chartTitle = 'Travel Time Differences';
        yAxisTitle = 'Travel time (min)<br>  positive = first is shorter <br> negative = second is shorter ';
    }
    else if(fieldName === 'mpg'){
        chartTitle = 'Fuel Use Differences';
        yAxisTitle = 'mpg';
    }
    Highcharts.chart(chartID, {
        chart: {
            type: 'area'
            //chartType
        },
        title: {
            text: chartTitle
        },
        yAxis: {
            title: {
                text: yAxisTitle
            }
        },
        xAxis: {
            title:  {
                text: "Time of Day"
            },
            accessibility: {
                rangeDescription: 'Time of day for the entire day'
            },
            data: inputdata['WB']['time'] // this is corrupt, no time in there.
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Eastbound',
            data: inputdata['EB'][fieldName],
            color: directionColorsOccupancyCount['East']
        }, {
            name: 'Westbound',
            data: inputdata['WB'][fieldName],
            color: directionColorsOccupancyCount['West']
        }],
        credits: {
            text: 'Data: Waze Corridors (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });
}
