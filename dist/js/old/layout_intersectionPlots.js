let LayerStyleService = {
    "directionColors" :{
        'North': '#29adcb',
        'East': '#ff7f00', 
        'South': '#984ea3',
        'West': '#a65628',
    }   

}




$.getJSON( "data/json/intersectionCharts.json", function( data ) {

// console.log(data);
    makeIntersectionChart("intersectionChart1",data)
    //makeIntersectionChart("intersectionChart2",data) 
});


function makeIntersectionChart(id,chartData) {
    Highcharts.chart(id, {
        chart: {
          type: "line"
        },
        credits: {
            text: 'Data: GridSmart (CDOT)',
            href: 'http://www.chattanooga.gov/transportation'
        },

        title: {
          text: ""
        },
        xAxis: {
          categories: getIntersectionNames(chartData)
        },
        yAxis: {
          title: {
            text: "Volume"
          }
        },
        series: [
          {
            name: "North",
            data: getNorthData(chartData)
          },
          {
            name: "East",
            data: getEastData(chartData)
          },
          {
            name: "South",
            data: getSouthData(chartData)
          },
          {
            name: "West",
            data: getWestData(chartData)
          }
        ],
        colors: [LayerStyleService.directionColors.North, LayerStyleService.directionColors.South, LayerStyleService.directionColors.East, LayerStyleService.directionColors.West]
      });

      setTimeout(() => {
        if(this.chartIsLoading) {
            this.chartIsLoading = false;
            this.chartNoData = true;
        }
    }, 5000);
  }

  function getIntersectionNames(chartData) {
    const intersectionNames = [];
    chartData.forEach(intersection => {
      intersectionNames.push(intersection.x);
    });

    return intersectionNames;
  }

  function getNorthData(chartData)  {
    const northData = [];
    chartData.forEach(intersection => {
      northData.push(intersection["y-north"] || 0);
    });

    return northData;
  }

  function getSouthData(chartData) {
    const southData = [];
    chartData.forEach(intersection => {
      southData.push(intersection["y-south"] || 0);
    });

    return southData;
  }

  function getEastData(chartData){
    const eastData = [];
    chartData.forEach(intersection => {
      eastData.push(intersection["y-east"] || 0);
    });

    return eastData;
  }

  function getWestData(chartData) {
    const westData = [];
    chartData.forEach(intersection => {
      westData.push(intersection["y-west"] || 0);
    });

    return westData;
  }
