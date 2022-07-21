window.onload = function () {
if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }}
const PROD_ENVIRONMENT = true;

let ProblemSolvingParams = {
  start: moment().startOf("year").format("YYYY-MM-DD") + "T00:00:00",
  end: moment().format("YYYY-MM-DD") + "T00:00:00",
  team: "",
};

let MonthlyTeamPerformance = {
  start: moment().startOf("year").format("YYYY-MM-DD") + "T00:00:00",
  end: moment().format("YYYY-MM-DD") + "T00:00:00",
  teams: [],
};

$(document).ready(function () {
  AOS.init({
    duration: 1200,
  });
  //$("select").formSelect();
  let analysisType = document.getElementById("analysisType").value || "MDT";
  //getCapaSubmittedMTDData(analysisType);
  //getCAPACountData(analysisType);
  getTeamList(analysisType);

  $('input[name="daterange"]').daterangepicker(
    {
      opens: "center",
      placeholder: "Select Date",
      startDate: moment().startOf("year"),
      endDate: moment(),
    },
    function (start, end, label) {
      ProblemSolvingParams.start = start.format("YYYY-MM-DD") + "T00:00:00";
      ProblemSolvingParams.end = end.format("YYYY-MM-DD") + "T00:00:00";

      //getTeamProblemSolvingData($("#analysisType").val());
    }
  );

  $('input[name="dateFilterMTP"]').daterangepicker(
    {
      opens: "center",
      placeholder: "Select Date",
      startDate: moment(),
      endDate: moment(),
    },
    function (start, end, label) {
      MonthlyTeamPerformance.start = start.format("YYYY-MM-DD") + "T00:00:00";
      MonthlyTeamPerformance.end = end.format("YYYY-MM-DD") + "T00:00:00";

      //getTeamKPIValues();
    }
  );

  //$("#teamSelectionMTP").multiSelect();
});

/**
 * API ENDPOINT CONFIGURATIONS
 */
const API_BASE = "/XMII/Illuminator?QueryTemplate=";

var externalCred = "&IllumLoginName=ap_cmn_srip&IllumLoginPassword=Pass12345";
var contentType = "&IsTesting=T&Content-Type=text%2Fjson";
let URL_SUFFIX = contentType + externalCred;

let API_ENDPOINTS = {
  GET_TEAM_LIST: "./JS/data/TEAMNAME_DROPDOWN.json",
  GET_CAPA_COUNT: "./JS/data/CAPA_COUNTS.json",
  GET_CAPA_SUBMISSION_STATUS_MTD: "./JS/data/CAPA_SUBMITTED_STATUS_MTD.json",
  GET_TRIGGER_HIT_CASES: "./JS/data/TEAMNAME_KPI_VALUE.json",
  GET_TEAM_KPIS: "./JS/data/TEAMNAME_DROPDOWN.json",
};

if (PROD_ENVIRONMENT) {
  API_ENDPOINTS = {
    GET_TEAM_LIST:
      API_BASE + "AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterTeam" + URL_SUFFIX,
    GET_CAPA_COUNT: API_BASE + "SBT_MDT%2FXact%2FXACT_CAPA_COUNTS" + URL_SUFFIX,
    GET_CAPA_SUBMISSION_STATUS_MTD:
      API_BASE + "SBT_MDT%2FXact%2FXACT_SUBMITED_STATUS" + URL_SUFFIX,
    GET_TRIGGER_HIT_CASES:
      API_BASE + "SBT_MDT%2FXact%2FXACT_GET_TRIGGER_HIT_COUNTS" + URL_SUFFIX,
    GET_TEAM_KPIS:
      API_BASE + "SBT_MDT%2FXact%2FXACT_TEAM_KPI_VALUE" + URL_SUFFIX,
  };
}
const MONTHS = [
  "January",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function ajaxCall(url, params, callback) {
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    data: { ...params },
    success: callback,
  });
}

const _asyncGet = (url, params) => {
  return $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    data: { ...params },
  });
};

function onchangeoftriggerchart() {
Chart.helpers.each(Chart.instances, function (instance) {
    if (instance.chart.canvas.id === "CANVAS_TEAM_PROBLEM_SOLVING") {
      instance.destroy();
      return;
    }
  });
getTeamProblemSolvingData($("#teamSelection").val());
}

/**
 * Parse data from the response returned by API
 *
 * @param {*} response
 */
function parseResponseData(response) {
  if (
    response &&
    response.Rowsets &&
    response.Rowsets.Rowset &&
    response.Rowsets.Rowset[0] &&
    response.Rowsets.Rowset[0].Row
  ) {
    return response.Rowsets.Rowset[0].Row;
  }

  return null;
}

