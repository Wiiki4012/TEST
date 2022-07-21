window.onload = function() {
    $(".modal").modal();
    selectTeam();

    //   //On Load Animation
    AOS.init({
        duration: 1200,
    });
    var today = new Date();
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - 30);
    $('input[name="_reportdaterange"]').daterangepicker({
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
        function(start, end, label) {
            // console.log(
            //   "A new date selection was made: " + start.format("YYYY-MM-DD")
            // );
        }
    );
};

var externalCred = "";
var ipAddress = "";
var contentType = "&IsTesting=T&Content-Type=text%2Fjson";
var selectedFile;

function selectTeam() {
    const API =
        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterTeam";
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
                result.Rowsets.Rowset[0].Row :
                [];
            // console.log("ajax-response", dataList);
            var htm = "";
            var htm1 = "";
            var mdt = [];
            if (dataList && dataList.length > 0) {
                $.each(dataList, function(i, item) {
                    const teamname = item.TEAM_NAME;
                    const split = teamname.split("-");
                    if (split[0] == 'MDT ') {
                        mdt = [...mdt, item];
                    }
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
                $.each(mdt, function(i, item) {
                    htm1 +=
                        "<option value='" +
                        item.TEAM_NAME +
                        "'>" +
                        item.TEAM_NAME +
                        "</option>";
                });
                $("#MDTteams").append(htm1);
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


function memberwiseattendancereport() {
    const split = $("#_team").val().split("~");
    const team = split[1];
    const date = $("#_reportdaterange").val();
    dates = date.split("-");
    const from =
        moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
    const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

    $.ajax({
        type: "GET",
        //    url: "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQuery%2FExecuteAttenPercentage&Content-Type=text/csv",
        url: "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTest%2FSQLSBTQuery&Content-Type=text/csv",
        data: {
            'Param.1': team,
            'Param.2': from,
            'Param.3': to
        },
        async: false,
        success(data) {
            var blob = new Blob([data], {
                type: 'application/ms-excel'
            });
            var downloadUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "Memberwise_attendance.csv";
            document.body.appendChild(a);
            a.click();
        },
        complete: function() {
            //stoploader();
        }
    });
}

function datewiseattendancereport() {
    const split = $("#_team").val().split("~");
    const team = split[1];
    const date = $("#_reportdaterange").val();
    dates = date.split("-");
    const from =
        moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
    const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

    $.ajax({
        type: "GET",
        url: "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransaction%2FXACT_ATTENDANCE_NEWLOGIC&Content-Type=text/csv",
        data: {
            'Param.1': team,
            'Param.2': from,
            'Param.3': to
        },
        async: false,
        success(data) {
            var blob = new Blob([data], {
                type: 'application/ms-excel'
            });
            var downloadUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "datewise_attendance.csv";
            document.body.appendChild(a);
            a.click();
        },
        complete: function() {
            //stoploader();
        }
    });
}

function maindashboardreport() {
    const split = $("#_team").val().split("~");
    const team = split[1];
    const date = $("#_reportdaterange").val();
    dates = date.split("-");
    const from =
        moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
    const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

    $.ajax({
        type: "GET",
        url: "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQueryTeams_S1%2FQuery%2FSQL_MAINDASHBOARD_REPORT&Content-Type=text/html",
        data: {
            'Param.1': team,
            'Param.2': from,
            'Param.3': to
        },
        async: false,
        success(data) {
            var blob = new Blob([data], {
                type: 'application/ms-excel'
            });
            var downloadUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "Maindashboard_Report.xls";
            document.body.appendChild(a);
            a.click();
        },
        complete: function() {
            //stoploader();
        }
    });
}


function kpireport() {
    const split = $("#_team").val().split("~");
    const team = split[1];
    const date = $("#_reportdaterange").val();
    dates = date.split("-");
    const from =
        moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
    const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

    $.ajax({
        type: "GET",
        url: "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQueryTeams_S1%2FKPI_REPORT&Content-Type=text/csv",
        data: {
            'Param.1': team,
            'Param.2': from,
            'Param.3': to
        },
        async: false,
        success(data) {
            var blob = new Blob([data], {
                type: 'application/ms-excel'
            });
            var downloadUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "KPI_Report.csv";
            document.body.appendChild(a);
            a.click();
        },
        complete: function() {
            //stoploader();
        }
    });
}

function psreport() {
    const split = $("#_team").val().split("~");
    const team = split[1];
    const date = $("#_reportdaterange").val();
    dates = date.split("-");
    const from =
        moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
    const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

    $.ajax({
        type: "GET",
        url: "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FQueryTeams_S1%2FTransactions%2FProblemSolving_REPORT_DUPL&Content-Type=text/csv",

        data: {
            'Param.1': team,
            'Param.2': from,
            'Param.3': to
        },
        async: false,
        success(data) {
            var blob = new Blob([data], {
                type: 'application/ms-excel'
            });
            var downloadUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "CAPA_Report.csv";
            document.body.appendChild(a);
            a.click();
        },
        complete: function() {
            //stoploader();
        }
    });
}


function _lists() {
    const team = teamShift().team;
    $("#_teamName").text(team);
    sbtTeam();
    memeberTable(team);
}

function teamShift() {
    const split = $("#_team").val().split("~");
    const list = {
        shift: split[0],
        team: split[1],
    };
    return list;
}

var sbtList = [];

function sbtTeam() {
    const API =
        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterTeam";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/team.json";

    const params = {};
    // console.log('k-', API_URL)
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row :
                [];
            // console.log('sd',dataList)
            var htm = "";
            if (dataList && dataList.length > 0) {
                SBTTable(dataList);
            } else {
                // console.log("no data for table");
                var noData =
                    "<tr><td colspan='7' class='text-center'>" + "No Data" + "</td></tr>";
                $("#_sbtList tbody").html(noData);
            }
        },
        function(err) {
            console.log("err", err);
        }
    );
}

function SBTTable(dataList) {
    // console.log('ss', dataList)
    var htm = "";
    if (dataList && dataList.length > 0) {
        sbtList = dataList;
        $.each(dataList, function(i, item) {
            const teamname = item.TEAM_NAME;
            const split = teamname.split("-");
            if (split[0] != 'SBT ') {
                htm +=
                    "<tr><td colspan='2'>" +
                    item.TEAM_NAME +
                    "</td><td>" +
                    item.SHIFT +
                    "</td><td class='_banner' onclick='starUpload(" +
                    JSON.stringify(item.TEAM_NAME) +
                    ")'>" +
                    "upload" +
                    "</td><td class='_banner' onclick='bannerUpload(" +
                    JSON.stringify(item.TEAM_NAME) +
                    ")'>" +
                    "upload" +
                    "</td>" +
                    "<td>---</td>" +
                    "<td class='_delete' onclick='SBTDelete(" +
                    JSON.stringify(item.TEAM_NAME) +
                    ")'>" +
                    "Delete" +
                    "</td></tr>";
            } else {
                htm +=
                    "<tr><td colspan='2'>" +
                    item.TEAM_NAME +
                    "<span class='mapmdt'>(" + item.RES_MDT + ")</span>" +
                    "</td><td>" +
                    item.SHIFT +
                    "</td><td class='_banner' onclick='starUpload(" +
                    JSON.stringify(item.TEAM_NAME) +
                    ")'>" +
                    "upload" +
                    "</td><td class='_banner' onclick='bannerUpload(" +
                    JSON.stringify(item.TEAM_NAME) +
                    ")'>" +
                    "upload" +
                    "</td>" +
                    "<td class='_banner' onclick='editteams(" + JSON.stringify(item.TEAM_NAME) + ")'>" + "Edit" + "</td>" +
                    "<td class='_delete' onclick='SBTDelete(" +
                    JSON.stringify(item.TEAM_NAME) +
                    ")'>" +
                    "Delete" +
                    "</td></tr>";
            }
        });
        $("#_sbtList tbody").html(htm);
    }
}

function SBTDelete(team) {
    $("#_deleteTeam").text(team);
    $("#closeModal").modal("open");
}

function deleteSBTData() {
    var input = prompt("Please Verify Your Identity", "");
    if (input != "$123SRIP") {
        alert("You're not Allowed to Delete!");
    } else {
    const API =

        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterTeam";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/NEW_SKU_DETAILS.json";
    const _team = $("#_deleteTeam").text();
    const params = {
        "Param.1": "N",
        "Param.2": _team,
    };
    $("#closeModal").modal("close");
    const list = sbtList.filter(function(x) {
        return x.TEAM_NAME !== _team;
    });
    SBTTable(list);
    // console.log("k-", params);
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets ? result.Rowsets.Rowset[0].Row : [];
            console.log("sd", dataList);

            // sbtTeam();
        },
        function(err) {
            console.log("err", err);
        }
    );
    }
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
                        dateNF: "yyyy/mm/dd",
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
            const API =
                "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT/Excel_Upload/Transaction/XCT_EXCEL_UPLOAD";
            const API_URL = ipAddress + API + contentType + externalCred;
            const Local_URL = "./JS/dummy_data/GET_HOLIDAY.json";
            const params = {
                "Param.1": teamShift().team,
                "Param.2": teamShift().shift,
                "Param.3": item.START_DATE,
                "Param.4": item.END_DATE,
            };

            // console.log("k-", item.DATE, newDt);
            ajaxCall(
                API_URL,
                params,
                function(result) {
                    const excelList = result.Rowsets.Rowset ?
                        result.Rowsets.Rowset[0].Row :
                        [];

                    if (excelList && excelList.length > 0) {
                        excelData.push(excelList[0]);
                        // console.log('succ', data.length, excelData.length)
                        if (data.length === excelData.length) {
                            // console.log('succ')
                            document.getElementById("_progress").style.display = "none";
                            $("#modal1").modal("close");
                            sbtTeam();
                        }
                    }

                    // console.log("excelData.push(excelList[0]);", excelData);
                },
                function(err) {
                    console.log("err", err);
                    document.getElementById("_progress").style.display = "none";
                    $("#modal1").modal("close");
                }
            );
        });
    } else {
        document.getElementById("_progress").style.display = "none";
        $("#modal1").modal("close");
    }
}

