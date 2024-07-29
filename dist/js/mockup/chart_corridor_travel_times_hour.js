var directionColors = {
    'North': '#29adcb',
    'East': '#ff7f00', 
    'South': '#984ea3',
    'West': '#a65628',
};

renderStatsByDirectionInterface();

function renderStatsByDirectionInterface(){

    $(".datepicker1").val("02/12/2020");

    d3.csv("data/hourly/travel_times_hour.csv", function(error, data) {
        let byDate = parseData(data);

        $(".datepicker1").change(function(){
            triggerByChange();   
        });
        //triggerByChange();
        triggerComparison (byDate);


        function triggerByChange(){
            let dataOfDate = byDate[$(".datepicker1").val()];
            $(".highchartCorridorTravelTimeHourly").remove();
            let htmlContainerTravelTime = '<div class="col-md-4 border highchartCorridorTravelTimeHourly" id="corridor-travel-time-hourly"></div>';
            $(".highchartCorridorWazeContainer").append(htmlContainerTravelTime);
            renderWazeHourlyStats('corridor-travel-time-hourly', dataOfDate, 'avg_travel_time');

            $(".highchartCorridorSpeedHourly").remove();
            let htmlContainerSpeed = '<div class="col-md-4 border highchartCorridorSpeedHourly" id="corridor-speed-hourly"></div>';
            $(".highchartCorridorWazeContainer").append(htmlContainerSpeed);
            renderWazeHourlyStats('corridor-speed-hourly', dataOfDate, 'avg_speed');

            $(".highchartCorridorMPGHourly").remove();
            let htmlContainerMPG = '<div class="col-md-4 border highchartCorridorMPGHourly" id="corridor-mpg-hourly"></div>';
            $(".highchartCorridorWazeContainer").append(htmlContainerMPG);
            renderWazeHourlyStats('corridor-mpg-hourly', dataOfDate, 'mpg');
        }

        function triggerComparison (byDate){
            console.log("compare data",byDate);
            let containID = ".highchartCorridorWazeCompareContainer";
            findFirstFewDates(byDate);

            
        
            function findFirstFewDates(byDate){
                let dateArrayAvailable = [];
                for(var eachDate in byDate){
                    //dateArrayAvailable.push(eachDate);                    
                }
                dateArrayAvailable = ["02/12/2020","02/19/2020"];
                console.log(dateArrayAvailable);
                $(containID).empty();
                for (var i=0; i<2; i++){
                    //console.log(dateArrayAvailable[i]);

                    let compareHtml = ` 
                        <div class="col-md-4 border">
                            <input class="dateSelectorCompare_`+i+` dateSelectorCompare" id="`+i+`" value=`+dateArrayAvailable[i]+` style="text-align: center;width:100%; margin-top:5px" /> 
                            <div id="selectorCorridorCompareTravelTime_`+i+`" class="selectorCorridorCompareTravelTime" style="margin-top:5px"></div>
                            <div id="selectorCorridorCompareSpeed_`+i+`" class="selectorCorridorCompareSpeed"  style="margin-top:5px"></div>
                        </div> `;
                    $(containID).append(compareHtml);
                   // $('.dateSelectorCompare_'+i).attr("disabled",true); // this is when you want them to be title
                    $('.dateSelectorCompare_'+i).datepicker({
                        uiLibrary: 'bootstrap',
                        dateFormat: 'm/dd/yyyy'
                      });

                     let dataOfDate = byDate[dateArrayAvailable[i]];
                     renderWazeHourlyStats('selectorCorridorCompareTravelTime_'+i, dataOfDate, 'avg_travel_time'); 
                    
                    // mockup-modify
                    // renderWazeHourlyStats('selectorCorridorCompareSpeed_'+i, dataOfDate, 'avg_speed');
                     
                                        
                     //$('.dateSelectorCompare_'+i).unbind();
                   

                }//end of for

                plotDifference();
                $('.dateSelectorCompare').change(function(){
                    console.log(this);
                    console.log($(this).val());

                    let index = Number($(this).attr("class").split(" ")[0].replace("dateSelectorCompare_",""));
                    console.log(index);

                   $(".corridorCompareHighchart_"+index).empty();       
                   console.log(byDate);
                   dataOfDate = byDate[ $(this).val() ];
                   if(byDate.hasOwnProperty($(this).val())){                       
                    renderWazeHourlyStats('selectorCorridorCompareTravelTime_'+index, dataOfDate, 'avg_travel_time'); 
                    renderWazeHourlyStats('selectorCorridorCompareSpeed_'+index, dataOfDate, 'avg_speed');
                    plotDifference();

                   }else{
                    $('#selectorCorridorCompareTravelTime_'+index).empty();
                    $('#selectorCorridorCompareSpeed_'+index).empty();
                    $('#selectorCorridorCompareSpeed_'+index).append(`
                            <div style="
                                top: 50%;
                                position: absolute;
                                width: 100%;
                                text-align: center;
                            ">No Data</div>
                    `);
                    plotDifference();
                   }
                   
                });

                function plotDifference(){
                    $(".difPlot").remove();
                  
                    let compareHtmlC = ` 
                    <div class="col-md-4 border difPlot">   
                        <h5 style="
                                    margin-top:10px;
                                    width: 100%;
                                    text-align: center;
                        ">Differences</h5>                       
                        <div id="selectorCorridorCompareTravelTime_difference" class="selectorCorridorCompareTravelTime" style="margin-top:5px"></div>
                        <div id="selectorCorridorCompareSpeed_difference" class="selectorCorridorCompareSpeed"  style="margin-top:5px"></div>
                    </div> `; 
                    let date1 = $(".dateSelectorCompare_0").val();
                    let date2 = $(".dateSelectorCompare_1").val();
                    $(containID).append(compareHtmlC); 
                    if(byDate.hasOwnProperty(date1) && byDate.hasOwnProperty(date2)){
                                       
                        let dataDifference = getDifferenceBetweenDates(byDate[date1],byDate[date2]);
                        console.log("dif",dataDifference);
                        renderWazeHourlyStatsDifferences('selectorCorridorCompareSpeed_difference', dataDifference, 'avg_speed'); 
                        
                        //mockup mod
                        //renderWazeHourlyStatsDifferences('selectorCorridorCompareTravelTime_difference', dataDifference, 'avg_travel_time'); 
                    
                    }else{
                        $('#selectorCorridorCompareSpeed_difference').empty();
                        $('#selectorCorridorCompareTravelTime_difference').empty();
                        $('#selectorCorridorCompareSpeed_difference').append(`
                                    <div style="
                                    top: 50%;
                                    position: absolute;
                                    width: 100%;
                                    text-align: center;
                                ">No Data</div>
                        `);
                    }
                    
                }

                function getDifferenceBetweenDates(dataDate1,dataDate2){
                    let finalResults = {};
                     
                    for(var direction in dataDate1){
                        finalResults[direction]=[];
                        for(let fieldName in dataDate1[direction]){
                            if(!finalResults[direction].hasOwnProperty(fieldName)){
                                finalResults[direction][fieldName]=[]
                            }
                            let totalIndex = Number(dataDate1[direction][fieldName].length) < Number(dataDate2[direction][fieldName].length) ? dataDate1[direction][fieldName].length : dataDate2[direction][fieldName].length;
           
                            for(let eachIndex = 0; eachIndex <totalIndex; eachIndex++){                     
                                    let item1 = dataDate1[direction][fieldName][eachIndex] || 0;
                                    let item2 = dataDate2[direction][fieldName][eachIndex] || 0;
                                    let difference = item2 - item1;
                                    finalResults[direction][fieldName].push(difference); 
                            }    
                        }
                    }
                    console.log(finalResults);
                    return finalResults;
                }//end of getDifference


            }//end of generating availble date
        }
    });        

    function parseData(inputData){
        let byDate={};
        let fields = ['time', 'avg_speed', 'avg_travel_time', 'mpg'];
        inputData.forEach(function(item, index){ 
            let mm = item.date.split("/")[0]< 10 ? "0"+(item.date.split("/")[0]) : item.date.split("/")[0];
            let dd = item.date.split("/")[1]< 10 ? "0"+(item.date.split("/")[1]) : item.date.split("/")[1];

            let parsedDate = mm +"/"+dd+"/20"+item.date.split("/")[2];
                             
            if(!byDate.hasOwnProperty(parsedDate)){
                byDate[parsedDate]={}
            }
            if(!byDate[parsedDate].hasOwnProperty(item["direction"])){
                byDate[parsedDate][item["direction"]]=[]
            }
            for(fieldID in fields){
                if(!byDate[parsedDate][item["direction"]].hasOwnProperty(fields[fieldID])){
                    byDate[parsedDate][item["direction"]][fields[fieldID]]=[]
                }
                conversionToFormat(byDate[parsedDate][item["direction"]][fields[fieldID]], item, fields[fieldID]);
            }            
        });
        return byDate;

        function conversionToFormat(arrays, item, field){
        	if(field === 'avg_travel_time'){
        		arrays.push(Number(item[field])/60);
        	}
        	else {
        		arrays.push(Number(item[field]));
        	}
        }//end of conversion
    }        //end of parseDate
}      