function setValue(elementId, data, asValue = false) {
  if (asValue) {
    document.getElementById(elementId).value = data;
  } else {
    document.getElementById(elementId).innerText = data;
  }
}

/**
 * Callback for analysis change "SBT" or "MDT"
 */
function changeAnalysisType(data) {
  var x = document.getElementById("analysisType");
  Chart.helpers.each(Chart.instances, function (instance) {
    instance.destroy();
  });
  x.innerHTML = data.toUpperCase();
  //getCAPACountData(data);
  ///getCapaSubmittedMTDData(data);
  getTeamList(data);
}

function onChangeTeam(value) {
  console.log("Selected Team", value);
  //ProblemSolvingParams.team = value;
  let analysisType = $("#analysisType").val();
  Chart.helpers.each(Chart.instances, function (instance) {
    instance.destroy();
  });
  getCAPACountData(analysisType, value);
  getCapaSubmittedMTDData(analysisType, value);
  getTeamProblemSolvingData(value);
}

function getTeamList(analysisType) {
  const params = {};

  ajaxCall(API_ENDPOINTS.GET_TEAM_LIST, params, function (response) {
    let responseData = parseResponseData(response);
    if (responseData.length > 0) {
      console.log("TEAM LIIST DATA");
      console.log(responseData);
      $("#teamSelection").empty();
      $("#KPITeamsGroupSelection").empty();
      $("<option/>").val("ALL").text("ALL").appendTo("#teamSelection");

      $("<option/>").val("ALL").text("ALL").appendTo("#KPITeamsGroupSelection");

      responseData.map((option) => {
        const teamtype = option.TEAM_NAME.split("-");
        const type = teamtype[0].replace(/\s/g, "");
        if (type == analysisType) {
          $("<option/>")
            .val(option.TEAM_NAME)
            .text(option.TEAM_NAME)
            .appendTo("#teamSelection");
        }
        $("<option/>")
          .val(option.TEAM_NAME)
          .text(option.TEAM_NAME)
          .appendTo("#KPITeamsGroupSelection");
        setTimeout(() => {
          $("#KPITeamsGroupSelection").multiSelect({
            noneText: "Select Team",
            menuMinHeight: 90,
          });
        }, 200);
      });

      onChangeTeam("ALL");
      /* $('<option/>')
  .val(optionVal)
  .text('some option')
  .appendTo('#mySelect') */
    }
  });
}

/**
 * CHART 3 - No. of Problem Solvings taken vs % trigger hits by individual team
 */

function getCAPACountData(analysisType, team) {
  //Need API call to fetch data to load graph
  const params = {
    "PARAM.1": analysisType,
    "PARAM.2": team,
  };

  ajaxCall(API_ENDPOINTS.GET_CAPA_COUNT, params, function (response) {
    let responseData = parseResponseData(response);
    if (responseData.length > 0) {
      setValue("stat-total-capa", responseData[0].Total_CAPA);
      setValue("stat-completed", responseData[0].COMPLETED);
      setValue("stat-pending", responseData[0].PENDING);
    }
    _Chart_CAPAStatusYTD([
      responseData[0].Within_Target,
      responseData[0].Beyond_Target,
    ]);
  });
}

