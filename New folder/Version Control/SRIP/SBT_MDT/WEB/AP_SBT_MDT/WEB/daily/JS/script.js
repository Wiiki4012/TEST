 window.onload = function() {
if (!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
     var today = new Date();
     var endDate = new Date(today.getFullYear(), today.getMonth(), 1);
     //endDate.setDate(endDate.getDay() - 30);
     $('input[name="_daterange"]').daterangepicker({
             // singleDatePicker: true,
             autoApply: true,
             maxSpan: {
                 days: 31,
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
         function(start, end, label) {

         }
     );

     selectTechno();

     //On Load Animation
     AOS.init({
         duration: 1200,
     });
 };

 var externalCred = "&IllumLoginName=ap_cmn_srip&IllumLoginPassword=Pass12345"; //";
 var ipAddress = ""; //"http://172.16.156.105:50000";
 var contentType = "&IsTesting=T&Content-Type=text%2Fjson";

 function selectTechno() {
     const API = "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2FExecuteMasterTeam";
     const API_URL = ipAddress + API + contentType + externalCred;
     const Local_URL = "./JS/dummy_data/team.json";

     const params = {};
     ajaxCall(
         API_URL,
         params,
         function(result) {
             // $("#_TECHNOCRATS").empty();
             $("#_TECHNOCRATS").append("<option value='' disabled>Select Team</option>");
             const dataList = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
             // console.log("ajax-response", dataList);
             var htm = "";
             if (dataList && dataList.length > 0) {
                 $.each(dataList, function(i, item) {
                     htm += "<option value='" + item.TEAM_NAME + "'>" + item.TEAM_NAME + "</option>";
                 });
                 $("#_TECHNOCRATS").append(htm);
                 const pantV = {
                     value: dataList[0].TEAM_NAME,
                 };
                 listChart();
             } else {
                 // console.log("no data");

                 $("#plant").append("<option value='' selected disabled>Select Plant</option> <option value='' disabled>No Data</option>");
             }
         },
         function(err) {
             console.log("err", err);
             $("#plant").append("<option value='' selected disabled>Select Plant</option> <option value='' disabled>No Data</option>");
         }
     );
 }

 $.urlParam = function(name) {
     var results = new RegExp("[?&+]" + name + "=([^&#]*)").exec(window.location.href);
     if (results == null) {
         return null;
     } else {
         return results[1] || 0;
     }
 };

 function listChart() {
     var teamname = decodeURIComponent($.urlParam("teamname"));
     var team;
     if (teamname == null || teamname == "null" || teamname == "null") {
         team = $("#_TECHNOCRATS").val();
     } else {
         team = teamname;
     }
     $("#_team").text(team);
     const date = $("#_daterange").val();
     dates = date.split("-");
     const from = moment(dates[0], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";
     const to = moment(dates[1], "MM/DD/YYYY").format("YYYY-MM-DD") + "T00:00:00";

     Chart.helpers.each(Chart.instances, function(instance) {
         instance.destroy();
     });
     chartList(from, to, team);
 }

 function nonzerovalues(value) {
     return value !== 0;
 }

 function chartList(from, to, teamName) {
     const API = "/XMII/Illuminator?QueryTemplate=SBT_MDT%2FQuery%2FTRIGGER_LOGIC%2FGET_OPERATIONS%2FQRY%2FDAILY_GRAPH_COLOR_CODINGS";
     //const API = "/XMII/Illuminator?QueryTemplate=Test%2FQRY%2FDaily%2FDAILY_GRAPH_COLOR_CODINGS";
     const API_URL = ipAddress + API + contentType + externalCred;
     const Local_URL = "./JS/dummy_data/triggerTarget.json";

     const params = {
         "Param.1": from,
         "Param.2": to,
         "Param.3": teamName,
     };

     var charts = [];

     ajaxCall(
         API_URL,
         params,
         function(result) {
             const dataList = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
             console.log("ajax-trigger", dataList);

             if (dataList && dataList.length > 0) {
                 $.each(dataList, function(i, item) {

                     let index = charts.findIndex((x) => x.GRAPH_ID === item.GRAPH_ID);
                     if (index > -1) {
                         
                         if (item.FLAG == 0 && item.VALUE == 0) {
                             charts[index].barColor.push("rgba(249,249, 26, 1)");
                             charts[index].borderColor.push("rgba(249, 249, 26, 1)");

                         } else {
                             charts[index].barColor.push(item.BACKGROUND);
                             charts[index].borderColor.push(item.BORDER);
                         }
                         charts[index].LOWER.push(item.LOWER_LIMIT);
                         charts[index].UPPER.push(item.UPPER_LIMIT);

                         if (charts[index].LOWER_LEGEND.length > 0) {
                             charts[index].LOWER_LEGEND[charts[index].LOWER_LEGEND.length - 1] != item.LOWER_LIMIT ? charts[index].LOWER_LEGEND.push(item.LOWER_LIMIT) : "";
                             charts[index].UPPER_LEGEND[charts[index].UPPER_LEGEND.length - 1] != item.UPPER_LIMIT ? charts[index].UPPER_LEGEND.push(item.UPPER_LIMIT) : "";
                         }
                     } else {
                         item.LOWER = [];
                         item.UPPER = [];
                         item.date = [];
                         item.COMMENTS = [];
                         item.value = [];

                         item.barColor = [];
                         item.borderColor = [];
if (item.FLAG == 0 && item.VALUE == 0) {
                            item.barColor.push("rgba(249,249, 26, 1)");
                            item.borderColor.push("rgba(249, 249, 26, 1)");

                        }
                        else {
                            item.barColor.push(item.BACKGROUND);
                            item.borderColor.push(item.BORDER);
                        }
                     //    item.barColor.push(item.BACKGROUND);
                       //  item.borderColor.push(item.BORDER);
                         item.LOWER.push(item.LOWER_LIMIT);
                         item.UPPER.push(item.UPPER_LIMIT);
                         item.LOWER_LEGEND = [];
                         item.UPPER_LEGEND = [];
                         item.LOWER_LEGEND.push(item.LOWER_LIMIT);
                         item.UPPER_LEGEND.push(item.UPPER_LIMIT);
                         // item.LOWER_LEGEND = item.LOWER.filter(function(elem, indxx, self) {
                         //   return indxx === self.indexOf(elem);
                         // })
                         // item.UPPER_LEGEND = item.UPPER.filter(function(elem, indxx, self) {
                         //   return indxx === self.indexOf(elem);
                         // })
                         // charts[index].barColor.push(item.BACKGROUND);
                         // charts[index].borderColor.push(item.BORDER);
                         charts = [...charts, item];
                     }
                 });

                 console.log("ajax-charts", charts);
             }

             const API = "/XMII/Illuminator?QueryTemplate=AP_SBT_MDT%2FTransactionKPI%2Fexdummyselect";
            // const API = "/XMII/Illuminator?QueryTemplate=Test%2FCOCKPIT_2%2FQRY%2Fexdummyselect";
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
                 function(result) {
                     const dataList = result.Rowsets.Rowset ? result.Rowsets.Rowset[0].Row : [];
                     //console.log("ajax-graphValue", charts);

                     if (dataList && dataList.length > 0) {
                         $.each(dataList, function(i, item) {
                             // if (chartInstances["myChart" + item.GRAPH_ID]) {
                             //   chartInstances["myChart" + item.GRAPH_ID].destroy();
                             // }
                             let index = charts.findIndex((x) => x.GRAPH_ID === item.GRAPH_ID);
                             if (index > -1) {
                                 // console.log('index',  charts[index].barColor)
                                 charts[index].COMMENTS.push(item.COMMENTS);
                                 charts[index].date.push(moment(item.DATE, "MM/DD/YYYY").format("DD MMM"));
                                 if (charts[index].UPDATE_FREQ == "weekcommented" && parseFloat(item.VALUE) !== 0 && charts[index].UNITFORYAXIS != "%") {
                                     // let weeklycumlative = charts[index].value.reduce(function(a,b) { return a+b; }) + parseFloat(item.VALUE);
                                     if (charts[index].value.filter(nonzerovalues).length > 0) {
                                         let weeklycumlative = parseFloat(item.VALUE) + parseFloat(charts[index].value.filter(nonzerovalues)[charts[index].value.filter(nonzerovalues).length - 1]);
                                         charts[index].value.push(weeklycumlative);
                                         //  console.log("Cum", weeklycumlative);
                                     } else {
                                         let weeklycumlative = parseFloat(item.VALUE);
                                         charts[index].value.push(weeklycumlative);
                                         // console.log("Cum", weeklycumlative);
                                     }
                                 } else if (charts[index].UPDATE_FREQ == "week" && parseFloat(item.VALUE) == 0) {
                                     charts[index].value.push(parseFloat(item.VALUE));
                                 } else {
                                     charts[index].value.push(parseFloat(item.VALUE));
                                 }
                                 if (charts[index].UPDATE_FREQ == "week") {
                                     charts[index].LOWER_LIMIT = charts[index].LOWER_LEGEND[charts[index].LOWER_LEGEND.length - 1];
                                     charts[index].UPPER_LIMIT = charts[index].UPPER_LEGEND[charts[index].UPPER_LEGEND.length - 1];
                                 }
                                 parseFloat(charts[index].LOWER_LIMIT) ? charts[index].LOWER.push(parseFloat(charts[index].LOWER_LIMIT)) : "";
                                 parseFloat(charts[index].UPPER_LIMIT) ? charts[index].UPPER.push(parseFloat(charts[index].UPPER_LIMIT)) : "";
                                 // charts[index].barColor.push(charts[index].BACKGROUND);
                                 // charts[index].borderColor.push(charts[index].BORDER);
                             } else {
                                 item.date = [];
                                 item.value = [];
                                 item.COMMENTS = [];
                                 charts = [...charts, item];
                             }
                         });
                     }

                     //console.log("ajax-charts", charts);
                     if (charts && charts.length > 0) {
                         $.each(charts, function(index, item) {
                             if (index < 20) {
                                 const _list = {
                                     title: item.KPI,
                                     labels: item.date,
                                     yAxes: item.UNITFORYAXIS,
                                    
                                     dataSets: [{
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
                                             datalabels: {
                                                 display: true,
                                             },
                                             labels: item.COMMENTS,
                                         },
                                     ],
                                 };
                                 if (chartInstances["myChart" + item.GRAPH_ID]) {
                                     chartInstances["myChart" + item.GRAPH_ID].destroy();
                                 }
                                 chartInstances["myChart" + item.GRAPH_ID] = generateChart("myChart" + item.GRAPH_ID, item.IS_CHARTER_KPI, _list);
                             } 
                         });
                     }
                 },
                 function(err) {
                     console.log("err", err);
                 }
             );
         },
         function(err) {
             console.log("err", err);
         }
     );
 }

 function getColorName(index) {
     const bgColor = ["#DA218E", "#DA4121", "#61DA21", "#CCDA21", "#21DAB3", "#215FDA", "#8321DA", "#66621E", "#D6D46D", "#82C4F9"];
     const col = index % 10;
     return bgColor[col];
 }

 let chartInstances = {};

 function generateChart(id, charter, list) {
     //  console.log(list);
     const tooltip = {

         callbacks: {

             label: function(context) {
                 console.log(context)
                 return "Reason : "+ context.dataset.labels[context.dataIndex]
             }
         }

     };
 // Note: changes to the plugin code is not reflected to the chart, because the plugin is loaded at chart construction time and editor changes only trigger an chart.update().
    const image = new Image();
    image.src = "/XMII/CM/AP_SBT_MDT/CMN/charter1.png";
   const plugin = {
        id: 'custom_canvas_background_image',
        beforeDraw: (chart) => {
            if (chart.config.options.canvas.backgroundImage) {
                const ctx = chart.ctx;
                const { top, left, width, height } = chart.chartArea;
                                ctx.drawImage(image, 0, 0);
                ctx.restore();
            } else {
                image.onload = () => chart.draw();
            }
        }
    };
     const config = {
         type: 'bar',
         //lable: _.dataSets,
         data: {
             labels: list.labels,
             datasets: list.dataSets,
             //COMMENTS: list.COMMENTS,
         },
         plugins: [ChartDataLabels,plugin],
         options: {
 canvas: {
                backgroundImage: (charter == 'true') ? "url('/XMII/CM/AP_SBT_MDT/V3/CMN/charter1.png')" : "",
            },
             plugins: {

                 tooltip,
                 datalabels: {
                     backgroundColor: function(context) {
                         return context.dataset.backgroundColor;
                     },
                     borderRadius: 4,
                     color: "#0d0d0d",
                     padding: 2,
                     font: {
                         size: 14,
                     },
                 },
                 legend: {
                     display: true,
                     position: "top",
                     labels: {
                         boxWidth: 8,
                         // fontColor: "black",
                         fontSize: 12,
                         padding: 2,
                     },
                 },
                 title: {
                     display: true,
                     text: list.title,
                     fontSize: 26,
                     padding: 2,
                     // fontColor: "black",
                 },
             },
             scales: { 
             },
             responsive: true,
         }
     };
     var canvas = document.getElementById(id);
     var chartInstance = new Chart(canvas, config);


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