function renderWazeHourlyStats(chartID, inputdata, fieldName){
    chartName = chartID.split("-")[0].replace("_"," ");
	chartTitle = ''
	yAxisTitle = ''
    if(fieldName === 'avg_speed') {
    	chartTitle = 'Vaccine Sentiment';
    	yAxisTitle = '';
    }
    else if(fieldName === 'avg_travel_time'){
    	chartTitle = 'Vaccine Attention';
    	yAxisTitle = '';
    }
    else if(fieldName === 'mpg'){
    	chartTitle = 'SR-153 to Ashford Rd Fuel Use';
    	yAxisTitle = 'mpg';
    }
    Highcharts.chart(chartID, {
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
            name: 'TN',
            data: inputdata['EB'][fieldName],
            color: "#238b45"
            //color: "directionColors['East']" 
        }, {
            name: 'US',
            data: inputdata['WB'][fieldName],
            color: "#225ea8"
            //color: directionColors['West']
            //
        }],
        credits: {
            text: 'Data: Waze Corridors (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });
}

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
            color:"#238b45"
              //    "#238b45"   
            //color: directionColors['East']
        }, {
            name: 'Westbound',
            data: inputdata['WB'][fieldName],
            color: "#225ea8"
            //color: directionColors['West']
        }],
        credits: {
            text: 'Data: Waze Corridors (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });
}
