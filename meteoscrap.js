const meteoweb = "https://www.meteolux.lu/"
$.get( {url:meteoweb, success: (html) => {

    let ttt = $($(html).find("p.temperature")[0]).text().trim();
    //console.log(ttt);
    $("#432").text(ttt);
    let ttz = $($(html).find(".temp-min-max")[0]).text().trim();
    //console.log(ttz);
    $("#433").text(ttz);

}, datatype: String});