function modal1open() {
    $("#modal1").modal({
        dismissible: false,
    });
    $("#modal1").modal("open");
    // $("#fileUpload").val("");
    var input = $("#fileUpload");
    input.replaceWith(input.val("").clone(true));
    document.getElementById("_progress").style.display = "none";
}

function modal1openInsert() {
    $("#modal1Create").modal("open");
    $("#_team_name").val("");
    $("#_shift").val("");
    $("#objective").val("");
}

function sbtInsert() {
    const data1 = $("#_teamtype").val() + $("#_team_name").val();
    const data2 = $("#_shift").val();
    const data3 = 'Objective';
    const dataC = data1 && data2;
    document.getElementById("sbt_err").style.display = "none";
    if (dataC) {
        $("#btn_sbt").addClass("enable");

        const API =
            "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteKPIInsert";
        const API_URL = ipAddress + API + contentType + externalCred;
        const Local_URL = "./JS/dummy_data/GET_HOLIDAY.json";
        const params = {
            "Param.1": data1,
            "Param.2": data2,
            "Param.5": data3,
        };

        // console.log("k-", item.DATE, newDt);
        ajaxCall(
            API_URL,
            params,
            function(result) {
                const dataList = result.Rowsets.Rowset ?
                    result.Rowsets.Rowset[0].Row :
                    [];

                $("#btn_sbt").removeClass("enable");
                $("#modal1").modal("close");
                sbtTeam();
                selectTeam();
                // if (dataList && dataList.length > 0 && dataList[0].OUTPUT == "T") {
                //   $("#modal1").modal("close");
                //    sbtTeam();
                // } else {
                //   document.getElementById("sbt_err").style.display = "block";
                //   $("#sbt_err").text("Record Already Exist");
                // }
            },
            function(err) {
                console.log("err", err);
            }
        );
    } else {
        const err = !data1 ? "Team Name" : !data2 ? "Shift" : "Objective";
        const _err = err + " field is missing";
        document.getElementById("sbt_err").style.display = "block";
        $("#sbt_err").text(_err);
    }
    setTimeout(function() {
        $("#btn_sbt").removeClass("enable");
        document.getElementById("sbt_err").style.display = "none";
    }, 5000);
}

