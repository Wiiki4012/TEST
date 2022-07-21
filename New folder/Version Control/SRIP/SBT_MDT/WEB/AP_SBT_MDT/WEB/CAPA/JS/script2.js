window.onload = function () {
  $(".modal").modal();
$('#loader').hide();
$('#successalerttrigger').hide();
$('#successalertfalse').hide();
  var today = new Date();
  var endDate = new Date();
  var autoclosuredate = new Date();
  autoclosuredate.setDate(today.getDate() + 10);
  endDate.setDate(endDate.getDay() - 7);
  $('input[name="_daterange"]').daterangepicker({
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
  });

  $('input[name="_daterangeTable"]').daterangepicker({
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
  });

  $('input[name="autotriggeredclosuredate"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: parseInt(moment().format("YYYY"), 1),
    // maxYear: parseInt(moment().format("YYYY"), 1),
    startDate: autoclosuredate,
    minDate: today,
    locale: {
      format: "MM-DD-YYYY",
    },
  });

  selectTechno();

  //On Load Animation
  AOS.init({
    duration: 1200,
  });
};

var externalCred = "&IllumLoginName=atos_mii&IllumLoginPassword=Pass01";
var ipAddress = "";
var contentType = "&IsTesting=T&Content-Type=text%2Fjson";
function PrintElem(elem) {
  var mywindow = window.open("", "PRINT", "height=400,width=600");

  mywindow.document.write("<html><head><title>" + document.title + "</title>");
  mywindow.document.write("</head><body >");
  mywindow.document.write("<h1>" + document.title + "</h1>");
  mywindow.document.write(document.getElementById(elem).innerHTML);
  mywindow.document.write("</body></html>");

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();

  return true;
}
function reportprint() {
  PrintElem("reportdiv");
}

function Downloadaspdf() {
  const { jsPDF } = window.jspdf;
  var doc = new jsPDF("l", "mm", [1200, 1210]);

  var pdfjs = document.querySelector("#reportdiv");

  // Convert HTML to PDF in JavaScript
  doc.html(pdfjs, {
    callback: function (doc) {
      doc.save("CAPA_REPORT.pdf");
    },
    x: 10,
    y: 10,
  });
}

