window.onload = function () {
  $(".modal").modal();

  var today = new Date();
  var endDate = new Date();
  endDate.setDate(endDate.getDate() - 7);
  $('input[name="_daterange"]').daterangepicker(
    {
      // singleDatePicker: true,
      autoApply: true,
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

var externalCred = "&IllumLoginName=ap_cmn_srip&IllumLoginPassword=Pass12345";
var ipAddress = "";
var contentType = "&IsTesting=T&Content-Type=text%2Fjson";

function bannerimage(team) {
const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FXACT_SELECT_ALLBANNERS";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/imgSelect.json";

  const params = {
	'Param.1': team
   };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log('img',dataList)
      document.getElementById("teambannertitle").style.display = "none";
      document.getElementById("_uploadImg").style.display = "none";
      if (dataList && dataList.length > 0) {
        document.getElementById("_uploadImg").style.display = "block";
        document.getElementById("_uploadImg").src = "data:image/png;base64,"+dataList[0].BASE64;
        document.getElementById("teambannertitle").style.display = "none";
      } else {
        document.getElementById("teambannertitle").style.display = "block";
         $("teambannertitle").text(team);
        // console.log("no data");
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function starimage(team) {
  const API =
      "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FXACT_GET_STAROFTHEDAY";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/imgSelect.json";
  
    const params = {
    'Param.1': team
     };
    // console.log('k-', API_URL)
    ajaxCall(
      API_URL,
      params,
      function (result) {
        const dataList = result.Rowsets.Rowset
          ? result.Rowsets.Rowset[0].Row
          : [];
        // console.log('img',dataList)
        if (dataList && dataList.length > 0) {
          document.getElementById("_staroftheday").src = "data:image/png;base64,"+dataList[0].BASE64;
        } else {
          document.getElementById("_staroftheday").src = "/XMII/CM/AP_SBT_MDT/main_dashboard/image/placeholder_starofday.png";
          // console.log("no data");
        }
      },
      function (err) {
        console.log("err", err);
      }
    );
  }
  function escalationmodal() {
    $("#escalationmodal").modal("open");
  }
function actiononescalation(data) {
alert('Development on Progress');
}
  function escalationcheck(team) {
        document.getElementById("escalationbell").style.display = "none";
    const split = team.split("-");
    if(split[0] == 'MDT ') {
      const API =
      "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FXact%2FXACT_GET_ESCALATIONS";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/imgSelect.json";
  
    const params = {
    'Param.1': team
     };
    // console.log('k-', API_URL)
    ajaxCall(
      API_URL,
      params,
      function (result) {
        const dataList = result.Rowsets.Rowset
          ? result.Rowsets.Rowset[0].Row
          : [];
        document.getElementById("escalationbell").style.display = "none";
        if (dataList && dataList.length > 0) {
          $('#escalationcount').text(dataList.length);
          $("#escalationbell").css("display", "block");      
          var htm = "";
          $.each(dataList, function (i, item) {
            htm +=
              "<tr><td>" +
              item.TEAM_NAME +
              "</td><td colspan='4'>" +
              item.ESCALATION +
              "</td><td>" +
              item.ESCALATION_DATE +
              "</td>" +
              //"<td class='Action' onclick='actiononescalation(" +
              //JSON.stringify(item) +
              //")'>" +
              //"Action" +
              //"</td>"+
"</tr>";
            });
            $("#_escalation tbody").html(htm);
          
        } else {
          document.getElementById("escalationbell").style.display = "none";
        }
      },
      function (err) {
        console.log("err", err);
      }
    ); 
    }
  }
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
            item.SHIFT +
            "~" +
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
  const split = $("#_TECHNOCRATS").val().split("~");
  const shift = split[0];
  const team = split[1];
  Chart.helpers.each(Chart.instances, function (instance) {
    instance.destroy();
  });
  const date = $("#_daterange").val();
  dates = date.split("-");
  const from =
    moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
  const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
  // console.log("team", team, from, to);
  allMember(from, to, team);
  bannerimage(team);
  starimage(team);
  escalationcheck(team);
  particularMember(from, to, team);
  executeData(team, shift);
  checkStatus(team, shift);
  // memberWho(team);  
}

function allMember(from, to, team) {
  const API = "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransaction%2FXACT_ATTENDANCE_NEWLOGIC";
   // "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT/Query/XctAttendanceAll";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/allMember.json";

  const params = {
    "Param.1": team,
    "Param.2": from,
    "Param.3": to,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log('all', dataList)
      if (dataList && dataList.length > 0) {
        let label = [];
        let data = [];
        let barcolor = [];
        $.each(dataList, function (i, item) {
          const date = moment(item.Date, "MM/DD/YYYY").format("DD-MMM");
          label = [...label, date];
          data = [...data, item.percentage];
          barcolor = [...barcolor, item.percentage > 75
                    ? "#26de81"
                    : "#fc5c65"];
        });
        if (chartInstance["myChart1"]) {
          chartInstance["myChart1"].destroy();
        }
        chartInstance["myChart1"] = generateChart(
          "myChart1",
          "Overall Team %",
          label,
          data,
          barcolor
        );
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function particularMember(from, to, team) {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQuery%2FExecuteAttenPercentage";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/Member.json";

  const params = {
    "Param.1": from,
    "Param.2": to,
    "Param.3": team,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log('particularMember', dataList)
      if (dataList && dataList.length > 0) {
        let label = [];
        let data = [];
        let barcolor = [];
        $.each(dataList, function (i, item) {
          label = [...label, item.Name];
          data = [...data, item.percent];
          barcolor = [...barcolor, item.percent > 75
                    ? "#26de81"
                    : "#fc5c65"];
        });
        if (chartInstance["myChart2"]) {
          chartInstance["myChart2"].destroy();
        }
        chartInstance["myChart2"] = generateChart(
          "myChart2",
          "Team Attendance %",
          label,
          data,
	        barcolor
        );
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

let chartInstance = {};

function generateChart(id, title, label, data,barcolor) {
  var canvas = document.getElementById(id);
  Chart.defaults.global.defaultFontStyle = "bold";
  var _dataset = {
    labels: label,
    datasets: [
      {
        label: title,
        backgroundColor: barcolor,
        data: data,
        borderWidth: 1,
      },
    ],
  };
  var chartInstance = new Chart(canvas, {
    type: "bar",
    data: _dataset,
    options: {
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
          formatter: Math.round,
          font: {
            weight: "bolder",
            size: 7,
          },
        },
      },
      legend: {
        display: true,
      },
      title: {
        display: false,
        text: title,
        fontSize: "20",
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 20,
            },
          },
        ],
      },
      responsive: true,
    },
  });
  return chartInstance;
}

function dateConvert(dateparam) {
  var newDt = moment(dateparam, "MM/DD/YYYY");
  return moment(newDt).format("YYYY-MM-DD") + "T00:00:00";
}

function executeData(team, shift) {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQueryTeams_S1%2FTransactions%2FXacute_MEETING_AGENDA";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/agenta.json";

  const params = {
    "Param.1": team,
    "Param.9": shift,
    "Param.11": dateConvert(new Date()),
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log("executeData", dataList);
      if (dataList && dataList.length > 0) {
        const data = dataList[0];
        // const _agenda = data.MEETING_AGENDA.replace("  ", "<br>")
        $("#_content1").text(data.MEETING_AGENDA);
        $("#content1").val(data.MEETING_AGENDA);
        $("#_content2").text(data.PLAN_FOR_DAY_1);
        $("#content2").val(data.PLAN_FOR_DAY_1);
        // $("#_content3").text(data.CODE_OF_CONDUCT);
        // $("#content3").text(data.CODE_OF_CONDUCT);
        $("#_content4").text(data.CRITICAL_FOR_24HR);
        $("#content4").val(data.CRITICAL_FOR_24HR);
        $("#_content5").text(data.SBT_MDT_ESCALATION);
        $("#content5").val(data.SBT_MDT_ESCALATION);
        $("#_content7").text(data.DESC_FOR_STAR_OF_THE_DAY);
        $("#content7").val(data.DESC_FOR_STAR_OF_THE_DAY);
        $("#_content6").text(data.STAR_OF_THE_DAY);
        $("#content6").val(data.STAR_OF_THE_DAY);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function viewList() {
  $("#_viewList").modal("open");
}

function submitData() {
  $("#_viewList").modal("close");
  const data1 = $("#content1").val();
  const data2 = $("#content2").val();
  // const data3 = $("#content3").val();
  const data4 = $("#content4").val();
  const data5 = $("#content5").val();
  const data6 = $("#content6").val();
  const data7 = $("#content7").val();
  const split = $("#_TECHNOCRATS").val().split("~");
  const shift = split[0];
  const team = split[1];

  // console.log("data", data1, data2, data3, data4, data5, data6, data7);

  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQueryTeams_S1%2FTransactions%2FXacute_MEETING_AGENDA";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/agenta.json";

  const params = {
    "Param.1": team,
    "Param.2": data1,
    "Param.3": data2,
    "Param.4": data4,
    "Param.5": data5,
    "Param.6": "",
    "Param.7": data6,
    "Param.8": data7,
    "Param.9": shift,
    "Param.10": "Y",
    "Param.11": dateConvert(new Date()),
  };
  console.log("data", params);
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      console.log("submitData", dataList);
      executeData(team, shift);
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function characters(id, event) {
  const len = $("#content" + id).val().length;
  const no = 500 - len;
  document.getElementById("-content" + id).style.display = "block";
  $("#-content" + id).text(no + " Characters left!");
  console.log("id", len);
}

function checkStatus(team, shift){
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FExecuteTeamActive";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/checkStatus.json";

  const params = {
    "Param.1": team,
    "Param.2": shift,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      console.log("checkStatus", dataList);
      const dataC = dataList[0].Output;
      var attnBtn = true;
      if(dataC == "Y"){
        memberWho(team, false);
        attnBtn = false;
      }else if(dataC == "Z"){
        presentMember(team, shift, true);
        attnBtn = true;
      }else if(dataC == "N"){
        memberWho(team, true);
        attnBtn = true;
      }else{
        attnBtn = true;
        // console.log('Attendance Entry Not Allowed');
        document.getElementById("_notA").style.display = "block";
      }
// console.log(attnBtn)
      document.getElementById("attnBtn").disabled = attnBtn;

      
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function presentMember(team, shift, status) {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FExecutePresentMembers";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/attendance.json";

  const params = {
    "Param.1": team,
    "Param.2": shift,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      console.log("presentMember", dataList);

      if (dataList && dataList.length > 0) {
        dataList.map((x) => {
          x.id = x.TEAM_MEMBER;
          x.ATTENDANCE = x.ATTENDANCE?x.ATTENDANCE:'A';           
        });
        attendenceMemberwithoutSNO(dataList, status);
      } else {
        // console.log("no data");
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function memberWho(team, status) {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterSelectMembers";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/selectMember.json";

  const params = {
    "Param.1": team,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log("ajax-response", dataList);

      if (dataList && dataList.length > 0) {
        dataList.map((x) => {
          x.id = x.TEAM_MEMBER.replace(" ", "");
          x.ATTENDANCE = "NA";
        });
        attendenceMember(dataList, status);
      } else {
        // console.log("no data");
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function attendenceMember(data, status) {
  $("#attenList").empty();
  $.each(data, function (i, item) {
    if (item.TEAM_MEMBER) {
       console.log(item)

      $("#attenList").append(
        `<div class="col s6 m6 radioList">
        <h5 class="_name" title="${item.TEAM_MEMBER}">${item.TEAM_MEMBER}</h5>
        <label class="_radio">
          <input class="with-gap red" id="${item.SNO}_A" name="${item.TEAM_MEMBER}" type="radio" onchange="radioList(event)" />
          <span>A</span>
        </label>
        <label class="_radio">
          <input class="with-gap green" id="${item.SNO}_P" name="${item.TEAM_MEMBER}" type="radio" onchange="radioList(event)" />
          <span>P</span>
        </label>
        <label class="_radio">
          <input class="with-gap yellow" id="${item.SNO}_NA" name="${item.TEAM_MEMBER}" type="radio" onchange="radioList(event)"/>
          <span>NA</span>
        </label>
      </div>`
      );
      // console.log("#"+item.SNO, status)
      $("#" + item.SNO + "_" + item.ATTENDANCE).trigger("click");      
      document.getElementById(item.SNO + "_A").disabled = status;
      document.getElementById(item.SNO + "_P").disabled = status;
      document.getElementById(item.SNO + "_NA").disabled = status;
    }
  });
}

function attendenceMemberwithoutSNO(data, status) {
  $("#attenList").empty();
  $.each(data, function (i, item) {
    if (item.TEAM_MEMBER) {
       console.log(item)

      $("#attenList").append(
        `<div class="col s6 m6 radioList">
        <h5 class="_name" title="${item.TEAM_MEMBER}">${item.TEAM_MEMBER}</h5>
        <label class="_radio">
          <input class="with-gap red" id="${item.TEAM_MEMBER}_A" name="${item.TEAM_MEMBER}" type="radio" onchange="radioList(event)" />
          <span>A</span>
        </label>
        <label class="_radio">
          <input class="with-gap green" id="${item.TEAM_MEMBER}_P" name="${item.TEAM_MEMBER}" type="radio" onchange="radioList(event)" />
          <span>P</span>
        </label>
        <label class="_radio">
          <input class="with-gap yellow" id="${item.TEAM_MEMBER}_NA" name="${item.TEAM_MEMBER}" type="radio" onchange="radioList(event)"/>
          <span>NA</span>
        </label>
      </div>`
      );
      // console.log("#"+item.SNO, status)
      $("#" + item.TEAM_MEMBER + "_" + item.ATTENDANCE).trigger("click");      
      document.getElementById(item.TEAM_MEMBER + "_A").disabled = status;
      document.getElementById(item.TEAM_MEMBER + "_P").disabled = status;
      document.getElementById(item.TEAM_MEMBER + "_NA").disabled = status;
    }
  });
}

function unique(array){
    return array.filter(function(el,index,arr){
        return index == arr.indexOf(el);
    });
}

var present = [];
var absent = [];
var notApplicable = [];
function radioList(event) {
  const split = event.target.id.split("_");
  if (split[1] == "A") {
    absent.push(split[0]);
    present = present.filter((x) => x !== split[0]);
    notApplicable = notApplicable.filter((x) => x !== split[0]);
  } else if (split[1] == "P") {
    present.push(split[0]);
    absent = absent.filter((x) => x !== split[0]);
    notApplicable = notApplicable.filter((x) => x !== split[0]);
  } else {
    notApplicable.push(split[0]);
    present = present.filter((x) => x !== split[0]);
    absent = absent.filter((x) => x !== split[0]);
    notApplicable = unique(notApplicable);
  }
}

function saveAtten() {
  console.log("present", present);
  console.log("absent", absent);
  console.log("notApplicable", notApplicable);
  const split = $("#_TECHNOCRATS").val().split("~");
  const shift = split[0];
  const team = split[1];
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FXACT_RECORD_ATTENDANCE";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/selectMember.json";

  const params = {
    "Param.1": dateConvert(new Date()),
    "Param.2": shift,
    "Param.3": team,
    "Param.4": present.join(),
    "Param.5": notApplicable.join(),
    "Param.6": absent.join(),
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      console.log("record-response", dataList);
      checkStatus(team, shift);
     
    },
    function (err) {
      console.log("err", err);
    }
  );
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
