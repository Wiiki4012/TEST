window.onload = function() {
    $(".modal").modal();
    selectTeam();

    //   //On Load Animation
    AOS.init({
        duration: 1200,
    });
};
$(document).ready(function() {
    $('input[type=checkbox][name=ischarter]').change(function() {
        if ($(this).prop("checked")) {
            $(this).val('true');
        } else {
            $(this).val('false');
        }
    });
});

$(function() {
    $('input[id$=_target_w1]').keyup(function() {
        var txtClone = $(this).val();
        $('input[id$=_target_w2]').val(txtClone);
        $('input[id$=_target_w3]').val(txtClone);
        $('input[id$=_target_w4]').val(txtClone);
    });
});
$(function() {
    $('input[id$=_trigger_w1]').keyup(function() {
        var txtClone = $(this).val();
        $('input[id$=_trigger_w2]').val(txtClone);
        $('input[id$=_trigger_w3]').val(txtClone);
        $('input[id$=_trigger_w4]').val(txtClone);
    });
});
var externalCred = ""; //"&IllumLoginName=atos_mii&IllumLoginPassword=Pass01";
var ipAddress = ""; //http://172.16.156.105:50000";
var contentType = "&IsTesting=T&Content-Type=text%2Fjson";


function selectTeam() {
    const API ="/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterTeam";
       // "/XMII/Illuminator?QueryTemplate=Test%2FCOCKPIT_2%2FQRY%2FExecuteMasterTeam"; // Create dupl. - SQL DEETE GRAPH SELECT.

    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/team.json";

    const params = {};
    ajaxCall(
        API_URL,
        params,
        function(result) {
            $("#_team").empty();
            $("#_team").append("<option value='' disabled>Select Team</option>");
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row : [];
            // console.log("ajax-response", dataList);
            var htm = "";
            if (dataList && dataList.length > 0) {
                $.each(dataList, function(i, item) {
                    htm +=
                        "<option value='" +
                        item.SHIFT +
                        "~" +
                        item.TEAM_NAME +
                        "'>" +
                        item.TEAM_NAME +
                        "</option>";
                });
                $("#_team").append(htm);
                const pantV = {
                    value: dataList[0].TEAM_NAME,
                };
                _lists();
            } else {
                // console.log("no data");

                $("#_team").append(
                    "<option value='' selected disabled>Select Team</option> <option value='' disabled>No Data</option>"
                );
            }
        },
        function(err) {
            console.log("err", err);
            $("#_team").append(
                "<option value='' selected disabled>Select Team</option> <option value='' disabled>No Data</option>"
            );
        }
    );
}

function _lists() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    $('input[name="_datepicker"]').daterangepicker({
            singleDatePicker: true,
            autoApply: true,
            "opens": "left",
            "drops": "up",
            showDropdowns: true,
            minYear: 1901,
            maxYear: parseInt(moment().format("YYYY"), 10),
            startDate: yesterday,
            maxDate: yesterday,
            locale: {
                format: "MM-DD-YYYY",
            },
        },
        function(start, end, label) {
            // console.log(
            //   "A new date selection was made: " + start.format("YYYY-MM-DD")
            // );
        }
    );

    const team = teamShift().team;
    $("#_teamName").text(team);
    _graph(team);
    KPIValues();
}

function teamShift() {
    const split = $("#_team").val().split("~");
    const list = {
        shift: split[0],
        team: split[1],
    };
    return list;
}

function kpiupload() {
    $("#modaluploadkpi").modal({
        dismissible: false,
    });
    $("#modaluploadkpi").modal("open");
    // $("#fileUpload").val("");
    var input = $("#fileUpload");
    input.replaceWith(input.val("").clone(true));
    document.getElementById("_progress").style.display = "none";
}

  function getKPI() {
        
        const shift = teamShift().shift;
        const shift1 = teamShift().shift.trim();
        console.log("-------S-----H----I-----F------T-----------",shift);
        console.log("-------S-----H----I-----F------T-----------",shift1);
        const API =
       "/XMII/Illuminator?QueryTemplate=Test%2FCOCKPIT_2%2FQRY%2FTEST"; //Vikrant
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/triggerTarget.json";

   const params = {
       "Param.1":shift1,
   };
   ajaxCall(
    API_URL,
    params,
    function(err){
        console.log("err",err);
    }
   );
alert("KPI FETCHED PLEASE REFRESH OR RESELECT");
   }