function bannerUpload(data) {
    $("#_uploadFile").modal("open");
    $("#uploadTeam").text(data);
    $("#_base64Img").val("");

    const API =
        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FXACT_SELECT_ALLBANNERS";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/imgSelect.json";

    const params = {
        'Param.1': data
    };
    // console.log('k-', API_URL)
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row :
                [];
            // console.log('img',dataList)
            document.getElementById("_noData").style.display = "none";
            document.getElementById("_uploadImg").style.display = "none";
            if (dataList && dataList.length > 0) {
                document.getElementById("_uploadImg").style.display = "block";
                document.getElementById("_uploadImg").src = "data:image/png;base64," + dataList[0].BASE64;
                $("#_base64Img").val(dataList[0].BASE64);
            } else {
                document.getElementById("_noData").style.display = "block";
                // console.log("no data");
            }
        },
        function(err) {
            console.log("err", err);
        }
    );
}

function starUpload(data) {
    $("#_uploadStar").modal("open");
    $("#uploadStarTeamName").text(data);
    $("#_base64ImgStar").val("");

    const API =
        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FXACT_GET_STAROFTHEDAY";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/imgSelect.json";

    const params = {
        'Param.1': data
    };
    // console.log('k-', API_URL)
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row :
                [];
            // console.log('img',dataList)
            document.getElementById("_noDataStar").style.display = "none";
            document.getElementById("_uploadImgstar").style.display = "none";
            if (dataList && dataList.length > 0) {
                document.getElementById("_uploadImgstar").style.display = "block";
                document.getElementById("_uploadImgstar").src = "data:image/png;base64," + dataList[0].BASE64;
                $("#_base64ImgStar").val(dataList[0].BASE64);
            } else {
                document.getElementById("_noDataStar").style.display = "block";
                // console.log("no data");
            }
        },
        function(err) {
            console.log("err", err);
        }
    );
}

