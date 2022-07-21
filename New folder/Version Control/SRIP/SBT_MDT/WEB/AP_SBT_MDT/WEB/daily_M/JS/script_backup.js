Chart.pluginService.register({
  beforeDraw: function (chart, easing) {
      var helpers = Chart.helpers;
      var ctx = chart.chart.ctx;
      var chartArea = chart.chartArea;
      if (chart.config.options.canvas) {
          if (chart.config.options.canvas.backgroundColor) {
              ctx.save();
              ctx.fillStyle = chart.config.options.canvas.backgroundColor;
              ctx.fillRect(0, 0, chart.chart.width, chart.chart.height);
              ctx.restore();
          }
          if (chart.config.options.canvas.backgroundImage) {
              ctx.save();
              var image = new Image();
              image.src = '/XMII/CM/AP_SBT_MDT/V3/CMN/charter1.png';
              ctx.drawImage(image, 0, 0);
              ctx.restore();
          }
      }
      if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
          ctx.save();
          ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
          ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
          ctx.restore();
      }
  }
});
window.onload = function () {
  var today = new Date();
  var endDate = new Date(today.getFullYear(), today.getMonth(), 1);
  //endDate.setDate(endDate.getDay() - 30);
  $('input[name="_daterange"]').daterangepicker(
    {
      // singleDatePicker: true,
      autoApply: true,
maxSpan: {
          days: 31
      },
      showDropdowns: true,
      minYear: 1901,
      maxYear: parseInt(moment().format("YYYY"), 10),
      startDate: endDate,
      endDate: today,
      maxDate: new Date(),
      locale: {
        format: "MM/DD/YYYY",
      },
    },
    function (start, end, label) {
      // console.log(
      //   "A new date selection was made: " + start.format("YYYY-MM-DD")
      // );
    }
  );

  selectTechno();

  //On Load Animation
  AOS.init({
    duration: 1200,
  });
};

var externalCred = "&IllumLoginName=atos_mii&IllumLoginPassword=Pass01";//";
var ipAddress = "";//"http://172.16.156.105:50000";
var contentType = "&IsTesting=T&Content-Type=text%2Fjson";


function selectTechno() {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterTeam";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/team.json";

  const params = {};
  ajaxCall(
    API_URL,
    params,
    function (result) {
      // $("#_TECHNOCRATS").empty();
      $("#_TECHNOCRATS").append(
        "<option value='' disabled>Select Team</option>"
      );
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log("ajax-response", dataList);
      var htm = "";
      if (dataList && dataList.length > 0) {
        $.each(dataList, function (i, item) {
          htm +=
            "<option value='" +
            item.TEAM_NAME +
            "'>" +
            item.TEAM_NAME +
            "</option>";
        });
        $("#_TECHNOCRATS").append(htm);
        const pantV = {
          value: dataList[0].TEAM_NAME,
        };
        listChart();
      } else {
        // console.log("no data");

        $("#plant").append(
          "<option value='' selected disabled>Select Plant</option> <option value='' disabled>No Data</option>"
        );
      }
    },
    function (err) {
      console.log("err", err);
      $("#plant").append(
        "<option value='' selected disabled>Select Plant</option> <option value='' disabled>No Data</option>"
      );
    }
  );
}

function listChart() {
  const team = $("#_TECHNOCRATS").val();
  $("#_team").text(team);
  const date = $("#_daterange").val();
  dates = date.split("-");
  const from =
    moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
  const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
  // console.log("team", team, from, to);

  chartList(from, to, team);
}

