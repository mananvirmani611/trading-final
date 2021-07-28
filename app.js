
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ["Sun", "Mun", "Tue", "Wed", "Thu", "Fri", "Sat"];
let graphType = "";
let table = document.getElementById('table');
let inputMonth = document.getElementById('input-month');
let inputDaily = document.getElementById('input-daily');
let inputHour = document.getElementById('input-hour');
let Data = []
let Profit = { daily: [], avg: [] };
let allDate = [];
let gainData = [];
let myChart;

function changeGraph(tx, first) {
  let text = tx;
  if (tx == 'Growth') {
    text = 'Profitable(%)';
  }
  sum = 0;

  Profit = { daily: [], avg: [] };
  allDate = [];
  for (let i = Data.length - 1; i >= 0; i--) {
    if (Data.length - i == 100) {
      break
    }
    let item = Data[i]
    let profit = item[text];
    let date = formatDate(item['Open Date']);
    sum += profit;

    Profit.daily.push(profit);
    Profit.avg.push(sum);
    allDate.push(date);
  }

  if (first) {
    makeGraph(allDate, Profit)
  } else {
    handler(myChart, Profit, tx)
  }
}


fetch('csvjson (2).json')
  .then(res => res.json())
  .then(data => {
    Data = data;
    makeTable(Data);
    changeGraph('Growth', true);
    makeHighChart(Data);

  });

function formatDate(str) {
  let d = new Date(str);
  let year = d.getFullYear().toString().substr(2, 2);
  let month = MONTHS[d.getMonth()];
  let day = d.getDate()
  return `${day} ${month} ${year}`;
}

function makeTable(Data) {
  $('#table').DataTable({
    data: Data,
    columns: [
      { data: 'Ticket' },
      { data: 'Open Date' },
      { data: 'Symbol' },
      { data: 'Action' },
      { data: "Units/Lots" },
      { data: "Open Price" },
      { data: "SL" },
      { data: "TP" },
      { data: "Close Date" },
      { data: "Close Price" },
      { data: "Commission" },
      { data: "Swap" },
      { data: "Profit" }
    ],
    initComplete: function () {
      $('div.dataTables_length').addClass('demo');
      $('div.dataTables_filter').addClass('demo');
    }
  });

  const inp = document.getElementsByTagName('input');
  inp[0].placeholder = "Search..."
  const lb = document.getElementsByTagName('label');
  lb[0] = '';

  var balance = 0;
  var swap = 0;
  var lots = 0;
  var wins = 0;
  var loses = 0;
  var maxprofit = 0;
  var maxprofitdate = 0;
  var minprofit = 0;
  var minprofitdate = 0;
  var winTotal = 0;
  var loseTotal = 0;

  for(var i = 0; i<Data.length-1; i++){
      var profit = Data[i].profit;
      balance = balance + profit;
      if(profit > maxprofit){
        maxprofit = profit;
        maxprofitdate = Data[i].opendate;
      }
      if(profit<minprofit){
        minprofit = profit;
        minprofitdate = Data[i].opendate;
      }

      swap = swap + Data[i].Swap;
      lots = lots + Data[i].UnitsLots;
      if(profit > 0){
        winTotal = winTotal + profit;
        wins++;
      }
      else{
        loseTotal = loseTotal + profit;
        loses++;
      }
  }
  console.log("max profit is " + maxprofit);
  var totalWinsLoses = loses + wins;
  document.getElementById("balance").innerHTML = (balance/Data.length).toFixed(2) +  " GBP";
  document.getElementById("balance-top").innerHTML = (balance/Data.length).toFixed(2) +  " GBP";
  document.getElementById("profit/loss").innerHTML = (balance/Data.length).toFixed(2) +  " GBP";
  document.getElementById("win-percentage").innerHTML = ((wins/(wins+loses))*100).toFixed(2) + "% of " +totalWinsLoses ;
  document.getElementById("loses-percentage").innerHTML = ((loses/(wins+loses))*100).toFixed(2) + "% of " +totalWinsLoses ;
  // document.getElementById("best-trade").innerHTML = maxprofit + " GBP " + "(" + maxprofitdate.substring(0, 10) + ")";
  // document.getElementById("worst-trade").innerHTML = minprofit + " GBP " + "(" + minprofitdate.substring(0, 10) + ")";

  document.getElementById("deposits").innerHTML = balance.toFixed(2) +  " GBP";
  document.getElementById("total-trades").innerHTML = Data.length;
  document.getElementById("swap").innerHTML = swap/Data.length;
  document.getElementById("lots").innerHTML = (lots/Data.length).toFixed(6);



  document.getElementById("avg-win").innerHTML = (winTotal/wins).toFixed(4) + " GBP";
  document.getElementById("avg-loss").innerHTML = (loseTotal/loses).toFixed(4) + " GBP";



  console.log("win total is  " + winTotal/wins);
  console.log("lose total is " + loseTotal/loses);




}