function _graph(team) {
    const API =
        "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FTRIGGER_LOGIC%2FXACT_SELECT_KPI_TABLE"; // NO CHANGE
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/triggerTarget.json";

    const params = {
        "Param.1": team,
    };
    // console.log('k-', API_URL)
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row : [];
            // console.log('sd',dataList)
            var htm = "";
            if (dataList && dataList.length > 0) {
                dataList.sort(function(a, b) {
                    return parseFloat(a.GRAPH_ID) - parseFloat(b.GRAPH_ID);
                });
                $.each(dataList, function(i, item) {
                    htm +=
                        "<tr><td >" +
                        item.GRAPH_ID +
                        "</td><td>" +
                        item.TEAM_NAME +
                        "</td><td colspan='2'>" +
                        item.KPI +
                        "</td><td>" +
                        item.LOWER_LIMIT_W1 + "," + item.LOWER_LIMIT_W2 + "," + item.LOWER_LIMIT_W3 + "," + item.LOWER_LIMIT_W4 +
                        "</td><td>" +
                        item.UPPER_LIMIT_W1 + "," + item.UPPER_LIMIT_W2 + "," + item.UPPER_LIMIT_W3 + "," + item.UPPER_LIMIT_W4 +
                        "</td><td>" +
                        item.UNITFORYAXIS +
                        "</td><td>" +
                        item.CALC_LOGIC +
                        "</td><td>" +
                        item.UPDATE_FREQ +
                        "</td><td>" +
                        item.IS_CHARTER_KPI +
                        "</td>" +
                        "<td class='_banner' onclick='modal1open(" +
                        JSON.stringify(item) +
                        ")'>" +
                        "Edit" +
                        "</td></tr>";
                });
                $("#_graphList tbody").html(htm);
            } else {
                // console.log("no data for table");
                var noData =
                    "<tr><td colspan='7' class='text-center'>" + "No Data" + "</td></tr>";
                $("#_graphList tbody").html(noData);
            }
        },
        function(err) {
            console.log("err", err);
        }
    );
}

function modal1open(data) {
    $("#modal1").modal("open");
    $("#graphid").val(data.GRAPH_ID);
    $("#_kpi_name").val(data.KPI);
    $("#_UOM").val(data.UNITFORYAXIS);
    $("#_target_w1").val(data.UPPER_LIMIT_W1);
    $("#_target_w2").val(data.UPPER_LIMIT_W2);
    $("#_target_w3").val(data.UPPER_LIMIT_W3);
    $("#_target_w4").val(data.UPPER_LIMIT_W4);
    $("#_trigger_w1").val(data.LOWER_LIMIT_W1);
    $("#_trigger_w2").val(data.LOWER_LIMIT_W2);
    $("#_trigger_w3").val(data.LOWER_LIMIT_W3);
    $("#_trigger_w4").val(data.LOWER_LIMIT_W4);
    $("#_calculationlogic").val(data.CALC_LOGIC);
    $("#_updatefrequency").val(data.UPDATE_FREQ);
    if (data.IS_CHARTER_KPI == 'true') {
        $("#ischarter").attr('checked', true);
    } else {
        $("#ischarter").attr('checked', false);
    }
}