function chartList(from, to, teamName) {
  const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FTRIGGER_LOGIC%2FGET_OPERATIONS%2FQRY%2FSELECT_DAILY_STEP_TT";
//"/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FXACT_TRIGGER_STEP";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/triggerTarget.json";

  const params = {
    "Param.1": teamName,
    "Param.2": from,
    "Param.3": to,
  };

  var charts = [];

  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
       console.log("ajax-trigger", dataList);
      if (dataList && dataList.length > 0) {
        $.each(dataList, function (i, item) {
          let index = charts.findIndex((x) => x.GRAPH_ID === item.GRAPH_ID);
          if (index > -1) {
            // charts[index].LOWER.push(item.LOWER_LIMIT);
            // charts[index].UPPER.push(item.UPPER_LIMIT);
          } else {
            item.LOWER = [];
            item.UPPER = [];
            item.date = [];
            item.value = [];
            item.barColor = [];
            item.borderColor = [];
            var i;
            for(i=0; i<7;i++){
              item.LOWER.push(item.LOWER_LIMIT_W1);
            }
            for(i=0; i<7;i++){
              item.LOWER.push(item.LOWER_LIMIT_W2);
            }
            for(i=0; i<7;i++){
              item.LOWER.push(item.LOWER_LIMIT_W3);
            }
            for(i=0; i<7;i++){
              item.LOWER.push(item.LOWER_LIMIT_W4);
            }
            for(i=0; i<7;i++){
              item.UPPER.push(item.UPPER_LIMIT_W1);
            }
            for(i=0; i<7;i++){
              item.UPPER.push(item.UPPER_LIMIT_W2);
            }
            for(i=0; i<7;i++){
              item.UPPER.push(item.UPPER_LIMIT_W3);
            }
            for(i=0; i<7;i++){
              item.UPPER.push(item.UPPER_LIMIT_W4);
            }
            item.LOWER_LEGEND = item.LOWER;
            item.UPPER_LEGEND = item.UPPER;
            item.LOWER_LEGEND = item.LOWER_LEGEND.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
            })
            item.UPPER_LEGEND = item.UPPER_LEGEND.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
            })
            charts = [...charts, item];
          }
        });
        console.log("ajax-charts", charts);
      }

      const API =
        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2Fexdummyselect";
      const API_URL = ipAddress + API + contentType + externalCred;
      const Local_URL = "./JS/dummy_data/graphValue.json";

      const params = {
        "Param.1": from,
        "Param.2": to,
        "Param.3": teamName,
      };
      ajaxCall(
        API_URL,
        params,
        function (result) {
          const dataList = result.Rowsets.Rowset
            ? result.Rowsets.Rowset[0].Row
            : [];
          // console.log("ajax-graphValue", charts);

          if (dataList && dataList.length > 0) {
            $.each(dataList, function (i, item) {
              // if (chartInstances["myChart" + item.GRAPH_ID]) {
              //   chartInstances["myChart" + item.GRAPH_ID].destroy();
              // }
              let index = charts.findIndex((x) => x.GRAPH_ID === item.GRAPH_ID);
              if (index > -1) {
                // console.log('index',  charts[index].barColor)
                charts[index].date.push(
                  moment(item.DATE, "MM/DD/YYYY").format("DD MMM")
                );
                charts[index].value.push(parseFloat(item.VALUE));
                parseFloat(charts[index].LOWER_LIMIT_W4)
                  ? charts[index].LOWER.push(parseFloat(charts[index].LOWER_LIMIT_W4))
                  : "";
                parseFloat(charts[index].UPPER_LIMIT_W4)
                  ? charts[index].UPPER.push(parseFloat(charts[index].UPPER_LIMIT_W4))
                  : "";
                //console.log(charts);
                if (parseFloat(charts[index].LOWER_LIMIT_W4) > parseFloat(charts[index].UPPER_LIMIT_W4)){
                  const colorCode =
                  parseFloat(item.VALUE) <= parseFloat(charts[index].UPPER_LIMIT_W4)
                    ? "rgb(33, 140, 116,0.2)"
                    : (parseFloat(item.VALUE) < parseFloat(charts[index].LOWER_LIMIT_W4) && parseFloat(item.VALUE) >= parseFloat(charts[index].UPPER_LIMIT_W4) ? "rgb(255, 177, 66, 0.2)" : "rgb(179, 57, 57, 0.2)");
                  charts[index].barColor
                    ? charts[index].barColor.push(colorCode)
                    : "";
                    const borderCode =
                    parseFloat(item.VALUE) <= parseFloat(charts[index].UPPER_LIMIT_W4)
                      ? "rgb(33, 140, 116,1)"
                      : (parseFloat(item.VALUE) < parseFloat(charts[index].LOWER_LIMIT_W4) && parseFloat(item.VALUE) >= parseFloat(charts[index].UPPER_LIMIT_W4) ? "rgb(255, 177, 66, 1)" : "rgb(179, 57, 57, 1)");
                    charts[index].barColor
                      ? charts[index].borderColor.push(borderCode)
                      : "";
                } else {
                  const colorCode =
                  parseFloat(item.VALUE) <= parseFloat(charts[index].LOWER_LIMIT_W4)
                    ? "rgb(179, 57, 57, 0.2)"
                    : (parseFloat(item.VALUE) < parseFloat(charts[index].UPPER_LIMIT_W4) && parseFloat(item.VALUE) >= parseFloat(charts[index].LOWER_LIMIT_W4) ? "rgb(255, 177, 66, 0.2)" : "rgb(33, 140, 116,0.2)");
                  charts[index].barColor
                    ? charts[index].barColor.push(colorCode)
                    : "";
                  const borderCode =
                  parseFloat(item.VALUE) <= parseFloat(charts[index].LOWER_LIMIT_W4)
                      ? "rgb(179, 57, 57, 1)"
                      : (parseFloat(item.VALUE) < parseFloat(charts[index].UPPER_LIMIT_W4) && parseFloat(item.VALUE) >= parseFloat(charts[index].LOWER_LIMIT_W4) ? "rgb(255, 177, 66, 1)" : "rgb(33, 140, 116,1)");
                    charts[index].barColor
                      ? charts[index].borderColor.push(borderCode)
                      : "";
                }
                
                
              } else {
                item.date = [];
                item.value = [];
                charts = [...charts, item];
              }
            });
          }

          //console.log("ajax-charts", charts);
          if (charts && charts.length > 0) {
            

            

            $.each(charts, function (index, item) {
              if (index < 12) {
                const _list = {
                  title: item.KPI,
                  labels: item.date,
                  yAxes: item.UNITFORYAXIS,
                  dataSets: [
                    {
                      label: "Trigger-" + item.LOWER_LEGEND,
                      type: "line",
                      data: item.LOWER,
                      borderColor: "#ff3838",
                      backgroundColor: "#ff3838",
                      borderWidth: 0.5,
                      steppedLine: true,
                      lineTension: 0,
                      fill: false,
                      datalabels: {
                        display: false,
                      },
                    },
                    {
                      label: "Target-" + item.UPPER_LEGEND,
                      type: "line",
                      data: item.UPPER,
                      borderColor: "#7d5fff",
                      backgroundColor: "#7d5fff",
                      borderWidth: 0.5,
                      steppedLine: true,
                      lineTension: 0,
                      fill: false,
                      datalabels: {
                        display: false,
                      },
                    },
                    {
                      label: "Bar",
                      type: "bar",
                      data: item.value,
                      borderColor: item.borderColor, //"#3498db",
                      backgroundColor: item.barColor, //"#3498db",
                      borderWidth: 1,
                      lineTension: 0,
                      fill: false,
                    },
                  ],
                };
                if (chartInstances["myChart" + item.GRAPH_ID]) {
                  chartInstances["myChart" + item.GRAPH_ID].destroy();
                }
                chartInstances["myChart" + item.GRAPH_ID]= generateChart("myChart" + item.GRAPH_ID, item.IS_CHARTER_KPI, _list);
              }
            });
          }
        },
        function (err) {
          console.log("err", err);
        }
      );
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function getColorName(index) {
  const bgColor = [
    "#DA218E",
    "#DA4121",
    "#61DA21",
    "#CCDA21",
    "#21DAB3",
    "#215FDA",
    "#8321DA",
    "#66621E",
    "#D6D46D",
    "#82C4F9",
  ];
  const col = index % 10;
  return bgColor[col];
}

