window.onload = function() {
    selectTechno();

    //On Load Animation
    AOS.init({
        duration: 1200,
    });
};

var externalCred = "&IllumLoginName=atos_mii&IllumLoginPassword=Pass01";
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
        function(result) {
            // $("#_TECHNOCRATS").empty();
            $("#_TECHNOCRATS").append(
                "<option value='' disabled>Select Team</option>"
            );
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row : [];
            // console.log("ajax-response", dataList);
            var htm = "";
            if (dataList && dataList.length > 0) {
                $.each(dataList, function(i, item) {
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
        function(err) {
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
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    chartList(team);
}

setInterval(function() {
    const team = $("#_TECHNOCRATS").val();
    $("#_team").text(team);
    chartList(team);
}, 120000);

function star() {
    console.log("-----------------tttttttttttttteeeeeeeeeeeaaaaaaaaaam" + teamName);
    starUpload(teamName);
}

function chartList(teamName) {
    const API =
        "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FTRIGGER_LOGIC%2FGET_OPERATIONS%2FQRY%2FSELECT_MONTHLY_TRIGGER_TARGET_V1";
    const API_URL = ipAddress + API + contentType + externalCred;
    const Local_URL = "./JS/dummy_data/triggerTarget.json";

    const params = {
        "Param.1": teamName,
    };

    var charts = [];

    ajaxCall(
        API_URL,
        params,
        function(result) {
            const dataList = result.Rowsets.Rowset ?
                result.Rowsets.Rowset[0].Row : [];
            // console.log("ajax-trigger", dataList);
            if (dataList && dataList.length > 0) {
                $.each(dataList, function(i, item) {
                    let index = charts.findIndex((x) => x.GRAPH_ID === item.GRAPH_ID);
                    if (index > -1) {
                        charts[index].LOWER.push(item.LOWER_LIMIT);
                        charts[index].UPPER.push(item.UPPER_LIMIT);
                        if (charts[index].LOWER_LEGEND.length > 0) {
                            ((charts[index].LOWER_LEGEND[charts[index].LOWER_LEGEND.length - 1] != item.LOWER_LIMIT) ? charts[index].LOWER_LEGEND.push(item.LOWER_LIMIT) : '');
                            ((charts[index].UPPER_LEGEND[charts[index].UPPER_LEGEND.length - 1] != item.UPPER_LIMIT) ? charts[index].UPPER_LEGEND.push(item.UPPER_LIMIT) : '');
                        }
                    } else {
                        item.LOWER = [];
                        item.UPPER = [];
                        item.LOWER = [];
                        item.date = [];
                        item.value = [];
                        item.barColor = [];
                        item.borderColor = [];
                        item.LOWER.push(item.LOWER_LIMIT);
                        item.UPPER.push(item.UPPER_LIMIT);
                        item.LOWER_LEGEND = [];
                        item.UPPER_LEGEND = [];
                        item.LOWER_LEGEND.push(item.LOWER_LIMIT);
                        item.UPPER_LEGEND.push(item.UPPER_LIMIT);
                        charts = [...charts, item];
                    }
                    console.log(item.VALUE + "-----" + item.UPPER_LIMIT);

                });
                console.log("ajax-charts", charts);
            }
            if (dataList && dataList.length > 0) {
                $.each(dataList, function(i, item) {
                    let index = charts.findIndex((x) => parseInt(x.GRAPH_ID) === parseInt(item.GRAPH_ID));
                    if (index > -1) {
                        // console.log('index',  charts[index].barColor)
                        // charts[index].date.push(
                        //   moment(item.DATE, "MM/DD/YYYY").format("DD MMM")
                        // );
                        charts[index].date.push(
                            monthsList(item.MONTH_VAL) + "," + item.YEAR_VAL
                        );
                        charts[index].value.push(item.VALUE);
                        // charts[index].LOWER_LIMIT
                        //   ? charts[index].LOWER.push(charts[index].LOWER_LIMIT)
                        //   : "";
                        charts[index].UPPER_LIMIT ?
                            charts[index].UPPER.push(charts[index].UPPER_LIMIT) :
                            "";
                        if (parseFloat(charts[index].LOWER_LIMIT) > parseFloat(charts[index].UPPER_LIMIT)) {
                            const colorCode =
                                item.VALUE > parseFloat(item.UPPER_LIMIT) ?
                                "rgba(179, 57, 57, 0.2)" :
                                "rgba(33, 140, 116,0.2)";
                            charts[index].barColor ?
                                charts[index].barColor.push(colorCode) :
                                "";
                            const bordercode =
                                item.VALUE > parseFloat(item.UPPER_LIMIT) ?
                                "rgba(179, 57, 57, 1)" :
                                "rgba(33, 140, 116,1)";
                            charts[index].barColor ?
                                charts[index].borderColor.push(bordercode) :
                                "";
                        } else {
                            const colorCode =
                                item.VALUE < parseFloat(item.UPPER_LIMIT) ?
                                "rgba(179, 57, 57, 0.2)" :
                                "rgba(33, 140, 116,0.2)";
                            charts[index].barColor ?
                                charts[index].barColor.push(colorCode) :
                                "";
                            const bordercode =
                                item.VALUE < parseFloat(item.UPPER_LIMIT) ?
                                "rgba(179, 57, 57, 1)" :
                                "rgba(33, 140, 116,1)";
                            charts[index].barColor ?
                                charts[index].borderColor.push(bordercode) :
                                "";
                        }

                    } else {
                        item.date = [];
                        item.value = [];
                        item.date.push(
                            monthsList(item.MONTH_VAL) + "," + item.YEAR_VAL
                        );
                        item.value.push(parseFloat(item.VALUE));

                        charts = [...charts, item];
                    }
                });
                console.log("Abby", charts);
            }

            //    const API =
            //      "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FNEW_KPI_LOGIC%2FTRANSACTIONS%2FXACUTE_MONTHLY_SELECT";
            // const API_URL = ipAddress + API + contentType + externalCred;
            // const Local_URL = "./JS/dummy_data/graphValue.json";

            // const params = {
            //    "Param.1": teamName,
            //  };
            //  ajaxCall(
            //    API_URL,
            //   params,
            //  function(result) {
            //    const dataList = result.Rowsets.Rowset ?
            //      result.Rowsets.Rowset[0].Row : [];
            // console.log("ajax-graphValue", charts);

            // if (dataList && dataList.length > 0) {
            //     $.each(dataList, function(i, item) {
            //         let index = charts.findIndex((x) => parseInt(x.GRAPH_ID) === parseInt(item.GRAPH_ID));
            //         if (index > -1) {
            //             // console.log('index',  charts[index].barColor)
            //             // charts[index].date.push(
            //             //   moment(item.DATE, "MM/DD/YYYY").format("DD MMM")
            //             // );
            //             charts[index].date.push(
            //                 monthsList(item.MONTH_VAL) + "," + item.YEAR_VAL
            //             );
            //             charts[index].value.push(item.VALUE);
            //             // charts[index].LOWER_LIMIT
            //             //   ? charts[index].LOWER.push(charts[index].LOWER_LIMIT)
            //             //   : "";
            //             charts[index].UPPER_LIMIT ?
            //                 charts[index].UPPER.push(charts[index].UPPER_LIMIT) :
            //                 "";
            //            // if (parseFloat(charts[index].LOWER_LIMIT) > parseFloat(charts[index].UPPER_LIMIT)) {
            //                 const colorCode =
            //                     item.VALUE > parseFloat(charts[index].UPPER_LIMIT) ?
            //                     "rgba(179, 57, 57, 0.2)" :
            //                     "rgba(33, 140, 116,0.2)";
            //                 charts[index].barColor ?
            //                     charts[index].barColor.push(colorCode) :
            //                     "";
            //                 const bordercode =
            //                     item.VALUE > parseFloat(charts[index].UPPER_LIMIT) ?
            //                     "rgba(179, 57, 57, 1)" :
            //                     "rgba(33, 140, 116,1)";
            //                 charts[index].barColor ?
            //                     charts[index].borderColor.push(bordercode) :
            //                     "";
            //             // } else {
            //             //     const colorCode =
            //             //         item.VALUE < parseFloat(charts[index].UPPER_LIMIT) ?
            //             //         "rgba(179, 57, 57, 0.2)" :
            //             //         "rgba(33, 140, 116,0.2)";
            //             //     charts[index].barColor ?
            //             //         charts[index].barColor.push(colorCode) :
            //             //         "";
            //             //     const bordercode =
            //             //         item.VALUE < parseFloat(charts[index].UPPER_LIMIT) ?
            //             //         "rgba(179, 57, 57, 1)" :
            //             //         "rgba(33, 140, 116,1)";
            //             //     charts[index].barColor ?
            //             //         charts[index].borderColor.push(bordercode) :
            //             //         "";
            //             // }

            //         } else {
            //             item.date = [];
            //             item.value = [];
            //             item.date.push(
            //                 monthsList(item.MONTH_VAL) + "," + item.YEAR_VAL
            //             );
            //             item.value.push(parseFloat(item.VALUE));

            //             charts = [...charts, item];
            //         }
            //     });
            //     console.log("Abby", charts);
            // }

            //console.log("ajax-charts", charts);
            if (charts && charts.length > 0) {
                $.each(charts, function(index, item) {
                    if (index < 20) {
                        const _list = {
                            title: item.KPI,
                            labels: item.date,
                            yAxes: item.UNITFORYAXIS,
                            dataSets: [
                                // {
                                //   label: "Trigger-" + Math.round(item.LOWER_LEGEND),
                                //   type: "line",
                                //   data: item.LOWER,
                                //   borderColor: "#DA4121",
                                //   backgroundColor: "#DA4121",
                                //   borderWidth: 1,
                                //   lineTension: 0,
                                //   fill: false,
                                //   datalabels: {
                                //     display: false,
                                //   },
                                // },
                                {
                                    label: "Target-" + item.UPPER_LEGEND,
                                    type: "line",
                                    data: item.UPPER,
                                    borderColor: "#7d5fff",
                                    backgroundColor: "#7d5fff",
                                    borderWidth: 0.5,
                                    lineTension: 0,
                                    steppedLine: true,
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
                        chartInstances["myChart" + item.GRAPH_ID] = generateChart(
                            "myChart" + item.GRAPH_ID,
                            _list
                        );
                    }
                });
            }
        },
        function(err) {
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
                    backgroundColor: function(context) {
                        // console.log('s', context)
                        return context.dataset.backgroundColor;
                    },
                    borderRadius: 4,
                    color: "#0d0d0d",
                    padding: 2,
                    //  formatter: Math.round,
                    font: {
                        // weight: "bolder",
                        size: 20,
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
                    fontSize: 16,
                    padding: 2,
                },
            },
            title: {
                display: true,
                text: list.title,
                fontSize: 25,
                padding: 2,
                // fontColor: "black",
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 16,
                    },
                }, ],
                yAxes: [{
                    position: "left",
                    ticks: {
                        beginAtZero: true,
                        // stepSize: 80,
                        fontSize: 16,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: list.yAxes,
                    },
                }, ],
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
    document.querySelectorAll("._type").forEach(function(element, index) {
        element.classList.remove("active");
    });
    $("#_myChart" + id).addClass("active");
}

function ajaxCall(url, params, callback, error) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        data: {...params },
        success: callback,
        error: error,
    });
}



function starload() {
    console.log("-----------------tttttttttttttteeeeeeeeeeeaaaaaaaaaam" + teamName);
    starUpload(teamName);
}

function star() {
    console.log("-----------------tttttttttttttteeeeeeeeeeeaaaaaaaaaam" + teamName);
    starUpload(teamName);
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
                result.Rowsets.Rowset[0].Row : [];
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
                    result.Rowsets.Rowset[0].Row : [];
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