function handler(chart, data, text) {
  chart.config.options.plugins.title.text = text;
  chart.config.data.datasets.forEach((dataset, key) => {
    if (key == 0) {
      dataset.data = data['daily'];
      dataset.label = "Daily " + text;
    } else {
      dataset.data = data['avg'];
      dataset.label = text;
    }
  });
  chart.update();
}

function makeGraph(allDate, Profit) {

  const labels = allDate;
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Daily Growth',
        data: Profit.daily,
        borderColor: 'rgb(21, 155, 137) ',
        backgroundColor: 'rgba(21, 155, 137, 0.575)',
        order: 0,
        border: 3,
      },
      {
        label: 'Growth',
        data: Profit.avg,
        borderColor: 'rgb(230, 216, 29)',
        backgroundColor: 'rgb(230, 216, 29,0.5)',
        type: "line",
        pointStyle: 'circle',
        pointRadius: 4,
        order: 1
      }
    ]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      animations: {
        radius: {
          duration: 400,
          easing: 'linear',
          loop: (context) => context.active
        },
      },
      hoverRadius: 12,
      hoverBackgroundColor: 'rgb(197, 78, 118)',

      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: 'Growth',
          font: {
            size: 40,
          }
        }
      },
      scales: {
        x: {
          ticks: {
            callback: function (val, index) {
              return index % 12 === 0 ? this.getLabelForValue(val) : '';
            },
            color: 'white',
          },
          grid: {
            display: true,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
          }
        },
        y: {
          grid: {
            drawBorder: false,
            color: function (context) {
              if (context.tick.value > 0) {
                return 'green';
              } else if (context.tick.value < 0) {
                return "red";
              }
              return 'rgb(21, 155, 137)';
            },
          },
        }
      }
    },
  };

  var ctx = document.getElementById('profit').getContext('2d');
  myChart = new Chart(ctx, config);
}










inputHour.addEventListener('input', () => makeHighChart(Data))
inputDaily.addEventListener('input', () => makeHighChart(Data))
inputMonth.addEventListener('input', () => makeHighChart(Data))


function indentifyName(name, mydata) {
  for (const key in mydata) {
    if (Object.hasOwnProperty.call(mydata, key)) {
      const element = mydata[key];
      if (name == element.name) {
        mydata[key].y++;
        return mydata;
      }
    }
  }
  let len = mydata.length;
  mydata[len] = {}
  mydata[len].name = name;
  mydata[len].y = 1;
  return mydata;
}
const makeArr = (n) => {
  let Arr = []
  for (let i = 0; i < n; i++) {
    Arr.push(i);
  }
  return Arr;
}

function makeHighChart(data) {
  let SymbolData = [];
  let Buy = [0, 0, 0, 0, 0, 0, 0];
  let Sell = [0, 0, 0, 0, 0, 0, 0,];
  let BuyHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let SellHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let monthData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  let hourValue = inputHour.value;
  let dailyValue = inputDaily.value;
  let monthValue = Number(inputMonth.value);
  let str = [];
  let str1 = [];
  let sum = 0;
  let Hours = makeArr(24);
  for (let key in data) {
    let item = data[key];
    SymbolData = indentifyName(item.Symbol, SymbolData);
    let dt = new Date(item["Open Date"]);
    let day = dt.getDay();

    if (dailyValue == "buy") {
      if (item.Action == "Buy") {
        Buy[day]++;
      } else if (item.Action == "Sell") {
        Sell[day]++;
      }
      str1[0] = 'Buy';
      str1[1] = 'Sell'
    } else {
      if (item.Profit >= 0) {
        Buy[day]++;
      } else {
        Sell[day]++;
      }
      str1[0] = 'Win';
      str1[1] = 'Loss';
    }

    if (dt.getFullYear() == monthValue) {
      monthData[dt.getMonth()] += item["Profit(%)"];
      sum += item["Profit(%)"];
    }




    if (hourValue == 'buy') {
      if (item.Action == "Buy") {
        SellHour[dt.getHours()]++;
      } else if (item.Action == "Sell") {
        BuyHour[dt.getHours()]++;
      }
      str[0] = 'Buy';
      str[1] = 'Sell';
    } else {
      if (item.Profit < 0) {
        SellHour[dt.getHours()]++;
      } else {
        BuyHour[dt.getHours()]++;
      }
      str[0] = 'Win';
      str[1] = 'Loss';
    }
  }
  for (const j in monthData) {
    if (Object.hasOwnProperty.call(monthData, j)) {
      const element = monthData[j];
      monthData[j] = parseFloat((element*100/sum).toFixed(3));
    }
  }
  let BuySellData = [{ name: str1[0], data: Buy }, { name: str1[1], data: Sell }]
  let BuySellDataHour = [{ name: str[0], data: BuyHour }, { name: str[1], data: SellHour }]
  makePieChart(SymbolData);
  console.log(monthData);
  makeMonthlyChart(monthData, monthValue)
  makeBuySell(BuySellData, DAYS, "days", str1);
  makeBuySell(BuySellDataHour, Hours, "hours", str);

}