function _Chart_CAPAStatusYTD(data) {
  var ctx = document.getElementById("CANVAS_CAPA_COMPLETION_YTD");
  let dataSet = {
    datasets: [
      {
        data,
        backgroundColor: ["#ffac32", "#F44336"],
      },
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ["Within Target", "Beyond Target"],
  };
  if (countdonet) {
    countdonet.destroy();
  }
  var countdonet = new Chart(ctx, {
    type: "doughnut",
    data: dataSet,
    plugins: [ChartDataLabels],
    options: {
      cutoutPercentage: 60,
      legend: {
        display: true,
        position: "bottom",
      },
      plugins: {
        datalabels: {
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          color: "white",
          font: {
            weight: "bolder",
            size: 13,
          },
          formatter: Math.round,
          padding: 2,
        },
      },
    },
  });
}

function getCapaSubmittedMTDData(analysisType, team) {
  const params = {
    "PARAM.1": analysisType,
    "PARAM.2": team,
  };

  ajaxCall(
    API_ENDPOINTS.GET_CAPA_SUBMISSION_STATUS_MTD,
    params,
    function (response) {
      let responseData = parseResponseData(response);
      if (responseData.length > 0) {
        const data = {
          label: responseData.map((data) => MONTHS[data.MONTH] || "N/A"),
          total: responseData.map((data) => data.Total),
          withinTarget: responseData.map((data) => data.Within_Target),
          beyondTarget: responseData.map((data) => data.Beyond_Target),
        };
        _Chart_CAPASubmitedStatusMTD(data);
      }
      /* _Chart_CAPAStatusYTD([
          responseData[0].Within_Target,
          responseData[0].Beyond_Target,
        ]); */
    }
  );
}

function _Chart_CAPASubmitedStatusMTD(chartData) {
  let data = {
    labels: chartData.label,
    datasets: [
      {
        label: "Total CAPA",
        backgroundColor: "#ffac32",
        data: chartData.total,
      },
      {
        label: "Within Target",
        backgroundColor: "#4CAF50",
        data: chartData.withinTarget,
      },
      {
        label: "Beyond Target",
        backgroundColor: "#F44336",
        data: chartData.beyondTarget,
      },
    ],
  };
  var capacomplettion = new Chart(
    document.getElementById("CANVAS_CAPA_COMPLETION_MTD"),
    {
      type: "bar",
      data,
      options: {
        legend: {
          display: true,
          position: "bottom",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
        plugins: {
          datalabels: {
            backgroundColor: function (context) {
              return context.dataset.backgroundColor;
            },
            borderRadius: 4,
            color: "white",
            font: {
              weight: "bolder",
              size: 13,
            },
            formatter: Math.round,
            padding: 2,
          },
        },
      },
    }
  );
}

const getTeamProblemSolvingData = (team) => {
  const { start, end } = ProblemSolvingParams;
  if (!start || !end || !team) {
    return false;
  }

  const params = {
    "PARAM.1": start,
    "PARAM.2": end,
    "PARAM.3": team,
  };

  ajaxCall(API_ENDPOINTS.GET_TRIGGER_HIT_CASES, params, function (response) {
    console.log("*******API RESPONSE FOR CAPA SUBMISSION STATUS******");
    console.log(response);
    let responseData = parseResponseData(response);
    if (responseData.length > 0) {
      $("#chartbg").hide();
      //Need API call to fetch data to load graph
      // _Chart_TeamProblemSolvingVsTriggerHits();

      const data = {
        labels: responseData.map((data) => data.KPI.split("-")[0]),
        problemSolvingTaken: responseData.map((data) => data.Problem_Solving_Taken),
        notconsidered: responseData.map((data) => data.Problem_Solving_NTaken),
        triggerHits: responseData.map((data) => data.Trigger_Hit_Cases),
      };
      Chart.helpers.each(Chart.instances, function (instance) {
        if (instance.chart.canvas.id === "CANVAS_TEAM_PROBLEM_SOLVING") {
          instance.destroy();
          return;
        }
      });
      _Chart_TeamProblemSolvingVsTriggerHits(data);
      console.log(responseData);
    }
  });
  //_Chart_TeamProblemSolvingVsTriggerHits();
};

function _Chart_TeamProblemSolvingVsTriggerHits({
  labels,
  problemSolvingTaken,
notconsidered,
  triggerHits,
}) {
  var data = {
    labels,
    datasets: [
{
        label: "Total Trigger Hit Cases",
        backgroundColor: "#3E4651",
        data: triggerHits,
      },
      {
        label: "Considered",
        backgroundColor: "#00B5B5",
        data: problemSolvingTaken,
      },
 {
        label: "Not Considered",
        backgroundColor: "#FC6042",
        data: notconsidered,
      }
    ],
  };

  new Chart(document.getElementById("CANVAS_TEAM_PROBLEM_SOLVING"), {
    type: "bar",
    data,
    options: {
      legend: {
        display: true,
        position: "bottom",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          color: "white",
          font: {
            weight: "bolder",
            size: 13,
          },
          formatter: Math.round,
          padding: 2,
        },
      },
    },
  });
}

/**
 * Section - Adding KPI value to the graph
 */
const genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
const chartBG = Array(20)
  .fill("#3ae374")
  .map((v) => genRanHex(6));
let chartData = { labels: [], datasets: [] };

function onAddKPIToChart(value) {
  console.log("Selected Team", value);
  //getTeamKPIValues(value);

  console.log($(".team-kpis"));
  console.log($(".team-kpis").val());
  //$(".team-kpis").map((d) => console.log(d.val()));
  console.log(document.getElementsByClassName("team-kpis")[0].value);
  //document.getElementsByClassName("team-kpis").map((d) => console.log(d.value));

  /* const data = {
    label: responseData.map((data) => MONTHS[data.MONTH] || "N/A"),
    total: responseData.map((data) => data.Total),
    withinTarget: responseData.map((data) => data.Within_Target),
    beyondTarget: responseData.map((data) => data.Beyond_Target),
  }; */
  //{team: "", "KPI":"CREDIBLE-INPROCESS CHECK FOR BATCH-Min-(Shift)","Trigger_Hit_Cases":4,"Problem_Solving_Taken":0}

  /*
{
        label: "Team A",
        backgroundColor: "#4472C4",
        data: [3, 7, 4, 5, 6, 2, 4, 5, 6],
      },
      {
        label: "Team B",
        backgroundColor: "#ED7D31",
        data: [4, 3, 5, 2, 5, 6, 4, 3, 5],
      },
      {
        label: "Team C",
        backgroundColor: "#565454",
        data: [3, 7, 4, 5, 6, 2, 4, 5, 6],
      }
*/
  var colors = [
    "#c56cf0",
    "#ff3838",
    "#ff9f1a",
    "#17c0eb",
    "#3ae374",
    "#7158e2",
    "#ffcccc",
    "#cd84f1",
    "#ff4d4d",
    "#ffaf40",
    "#fffa65",
    "#3d3d3d",
    "#c56cf0",
    "#ff3838",
    "#ff9f1a",
    "#17c0eb",
    "#3ae374",
  ];
  Array.prototype.slice
    .call(document.getElementsByClassName("team-kpis"))
    .map((d) => JSON.parse(d.value))
    .map((d, idx) => {
      console.log(d);
      const kpiraw = d.KPI.split("-");
      idx === 0 && chartData.labels.push(kpiraw[0]);
      chartData.datasets[idx].data.push(d.Value);
      chartData.datasets[idx].backgroundColor.push(colors[idx]);
    });
  _Chart_TeamMonthlyKPIPerformance(chartData);

  console.log("CHART DATATATATATATAT");
  console.log(chartData);
}

let TeamsData = {};
let selectedTeams = [];

const onSelectKPITeamGroups = (data) => {
  var checked = document.querySelectorAll("#KPITeamsGroupSelection :checked");
  selectedTeams = [...checked].map((option) => option.value);
  console.log(selectedTeams);
  document.getElementById("selectedTeamsKPI").innerHTML = "";
  chartData.datasets = [];
  chartData.label = [];
  selectedTeams.map(async (team, idx) => {
    await renderTeamKPI(team);
    chartData.datasets.push({
      label: team,
      backgroundColor: [],
      data: [],
    });
  });
};

const renderTeamKPI = async (team) => {
  console.log(team);
  if (!TeamsData[team]) {
    const params = {
      "Param.1": team,
    };
    try {
      const response = await _asyncGet(API_ENDPOINTS.GET_TEAM_KPIS, params);
      let responseData = parseResponseData(response);
      TeamsData[team] = responseData;
    } catch (e) {
      console.log(e);
    }
  }

  $("#selectedTeamsKPI").append(
    `<div class="col s6 pb-2">
    <label for="team1" style="display: block"
      >${team}</label
    ><select
    id="team1"
    class="form-control plant dropdown team-kpis"
    style="width: auto; height: 33px"
    value=""
  >` +
      TeamsData[team].map((d) => `
    <option value='${JSON.stringify(d)}'>${d.KPI}</option>
  `
        )
        .join("") +
      `</select></div>`
  );
};

function getTeamKPIValues(analysis) {
  //Need API call to fetch data to load graph
  _Chart_TeamMonthlyKPIPerformance();
}

function _Chart_TeamMonthlyKPIPerformance(chartData) {
  /* var data = {
    labels: [
      "HARP Submitted",
      "Daily Production",
      "5S Score",
      "Haz waste (kg/kl)",
      "R&R",
      "Test KPI",
      "Test KPI 2",
      "Test KPI 3",
      "Test KPI 4",
    ],
    datasets: [
      {
        label: "Team A",
        backgroundColor: "#4472C4",
        data: [3, 7, 4, 5, 6, 2, 4, 5, 6],
      },
      {
        label: "Team B",
        backgroundColor: "#ED7D31",
        data: [4, 3, 5, 2, 5, 6, 4, 3, 5],
      },
      {
        label: "Team C",
        backgroundColor: "#565454",
        data: [3, 7, 4, 5, 6, 2, 4, 5, 6],
      },
    ],
  }; */
  $("#performancebg").hide();
  Chart.helpers.each(Chart.instances, function (instance) {
    if (instance.chart.canvas.id === "CANVAS_MONTHLY_KPI_PERFORMANCE") {
      instance.destroy();
      return;
    }
  });
  new Chart(document.getElementById("CANVAS_MONTHLY_KPI_PERFORMANCE"), {
    type: "bar",
    data: chartData,
    options: {
      legend: {
        display: true,
        position: "right",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          color: "white",
          font: {
            weight: "bolder",
            size: 13,
          },
          //formatter: Math.round,
          padding: 2,
        },
      },
    },
  });
}