let chartInstances = {};

function generateChart(id, charter, list) {
  // var grapView = [];
  // $.each(list.dataSets, function (index, value) {
  //   grapView.push({
  //     type: value.type,
  //     label: value.label,
  //     data: value.data,
  //     lineTension: 0,
  //     fill: false,
  //     borderColor: getColorName(index),
  //     backgroundColor: getColorName(index),
  //     borderWidth: 1,
  //   });
  // });
  var canvas = document.getElementById(id);
  Chart.defaults.global.defaultFontStyle = "bold";
  var chartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: list.labels,
      datasets: list.dataSets,
    },
    options: {
      canvas: { //url('/XMII/CM/AP_SBT_MDT/V3/CMN/charter.png')
        backgroundImage: (charter == 'true') ? "url('/XMII/CM/AP_SBT_MDT/V3/CMN/charter1.png')" : ""
      },
      plugins: {
        datalabels: {
          // anchor: 'end',
          // align: 'top',
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          color: "#0d0d0d",
          padding: 2,
          // formatter: Math.round,
          font: {
            // weight: "bolder",
            size: 10,
          },
        },
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 8,
          // fontColor: "black",
          fontSize: 10,
          padding: 2,
        },
      },
      title: {
        display: true,
        text: list.title,
        fontSize: 12,
        padding: 2,
        // fontColor: "black",
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            },
          },
        ],
        yAxes: [
          {
            position: "left",
            ticks: {
              beginAtZero: true,
              //stepSize: 80,
              fontSize: 10,
            },
            scaleLabel: {
              display: true,
              labelString: list.yAxes,
            },
          },
        ],
      },
      responsive: true,
    },
  });
  return chartInstance;
}

function viewList(id) {
  // console.log('sdf')
  // const no = id;
  $("#_myChart" + id).toggleClass("active");
}

function slideChange(id) {
  // console.log('sdf', id)
  document.querySelectorAll("._type").forEach(function (element, index) {
    element.classList.remove("active");
  });
  $("#_myChart" + id).addClass("active");
}

function ajaxCall(url, params, callback, error) {
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    data: { ...params },
    success: callback,
    error: error,
  });
}