function clearGraph() {
    const team = teamShift().team;
    const data1 = "";
    const data2 = "";
    const data3 = "";
    const data4 = "";
    const data5 = "";
    const data6 = "";
    const graphid = $("#graphid").val();
    const radio = "";
    const charter = "false";

    console.log("radio", radio);
    document.getElementById("graph_err").style.display = "none";
    $("#btn_graph").addClass("enable");

    const API =
        "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FTRIGGER_LOGIC%2FUPDATE_KPI_NEW_LOGIC"; // NO CHANGE
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/GET_HOLIDAY.json";
    const params = {
        "Param.1": team,
        "Param.2": graphid,
        "Param.3": "",
        "Param.4": "Manual",
        "Param.5": "",
        "Param.6": "",
        "Param.7": "",
        "Param.8": "",
        "Param.9": "",
        "Param.10": "",
        "Param.11": "",
        "Param.12": "",
        "Param.13": "",
        "Param.14": "",
        "Param.15": "",
        "Param.16": ""
    };

    // console.log("k-", item.DATE, newDt);
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row : [];

            $("#btn_graph").removeClass("enable");
            $("#modal1").modal("close");
            _graph(team);

            // if (dataList && dataList.length > 0 && dataList[0].OUTPUT == "T") {
            //   $("#modal1").modal("close");
            //
            // } else {
            //   document.getElementById("graph_err").style.display = "block";
            //   $("#graph_err").text("Record Already Exist");
            // }
        },
        function(err) {
            console.log("err", err);
        }
    );
    setTimeout(function() {
        $("#btn_graph").removeClass("enable");
        document.getElementById("graph_err").style.display = "none";
    }, 5000);
}

function updateGraph() {
    const team = teamShift().team;
    const kpi = $("#_kpi_name").val();
    const uom = $("#_UOM").val();
    const targetw1 = $("#_target_w1").val();
    const targetw2 = $("#_target_w2").val();
    const targetw3 = $("#_target_w3").val();
    const targetw4 = $("#_target_w4").val();
    const triggerw1 = $("#_trigger_w1").val();
    const triggerw2 = $("#_trigger_w2").val();
    const triggerw3 = $("#_trigger_w3").val();
    const triggerw4 = $("#_trigger_w4").val();
    const calc = $("#_calculationlogic option:selected").val();
    const updatefreq = $("#_updatefrequency option:selected").val();
    const graphid = $("#graphid").val();
    const radio = $("input[type='radio'][name='KpiType']:checked").val();
    const charter = $("input[type='checkbox'][name='ischarter']").val();
    const dataC = kpi && uom && targetw1 && targetw2 && targetw3 && targetw4 && triggerw1 && triggerw2 && triggerw3 && triggerw4 && calc && updatefreq;
    console.log("radio", radio);
    document.getElementById("graph_err").style.display = "none";
    if (dataC) {
        $("#btn_graph").addClass("enable");

        const API =
            "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FTRIGGER_LOGIC%2FUPDATE_KPI_NEW_LOGIC"; // NO CHANGE
        const API_URL = ipAddress + API + contentType + externalCred;
        const Local_URL = "./JS/dummy_data/GET_HOLIDAY.json";
        const params = {
            "Param.1": team,
            "Param.2": graphid,
            "Param.3": kpi,
            "Param.4": "Manual",
            "Param.5": updatefreq,
            "Param.6": uom,
            "Param.7": calc,
            "Param.8": charter,
            "Param.9": triggerw1,
            "Param.10": triggerw2,
            "Param.11": triggerw3,
            "Param.12": triggerw4,
            "Param.13": targetw1,
            "Param.14": targetw2,
            "Param.15": targetw3,
            "Param.16": targetw4
        };

        // console.log("k-", item.DATE, newDt);
        ajaxCall(
            API_URL,
            params,
            function(result) {
                const dataList = result.Rowsets.Rowset ?
                    result.Rowsets.Rowset[0].Row : [];

                $("#btn_graph").removeClass("enable");
                $("#modal1").modal("close");
                _graph(team);

                // if (dataList && dataList.length > 0 && dataList[0].OUTPUT == "T") {
                //   $("#modal1").modal("close");
                //
                // } else {
                //   document.getElementById("graph_err").style.display = "block";
                //   $("#graph_err").text("Record Already Exist");
                // }
            },
            function(err) {
                console.log("err", err);
            }
        );
    } else {
        const err = !data1 ?
            "KPI Name" :
            !data2 ?
            "UOM" :
            "Trigger & Target";
        const _err = err + " field is missing";
        document.getElementById("graph_err").style.display = "block";
        $("#graph_err").text(_err);
    }
    setTimeout(function() {
        $("#btn_graph").removeClass("enable");
        document.getElementById("graph_err").style.display = "none";
    }, 5000);
}