function verifyidentity(data) {
var input = prompt ("Please Verify Your Identity", "");
if(input != "vin143") {
alert("You're not Allowed to Delete!");
}
else {
const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FDELETE_CAPA_MASTER";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": data.CAPAID,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      alert('CAPA Deleted!');
      _table();
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
      $("#_TECHNOCRATS").empty();
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

        $("#_TECHNOCRATS").append(
          "<option value='' selected disabled>Select</option> <option value='' disabled>No Data</option>"
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
  $("#triggerhitnotification").css("display", "none");
  const team = data.value;
  $("#_team").text(team);
  executeStatus(team);
  // starofteams(team);
  triggerhitcases(team);
  KpiDrop(team);
  memberWho(team);
  _table();
  getActionableData();
}

// function starofteams(team) {
//   const API =
//   "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQuery%2FXACT_STAR_OF_TEAM";
//   const API_URL = ipAddress + API + contentType + externalCred;

//   const params = {
//     "Param.1": team,
//   };
//   ajaxCall(
//     API_URL,
//     params,
//     function (result) {
//       const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
//       // console.log('sta', dataList)
//       const dataList = dataC && dataC.length > 0;
//       const star1 =
//         dataList && dataC[0].WHO && dataC[0].WHO != "N/A" ? dataC[0].WHO : 0;
//       const star1cnt =
//         dataList && dataC[0].STARCOUNT && dataC[0].STARCOUNT != "N/A" ? dataC[0].STARCOUNT : 0;
//       const star2 =
//         dataList && dataC[1].WHO && dataC[1].WHO != "N/A"
//           ? dataC[1].WHO
//           : 0;
//       const star2cnt =
//           dataList && dataC[1].STARCOUNT && dataC[1].STARCOUNT != "N/A" ? dataC[1].STARCOUNT : 0;
// 	$("#membername").html("1<sup>st</sup> - " + star1 + "(" + star1cnt +") </br>" + "2<sup>nd</sup> - " + star2 + "(" + star2cnt +")");
//       //$("#membername").html(star1 +" - "+ star1cnt +", "+ star2 +" - "+ star2cnt);
//     },
//     function (err) {
//       console.log("err", err);
//     }
//   );
// }
var triggerlist = [];
function triggerhitcases(team) {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FPS_LOGIC%2FXACT_AUTO_PS_TRIGGER";
  const API_URL = ipAddress + API + contentType + externalCred;

  const params = {
    "Param.1": team,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      // console.log('sta', dataList)
if(dataC != undefined) {
      const dataList = dataC && dataC.length > 0;
      if (dataC.length > 0) {
        $("#triggerhitcount").text(dataC.length);
        $("#triggerhitnotification").css("display", "block");
        $("#trigt").text(team);
        var htm = "";
        triggerlist = dataC;
        $.each(dataC, function (i, item) {
          htm +=
            "<tr><td colspan='3'>" +
            item.KPI +
            "</td><td>" +
            dateConvert(item.TRIGGERD_DATE) +
            "</td><td>" +
            item.TRIGGER +
            "</td><td>" +
            item.KPI_VALUE +
            "</td>" +
            "<td class='consider' onclick='considerps(" +
            JSON.stringify(item) +
            ")'>" +
            "Consider" +
            "</td>" +
            "<td class='nconsider' onclick='notconsider(" +
            JSON.stringify(item) +
            ")'>" +
            "Not Consider" +
            "</td>" +
            "<td>" +
            "<input type='text' id='triggercomments"+item.ID+"' value='"+((item.COMMENTS != '---') ? item.COMMENTS : '')+"'>" +
            "</td>" +
            "</tr>";
        });
        $("#_trigger tbody").html(htm);
      }
} else {
        $("#triggerhitnotification").css("display", "none");
        // console.log("no data for table");
        var noData =
          "<tr><td colspan='12' class='text-center'>" +
          "No Data" +
          "</td></tr>";
        $("#_trigger tbody").html(noData);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function report5why(KPI, teamname, kpihiton) {
  const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FSELECT_5WHYs";
  const API_URL = ipAddress + API + contentType + externalCred;

  const params = {
    "Param.1": KPI,
    "Param.2": dateService(kpihiton),
    "Param.3": teamname,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      // console.log('sta', dataList)
      const dataList = dataC && dataC.length > 0;
      if (dataC.length > 0) {
        var htm = "";
        $.each(dataC, function (i, item) {
          htm +=
            "<tr><td>" +
            item.MAIN_CAUSE +
            "</td><td>" +
            item.SUB_CAUSE1 +
            "</td><td>" +
            item.SUB_CAUSE2 +
            "</td><td>" +
            item.SUB_CAUSE3 +
            "</td><td>" +
            item.ROOT_CAUSE +
            "</td></tr>";
        });
        $("#_Report5why tbody").html(htm);
      } else {
        var noData =
          "<tr><td colspan='5' class='text-center'>" + "No Data" + "</td></tr>";
        $("#_Report5why tbody").html(noData);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function edit5why(KPI, kpihiton, teamname) {
  const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FSELECT_5WHYs";
  const API_URL = ipAddress + API + contentType + externalCred;

  const params = {
    "Param.1": KPI,
    "Param.2": dateService(kpihiton),
    "Param.3": teamname,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      // console.log('sta', dataList)
      const dataList = dataC && dataC.length > 0;
      if (dataC.length > 0) {
        var htm = "";
        $.each(dataC, function (i, item) {
          htm +=
            "<tr><td>" +
            item.MAIN_CAUSE +
            "</td><td>" +
            item.SUB_CAUSE1 +
            "</td><td>" +
            item.SUB_CAUSE2 +
            "</td><td>" +
            item.SUB_CAUSE3 +
            "</td><td>" +
            item.ROOT_CAUSE +
            "</td>" +
            //"<td class='consider' onclick='edit5why(" +
            //JSON.stringify(item) +
            //")'>" +
            //"Edit" +
            //"</td>"+
            "<td class='nconsider' onclick='delete5why(" +
            JSON.stringify(item) +
            ")'>" +
            "Delete" +
            "</td></tr>";
        });
        $("#_5why tbody").html(htm);
      } else {
        var noData =
          "<tr><td colspan='5' class='text-center'>" + "No Data" + "</td></tr>";
        $("#_5why tbody").html(noData);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function reportcapa(KPI, teamname, kpihiton) {
  const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FSELECT_CA_PA";
  const API_URL = ipAddress + API + contentType + externalCred;

  const params = {
    "Param.1": KPI,
    "Param.2": dateService(kpihiton),
    "Param.3": teamname,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      // console.log('sta', dataList)
      const dataList = dataC && dataC.length > 0;
      if (dataC.length > 0) {
        var htm = "";
        $.each(dataC, function (i, item) {
          htm +=
            "<tr><td>" +
            item.CAPA +
            "</td><td>" +
            item.WHAT +
            "</td><td>" +
            item.WHO +
            "</td><td>" +
            item.WHEN +
            "</td><td>" +
            item.STATUS +
            "</td></tr>";
        });
        $("#_ReportCAPA tbody").html(htm);
      } else {
        var noData =
          "<tr><td colspan='5' class='text-center'>" + "No Data" + "</td></tr>";
        $("#_ReportCAPA tbody").html(noData);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}
function editcapa(KPI, kpihiton, teamname) {
  const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FSELECT_CA_PA";
  const API_URL = ipAddress + API + contentType + externalCred;

  const params = {
    "Param.1": KPI,
    "Param.2": dateService(kpihiton),
    "Param.3": teamname,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      // console.log('sta', dataList)
      const dataList = dataC && dataC.length > 0;
      if (dataC.length > 0) {
        var htm = "";
        $.each(dataC, function (i, item) {
          htm +=
            "<tr><td>" +
            item.CAPA +
            "</td><td>" +
            item.WHAT +
            "</td><td>" +
            item.WHO +
            "</td><td>" +
            item.WHEN +
            "</td><td>" +
            item.STATUS +
            "</td>" +
            //"<td class='consider' onclick='edit5capa(" +
            //JSON.stringify(item) +
            //")'>" +
            //"Edit" +
            //"</td>"+
            "<td class='nconsider' onclick='deletecapa(" +
            JSON.stringify(item) +
            ")'>" +
            "Delete" +
            "</td></tr>";
        });
        $("#_capa tbody").html(htm);
      } else {
        var noData =
          "<tr><td colspan='5' class='text-center'>" + "No Data" + "</td></tr>";
        $("#_capa tbody").html(noData);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function triggermodal() {
  $("#triggermodal").modal("open");
}
var _5whyarray = [];
var _CAPAarray = [];

function add5why() {
  htm = "";
  const kpi = $("#_kpi").val();
  const kpihiton = $("#_Kpi_hit_on").val();
  const teamname = $("#_TECHNOCRATS").val();
  const maincause = $("#maincause").val();
  const subcause1 = $("#subcause1").val();
  const subcause2 = $("#subcause2").val();
  const subcause3 = $("#subcause3").val();
  const rootcause = $("#rootcause").val();
  if(kpi != "" || maincause != "" || subcause1 != "" || subcause2 != "" || subcause3 != "" || rootcause != "") {
    // _5whyarray.push(maincause,subcause1,subcause2,subcause3,rootcause,"$");
    const API =
      "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FXact%2FXACT_CAPA_5WHY_INSERT";
    const API_URL = ipAddress + API + contentType + externalCred;

    const params = {
      "Param.1": kpi,
      "Param.2": dateService(kpihiton),
      "Param.3": teamname,
      "Param.4": maincause,
      "Param.5": subcause1,
      "Param.6": subcause2,
      "Param.7": subcause3,
      "Param.8": rootcause,
    };
    ajaxCall(
      API_URL,
      params,
      function (result) {
        const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
        // console.log('sta', dataList)
        const dataList = dataC && dataC.length > 0;
        $("#_5why tbody").empty();
        if (dataC.length > 0) {
          var htm = "";
          $.each(dataC, function (i, item) {
            htm +=
              "<tr><td>" +
              item.MAIN_CAUSE +
              "</td><td>" +
              item.SUB_CAUSE1 +
              "</td>" +
              "<td>" +
              item.SUB_CAUSE2 +
              "</td>" +
              "<td>" +
              item.SUB_CAUSE3 +
              "</td>" +
              "<td>" +
              item.ROOT_CAUSE +
              "</td>" +
              //"<td class='consider' onclick='edit5why(" +
              //JSON.stringify(item) +
              //")'>" +
              //"Edit" +
              //"</td>"+
              "<td class='nconsider' onclick='delete5why(" +
              JSON.stringify(item) +
              ")'>" +
              "Delete" +
              "</td></tr>";
          });
          $("#_5why tbody").append(htm);
$("#maincause").val("");
$("#subcause1").val("");
 $("#subcause2").val("");
$("#subcause3").val("");
$("#rootcause").val("");
        } else {
          // console.log("no data for table");
          var noData =
            "<tr><td colspan='12' class='text-center'>" +
            "No Data" +
            "</td></tr>";
          $("#_5why tbody").html(noData);
        }
      },
      function (err) {
        console.log("err", err);
      }
    );
  } else {
    alert("Enter all the Fields to Add!");
  }
}

function addcapa() {
  htm = "";
  const kpi = $("#_kpi").val();
  const kpihiton = $("#_Kpi_hit_on").val();
  const teamname = $("#_TECHNOCRATS").val();
  const CAPA = $("#CAPA").val();
  const capawhat = $("#capawhat").val();
  const capawho = $("#capawho").val();
  const capawhen = $("#capawhen").val();
  const capastatus = $("#capastatus").val();
  if (
    kpi != "" ||
    CAPA != "" ||
    capawhat != "" ||
    capawho != "" ||
    capawhen != "" ||
    capastatus != ""
  ) {
    const API =
      "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FXact%2FXACT_CA_PA_TABLE_INSERT";
    const API_URL = ipAddress + API + contentType + externalCred;

    const params = {
      "Param.1": kpi,
      "Param.2": dateService(kpihiton),
      "Param.3": teamname,
      "Param.4": CAPA,
      "Param.5": capawhat,
      "Param.6": capawho,
      "Param.7": capawhen,
      "Param.8": capastatus,
    };
    ajaxCall(
      API_URL,
      params,
      function (result) {
        const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
        // console.log('sta', dataList)
        const dataList = dataC && dataC.length > 0;
        $("#_capa tbody").empty();
        if (dataC.length > 0) {
          var htm = "";
          $.each(dataC, function (i, item) {
            htm +=
              "<tr><td>" +
              item.CAPA +
              "</td><td>" +
              item.WHAT +
              "</td>" +
              "<td>" +
              item.WHO +
              "</td>" +
              "<td>" +
              item.WHEN +
              "</td>" +
              "<td>" +
              item.STATUS +
              "</td>" +
              //"<td class='consider' onclick='edit5capa(" +
              //JSON.stringify(item) +
              //")'>" +
              //"Edit" +
              //"</td>"+
              "<td class='nconsider' onclick='deletecapa(" +
              JSON.stringify(item) +
              ")'>" +
              "Delete" +
              "</td></tr>";
          });
          $("#_capa tbody").append(htm);
        } else {
          // console.log("no data for table");
          var noData =
            "<tr><td colspan='12' class='text-center'>" +
            "No Data" +
            "</td></tr>";
          $("#_capa tbody").html(noData);
$("#CAPA").val("");
$("#capawhat").val("");
$("#capawho").val("");
$("#capawhen").val("");
$("#capastatus").val("");
        }
      },
      function (err) {
        console.log("err", err);
      }
    );
  } else {
    // $('$capaerror').show();
    alert("Enter all the Fields to Add!");
  }
}

function delete5why(data) {
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FXact%2FXACT_DELETE_5WHY";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": data.WHY_ID,
    "Param.2": data.KPI,
    "Param.3": dateService(data.KPIHITON),
    "Param.4": data.TEAM_NAME,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      if (dataC.length != undefined) {
        if (dataC && dataC.length > 0) {
          $("#_5why tbody").empty();
          var htm = "";
          $.each(dataC, function (i, item) {
            htm +=
              "<tr><td>" +
              item.MAIN_CAUSE +
              "</td><td>" +
              item.SUB_CAUSE1 +
              "</td>" +
              "<td>" +
              item.SUB_CAUSE2 +
              "</td>" +
              "<td>" +
              item.SUB_CAUSE3 +
              "</td>" +
              "<td>" +
              item.ROOT_CAUSE +
              "</td>" +
              //"<td class='consider' onclick='edit5why(" +
              //JSON.stringify(item) +
              //")'>" +
              //"Edit" +
              //"</td>"+
              "<td class='nconsider' onclick='delete5why(" +
              JSON.stringify(item) +
              ")'>" +
              "Delete" +
              "</td></tr>";
          });
          $("#_5why tbody").append(htm);
        }
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function deletecapa(data) {
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FXact%2FXACT_DELETE_CAPA";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": data.CA_PAID,
    "Param.2": data.KPI,
    "Param.3": dateService(data.KPIHITON),
    "Param.4": data.TEAM_NAME,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      if (dataC.length != undefined) {
        if (dataC && dataC.length > 0) {
          $("#_capa tbody").empty();
          var htm = "";
          $.each(dataC, function (i, item) {
            htm +=
              "<tr><td>" +
              item.CAPA +
              "</td><td>" +
              item.WHAT +
              "</td>" +
              "<td>" +
              item.WHO +
              "</td>" +
              "<td>" +
              item.WHEN +
              "</td>" +
              "<td>" +
              item.STATUS +
              "</td>" +
              //"<td class='consider' onclick='edit5why(" +
              //JSON.stringify(item) +
              //")'>" +
              //"Edit" +
              //"</td>"+
              "<td class='nconsider' onclick='deletecapa(" +
              JSON.stringify(item) +
              ")'>" +
              "Delete" +
              "</td></tr>";
          });
          $("#_capa tbody").append(htm);
        }
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function clear5why() {
  _5whyarray = [];
  $("#5whytbody").empty();
}

function clearCAPA() {
  _CAPAarray = [];
  $("#CAPAtbody").empty();
}

function exportcapa(data) {
  const KPI = !data ? "" : data.KPI;
  const TEAM = !data ? "" : data.TEAM_NAME;
  const KPIHITON = !data ? "" : data.KPIHITON;
  const DATE_ALLOCATION = !data ? "" : data.DATE_ALLOCATION;
  const DATE_SUBMISSION = !data ? "" : data.DATE_SUBMISSION;
  const WHAT = !data ? "" : data.WHAT;
  const WHERE = !data ? "" : data.WHERE_S1;
  const WHEN = !data ? "" : data.WHEN_S1;
  const WHO = !data ? "" : data.WHO;
  const WHY = !data ? "" : data.WHY;
  const HOWBIG = !data ? "" : data.HOWBIG;
  const EVIDANCE_LINKS = !data ? "" : data.EVIDANCE_LINKS;
  const CORRECTION = !data ? "" : data.CORRECTION;
  const ANALYSE_MAN = !data ? "" : data.ANALYSE_MAN;
  const ANALYSE_METHOD = !data ? "" : data.ANALYSE_METHOD;
  const ANALYSE_MEASUREMENT = !data ? "" : data.ANALYSE_MEASUREMENT;
  const ANALYSE_MACHINE = !data ? "" : data.ANALYSE_MACHINE;
  const ANALYSE_MATERIAL = !data ? "" : data.ANALYSE_MATERIAL;
  const ANALYSE_ENVIORNMENT = !data ? "" : data.ANALYSE_ENVIORNMENT;
  const BRAINSTORMING_TOOL = !data ? "" : data.BRAINSTORMING_TOOL;
  const PROBLEM = !data ? "" : data.PROBLEM;
  const MAKE_IT_STICK = !data ? "" : data.MAKE_IT_STICK;
  const PM_SCHEDULE = !data ? "" : data.PM_SCHEDULE;
  const OTHERS = !data ? "" : data.OTHERS;
  const PREPARED_BY = !data ? "" : data.PREPARED_BY;
  const PREPARED_BY_DATE = !data ? "" : data.PREPARED_BY_DATE;
  const REVIEWED_BY = !data ? "" : data.REVIEWED_BY;
  const REVIEWED_BY_DATE = !data ? "" : data.REVIEWED_BY_DATE;
  const ASSESSED_BY = !data ? "" : data.ASSESSED_BY;
  const ASSESSED_BY_DATE = !data ? "" : data.ASSESSED_BY_DATE;
  const PARTICIPANTS_NAMES = !data ? "" : data.PARTICIPANTS_NAMES;
  const CAPAID = !data ? "" : data.CAPAID;
  reportcapa(KPI, TEAM, KPIHITON);
  report5why(KPI, TEAM, KPIHITON);
  $("#capaid").text(new Date());
  $("#report_kpi").text(KPI);
  $("#report_kpihiton").text(KPIHITON);
  $("#report_dateofallocation").text(DATE_ALLOCATION);
  $("#report_dateofsubmission").text(DATE_SUBMISSION);
  $("#report_participants").text(PARTICIPANTS_NAMES);
  $("#report_what").text(WHAT);
  $("#report_where").text(WHERE);
  $("#report_when").text(WHEN);
  $("#report_who").text(WHO);
  $("#report_why").text(WHY);
  $("#report_howbig").text(HOWBIG);
  $("#report_evidance").text(EVIDANCE_LINKS);
  $("#report_correction").text(CORRECTION);
  $("#report_brainstorming").text(BRAINSTORMING_TOOL);
  $("#report_problem").text(PROBLEM);
  $("#report_man").text(ANALYSE_MAN);
  $("#report_method").text(ANALYSE_METHOD);
  $("#report_measurement").text(ANALYSE_MEASUREMENT);
  $("#report_machine").text(ANALYSE_MACHINE);
  $("#report_material").text(ANALYSE_MATERIAL);
  $("#report_enviornment").text(ANALYSE_ENVIORNMENT);
  $("#report_pm_schedule").text(PM_SCHEDULE);
  $("#report_others").text(OTHERS);
  $("#report_preparedby").text(PREPARED_BY);
  $("#report_preparedbydate").text(PREPARED_BY_DATE);
  $("#report_reviewedby").text(REVIEWED_BY);
  $("#report_reviewedbydate").text(REVIEWED_BY_DATE);
  $("#report_assessedby").text(ASSESSED_BY);
  $("#report_assessedbydate").text(ASSESSED_BY_DATE);
  $("#exportmodal").modal("open");
}

function considerps(data) {
$('#loader').show();
$('#successalerttrigger').hide();
  const today = new Date();
  const clsdate = $("#autotriggeredclosuredate").val();
  //clsdate.setDate(clsdate.getDate() + 10);
  const _kpi = !data ? "" : data.KPI;
  const _team = !data ? "" : data.TEAM_NAME;
  const _Kpi_hit_on = dateService(dateConvert(data.TRIGGERD_DATE));
  const _creationDate = dateService(today);
  const _submissiondate = dateService(clsdate);
  const _participants = "Yet to Assign";
const commentid = "#triggercomments" + data.ID;
  const _comments =$(commentid).val();
  const step1what = "";
  const step1where = "";
  const step1when = "";
  const step1who = "";
  const step1why = "";
  const howbig = "";
  const evidance = "";
  const correction = "";
  const brainstorming = "";
  const problem = "";
  var makeitstick = [];
  const analyseman = "";
  const analysemethod = "";
  const analysemeasurement = "";
  const analysemachine = "";
  const analysematerial = "";
  const analyseenvironment = "";
  const pmschedule = "";
  const others = "";
  const preparedby = "";
  const preparedbydate = dateService(today);
  const reviewedby = "";
  const reviewedbydate = dateService(today);
  const assessedby = "";
  const assessedbydate = dateService(today);
  tasksInsert(
    _kpi,
    _Kpi_hit_on,
    _team,
    _creationDate,
    _submissiondate,
    _participants,
    evidance,
    correction,
    step1what,
    step1where,
    step1when,
    step1who,
    step1why,
    howbig,
    brainstorming,
    problem,
    makeitstick,
    analyseman,
    analysemethod,
    analysemeasurement,
    analysemachine,
    analysematerial,
    analyseenvironment,
    pmschedule,
    others,
    preparedby,
    preparedbydate,
    reviewedby,
    reviewedbydate,
    assessedby,
    assessedbydate
  );
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FPS_LOGIC%2FXACT_UPDATE_TRIGGER_HIT_STATUS";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": _team,
    "Param.2": _kpi,
    "Param.3": dateService(data.TRIGGERD_DATE),
    "Param.4": "Considered",
    "Param.5": _comments,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      if (dataC.length != undefined) {
        if (dataC && dataC.length > 0) {
          if (dataC[0].output == "T") {
            triggerhitcases(_team);
$('#loader').hide();
$('#triggeredkpionalert').val(_kpi);
$('#successalerttrigger').show();
          } else {
            alert("Problem with Update!");
          }
        }
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}
function notconsider(data) {
$('#loader').show();
$('#successalertfalse').hide();
const commentid = "#triggercomments" + data.ID;
  const _comments =$(commentid).val();
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FPS_LOGIC%2FXACT_UPDATE_TRIGGER_HIT_STATUS";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": data.TEAM_NAME,
    "Param.2": data.KPI,
    "Param.3": dateService(data.TRIGGERD_DATE),
    "Param.4": "Not Considered",
    "Param.5": _comments,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      if (dataC.length != undefined) {
        if (dataC && dataC.length > 0) {
          if (dataC[0].output == "T") {
            triggerhitcases(data.TEAM_NAME);
$('#loader').hide();
$('#triggeredkpifalsekpi').val(_kpi);
$('#successalertfalse').show();
          } else {
            alert("Problem with Update!");
          }
        }
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function executeStatus(team) {
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FCAPA_COUNTS%2FXACT_CAPA_COUNTS";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/team.json";

  const params = {
    "Param.1": team,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataC = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
      // console.log('sta', dataList)
      const dataList = dataC && dataC.length > 0;
      const data1 =
        dataList && dataC[0].openMTD && dataC[0].openMTD != "N/A"
          ? dataC[0].openMTD
          : 0;
      const data2 =
        dataList && dataC[0].ClosedMTD && dataC[0].ClosedMTD != "N/A"
          ? dataC[0].ClosedMTD
          : 0;
      const data3 =
        dataList && dataC[0].TOTALMTD && dataC[0].TOTALMTD != "N/A"
          ? dataC[0].TOTALMTD
          : 0;
      const data4 =
        dataList && dataC[0].AVGDELAY && dataC[0].AVGDELAY != "N/A"
          ? dataC[0].AVGDELAY
          : 0;
      const data5 =
        dataList && dataC[0].overallopen && dataC[0].overallopen != "N/A"
          ? dataC[0].overallopen
          : 0;
      const data6 =
        dataList && dataC[0].ClosedYTD && dataC[0].ClosedYTD != "N/A"
          ? dataC[0].ClosedYTD
          : 0;
      const data7 =
        dataList && dataC[0].totalYTD && dataC[0].totalYTD != "N/A"
          ? dataC[0].totalYTD
          : 0;
      const data8 =
        dataList && dataC[0].AvgYTD && dataC[0].AvgYTD != "N/A"
          ? dataC[0].AvgYTD
          : 0;
      $("#_PSOMTD").text(data1);
      $("#_PSCMTD").text(data2);
      $("#_TPSMTD").text(data3);
      $("#_ADCYTD").text(data4);
      $("#_OPSO").text(data5);
      $("#_PSCYTD").text(data6);
      $("#_TPSYTD").text(data7);
      $("#_AVDCYTD").text(data8);
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function _download() {
  const team = $("#_TECHNOCRATS").val();
  const date = $("#_daterange").val();
  dates = date.split("-");
  const from =
    moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
  const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

  $.ajax({
    type: "GET",
    url: "/XMII/Illuminator?IsTesting=T&QueryTemplate=AP_SBT_MDT/Query/ExecuteQueryDownload_V1&Content-Type=text/csv",
    data: {
      "Param.1": team,
      "Param.2": from,
      "Param.3": to,
    },
    async: false,
    success(data) {
      var blob = new Blob([data], {
        type: "application/ms-excel",
      });
      var downloadUrl = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "SBT_MDT_Dump.csv";
      document.body.appendChild(a);
      a.click();
    },
    complete: function () {
      stoploader();
    },
  });
}

function KpiDrop(team) {
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FTRIGGER_LOGIC%2FXACT_SELECT_KPI_TABLE";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/KPI.json";

  const params = {
    "Param.1": team,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      $("._kpi").empty();
      $("._kpi").append("<option value='' disabled>Select KPI</option>");
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log("ajax-response", dataList);
      var htm = "";
      if (dataList && dataList.length > 0) {
        $.each(dataList, function (i, item) {
          if (item.KPI != "") {
            htm += "<option value='" + item.KPI + "'>" + item.KPI + "</option>";
          }
        });
        htm += "<option value='Others'>Others</option>";
        $("._kpi").append(htm);
      } else {
        // console.log("no data");

        $("._kpi").append(
          "<option value='' selected disabled>Select KPI</option> <option value='' disabled>No Data</option>"
        );
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function memberWho(team) {
  const API =
    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterSelectMembers";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/member.json";

  const params = {
    "Param.1": team,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      $("#_who").empty();
      $("#_who").append("<option value='' disabled>Select Who</option>");
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      // console.log("ajax-response", dataList);
      var htm = "";
      if (dataList && dataList.length > 0) {
        $.each(dataList, function (i, item) {
          if (item.TEAM_MEMBER != "") {
            htm +=
              "<option value='" +
              item.TEAM_MEMBER +
              "'>" +
              item.TEAM_MEMBER +
              "</option>";
          }
        });
        $("#_who").append(htm);
      } else {
        // console.log("no data");

        $("#_who").append(
          "<option value='' selected disabled>Select Who</option> <option value='' disabled>No Data</option>"
        );
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}
var assid = "";
function assessmentmodel(id) {
  $("#assessmentModal").modal("open");
  assid = id;
}
function assess() {
  $("#assessmentModal").modal("close");
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FASSESSMENT_CAPA";
  const API_URL = ipAddress + API + contentType + externalCred;

  const params = {
    "Param.1": assid,
  };
  ajaxCall(
    API_URL,
    params,
    function (result) {
      // const dataList = result.Rowsets.Rowset
      //   ? result.Rowsets.Rowset[0].Row
      //   : [];
      // if (dataList && dataList.length > 0) {
      const tagid = "assessment_" + assid;
      document.getElementById(tagid).innerHTML = "Approved";
      document.getElementById(tagid).disabled = true;
      $(tagid).addClass("waves-effect waves-light btn");
      $(tagid).removeClass("red");
      // }
    },
    function (err) {
      console.log("err", err);
    }
  );
}
function _table() {
  const team = $("#_TECHNOCRATS").val();
  const date = $("#_daterangeTable").val();
  dates = date.split("-");
  const from =
    moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
  const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FSELECT_MASTER_CAPA";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/team.json";

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
      var htm = "";
      if (dataList && dataList.length > 0) {
        console.log("sd", dataList);
        // var currentdate = moment().format("MM/DD/YYYY") + " 00:00:00";
        //console.log("cur", currentdate);
        var currentdate = new Date();
        currentdate.setHours(0, 0, 0, 0);
        console.log("cur", currentdate);
        const _filterOverdue = dataList.filter(
          (x) =>
            new Date(x.DATE_SUBMISSION) < currentdate && x.STATUS !== "Closed"
        );
        console.log("overdue", _filterOverdue);
        const _filterClosed = dataList.filter((x) => x.STATUS === "Closed");
        console.log("closed", _filterOverdue);
        const _filter = dataList.filter(
          (x) =>
            x.STATUS !== "Closed" && new Date(x.DATE_SUBMISSION) >= currentdate
        );
        console.log("others", _filterOverdue);
        const datalists = [..._filterOverdue, ..._filter, ..._filterClosed];
        $.each(datalists, function (i, item) {
          var closuredate = new Date(item.DATE_SUBMISSION);
          console.log("close", closuredate);
          var overdue =
            closuredate < currentdate && item.STATUS != "Closed"
              ? "overdue"
              : "";
          if (item.STATUS == "Closed") {
            if (item.ASSESSMENT_STATUS == "Approved") {
              htm +=
                "<tr class='" +
                overdue +
                "'><td colspan='2'>" +
                item.KPI +
                "</td><td>" +
                item.PROBLEM +
                "</td><td>" +
                dateConvert(item.DATE_ALLOCATION) +
                "</td><td>" +
                dateConvert(item.DATE_SUBMISSION) +
                "</td><td>" +
                item.PARTICIPANTS_NAMES +
                "</td><td>" +
                item.STATUS +
                "</td><td>" +
                item.OTHERS +
                "</td><td>" +
                "Approved by Block Manager" +
                "</td>" +
                "<td><button class='waves-effect waves-light btn-small pink darken-4' onclick='exportcapa(" +
                JSON.stringify(item) +
                ")'>Download</button></td><td>---</td><td onclick='verifyidentity(" +
              JSON.stringify(item) +
              ")'>" +
              "Delete" +
              "</td></tr>";
            } else {
              htm +=
                "<tr class='" +
                overdue +
                "'><td colspan='2'>" +
                item.KPI +
                "</td><td>" +
                item.PROBLEM +
                "</td><td>" +
                dateConvert(item.DATE_ALLOCATION) +
                "</td><td>" +
                dateConvert(item.DATE_SUBMISSION) +
                "</td><td>" +
                item.PARTICIPANTS_NAMES +
                "</td><td>" +
                item.STATUS +
                "</td><td>" +
                item.OTHERS +
                "</td><td>" +
                "<button id='assessment_" +
                item.CAPAID +
                "' class='" +
                (item.ASSESSMENT_STATUS != "Approved"
                  ? "waves-effect waves-light btn red asses"
                  : "waves-effect waves-light btn asses") +
                "' onclick='assessmentmodel(" +
                item.CAPAID +
                ")'>" +
                (item.ASSESSMENT_STATUS != "Approved"
                  ? "Approval Pending"
                  : "Approved") +
                "</button>" +
                "</td>" +
              "<td onclick='modal1open(" +
              JSON.stringify(item) +
              ")'>" +
              "Edit" +
              "</td><td>---</td><td onclick='verifyidentity(" +
              JSON.stringify(item) +
              ")'>" +
              "Delete" +
              "</td></tr>";
            }
          } else {
            htm +=
              "<tr class='" +
              overdue +
              "'><td colspan='2'>" +
              item.KPI +
              "</td><td>" +
              item.PROBLEM +
              "</td><td>" +
              dateConvert(item.DATE_ALLOCATION) +
              "</td><td>" +
              dateConvert(item.DATE_SUBMISSION) +
              "</td><td>" +
              item.PARTICIPANTS_NAMES +
              "</td><td>" +
              item.STATUS +
              "</td><td>" +
              item.OTHERS +
              "</td><td> Problem Solving Still Open!" +
              "</td>" +
              "<td class=" +
              "action" +
              item.STATUS +
              "><span>---</span><span class=" +
              "action" +
              item.STATUS +
              " s" +
              " id='edit" +
              "'onclick='modal1open(" +
              JSON.stringify(item) +
              ")'>" +
              "Edit" +
              "</span></td><td class=" +
              "action" +
              item.STATUS +
              "><span>---</span><span class=" +
              "action" +
              item.STATUS +
              " id='delete" +
              "'onclick='deleteTasks(" +
              JSON.stringify(item) +
              ")'>" +
              "Close" +
              "</span></td><td onclick='verifyidentity(" +
              JSON.stringify(item) +
              ")'>" +
              "Delete" +
              "</td></tr>";
          }
        });
        $("#_tasks tbody").html(htm);
      } else {
        // console.log("no data for table");
        var noData =
          "<tr><td colspan='12' class='text-center'>" +
          "No Data" +
          "</td></tr>";
        $("#_tasks tbody").html(noData);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}
function dateConvert(DATE) {
  var newDt = moment(DATE, "MM/DD/YYYY");
  return moment(newDt).format("MM/DD/YYYY");
}

function tasksInsert(
  _kpi,
  _Kpi_hit_on,
  _team,
  _creationDate,
  _submissiondate,
  _participants,
  _evidance,
  _correction,
  _step1what,
  _step1where,
  _step1when,
  _step1who,
  _step1why,
  _howbig,
  _brainstorming,
  _problem,
  _makeitstick,
  _analyseman,
  _analysemethod,
  _analysemeasurement,
  _analysemachine,
  _analysematerial,
  _analyseenvironment,
  _pmschedule,
  _others,
  _preparedby,
  _preparedbydate,
  _reviewedby,
  _reviewedbydate,
  _assessedby,
  _assessedbydate
) {
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FXact%2FXACT_CAPA_MASTER_INSERT";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": _kpi,
    "Param.2": _Kpi_hit_on,
    "Param.3": _team,
    "Param.4": _creationDate,
    "Param.5": _submissiondate,
    "Param.6": _participants,
    "Param.7": _step1what,
    "Param.8": _step1where,
    "Param.9": _step1when,
    "Param.10": _step1who,
    "Param.11": _step1why,
    "Param.12": _howbig,
    "Param.13": _evidance,
    "Param.14": _correction,
    "Param.15": _analyseman,
    "Param.16": _analysemethod,
    "Param.17": _analysemeasurement,
    "Param.18": _analysemachine,
    "Param.19": _analysematerial,
    "Param.20": _analyseenvironment,
    "Param.21": _brainstorming,
    "Param.22": _problem,
    "Param.23": _makeitstick,
    "Param.24": _pmschedule,
    "Param.25": _others,
    "Param.26": _preparedby,
    "Param.27": _preparedbydate,
    "Param.28": _reviewedby,
    "Param.29": _reviewedbydate,
    "Param.30": _assessedby,
    "Param.31": _assessedbydate,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      const dataList = result.Rowsets ? result.Rowsets.Rowset[0].Row : [];
      // console.log("sd", dataList);
      $("#btn_packing").removeClass("enable");
      // if (dataList && dataList.length > 0) {
      //   $("#modal1").modal("close");
      //   _table(_team);
      // }
      $("#modal1").modal("close");
      _table();
  executeStatus(_team);
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function tasksUpdate(
  _capaid,
  _kpi,
  _Kpi_hit_on,
  _team,
  _creationDate,
  _submissiondate,
  _participants,
  _evidance,
  _correction,
  _step1what,
  _step1where,
  _step1when,
  _step1who,
  _step1why,
  _howbig,
  _brainstorming,
  _problem,
  _makeitstick,
  _analyseman,
  _analysemethod,
  _analysemeasurement,
  _analysemachine,
  _analysematerial,
  _analyseenvironment,
  _pmschedule,
  _others,
  _preparedby,
  _preparedbydate,
  _reviewedby,
  _reviewedbydate,
  _assessedby,
  _assessedbydate
) {
  const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FUPDATE_CAPA";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": _kpi,
    "Param.2": _Kpi_hit_on,
    "Param.3": _creationDate,
    "Param.4": _submissiondate,
    "Param.5": _participants,
    "Param.6": _evidance,
    "Param.7": _correction,
    "Param.8": _step1what,
    "Param.9": _step1where,
    "Param.10": _step1when,
    "Param.11": _step1who,
    "Param.12": _step1why,
    "Param.13": _howbig,
    "Param.14": _brainstorming,
    "Param.15": _problem,
    "Param.16": _makeitstick,
    "Param.17": _analyseman,
    "Param.18": _analysemethod,
    "Param.19": _analysemeasurement,
    "Param.20": _analysemachine,
    "Param.21": _analysematerial,
    "Param.22": _analyseenvironment,
    "Param.23": _pmschedule,
    "Param.24": _others,
    "Param.25": _preparedby,
    "Param.26": _preparedbydate,
    "Param.27": _reviewedby,
    "Param.28": _reviewedbydate,
    "Param.29": _assessedby,
    "Param.30": _assessedbydate,
    "Param.31": _capaid,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      $("#btn_packing").removeClass("enable");
      $("#modal1").modal("close");
      _table();
    },
    function (err) {
      console.log("err", err);
    }
  );
}

function dateService(dateparam) {
  var newDt = moment(dateparam, "MM/DD/YYYY");
  return moment(newDt).format("YYYY-MM-DD") + "T00:00:00";
}

function tasksData() {
  const _team = $("#_TECHNOCRATS").val();
  const _kpi = $("#_kpi").val();
  const _Kpi_hit_on = $("#_Kpi_hit_on").val();
  const _creationDate = $("#_creationDate").val();
  const _submissiondate = $("#_submissiondate").val();
  const _participants = $("#_participants").val();
  const step1what = $("#step1what").val();
  const step1where = $("#step1where").val();
  const step1when = $("#step1when").val();
  const step1who = $("#step1who").val();
  const step1why = $("#step1why").val();
  const howbig = $("#howbig").val();
  const evidance = $("#evidance").val();
  const correction = $("#correction").val();
  const brainstorming = $("#brainstorming").val();
  const problem = $("#problem").val();
  var makeitstick = [];
  if ($("#OPL").is(":checked")) {
    makeitstick.push($("#OPL").val());
  } else if ($("#SOP").is(":checked")) {
    makeitstick.push($("#SOP").val());
  } else if ($("#Training").is(":checked")) {
    makeitstick.push($("#Training").val());
  } else if ($("#Gemba").is(":checked")) {
    makeitstick.push($("#Gemba").val());
  } else if ($("#pokeyoke").is(":checked")) {
    makeitstick.push($("#pokeyoke").val());
  } else {
    makeitstick = [];
  }
  const analyseman = $("#analyseman").val();
  const analysemethod = $("#analysemethod").val();
  const analysemeasurement = $("#analysemeasurement").val();
  const analysemachine = $("#analysemachine").val();
  const analysematerial = $("#analysematerial").val();
  const analyseenvironment = $("#analyseenvironment").val();
  const pmschedule = $("#pmschedule").val();
  const others = $("#others").val();
  const preparedby = $("#preparedby").val();
  const preparedbydate = $("#preparedbydate").val();
  const reviewedby = $("#reviewedby").val();
  const reviewedbydate = $("#reviewedbydate").val();
  const assessedby = $("#assessedby").val();
  const assessedbydate = $("#assessedbydate").val();
  const capaid = $("#_SNO").val();
  //Dont Edit
  const _label = $("#insert_Edit").val();
  // console.log(
  //   "err",
  //   _team,
  //   _who,
  //   _kpi,
  //   _what,
  //   _lastDate,
  //   _creationDate,
  //   _textarea,
  //   _closureDate,
  //   _solving,
  //   _actionable
  // );
  document.getElementById("packing_err").style.display = "none";
  const dataC = _kpi && _creationDate && _Kpi_hit_on && _submissiondate;

  if (dataC) {
    $("#btn_packing").addClass("enable");

    _label == "Edit"
      ? tasksUpdate(
          capaid,
          _kpi,
          dateService(_Kpi_hit_on),
          _team,
          dateService(_creationDate),
          dateService(_submissiondate),
          _participants,
          evidance,
          correction,
          step1what,
          step1where,
          step1when,
          step1who,
          step1why,
          howbig,
          brainstorming,
          problem,
          makeitstick,
          analyseman,
          analysemethod,
          analysemeasurement,
          analysemachine,
          analysematerial,
          analyseenvironment,
          pmschedule,
          others,
          preparedby,
          dateService(preparedbydate),
          reviewedby,
          dateService(reviewedbydate),
          assessedby,
          dateService(assessedbydate)
        )
      : tasksInsert(
          _kpi,
          dateService(_Kpi_hit_on),
          _team,
          dateService(_creationDate),
          dateService(_submissiondate),
          _participants,
          evidance,
          correction,
          step1what,
          step1where,
          step1when,
          step1who,
          step1why,
          howbig,
          brainstorming,
          problem,
          makeitstick,
          analyseman,
          analysemethod,
          analysemeasurement,
          analysemachine,
          analysematerial,
          analyseenvironment,
          pmschedule,
          others,
          preparedby,
          dateService(preparedbydate),
          reviewedby,
          dateService(reviewedbydate),
          assessedby,
          dateService(assessedbydate)
        );
    // $("#modal1").modal("close");
  } else {
    const dataC =
      _kpi && _creationDate && _Kpi_hit_on && _submissiondate && preparedby;
    const err = !_kpi
      ? "Name of KPI"
      : !_creationDate
      ? "Creation Date"
      : !_Kpi_hit_on
      ? "KPI Hit On"
      : !_submissiondate
      ? "Submission Date"
      : "Date";
    const _err = err + " field is missing";
    document.getElementById("packing_err").style.display = "block";
    $("#packing_err").text(_err);
    // console.log("err", absent_number, absent_date);
  }
  setTimeout(function () {
    $("#btn_packing").removeClass("enable");
    document.getElementById("packing_err").style.display = "none";
  }, 5000);
}

function modal1open(data) {
  const label = !data ? "Insert" : "Edit";
  $("#insert_Edit").val(label);

  const KPI = !data ? "" : data.KPI;
  const TEAMNAME = !data ? "" : data.TEAM_NAME;
  const KPIHITON = !data ? "" : data.KPIHITON;
  const DATE_ALLOCATION = !data ? "" : data.DATE_ALLOCATION;
  const DATE_SUBMISSION = !data ? "" : data.DATE_SUBMISSION;
  const WHAT = !data ? "" : data.WHAT;
  const WHERE = !data ? "" : data.WHERE;
  const WHEN = !data ? "" : data.WHEN;
  const WHO = !data ? "" : data.WHO;
  const WHY = !data ? "" : data.WHY;
  const HOWBIG = !data ? "" : data.HOWBIG;
  const EVIDANCE_LINKS = !data ? "" : data.EVIDANCE_LINKS;
  const CORRECTION = !data ? "" : data.CORRECTION;
  const ANALYSE_MAN = !data ? "" : data.ANALYSE_MAN;
  const ANALYSE_METHOD = !data ? "" : data.ANALYSE_METHOD;
  const ANALYSE_MEASUREMENT = !data ? "" : data.ANALYSE_MEASUREMENT;
  const ANALYSE_MACHINE = !data ? "" : data.ANALYSE_MACHINE;
  const ANALYSE_MATERIAL = !data ? "" : data.ANALYSE_MATERIAL;
  const ANALYSE_ENVIORNMENT = !data ? "" : data.ANALYSE_ENVIORNMENT;
  const BRAINSTORMING_TOOL = !data ? "" : data.BRAINSTORMING_TOOL;
  const PROBLEM = !data ? "" : data.PROBLEM;
  const MAKE_IT_STICK = !data ? "" : data.MAKE_IT_STICK;
  const PM_SCHEDULE = !data ? "" : data.PM_SCHEDULE;
  const OTHERS = !data ? "" : data.OTHERS;
  const PREPARED_BY = !data ? "" : data.PREPARED_BY;
  const PREPARED_BY_DATE = !data ? "" : data.PREPARED_BY_DATE;
  const REVIEWED_BY = !data ? "" : data.REVIEWED_BY;
  const REVIEWED_BY_DATE = !data ? "" : data.REVIEWED_BY_DATE;
  const ASSESSED_BY = !data ? "" : data.ASSESSED_BY;
  const ASSESSED_BY_DATE = !data ? "" : data.ASSESSED_BY_DATE;
  const PARTICIPANTS_NAMES = !data ? "" : data.PARTICIPANTS_NAMES;
  const CAPAID = !data ? "" : data.CAPAID;
  $("#_5why tbody").empty();
  $("#_capa tbody").empty();
  edit5why(KPI, KPIHITON, TEAMNAME);
  editcapa(KPI, KPIHITON, TEAMNAME);
  $("#wipT").text(!data ? "Create " : "Update ");

  $("#_SNO").val(CAPAID);
  $("#_kpi").val(KPI);
  $("#_Kpi_hit_on").val(KPIHITON);
  $("#_creationDate").val(DATE_ALLOCATION);
  $("#_submissiondate").val(DATE_SUBMISSION);
  $("#_participants").val(PARTICIPANTS_NAMES);
  $("#step1what").val(WHAT);
  $("#step1where").val(WHERE);
  $("#step1when").val(WHEN);
  $("#step1who").val(WHO);
  $("#step1why").val(WHY);
  $("#howbig").val(HOWBIG);
  $("#evidance").val(EVIDANCE_LINKS);
  $("#correction").val(CORRECTION);
  $("#brainstorming").val(BRAINSTORMING_TOOL);
  $("#problem").val(PROBLEM);
  $("#analyseman").val(ANALYSE_MAN);
  $("#analysemethod").val(ANALYSE_METHOD);
  $("#analysemeasurement").val(ANALYSE_MEASUREMENT);
  $("#analysemachine").val(ANALYSE_MACHINE);
  $("#analysematerial").val(ANALYSE_MATERIAL);
  $("#analyseenvironment").val(ANALYSE_ENVIORNMENT);
  $("#pmschedule").val(PM_SCHEDULE);
  $("#others").val(OTHERS);
  $("#preparedby").val(PREPARED_BY);
  $("#preparedbydate").val(PREPARED_BY_DATE);
  $("#reviewedby").val(REVIEWED_BY);
  $("#reviewedbydate").val(REVIEWED_BY_DATE);
  $("#assessedby").val(ASSESSED_BY);
  $("#assessedbydate").val(ASSESSED_BY_DATE);

  var today = new Date();
  var endDate = new Date();
  endDate.setDate(endDate.getDay() - 7);
  var CREATION_DATE =
    data && data.DATE_ALLOCATION ? data.DATE_ALLOCATION : moment();
  $('input[name="_creationDate"]').daterangepicker(
    {
      singleDatePicker: true,
      // autoUpdateInput :false,
      autoApply: true,
      showDropdowns: true,
      minYear: 1901,
      maxYear: parseInt(moment().format("YYYY"), 1),
      startDate: CREATION_DATE,
      maxDate: today,
      locale: {
        format: "MM-DD-YYYY",
      },
    },
    function (start, end, label) {
      // console.log(
      //   "A new date selection was made: " + start.format("YYYY-MM-DD")
      // );
    }
  );

  var KPIHITDATE = data && data.KPIHITON ? data.KPIHITON : moment();
  $('input[name="_Kpi_hit_on"]').daterangepicker(
    {
      singleDatePicker: true,
      // autoUpdateInput :false,
      autoApply: true,
      showDropdowns: true,
      minYear: 1901,
      maxYear: parseInt(moment().format("YYYY"), 1),
      startDate: KPIHITDATE,
      maxDate: today,
      locale: {
        format: "MM-DD-YYYY",
      },
    },
    function (start, end, label) {}
  );
  var subdate = data && data.DATE_SUBMISSION ? data.DATE_SUBMISSION : moment();
  $('input[name="_submissiondate"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 1),
    startDate: subdate,
    minDate: subdate,
    locale: {
      format: "MM-DD-YYYY",
    },
  });
  var prepareddate =
    data && data.PREPARED_BY_DATE ? data.PREPARED_BY_DATE : moment();
  $('input[name="preparedbydate"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 1),
    startDate: prepareddate,
    maxDate: today,
    locale: {
      format: "MM-DD-YYYY",
    },
  });
  var revieweddate =
    data && data.REVIEWED_BY_DATE ? data.REVIEWED_BY_DATE : moment();
  $('input[name="reviewedbydate"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 1),
    startDate: revieweddate,
    maxDate: today,
    locale: {
      format: "MM-DD-YYYY",
    },
  });
  var assesseddate =
    data && data.ASSESSED_BY_DATE ? data.ASSESSED_BY_DATE : moment();
  $('input[name="assessedbydate"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 1),
    startDate: assesseddate,
    maxDate: today,
    locale: {
      format: "MM-DD-YYYY",
    },
  });

  document.getElementById("_submissiondate").disabled = !data ? false : true;
  document.getElementById("_kpi").disabled = !data ? false : true;
  // var tomorowDate = new Date();
  // tomorowDate.setDate(tomorowDate.getDate() + 1);
  // var CLOSURE_DATE =
  //   data && data.CLOSURE_DATE ? data.CLOSURE_DATE : tomorowDate;
  // $('input[name="_closureDate"]').daterangepicker(
  //   {
  //     singleDatePicker: true,
  //     // autoUpdateInput :false,
  //     autoApply: true,
  //     showDropdowns: true,
  //     minYear: parseInt(moment().format("YYYY"), 1),
  //     // maxYear: parseInt(moment().format("YYYY"), 1),
  //     startDate: CLOSURE_DATE,
  //     minDate: tomorowDate,
  //     locale: {
  //       format: "MM-DD-YYYY",
  //     },
  //   },
  //   function (start, end, label) {
  //     // console.log(
  //     //   "A new date selection was made: " + start.format("YYYY-MM-DD")
  //     // );
  //   }
  // );
  // var LAST_UPDATED = data && data.LAST_UPDATED ? data.LAST_UPDATED : moment();
  // $('input[name="_lastDate"]').daterangepicker(
  //   {
  //     singleDatePicker: true,
  //     // autoUpdateInput :false,
  //     autoApply: true,
  //     showDropdowns: true,
  //     minYear: 1901,
  //     maxYear: parseInt(moment().format("YYYY"), 1),
  //     startDate: today,
  //     maxDate: today,
  //     locale: {
  //       format: "MM-DD-YYYY",
  //     },
  //   },
  //   function (start, end, label) {
  //     // console.log(
  //     //   "A new date selection was made: " + start.format("YYYY-MM-DD")
  //     // );
  //   }
  // );

  $("#modal1").modal("open");

  // console.log("dd", data);
}
var deleteList = "";
function deleteTasks(data) {
  $("#closeModal").modal("open");
  deleteList = data;
}
function closetasksData() {
  $("#closeModal").modal("close");
  // console.log("delete", deleteList);
  const preparedby = $("#preparedby").val();
  if (preparedby !== "") {
    const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FCLOSE_CAPA";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

    const params = {
      "Param.1": deleteList.CAPAID,
    };
    console.log("k-", params);
    ajaxCall(
      API_URL,
      params,
      function (result) {
        $("#btn_packing").removeClass("enable");
        $("#modal1").modal("close");
        _table();
      },
      function (err) {
        console.log("err", err);
      }
    );
  } else {
    alert("Please Fill Prepared By Detail for Closing Problem Solving!");
  }
}

function getActionableData() {
  const team = $("#_TECHNOCRATS").val();
  const date = $("#_daterangeTable").val();
  dates = date.split("-");
  const from =
    moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
  const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FActionable%2FSELECT_CAPA_ACTIONABLE";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/CAPA_TABLE_RESPONSE.json";

  const params = {
    "Param.1": team,
    "Param.2": from,
    "Param.3": to,
  };

  ajaxCall(
    API_URL,
    params,
    function (result) {
      console.log("GET ACTIONABLE DATA");
      console.log(result);
      const dataList = result.Rowsets.Rowset
        ? result.Rowsets.Rowset[0].Row
        : [];
      var htm = "";
      if (dataList && dataList.length > 0) {
        let tdata = "";
        $.each(dataList, function (i, item) {
          if(item.STATUS == 'Closed') {
            tdata += `<tr><td colspan="3">${item.KPI}</td>
            <td>${item.WHAT}</td>
            <td>${dateConvert(item.CREATION_DATE)}</td>
            <td>${dateConvert(item.CLOSURE_DATE)}</td>
            <td>${item.MEMBER}</td>
            <td>${dateConvert(item.LAST_UPDATEDON)}</td>
            <td>${item.STATUS}</td>
            <td>${item.COMMENTS}</td>
            <td>---</td>
            <td>---</td></tr>`;
          }
          else {
            tdata += `<tr><td colspan="3">${item.KPI}</td>
            <td>${item.WHAT}</td>
            <td>${dateConvert(item.CREATION_DATE)}</td>
            <td>${dateConvert(item.CLOSURE_DATE)}</td>
            <td>${item.MEMBER}</td>
            <td>${dateConvert(item.LAST_UPDATEDON)}</td>
            <td>${item.STATUS}</td>
            <td>${item.COMMENTS}</td>
            <td><a href="#" style="text-decoration: underline;"  onclick='modal2open(${JSON.stringify(
              item
            )})'>Edit</a></td>
            <td><a href="#" style="text-decoration: underline;" onclick='deleteActionable(${JSON.stringify(
              item
            )})'>close</a></td></tr>`;
          }
        });

        $("#_tableActionable tbody").html(tdata);
      } else {
        // console.log("no data for table");
        var noData =
          "<tr><td colspan='12' class='text-center'>" +
          "No Data" +
          "</td></tr>";
        $("#_tableActionable tbody").html(noData);
      }
    },
    function (err) {
      console.log("err", err);
    }
  );
}

let isEdit = "";
function modal2open(data) {
  var today = new Date();
  console.log(data);

  /*   CLOSURE_DATE: "07/30/2021 00:00:00"
COMMENTS: ""
CREATION_DATE: "07/30/2021 00:00:00"
KPI: ""
LAST_UPDATEDON: "07/30/2021 00:00:00"
MEMBER: ""
STATUS: "Pending"
TEAM_NAME: "" */

  isEdit = data ? data.ACT_ID : false;
  if (isEdit) {
    $("#act_kpi").val(data.KPI || "");
    $("#act_what").val(data.WHAT || "");
    $("#act_creation_date").val(dateConvert(data.CREATION_DATE) || "");
    $("#act_closure_date").val(dateConvert(data.CLOSURE_DATE) || "");
    $("#act_status").val(data.STATUS || "");
    $("#act_who").val(data.MEMBER || "");
    $("#act_comments").val(data.COMMENTS || "");
  } else {
    $("#act_kpi").val("");
    $("#act_what").val("");
    $("#act_creation_date").val("");
    $("#act_closure_date").val("");
    $("#act_status").val("");
    $("#act_who").val("");
    $("#act_comments").val("");
  }

  $('input[name="act_creation_date"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 1),
    maxDate: today,
    locale: {
      format: "MM-DD-YYYY",
    },
  });
  $('input[name="act_closure_date"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 1),
    minDate: today,
    locale: {
      format: "MM-DD-YYYY",
    },
  });

  $('input[name="act_last_updated_date"]').daterangepicker({
    singleDatePicker: true,
    // autoUpdateInput :false,
    autoApply: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 1),
    maxDate: today,
    locale: {
      format: "MM-DD-YYYY",
    },
  });

  $("#modal2").modal("open");
}

function createActionable() {
  const p1 = $("#act_kpi").val();
  const p2 = $("#_TECHNOCRATS").val();
  const p3 = $("#act_creation_date").val();
  const p4 = $("#act_closure_date").val();
  const p5 = $("#act_status").val();
  const p6 = $("#act_who").val();
  const p7 = $("#act_comments").val();
  const p8 = $("#act_what").val();

  /*Param.1: KPI
    Param.2: Team Name
    Param.3: Creation Date
    Param.4: Closure Date
    Param.5: Status
    Param.6: Member
    Param.7: Comments */
  console.log(p1, p2, p3, p4, p5, p6, p7, p8);

  if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6 || !p7 || !p8) {
    $("#error-msg1").text("All fields are required");
    return false;
  }

  $("#error-msg1").text("");

  console.log("EDIT IDIDIDIIDID - " + isEdit);
  if (isEdit) {
    ActionableUpdate(p1, p2, p3, p4, p5, p6, p7, p8, isEdit);
  } else {
    ActionableInsert(p1, p2, p3, p4, p5, p6, p7, p8);
  }
}

function ActionableInsert(p1, p2, p3, p4, p5, p6, p7, p8) {
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FActionable%2FXACT_ACTIONABLE_INSERT";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/INSERT_ACTIONABLE.json";

  const params = {
    "Param.1": p1,
    "Param.2": p2,
    "Param.3": dateService(p3),
    "Param.4": dateService(p4),
    "Param.5": p5,
    "Param.6": p6,
    "Param.7": p7,
    "Param.8": p8,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      $("#modal2").modal("close");

      //Need to reload the table
      getActionableData();
    },
    function (err) {
      console.log("err", err);
      $("#error-msg1").text("Unable to update the data. Try again later.");
    }
  );
}

function ActionableUpdate(p1, p2, p3, p4, p5, p6, p7, p8, actID) {
  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FActionable%2FUPDATE_CAPA_ACTIONABLE";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/INSERT_ACTIONABLE.json";

  const params = {
    "Param.1": p1,
    "Param.2": p2,
    "Param.3": dateService(p3),
    "Param.4": dateService(p4),
    "Param.5": p5,
    "Param.6": p6,
    "Param.7": p7,
    "Param.8": p8,
    "Param.9": actID,
  };
  // console.log('k-', API_URL)
  ajaxCall(
    API_URL,
    params,
    function (result) {
      $("#modal2").modal("close");

      //Need to reload the table
      getActionableData();
    },
    function (err) {
      console.log("err", err);
      $("#error-msg1").text("Unable to update the data. Try again later.");
    }
  );
}

var deleteListActionable = "";
function deleteActionable(data) {
  $("#closeModal2").modal("open");
  deleteListActionable = data;
}
function closeActionableData() {
  $("#closeModal2").modal("close");
  // console.log("delete", deleteList);

  const API =
    "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FActionable%2FCLOSE_CAPA_ACTIONABLE";
  const API_URL = ipAddress + API + contentType + externalCred;
  const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";

  const params = {
    "Param.1": deleteListActionable.ACT_ID,
  };
  console.log("k-", params);
  ajaxCall(
    API_URL,
    params,
    function (result) {
      getActionableData();
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
