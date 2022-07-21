window.onload = function () {
  selectTechno();

  //On Load Animation
  AOS.init({
    duration: 1200,
  });
};

var externalCred = ""; //"&IllumLoginName=atos_mii&IllumLoginPassword=Pass01";
var ipAddress = ""; //"http://172.16.156.105:50000";
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
        listChart(pantV);
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

function listChart(data) {
  const team = data.value;
  $("#_team").text(team);

  chartList(team);
}

function chartList(teamName) {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterSelectKPI";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/triggerTarget.json";

  const params = {
    "Param.1": teamName,
  };

  var charts = [];

  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log("ajax-trigger", dataList);
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
            // item.LOWER.push(item.LOWER_LIMIT);
            // item.UPPER.push(item.UPPER_LIMIT);
            charts = [...charts, item];
          }
        });
        // console.log("ajax-charts", charts);
      }

      const API =
        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FNEW_KPI_LOGIC%2FTRANSACTIONS%2FXACUTE_MONTHLY_SELECT";
      const API_URL = ipAddress + API + contentType + externalCred;
      const Local_URL = "./JS/dummy_data/graphValue.json";

      const params = {
        "Param.1": teamName,
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
              let index = charts.findIndex((x) => x.GRAPH_ID === item.GRAPH_ID);
              if (index > -1) {
                // console.log('index',  charts[index].barColor)
                // charts[index].date.push(
                //   moment(item.DATE, "MM/DD/YYYY").format("DD MMM")
                // );
                charts[index].date.push(
                  monthsList(item.MONTH_VAL) + "," + item.YEAR_VAL
                );
                charts[index].value.push(item.VALUE);
                charts[index].LOWER_LIMIT
                  ? charts[index].LOWER.push(charts[index].LOWER_LIMIT)
                  : "";
                charts[index].UPPER_LIMIT
                  ? charts[index].UPPER.push(charts[index].UPPER_LIMIT)
                  : "";
                const colorCode =
                  item.VALUE > charts[index].LOWER_LIMIT
                    ? "#f12323d6"
                    : "rgb(34 169 92)";
                charts[index].barColor
                  ? charts[index].barColor.push(colorCode)
                  : "";
              } else {
                item.date = [];
                item.value = [];
                item.date.push(
                  monthsList(item.MONTH_VAL) + "," + item.YEAR_VAL
                );
                item.value.push(item.VALUE);
                charts = [...charts, item];
              }
            });
          }

          // console.log("ajax-charts", charts);
          if (charts && charts.length > 0) {
            $.each(charts, function (index, item) {
              if (index < 12) {
                const _list = {
                  title: item.KPI,
                  labels: item.date,
                  yAxes: item.UNITFORYAXIS,
                  dataSets: [
                    {
                      label: "Trigger-" + Math.round(item.LOWER_LIMIT),
                      type: "line",
                      data: item.LOWER,
                      borderColor: "#DA4121",
                      backgroundColor: "#DA4121",
                      borderWidth: 1,
                      lineTension: 0,
                      fill: false,
                      datalabels: {
                        display: false,
                      },
                    },
                    {
                      label: "Target-" + Math.round(item.UPPER_LIMIT),
                      type: "line",
                      data: item.UPPER,
                      borderColor: "#DA218E",
                      backgroundColor: "#DA218E",
                      borderWidth: 1,
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
                      // borderColor: item.barColor, //"#3498db",
                      backgroundColor: item.barColor, //"#3498db",
                      // borderWidth: 1,
                      lineTension: 0,
                      fill: false,
                    },
                  ],
                };
                if (chartInstances["myChart" + item.GRAPH_ID]) {
                  chartInstances["myChart" + item.GRAPH_ID].destroy();
                }
                chartInstances["myChart" + item.GRAPH_ID] = generateChart(
                  "myChart" + item.GRAPH_ID,
                  _list
                );
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

function monthsList(val) {
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[val - 1];
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

function generateChart(id, list) {
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
  // Chart.defaults.global.plugins.datalabels
  var chartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: list.labels,
      datasets: list.dataSets,
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          // opacity:0,
          // anchor: 'end',
          // align: 'top',
          backgroundColor: function (context) {
            // console.log('s', context)
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          color: "white",
          padding: 2,
          formatter: Math.round,
          font: {
            // weight: "bolder",
            size: 8,
          },
        },
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          // usePointStyle: true,          
          boxWidth: 8,
          // fontColor: "black",
          fontSize: 8,
          padding: 2,
        },
      },
      title: {
        display: true,
        text: list.title,
        fontSize: 8,
        padding: 2,
        // fontColor: "black",
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 8,
            },
          },
        ],
        yAxes: [
          {
            position: "left",
            ticks: {
              beginAtZero: true,
              stepSize: 80,
              fontSize: 8,
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