function KPIValues() {
    const team = teamShift().team;
    const date = $("#_datepicker").val();
    const API ="/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteSelectManual";
       // "/XMII/Illuminator?QueryTemplate=Test%2FQRY%2FXACT_SELECT_MANNUAL_KPI"; //CREATE NEW
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/kpiupdate.json";

    const params = {
        "Param.1": team,
        "Param.2": dateConvert(date),
    };
    // console.log("k-", params);
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row : [];
            // console.log("sd", dataList);
            var htm = "";
            if (dataList && dataList.length > 0) {
                dataList.sort(function(a, b) {
                    return parseFloat(a.GRAPH_ID) - parseFloat(b.GRAPH_ID);
                });
                console.log(dataList);
                $.each(dataList, function(i, item) {
                    // if (item.TEAM_MEMBER) {
                    var newDt = moment(item.DATE, "MM/DD/YYYY");
                    var Date = moment(newDt).format("MM/DD/YYYY");
                    if (item.GRAPH_ID != 21) {
                        htm +=
                            "<tr><td>" +
                            item.TEAM_NAME +
                            "</td><td>" +
                            Date +
                            "</td><td>" +
                            item.SHIFT +
                            "</td><td>" +
                            item.GRAPH_ID +
                            "</td><td colspan='2'>" +
                            item.KPI_NAME +
                            "</td><td>" +
                            item.VALUE +
                            "</td><td> 1 " +
                            "</td>" + "<td colspan = '2'> " + item.COMMENTS +
                            "</td>" +
                            "</td><td class='_banner' onclick='KPIModal(" +
                            JSON.stringify(item) +
                            ")'>" +
                            "Edit" +
                            "</td></tr>";
                    }
                    // }
                });
                $("#_KpiValues tbody").html(htm);
            } else {
                // console.log("no data for table");
                var noData =
                    "<tr><td colspan='9' class='text-center'>" + "No Data" + "</td></tr>";
                $("#_KpiValues tbody").html(noData);
            }
        },
        function(err) {
            console.log("err", err);
        }
    );
}

function KPIModal(data) {
    // console.log(data)
    $("#KPIModal").modal("open");
    $("#_daily").val(data.VALUE);
    $("#_monthly").val(data.MONTHLY_VALUE);
    $("#_date").val(data.DATE);
    $("#_shift").val(data.SHIFT);
    $("#_sno").val(data.GRAPH_ID);
    $("#_kpiname").val(data.KPI_NAME);
    $("#_Reason").val(data.COMMENTS)

}

function dateConvert(date) {
    var newDt = moment(date, "MM/DD/YYYY");
    return moment(newDt).format("YYYY-MM-DD") + "T00:00:00";
}

function dateConvertExcel(date) {
    var newDt = moment(date, "DD-MM-YYYY");
    return moment(newDt).format("YYYY-MM-DD") + "T00:00:00";
}