function uploadFile(e) {
    // console.log(e.target.files)
    $("#sbt_banner").text("");
    $("#btn_banner").removeClass("enable");
    if (e.target.files && e.target.files[0]) {
        var FR = new FileReader();

        FR.addEventListener("load", function(e) {
            // console.log(e.target.result);
            document.getElementById("_uploadImg").src = e.target.result;
            $("#_base64Img").val(e.target.result);
        });

        FR.readAsDataURL(e.target.files[0]);
    }
}

function uploadFilestar(e) {
    // console.log(e.target.files)
    $("#sbt_star").text("");
    $("#btn_star").removeClass("enable");
    if (e.target.files && e.target.files[0]) {
        var FR = new FileReader();
        c

        FR.addEventListener("load", function(e) {
            // console.log(e.target.result);
            document.getElementById("_uploadImgstar").src = e.target.result;
            $("#_base64ImgStar").val(e.target.result);
        });

        FR.readAsDataURL(e.target.files[0]);
    }
}

function bannerData() {
    let team = $("#uploadTeam").text();
    let src = $("#_base64Img").val().split(",");
    console.log(src[0]);
    //console.log(src);
    $("#sbt_banner").text("");

    if (src) {
        $("#btn_banner").addClass("enable");
        const API_URL =
            "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FXACT_UPDATE_TEAMBANNER&IsTesting=T&Content-Type=text%2Fjson";
        // const API_URL = ipAddress + API + contentType + externalCred;
        const Local_URL = "./JS/dummy_data/imgSelect.json";

        const params = {
            "Param.1": team,
            "Param.2": src[1],
        };
        // console.log('k-', API_URL)
        ajaxCall1(
            API_URL,
            params,
            function(result) {
                const dataList = result.Rowsets.Rowset ?
                    result.Rowsets.Rowset[0].Row :
                    [];
                $("#btn_banner").removeClass("enable");
                $("#_uploadFile").modal("close");
            },
            function(err) {
                $("#btn_banner").removeClass("enable");
                console.log("err", err);
            }
        );
    } else {
        // console.log('k-', 97)
        $("#btn_banner").removeClass("enable");
        $("#sbt_banner").text("Image field is missing");
    }
}

function starData() {
    let team = $("#uploadStarTeamName").text();
    let src = $("#_base64ImgStar").val().split(",");
    console.log(src[0]);
    //console.log(src);
    $("#sbt_star").text("");

    if (src) {
        $("#btn_star").addClass("enable");
        const API_URL =
            "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionTeams%2FXACT_UPDATE_STAR&IsTesting=T&Content-Type=text%2Fjson";
        // const API_URL = ipAddress + API + contentType + externalCred;
        const Local_URL = "./JS/dummy_data/imgSelect.json";

        const params = {
            "Param.1": team,
            "Param.2": src[1],
        };
        // console.log('k-', API_URL)
        ajaxCall1(
            API_URL,
            params,
            function(result) {
                const dataList = result.Rowsets.Rowset ?
                    result.Rowsets.Rowset[0].Row :
                    [];
                $("#btn_star").removeClass("enable");
                $("#_uploadStar").modal("close");
            },
            function(err) {
                $("#btn_star").removeClass("enable");
                console.log("err", err);
            }
        );
    } else {
        // console.log('k-', 97)
        $("#btn_star").removeClass("enable");
        $("#sbt_star").text("Image field is missing");
    }
}