function makeMonthlyChart(data, year) {
  Highcharts.chart('month', {
    title: {
      text: 'Monthly Profit(%) '
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Month/Year'
    }
    },
    yAxis: {
      labels: {
          format: '{text}%' // The $ is literally a dollar unit
      },
      title: {
          text: 'Percentage'
      }
  },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function () {
        let d = new Date(this.x);
        return '<b>' +MONTHS[d.getMonth()] +" "+ d.getFullYear()+
            '</b><br/> Percentage: <b>' + this.y + '%</b>';
    },
      backgroundColor: '#000'
    },
    series: [{
      name: 'Profit(%)',
      type: 'column',
      data: data,
      pointStart: Date.UTC(year, 0),
      pointInterval: 30 * 24 * 36e5,
      color: '#0088FF',
      negativeColor: '#FF0000'
    }]
  });
}

function makeBuySell(data, cat, place, str) {
  Highcharts.chart(place, {

    chart: {
      type: 'column'
    },

    title: {
      text: `${place} Wise Data Of ${str[0]} and ${str[1]}`
    },


    xAxis: {
      categories: cat,
    },

    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: `Number of ${str[0]}/${str[1]}`
      }
    },

    tooltip: {
      formatter: function () {
        return '<b>' + this.x + '</b><br/>' +
          this.series.name + ': ' + this.y + '<br/>' +
          'Total: ' + this.point.stackTotal;
      },
      headerFormat: '<b>{point.x}</b><br/>',
      backgroundColor: '#000'
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false
        }
      },
      series: {
        pointPadding: 0.001,
      }
    },
    legend: {
      itemHiddenStyle: {
        color: 'green',
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: data,
  });
}



function makePieChart(data) {
  Highcharts.chart('pie', {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Symbols'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        size: 240,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
      },
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        'Total: <b>{point.y} </b><br/>' +
        'Percentage: <b> {point.percentage:.1f} %</b><br/>',
      backgroundColor: '#000',
    },
    series: [{
      minPointSize: 10,
      innerSize: '40%',
      name: 'Symbol',
      data,
    }]
  });


}


Highcharts.theme = {
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
    '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    backgroundColor: "#000"
  },
  credits: {
    enabled: false
  },
  title: {
    style: {
      color: '#dcdcdc',
      font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
    }
  },
  subtitle: {
    style: {
      color: '#dcdcdc',
      font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
    }
  },
  legend: {
    itemStyle: {
      font: '9pt Trebuchet MS, Verdana, sans-serif',
      color: '#dcdcdc'
    },
    itemHoverStyle: {
      color: 'gray'
    }
  }
};
// Apply the theme
Highcharts.setOptions(Highcharts.theme);


$("#trading-stats-button").on("click", function(){
  $("#account-info-button").css("border", "0 gray solid");
  $("#table-2").addClass("hidden");
  $("#table-1").removeClass("hidden");
  $("#trading-stats-button").css("border", "2px gray solid");
})

$("#account-info-button").on("click", function(){
  $("#account-info-button").css("border", "2px gray solid");
  $("#trading-stats-button").css("border", "0 gray solid");
  $("#table-1").addClass("hidden");
  $("#table-2").removeClass("hidden");
})
