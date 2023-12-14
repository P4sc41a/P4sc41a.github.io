// $.ajax("src/car.py",{type:"HEAD", async:true}).done(function(a,b,c){
//  alert(c.getResponseHeader("Last-Modified"));});


//get the files from the server
var files = [   "src/rasp4log.txt",
                "src/rasp5log.txt",
                "src/rasp6log.txt",
                "src/rasp7log.txt",
                "src/rasp8log.txt"];

var logdict = {};
var indexcount = files.length;
var filesLoaded = false;

//add them to the deviceselectorr
var deviceSelector = $("#deviceselector2")[0];
populateDeviceSelector(deviceSelector)

// load all files
$.each(files,function(index,file) {
    $.get(file, (xx)=>{ 
        logdict[file] = xx; 
        // counter == 0 then all files loaded
        indexcount -= 1;
        if (indexcount == 0){
            //console.log(Object.keys(logdict));
            console.log("All files available");
            setTimeout( ()=> 
                {filesLoaded = true;
                $("#plotlyloading").addClass("w11");
                $("#mainm").click();
                populateDeviceStatus(logdict);
                }
                ,20

            );
        }
    });
})

// window action
    withBelow767px = true 

    function myFunction(x) {
        if (x.matches) { // If media query matches
            withBelow767px = true;
        } else {
            withBelow767px = false;
        }
        console.log(withBelow767px);
        //Plotly.restyle(plotlyGraph, {title:{text:"q324"}})
        Plotly.relayout(plotlyGraph, {title:{text:"q324",y:0.9,
        x:0.1,}});
    }
    
  // Create a MediaQueryList object
  var x = window.matchMedia("(max-width: 767px)")
  
  // Call listener function at run time
  //myFunction(x);
  
  // Attach listener function on state changes
  x.addEventListener("change", function() {
    myFunction(x);
  });

// now the plott action

// empty plot initialize
var plotlyGraph = document.getElementById("plotlygraph");
var plotDateRange = document.getElementById("myRange");

var config = {responsive: true, scrollZoom: true};
function initializePlot() {
    data = [];
    layout = {};
    testerframe = Plotly.newPlot(plotlyGraph, data, layout, config);
}
initializePlot()

// define the plot function for detail view
function reactPlot_temperature() {
    // keeps the initial plot, faster
    if (filesLoaded==false) {return}

    var data = []

    for (let log in logdict) {
        let [ti, te, hu] = textToTempHum(logdict[log]);
        data.push({ x: ti, y: te, name: log, type:'scatter'});
    }

    var layout = {font: {size: 16},
        title: {
            text:  "Temperature <br>Chart",
            y:0.9,
            x:0.1,
            },
        margin: {
            l:55,
            r:15,
        },
        yaxis:{title:"Temperature [°C]"},
        legend: {x:0.4, y:1.4},
        };
    
    Plotly.react(plotlyGraph, data, layout);

}

// define the plot function for detail view
function reactPlot_humidity() {
    // keeps the initial plot, faster
    if (filesLoaded==false) {return}

    var data = []

    for (let log in logdict) {
        let [ti, te, hu] = textToTempHum(logdict[log]);
        data.push({ x: ti, y: hu, name: log, type:'scatter'});
    }

    var layout = {font: {size: 16},
        title: {
            text:  "Humidity <br>Chart",
            y:0.9,
            x:0.1,
            },
        margin: {
                l:55,
                r:15,
            },
        yaxis:{title:"Humidity [%r.H.]"},
        legend: {x:0.4, y:1.4 },
        };
    
    Plotly.react(plotlyGraph, data, layout);

}

// define the plot function for detail view
function reactPlot_detail(detailSelect) {
    // keeps the initial plot, faster
    if (filesLoaded==false) {return}

    let loggedFile = detailSelect|| files[0];
    let loggedData =  logdict[loggedFile];
    let [ti, te, hu] = textToTempHum(loggedData);

    let data = [
        { x: ti, y: te, name: 'temp' , type:'scatter'},
        { x: ti, y: hu, name: 'hum' ,yaxis: 'y2',type:'scatter'}
    ];
    
    let layout = {font: {size: 18},
        title: {
            text:  "Chart for \"" + loggedFile + '\"',
            y:0.85,
            },
        yaxis:{title:"Temperature [°C]", color: "#f81",},
        legend: {x:0.4, y:1.4},
        margin: {
            l:55,
            r:55,
        },
        yaxis2: {
            color: "#27b",
            title: 'Humidity [%r.H.]',
            overlaying: 'y',
            side: 'right'
        }};
    
    Plotly.react(plotlyGraph, data, layout);

}



// functionalize the menu
$(()=>{
    $("#mainm").click(function(){
        //Plotly.purge(plotlyGraph);
        $("#plotContent").addClass("w11");
        $("#mainMenuContent").removeClass("w11");
        $("#deviceselector").addClass("w11");  
    });    
    $("#menu1").click(function(){
        $("#plotContent").removeClass("w11");
        $("#mainMenuContent").addClass("w11");
        $("#deviceselector").addClass("w11");  
        reactPlot_temperature()
    });
    $("#menu2").click(function(){
        $("#plotContent").removeClass("w11");
        $("#mainMenuContent").addClass("w11");
        $("#deviceselector").addClass("w11");  
        reactPlot_humidity()
    });
    $("#menu3").click(function(){
        $("#plotContent").removeClass("w11");
        $("#mainMenuContent").addClass("w11");
        $("#deviceselector").removeClass("w11");  
        reactPlot_detail()
    });
    $("#menu4").click(function(){
        let dergo = plotlyGraph.layout.xaxis.range[1]
        console.log(dergo)
        let tron = new Date(dergo)
        console.log(tron);
        let trow = Date(tron.setDate(tron.getDate()-5));
        console.log(trow);
        plotlyGraph.layout.xaxis.range[1] = trow;

    });
    $("#deviceselector2").on("change",(x)=>{
        myselect = $("#deviceselector2")[0].value;
        //console.log(myselect);
        reactPlot_detail(myselect);


    })
});


// ==========
// functions

function toDateTime(secs) {
    // convert the seconds to Date object
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

function textToTempHum(text) {
    // convert the text lines to variables
    var texxt = text.split('\n');
    var time = texxt.map((line)=>{return toDateTime(line.split(',')[2])});
    var temp = texxt.map((line)=>{return line.split(',')[3]});
    var hum  = texxt.map(line=>{return line.split(',')[4]});
    return ([time, temp, hum]);
}

function populateDeviceSelector(selectElem) {
    // used to populate the select element
    while (selectElem.options.length > 0) {
        selectElem.remove(0);
    }
    for (let i of files) {
        selectElem.add(new Option(i));
    }
}

function populateDeviceStatus(logdict) {
    // used for the main Menu device status
    console.log(Object.keys(logdict).length);
    for (let [k,v] of Object.entries(logdict)) {
        console.log(k);
        let z = v.split("\n").slice(-2)[0];
        let comp1 = z.slice(6,16);
        let comp2 = new Date().toDateString().slice(0,10);
        let t = z.split(',')[3];
        let h = z.split(',')[4];
        elementText = ` ${k} => Temp: ${t} °C; Hum: ${h} %rH`
        if (comp1==comp2) {
            activeButton = '<i class="fa fa-dot-circle-o" aria-hidden="true" style="color:green"></i>'
        }
        else {
            activeButton = '<i class="fa fa-circle-o" aria-hidden="true" style="color:orange"></i>'
        }
        elementText = activeButton + elementText
        $("#deviceStatus").append(Object.assign(document.createElement("li"),
            {innerHTML:elementText}));   
    
    };
}




