// $.ajax("src/car.py",{type:"HEAD", async:true}).done(function(a,b,c){
//  alert(c.getResponseHeader("Last-Modified"));});


//get the files from the server
var files = [   "src/rasp4log.txt",
                "src/rasp5log.txt",
                "src/rasp6log.txt",
                "src/rasp7log.txt",
                "src/rasp8log.txt"];

var aliasNames = {}
var stored = localStorage['myDeviceNames'];
if (stored) aliasNames = JSON.parse(stored);
else files.map((x, i)=>{aliasNames[x]=`Sensor ${i}`});

var logdict = {};
var indexcount = files.length;
var filesLoaded = false;

//add them to the deviceselectorr
var deviceSelector = $("#deviceselector2")[0];
populateDeviceSelector(deviceSelector);

//add the Devicenames
var deviceNames = $("#deviceNames")[0];
populateDeviceNames(deviceNames);

//create the slider item
var dateSlider = $("#myDateRange")[0];

// load all files
$.each(files,function(index,file) {
    $.get(file, (xx)=>{ 
        logdict[file] = {};
        logdict[file].text = xx;
        logdict[file].name = name;

        let [ti, te, hu] = textToTempHum(xx);
        logdict[file].ti = ti;
        logdict[file].te = te;
        logdict[file].hu = hu;

        logdict[file].tir = [ti[0], ti[ti.length-2]]
        
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
                ,1

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
    // console.log(withBelow767px);

    // margin: {
    //     l:55,
    //     r:15,
    // },
    // Plotly.relayout(plotlyGraph, {title:{text:"q324",y:0.9, x:0.1,},});
}
    
  // Create a MediaQueryList object
  var x = window.matchMedia("(max-width: 767px)")
  
  // Call listener function at run time
  //myFunction(x);
  
  // Attach listener function on state changes
  x.addEventListener("change", function() {
    myFunction(x);
  });

// add annother media listener
// window.screen.orientation.addEventListener("change",(x)=>{console.log(x.target.angle)})


// now the plott action

// empty plot initialize
var plotlyGraph = document.getElementById("plotlygraph");
var plotDateRange = document.getElementById("myRange");
var plotDataRange;

function initializePlot() {
    let data = [];
    let layout = {};
    let config = {responsive: true, autosize:true, scrollZoom: true};
    testerframe = Plotly.newPlot(plotlyGraph, data, layout, config);
}
initializePlot()

// define the plot function for detail view
function reactPlot_temperature() {
    // keeps the initial plot, faster
    if (filesLoaded==false) {return}

    let data = []
    for (let log in logdict) {
        data.push({ x: logdict[log].ti, y: logdict[log].te, 
            name: aliasNames[log], type:'scatter'});
    }

    let layout = {
        height:500,
        font:{size:14},
        margin:{r:25, l:55},
        title: {text: "Temperature <br>Chart", x:0.1, y:0.85 },
        yaxis:{title: "Temperature [°C]"},
        legend: {x:0.6, y:1.4},
        };
    
    Plotly.react(plotlyGraph, data, layout);
    plotDataRange = plotlyGraph.layout.xaxis.range;
    dateSlider.value = 0

}

// define the plot function for detail view
function reactPlot_humidity() {
    // keeps the initial plot, faster
    if (filesLoaded==false) {return}

    var data = []

    for (let log in logdict) {
        data.push({ x: logdict[log].ti, y: logdict[log].hu, 
            name: aliasNames[log], type:'scatter'});
    }

    let layout = {
        height:500,
        font:{size:14},
        margin:{r:25, l:55},
        title: {text: "Humidity <br>Chart", x:0.1, y:0.85 },
        yaxis:{title: "Humidity [%r.H.]"},
        legend: {x:0.6, y:1.4},
        };
    
    Plotly.react(plotlyGraph, data, layout);
    plotDataRange = plotlyGraph.layout.xaxis.range;
    dateSlider.value = 0

}

// define the plot function for detail view
function reactPlot_detail() {
    // keeps the initial plot, faster
    if (filesLoaded==false) {return}

    let loggedFile = deviceSelector.value|| files[0];
    let loggedData =  logdict[loggedFile];

    let data = [
        { x: loggedData.ti, y: loggedData.te, name: 'temp' , type:'scatter'},
        { x: loggedData.ti, y: loggedData.hu, name: 'hum' ,yaxis: 'y2',type:'scatter'}
    ];
    
    let layout = {
        height:500,
        font:{size:14},
        margin:{r:55, l:55},
        title: {text: `Chart for <br>${aliasNames[loggedFile]}`, x:0.1, y:0.85 },
        yaxis:{title: "Temperature [°C]", color: "#27b"},
        legend: {x:0.6, y:1.4},
        yaxis2: {
            color: "#f81",
            title: 'Humidity [%r.H.]',
            overlaying: 'y',
            side: 'right'
        }
        };
    
    Plotly.react(plotlyGraph, data, layout);
    plotDataRange = plotlyGraph.layout.xaxis.range;
    dateSlider.value = 0

}


// functionalize the menu
$(()=>{
    $("#mainm").click(function(){
        //Plotly.purge(plotlyGraph);
        $("#plotContent").addClass("w11");
        $("#mainMenuContent").removeClass("w11");
        $("#deviceselector").addClass("w11");
        $("#settingsContent").addClass("w11");            
    });    
    $("#menu1").click(function(){
        $("#plotContent").removeClass("w11");
        $("#mainMenuContent").addClass("w11");
        $("#deviceselector").addClass("w11");  
        $("#settingsContent").addClass("w11");          
        reactPlot_temperature()
    });
    $("#menu2").click(function(){
        $("#plotContent").removeClass("w11");
        $("#mainMenuContent").addClass("w11");
        $("#deviceselector").addClass("w11");  
        $("#settingsContent").addClass("w11");          
        reactPlot_humidity()
    });
    $("#menu3").click(function(){
        $("#plotContent").removeClass("w11");
        $("#mainMenuContent").addClass("w11");
        $("#deviceselector").removeClass("w11");  
        $("#settingsContent").addClass("w11");          
        reactPlot_detail()
    });
    $("#menu4").click(function(){
        $("#plotContent").addClass("w11");
        $("#deviceselector").addClass("w11");  
        $("#mainMenuContent").addClass("w11");
        $("#settingsContent").removeClass("w11");          

    });
    $("#deviceselector2").on("change",(x)=>{
        myselect = $("#deviceselector2")[0].value;
        //console.log(myselect);
        reactPlot_detail(myselect);


    })
    $("#changeTimeaxis-a").click(function(){
        // sets the time window to all weeks
        let end = plotDataRange[1]
        let start = plotDataRange[0]

        rrange = [start, end];
        // console.log(rr);
        Plotly.relayout(plotlyGraph, {xaxis:{range:rrange}});
        dateSlider.value = 0;

    }); 
    $("#changeTimeaxis-4").click(function(){
        // sets the time window to 4 weeks
        let end = plotDataRange[1]
        let start = plotDataRange[0]

        let tron = new Date(end);
        // console.log(tron);
        let trow = new Date(tron.setDate(tron.getDate()-28));
        // console.log(trow);
        
        rrange = [trow, end];
        // console.log(rr);
        Plotly.relayout(plotlyGraph, {xaxis:{range:rrange}});

        tron = new Date(end);
        let troe = new Date(start);
        let ratio = Math.min(1,(tron.valueOf()-
            trow.valueOf())/(tron.valueOf()-troe.valueOf()))
        dateSlider.value = Math.floor((1-ratio)*1000)-1

    });
    $("#changeTimeaxis-1").click(function(){
        // sets the time window to 1 weeks
        let end = plotDataRange[1]
        let start = plotDataRange[0]

        let tron = new Date(end);
        // console.log(tron);
        let trow = new Date(tron.setDate(tron.getDate()-7));
        // console.log(trow);
        
        rrange = [trow, end];
        // console.log(rr);
        Plotly.relayout(plotlyGraph, {xaxis:{range:rrange}});

        tron = new Date(end);
        let troe = new Date(start);
        let ratio = Math.min(1,(tron.valueOf()-
            trow.valueOf())/(tron.valueOf()-troe.valueOf()))
        dateSlider.value = Math.floor((1-ratio)*1000)-1

    });
    $("#changeTimeaxis-d").click(function(){
        // sets the time window to 1 day
        let end = plotDataRange[1]
        let start = plotDataRange[0]

        let tron = new Date(end);
        // console.log(tron);
        let trow = new Date(tron.setDate(tron.getDate()-1));
        // console.log(trow);
        
        rrange = [trow, end];
        // console.log(rr);
        Plotly.relayout(plotlyGraph, {xaxis:{range:rrange}});
        
        tron = new Date(end);
        let troe = new Date(start);
        let ratio = Math.min(1,(tron.valueOf()-
            trow.valueOf())/(tron.valueOf()-troe.valueOf()))
        dateSlider.value = Math.floor((1-ratio)*1000)-1

    });
    $("#myDateRange").on("input",(x)=>{
        // console.log(dateSlider.value);

        let end = new Date(plotDataRange[1])
        let start = new Date(plotDataRange[0])
        
        let ends = new Date(end).valueOf();
        let starts = new Date(start).valueOf();

        let ranges = ends-starts;
        let news = starts + ((dateSlider.value/1000) * ranges);
        let neww = new Date(news);

        rrange = [neww, end];
        // console.log(rr);
        Plotly.relayout(plotlyGraph, {xaxis:{range:rrange}});
    

    });
    $("#saveNames").click(function(){
        saveDeviceNames();
    });
});


// ==========
// functions

function toDateTime(secs) {
    // convert the seconds to Date object
    let t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

function textToTempHum(text) {
    // convert the text lines to variables
    let texxt = text.split('\n');
    let time = texxt.map((line)=>{return toDateTime(line.split(',')[2])});
    let temp = texxt.map((line)=>{return line.split(',')[3]});
    let hum  = texxt.map(line=>{return line.split(',')[4]});
    return ([time, temp, hum]);
}

function populateDeviceSelector(selectElem) {
    // used to populate the select element
    while (selectElem.options.length > 0) {
        selectElem.remove(0);
    }
    for (let i of files) {
        selectElem.add(new Option(aliasNames[i],i));
    }
}

function populateDeviceStatus(logdict) {
    
    // used for the main Menu device status
    //console.log(Object.keys(logdict).length);
    for (let [k,v] of Object.entries(logdict)) {
        //console.log(k);
        let z = v.text.split("\n").slice(-2)[0];
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

function populateDeviceNames(deviceNames) {
    // used to populate the select element
    for (let i of files) {
        let iblock = `
        <div class="input-group m-2">
            <div class="input-group-prepend">
                <span id="" class="input-group-text">${i}</span>
            </div>
            <input id="" type="text" class="form-control" placeholder="${aliasNames[i]}">
        </div>
        `
        let elem = document.createElement("div");
        Object.assign(elem, {innerHTML : iblock});
        deviceNames.append(elem);
    }
}

function saveDeviceNames(){
    newAliasNames = {}
    $("#deviceNames .input-group").each(function(){
        curelem = $(this)
        device = curelem.find("span")[0].innerHTML;
        newname = curelem.find("input")[0].value || aliasNames[device];
        newAliasNames[device] = newname;
    });
    $("#deviceselector2 option").each(function(){
        optionn = $(this)[0];
        optionn.text = newAliasNames[optionn.value];
    })
    localStorage['myDeviceNames'] = JSON.stringify(newAliasNames);
    aliasNames = newAliasNames;
}