function memeberTable(team) {
    const API =
        "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterSelectMembers";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/member.json";

    const params = {
        "Param.1": team,
    };
    // console.log('k-', API_URL)
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row :
                [];
            // console.log('sd',dataList)
            var htm = "";
            if (dataList && dataList.length > 0) {
                dataList.sort(function(a, b) {
                    return parseFloat(a.SNO) - parseFloat(b.SNO);
                });
                $.each(dataList, function(i, item) {
                    // if (item.TEAM_MEMBER) {
                    htm +=
                        "<tr><td>" +
                        item.SNO +
                        "</td><td>" +
                        item.TEAM_NAME +
                        "</td><td>" +
                        item.TEAM_MEMBER +
                        "</td><td class='_banner' onclick='memberModal(" +
                        JSON.stringify(item) +
                        ")'>" +
                        "Edit" +
                        "</td></tr>";
                    // }
                });
                $("#_editTeam tbody").html(htm);
            } else {
                // console.log("no data for table");
                var noData =
                    "<tr><td colspan='4' class='text-center'>" + "No Data" + "</td></tr>";
                $("#_editTeam tbody").html(noData);
            }
        },
        function(err) {
            console.log("err", err);
        }
    );
}

function memberModal(data) {
    // console.log(data)
    $("#memberEdit").modal("open");
    $("#_sno").val(data.SNO);
    $("#_Memberteam_Name").val(data.TEAM_NAME);
    $("#_teamMember").val(data.TEAM_MEMBER);

}

function editteams(data) {
    // console.log(data)
    $("#editteams").modal("open");
    $("#teamnameedit").text(data);
    $("#teamnamefield").val(data);
}

function memberUpdate() {
    const data1 = $("#_sno").val();
    const data2 = $("#_Memberteam_Name").val();
    const data3 = $("#_teamMember").val();
    const dataC = data3;
    document.getElementById("member_err").style.display = "none";
    if (dataC) {
        $("#btn_member").addClass("enable");

        const API =
            "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterUpdateMembers";
        const API_URL = ipAddress + API + contentType + externalCred;
        const Local_URL = "./JS/dummy_data/GET_HOLIDAY.json";
        const params = {
            "Param.1": data1,
            "Param.2": data3,
            "Param.3": data2,
        };

        // console.log("k-", item.DATE, newDt);
        ajaxCall(
            API_URL,
            params,
            function(result) {
                const dataList = result.Rowsets.Rowset ?
                    result.Rowsets.Rowset[0].Row :
                    [];

                $("#btn_member").removeClass("enable");
                $("#memberEdit").modal("close");
                memeberTable(data2);


            },
            function(err) {
                $("#btn_member").removeClass("enable");
                console.log("err", err);
            }
        );
    } else {
        const _err = "Team Member field is missing";
        document.getElementById("member_err").style.display = "block";
        $("#member_err").text(_err);
    }
    setTimeout(function() {
        $("#btn_member").removeClass("enable");
        document.getElementById("member_err").style.display = "none";
    }, 5000);
}

function teamupdate() {
    const data1 = $("#teamnamefield").val();
    const data2 = $("#MDTteams").val();
    const API =
        "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FXact%2FXACT_MDT_MAPPING";
    const API_URL = ipAddress + API + contentType + externalCred;
    const params = {
        "Param.1": data1,
        "Param.2": data2
    };

    // console.log("k-", item.DATE, newDt);
    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row :
                [];
            if (dataList && dataList.length > 0) {
                alert('Updated');
                sbtTeam();
            }
        },
        function(err) {

        }
    );
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

function ajaxCall1(url, params, callback, error) {
    // console.log('fdg', error)
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: {...params },
        success: callback,
        error: error,
    });
}

function excelData() {
    const JSONData = [{
        START_DATE: "MM-DD-YYYY",
        END_DATE: "MM-DD-YYYY",
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