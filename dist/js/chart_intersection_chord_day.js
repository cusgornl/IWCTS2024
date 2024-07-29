var directionColors = {
    'North': '#29adcb',
    'East': '#ff7f00', 
    'South': '#984ea3',
    'West': '#a65628',
};


renderHighChartChordInterface();

function renderHighChartChordInterface(){

        $(".datepicker1").val("02/12/2020");

        d3.csv("data/daily/chord_diagram_day.csv", function(error, data) {
          let byDate = parsseData(data);

          $(".datepicker1").change(function(){
            triggerByDateChange();
            
          });
          triggerByDateChange();
          addChartTitle();

          function triggerByDateChange(){
            let dataOfDate = byDate[$(".datepicker1").val()];
            let displayMode = $(".displaymodeselection").val();
            $(".highchartChord").remove();
            $(".highchartChordsContainer").empty();
            
            let intersectionOrder = ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'];
            for(var intersectionIndex in intersectionOrder){
                let intersection = intersectionOrder[intersectionIndex];
              
                
                if(dataOfDate.hasOwnProperty(intersection)){
                    let htmlContainer = `
                                    <div class="col-md-2">                                
                                    <div class="border highchartChord" id='`+intersection.replace(" ","_")+`-chord'></div> 
                                    </div>
                                    `;
                     $(".highchartChordsContainer").append(htmlContainer);
                     renderHighChartChord(intersection.replace(" ","_")+'-chord',dataOfDate[intersection], displayMode);    
                }else{
                    let htmlContainer = `
                                        <div class="col-md-2" >                                       
                                        <div class="highchartChord border" style="height:100%"  id='`+intersection.replace(" ","_")+`-chord'>
                                        <p style="margin-top:50%; text-align: center;" >No Data</p>
                                        </div> 
                                        </div>
                                        `;
                    $(".highchartChordsContainer").append(htmlContainer); 

                }
                   
            }
        }

        function addChartTitle(){
          let intersectionOrder = ['Amin Dr', 'I-75 SB', 'I-75 NB', 'Napier Rd', 'Lifestyle Way', 'Gunbarrel Rd'];
          $(".intersectionTitleContainer").empty();
          for(var intersectionIndex in intersectionOrder){
            let intersection = intersectionOrder[intersectionIndex];
            let htmlContainer = `
                <div class="col-md-2" >
                <h5 style="text-align: center;">`+intersection+`</h5>         
                </div>
                `;
                $(".intersectionTitleContainer").append(htmlContainer);

          }

        }

        });

        

        function parsseData(inputData){
            let byDate={};
            inputData.forEach(function(item,index){
              let mm = item.date.split("/")[0]< 10 ? "0"+(item.date.split("/")[0]) : item.date.split("/")[0];
              
              let parsedDate = mm +"/"+item.date.split("/")[1]+"/20"+item.date.split("/")[2];
              
              if(!byDate.hasOwnProperty(parsedDate)){
                byDate[parsedDate]={}
              }
              if(!byDate[parsedDate].hasOwnProperty(item["intersection"])){
                byDate[parsedDate][item["intersection"]]=[]
              }
              conversionToFormat(byDate[parsedDate][item["intersection"]],item);
            });

            return byDate;

            function conversionToFormat(arrays,item){
              let conversion = {
              "es":["East", "South", Number(item["es"])],
              'wn':["West", "North", Number(item["wn"])],
              "sw":["South", "West", Number(item["sw"])],
              "ne":["North", "East", Number(item["ne"])],
              "en":["East", "North", Number(item["en"])],
              "ws":["West", "South", Number(item["ws"])],
              "se":["South", "East", Number(item["se"])],
              "nw":["North", "West", Number(item["nw"])],
              "ew":["East", "West", Number(item["ew"])],
              "we":["West", "East", Number(item["we"])],
              "sn":["South", "North", Number(item["sn"])],
              "ns":["North", "South", Number(item["ns"])],
              "ee":["East", "East", Number(item["ee"])],
              "ww":["West", "West", Number(item["ww"])],
              "ss":["South", "South", Number(item["ss"])],
              "nn":["North", "North", Number(item["nn"])]
              };

              for(var key in item){
                if(conversion.hasOwnProperty(key)){
                  arrays.push(conversion[key]); 
                }
              }
            }//end of converssion
        }    
}

function renderHighChartChord(chartID,inputdata){
    Highcharts.chart(chartID, {

          title: {
              text: 'Turn Movements'
          },

          accessibility: {
              point: {
                  valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.'
              }
          },

          series: [{
              keys: ['from', 'to', 'weight'],
              data: inputdata,
            
              type: 'dependencywheel',
              name: 'Traffic flow direction',
              dataLabels: {
                  color: '#333',
                  textPath: {
                      enabled: true,
                      attributes: {
                          dy: 5
                      }
                  },
                  distance: 10
              },
              size: '95%'
          }],    
          colors: [directionColors['East'], directionColors['South'], directionColors['West'], directionColors['North'],],
        credits: {
            text: 'Data: GridSmart (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

    });
}