function KPIUpdate() {
    const team = teamShift().team;
    const data1 = $("#_daily").val();
    const data2 = $("#_monthly").val();
    const data3 = $("#_date").val();
    const data4 = $("#_shift").val();
    const data5 = $("#_sno").val();
    const data6 = $("#_kpiname").val();
    const data7 = $("#_Reason").val();
    //const data8 = $("#_Flag").val();
    const dataC = data1;
    document.getElementById("KPI_err").style.display = "none";
    if (dataC) {
        $("#btn_KPI").addClass("enable");

        const API ="/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteManualUpdate";
           // "/XMII/Illuminator?QueryTemplate=Test%2FQRY%2FUPDATE_ZKPI_MANUAL_DATE_NEW"; // CREATE NEW
        const API_URL = ipAddress + API + contentType + externalCred;
        const Local_URL = "./JS/dummy_data/GET_HOLIDAY.json";
        const params = {
            "Param.1": team,
            "Param.2": dateConvert(data3),
            "Param.3": data4,
            "Param.4": data5,
            "Param.5": data6,
            "Param.6": data1,
            "Param.7": data2,
            "Param.8": data7,
        };

        // console.log("k-", item.DATE, newDt);
        ajaxCall(
            API_URL,
            params,
            function(result) {
                const dataList = result.Rowsets.Rowset ?
                    result.Rowsets.Rowset[0].Row : [];

                $("#btn_KPI").removeClass("enable");
                $("#KPIModal").modal("close");
                KPIValues();
            },
            function(err) {
                // $("#btn_KPI").removeClass("enable");
                console.log("err", err);
            }
        );
    } else {
        const err = !data1 ? "Daily" : "Monthly";
        const _err = "KPI Value " + err + " field is missing";
        document.getElementById("KPI_err").style.display = "block";
        $("#KPI_err").text(_err);
    }
    setTimeout(function() {
        $("#btn_KPI").removeClass("enable");
        document.getElementById("KPI_err").style.display = "none";
    }, 5000);
}

function selectFile() {
    document
        .getElementById("fileUpload")
        .addEventListener("change", function(event) {
            selectedFile = event.target.files[0];
            if (selectedFile) {
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    var data = event.target.result;
                    var workbook = XLSX.read(data, {
                        type: "binary",
                        cellDates: true,
                        dateNF: "MM-DD-YYYY",
                    });
                    workbook.SheetNames.forEach((sheet) => {
                        let rowObject = XLSX.utils.sheet_to_row_object_array(
                            workbook.Sheets[sheet]
                        );
                        let jsonObject = JSON.stringify(rowObject);
                        // console.log(jsonObject);
                        exceltoJson(JSON.parse(jsonObject));
                    });
                };
                fileReader.readAsBinaryString(selectedFile);
            }
        });
}

function exceltoJson(data) {
    document.getElementById("_progress").style.display = "block";
    // console.log("data", data);
    if (data && data.length > 0) {
        excelData = [];
        $.each(data, function(i, item) {
            if (item.DATE != moment().format('DD-MM-YYYY')) {
                const API =
                    "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteManualUpdate"; // CREATE NEW
                const API_URL = ipAddress + API + contentType + externalCred;
                const params = {
                    "Param.1": teamShift().team,
                    "Param.2": dateConvertExcel(item.DATE),
                    "Param.3": teamShift().shift,
                    "Param.4": item.GRAPHID,
                    "Param.5": item.KPI_NAME,
                    "Param.6": item.VALUE,
                    "Param.7": 0,
                    "Param.8": 1
                };

                // console.log("k-", item.DATE, newDt);
                ajaxCall(
                    API_URL,
                    params,
                    function(result) {
                        const excelList = result.Rowsets.Rowset ?
                            result.Rowsets.Rowset[0].Row : [];

                        // console.log("excelData.push(excelList[0]);", excelData);
                    },
                    function(err) {
                        console.log("err", err);
                        document.getElementById("_progress").style.display = "none";
                        $("#modaluploadkpi").modal("close");
                    }
                );
            } else {
                alert('Current Date Entries Not Allowed! - Row No - ' + (i + 2));
            }
        });
        document.getElementById("_progress").style.display = "none";
        $("#modaluploadkpi").modal("close");
        KPIValues();
    } else {
        document.getElementById("_progress").style.display = "none";
        $("#modaluploadkpi").modal("close");
    }
}

function ajaxCall(url, params, callback, error) {
    // console.log('fdg', error)
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        data: {...params },
        success: callback,
        error: error,
    });
}

function excelData() {
    const JSONData = [{
        DATE: "MM-DD-YYYY",
        GRAPHID: "1",
        KPI_NAME: "KPI NAME",
        VALUE: "30"
    }, ];
    const ShowLabel = true;
    const ReportTitle = "SBT_" + moment().unix();
    var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

    var CSV = "";
    //Set Report title in first row or line

    // CSV += ReportTitle + "\r\n\n";

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ",";
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + "\r";
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + "\r\n";
    }

    if (CSV == "") {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "Team";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}