thumbnailsVisible = true
captionsVisible = true
menuExpanded = false
pWidth = 465
oWidth = 175

currentImageAlt = ""
currentImageSrc = ""
CurrentImageID = ""
clickedElement = ""
hoverElement = ""

exifResolution = "--"
exifDimensions = "--"
exifDateTaken = "--"
exifMake = "--"
exifModel = "--"
exifShutter = "--"
exifAperture = "--"
exifExposureComp = "--"
exifExposure = "--"
exifFocalLength = "--"
exifMetering = "--"

function loadComplete(){
  $("#loading_overlay").fadeOut(500);
  adjustLayout();
}

function adjustLayout(){
 if (thumbnailsVisible==true){
   pWidth = pageWidth()-465
   oWidth = 175
 } else{
   pWidth = pageWidth()-290
   oWidth = 0
 }
 if (pWidth > 385){
  viewportAspectRatio = (pWidth) / (pageHeight()-60)
  imge = new Image()
  imge.src = currentImageSrc
  imageAspectRatio = imge.width / imge.height;
  if (imageAspectRatio < viewportAspectRatio) {
    var _resizeWidth  = pWidth;
    var _resizeHeight = pageHeight() - 60;
    var _resizeClass  = "photo";
    var imgArray = document.getElementsByTagName('IMG');
    for ( var i = 0; i < imgArray.length; i++ ){
       var imgObj = imgArray[i];
         if ( imgObj.className == _resizeClass ){
            imgObj.style.width = 'auto';
            imgObj.style.height = _resizeHeight + 'px';
         }
    }
  } else{
    var _resizeWidth  = pWidth;
    var _resizeHeight = pageHeight() - 60;
    var _resizeClass  = "photo";
    var imgArray = document.getElementsByTagName('IMG');
    for ( var i = 0; i < imgArray.length; i++ ){
       var imgObj = imgArray[i];
         if ( imgObj.className == _resizeClass ){
            imgObj.style.width = _resizeWidth + 'px';
            imgObj.style.height = 'auto';
         }
    }
  }
  $("#photo_wrapper").css({"left": (pageWidth()-(document.getElementById("photo").offsetWidth+oWidth))/2});
  $("#photo_wrapper").css({"right": ((pageWidth()-(document.getElementById("photo").offsetWidth+oWidth))/2)+oWidth});
  $("#photo_wrapper").css({"bottom": pageHeight()-document.getElementById("photo").offsetHeight-30});
  var photoLeft = (pageWidth()-(document.getElementById("photo").offsetWidth+oWidth))/2
  $("#grid_wrapper").css({"left": photoLeft+document.getElementById("photo").offsetWidth+15});
  $("#grid_wrapper").css({"bottom": pageHeight()-document.getElementById("photo").offsetHeight-30});
  $("#info_hud").css({"left": (document.getElementById("photo_wrapper").offsetWidth-282)/2});
  $("#info_hud").css({"top": (document.getElementById("photo_wrapper").offsetHeight-429)/2});
 }
}

function getID(theLink){
  currentImageSrc = theLink.src
  currentImageAlt = theLink.alt
  $("#photo").animate({ opacity: 0 }, "fast", function() {
    $("#photo").attr({src: currentImageSrc});
    $("#photo").attr({alt: currentImageAlt});
    $(this).animate({ opacity: 1 }, "fast");
  });
  if (captionsVisible==true){
    if (currentImageAlt==""){
      $("#caption_wrapper").animate({"bottom": "-35px"},500);
    } else{
      $("#caption_wrapper").animate({"bottom": "0px"},500);
    }
  }
  $("#caption_text").html(currentImageAlt);
  $("#caption_wrapper").css({"width": document.getElementById("caption_text").offsetWidth+35});
  adjustLayout();
  getExifData();
}

function whichElement(event){
    if (navigator.appName=="Microsoft Internet Explorer"){
        clickedElement=event.srcElement.id
    } else{
        clickedElement=event.target.id
    }
    if (clickedElement!="sendlink_button" && clickedElement!="download_button" && clickedElement!="getinfo_button" && clickedElement!="photo"){
      $("#menu").fadeOut(0);
      $("#menu").css({"height": 32});
      $("#menu_title").html('larger photo');
    }
    if (clickedElement=="photo"){
      if ($("#menu").css("height")=="100px"){
        $("#menu").css({"height": 32});
        $("#menu_title").html('options');
      } else{
        $("#menu").animate({"height": 100},250);
        $("#menu_title").html('select');
      }
    }
}
function whichElement2(event){
    //alert(event.target.id);
    if (navigator.appName=="Microsoft Internet Explorer"){
        hoverElement=event.srcElement.id
    } else{
        hoverElement=event.target.id
    }
    if (hoverElement!="sendlink_button" && hoverElement!="download_button" && hoverElement!="getinfo_button" && hoverElement!="top" && hoverElement!="bottom" && hoverElement!="center" && hoverElement!="menu_title" && hoverElement!="photo"){
      if ($("#menu").css("height")=="32px"){
        $("#menu").fadeOut(500);
      }
    }
}

function getExifData() {
  $("#info_labels").css({"visibility": "hidden"});
  $("#info_text").css({"visibility": "hidden"});
  $("#loading_text").css({"visibility": "visible"});
  var oImg = new Image();
  oImg.exifdata = null
  oImg.src = currentImageSrc
  EXIF.getData(oImg, displayData);
  function displayData(){
    exifResolution = (Math.round(((oImg.width * oImg.height)/1000000)*10)/10)+" megapixels";
     if ((Math.round(((oImg.width * oImg.height)/1000000)*10)/10)<.1) {exifResolution="--"}
    exifDimensions = oImg.width+" x "+oImg.height;
    exifDateTaken = String(EXIF.getTag(oImg, "DateTime"))
    try {exifDateTaken = exifDateTaken.replace(/\0/g, "")} catch(err){}
    if (exifDateTaken!="undefined") {
      exifDateTaken = (EXIF.getTag(oImg, "DateTime").substring(5,7))+"/"+(EXIF.getTag(oImg, "DateTime").substring(8,10))+"/"+(EXIF.getTag(oImg, "DateTime").substring(0,4))
        } else{
          exifDateTaken = "--"
        }
        exifMake = EXIF.getTag(oImg, "Make");
        try {exifMake = exifMake.replace(/\0/g, "")} catch(err){}
        exifModel = EXIF.getTag(oImg, "Model");
        try {exifModel = exifModel.replace(/\0/g, "")} catch(err){}
        exifShutter = (fractApprox(parseFloat(EXIF.getTag(oImg, "ExposureTime")),10000))+" sec";
        try {exifShutter = exifShutter.replace(/\0/g, "")} catch(err){}
        exifAperture = "f/"+EXIF.getTag(oImg, "FNumber");
        try {exifAperture = exifAperture.replace(/\0/g, "")} catch(err){}
        exifExposureComp = fractApprox(parseFloat(EXIF.getTag(oImg, "ExposureBias")),1000)+" step";
        try {exifExposureComp = exifExposureComp.replace(/\0/g, "")} catch(err){}
        if (parseFloat(exifExposureComp)>0) {
          exifExposureComp = "+"+exifExposureComp
        }
        exifExposure = EXIF.getTag(oImg, "ExposureProgram");
        try {exifExposure = exifExposure.replace(/\0/g, "")} catch(err){}
        exifFocalLength = Math.round(parseFloat(EXIF.getTag(oImg, "FocalLength")))+"mm";
        try {exifFocalLength = exifLength.replace(/\0/g, "")} catch(err){}
        exifMetering = EXIF.getTag(oImg, "MeteringMode");
        try {exifMetering = exifMetering.replace(/\0/g, "")} catch(err){}
        if (String(exifMake)=="undefined") {exifMake="--"}
        if (String(exifModel)=="undefined") {exifModel="--"}
        if (String(exifShutter)=="NaN/1 sec") {exifShutter="--"}
        if (String(exifAperture)=="f/undefined") {exifAperture="--"}
        if (String(exifExposureComp)=="NaN/1 step") {exifExposureComp="--"}
        if (String(exifExposureComp)=="0/1 step") {exifExposureComp="0 step"}
        if (String(exifExposure)=="undefined") {exifExposure="--"}
        if (String(exifFocalLength)=="NaNmm") {exifFocalLength="--"}
        if (String(exifMetering)=="undefined") {exifMetering="--"}
        if (exifMake.length > 10){
          exifMake = exifMake.substring(0,10)+"..."
        }
        if (exifModel.length > 13){
          exifModel = exifModel.substring(0,13)+"..."
        }
        $("#info_text").html(exifResolution+'<br />'+exifDimensions+'<br />'+exifDateTaken+'<br /><br />'+exifMake+'<br />'+exifModel+'<br /><br />'+exifShutter+'<br />'+exifAperture+'<br />'+exifExposureComp+'<br />'+exifExposure+'<br />'+exifFocalLength+'<br />'+exifMetering+'<br />');
    $("#info_labels").css({"visibility": "visible"});
    $("#info_text").css({"visibility": "visible"});
    $("#loading_text").css({"visibility": "hidden"});
  }
}

function fractApprox(x,maxDenominator) {
        try {
        // Created 1997 by Brian Risk.  http://brianrisk.com
        maxDenominator = parseInt(maxDenominator);
        var approx = 0;
        var error = 0;
        var best = 0;
        var besterror = 0;
        for (var i=1; i <= maxDenominator; i++) {
                approx = Math.round(x/(1/i));
                error = (x - (approx/i))
                if (i==1) {best = i; besterror = error;}
                if (Math.abs(error) < Math.abs(besterror)) 
                        {best = i; besterror = error;}
        }
        return (Math.round(x/(1/best)) + "/" + best);
        } catch(err){
        return (Math.round((x*100)/100));
        }
}

$(document).ready(function(){
   if (navigator.appName=="Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 6.0")>=0){
     window.location="ie6/index.html"
   }
   $("#caption_text").html(document.getElementById("photo").getAttribute("alt"));
   currentImageAlt=document.getElementById("photo").getAttribute("alt")
   currentImageSrc=document.getElementById("photo").getAttribute("src")
   $("#caption_wrapper").css({"width": document.getElementById("caption_text").offsetWidth+35})
   setTimeout("adjustLayout()", 500);
   $("#toolbar").fadeOut(0);
   $("#info_hud").fadeOut(0);
   //$("#nav_wrapper").fadeOut(0);
   $("#menu").fadeOut(0);
   $("#nav_wrapper").fadeOut(0);
   $("#menu_title").html("click for options");

   if (navigator.appName=="Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 7.0")>=0){
     $("ul#grid li").css({"margin": "0px 0px 8px -40px"});
   } else{
     $("ul#grid li").css({"margin": "-13px 0px 25px -40px"});
   }
     
  $(window).resize(function(){
   setTimeout("adjustLayout()", 500);
  });
  
  $("#photo_wrapper").mouseenter(function(){
      $("#toolbar").fadeIn(500);
  });
  $("#mouse_overlay").mouseenter(function(){
      $("#toolbar").fadeOut(500);
  });
  $("#photo").mouseenter(function(){
      $("#menu").fadeIn(500);
  });
  $("#photo").mousemove(function(e){
    if ($("#menu").css("height")=="32px"){
      $("#menu").css({"left": e.pageX-this.offsetLeft});
      $("#menu").css({"top": e.pageY-this.offsetTop});
    }
  });

  $("#grid_wrapper").mousemove(function(e){
	  mousePercent = (((e.pageY-this.offsetTop)/this.offsetHeight)*document.getElementById("grid_container").offsetHeight)^-1
	  //alert(mousePercent);
	  varA = ((e.pageY-this.offsetTop)/this.offsetHeight)
	  varB = document.getElementById("grid_container").offsetHeight - document.getElementById("grid_wrapper").offsetHeight
	  con_top = (varA*varB)^-1
      $("#grid_container").css({"top": con_top+15});
  });

  $("#thumbnails_button").click(function(){
    if (thumbnailsVisible==true){
      thumbnailsVisible = false
      $("#grid_wrapper").hide();
      $("#thumbnails_button").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; thumbnails: <strong>off</strong>');
    } else{
      thumbnailsVisible = true
      $("#grid_wrapper").show();
      $("#thumbnails_button").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; thumbnails: <strong>on</strong>');
    }
    adjustLayout();
  });
  $("#captions_button").click(function(){
    if (captionsVisible==true){
      captionsVisible = false
      $("#caption_wrapper").animate({"bottom": "-35px"},500);
      $("#captions_button").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; captions: <strong>off</strong>');
    } else{
      if (currentImageAlt!=""){
        captionsVisible = true
        $("#caption_wrapper").animate({"bottom": "0px"},500);
      }
      $("#captions_button").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; captions: <strong>on</strong>');
    }
    adjustLayout();
  });
  
  $("#photoinfo_button").click(function(){
    getExifData();
    $("#info_hud").fadeIn(250);
  });
  $("#closeinfo_button").click(function(){
    $("#info_hud").fadeOut(250);
  });
  
  $("#send_button").mousedown(function(){
    $("#send_button").css({"background-image": "url('images/send_button_sel.png')"});
  });
  $("#send_button").mouseup(function(){
    $("#send_button").css({"background-image": "url('images/send_button.png')"});
  });
  
  $("#panel1_button").click(function(){
    $("#panel1_button").css({"background-image": "url('images/button_sel.jpg')"});
	$("#panel2_button").css({"background-image": ""});
    $("#panel3_button").css({"background-image": ""});
    $("#panel4_button").css({"background-image": ""});
	$("#panel1_button").css({"color": "#FFFFFF"});
	$("#panel2_button").css({"color": "#444444"});
	$("#panel3_button").css({"color": "#444444"});
	$("#panel4_button").css({"color": "#444444"});
	$("#slider_container").animate({"left": "0px"},500);
  });
  $("#panel2_button").click(function(){
    $("#panel1_button").css({"background-image": ""});
	$("#panel2_button").css({"background-image": "url('images/button_sel.jpg')"});
    $("#panel3_button").css({"background-image": ""});
    $("#panel4_button").css({"background-image": ""});
	$("#panel1_button").css({"color": "#444444"});
	$("#panel2_button").css({"color": "#FFFFFF"});
	$("#panel3_button").css({"color": "#444444"});
	$("#panel4_button").css({"color": "#444444"});
	$("#slider_container").animate({"left": "-617px"},500);
  });
  $("#panel3_button").click(function(){
    $("#panel1_button").css({"background-image": ""});
	$("#panel2_button").css({"background-image": ""});
    $("#panel3_button").css({"background-image": "url('images/button_sel.jpg')"});
    $("#panel4_button").css({"background-image": ""});
	$("#panel1_button").css({"color": "#444444"});
	$("#panel2_button").css({"color": "#444444"});
	$("#panel3_button").css({"color": "#FFFFFF"});
	$("#panel4_button").css({"color": "#444444"});
	$("#slider_container").animate({"left": "-1234px"},500);
  });
  $("#panel4_button").click(function(){
    $("#panel1_button").css({"background-image": ""});
	$("#panel2_button").css({"background-image": ""});
    $("#panel3_button").css({"background-image": ""});
    $("#panel4_button").css({"background-image": "url('images/button_sel.jpg')"});
	$("#panel1_button").css({"color": "#444444"});
	$("#panel2_button").css({"color": "#444444"});
	$("#panel3_button").css({"color": "#444444"});
	$("#panel4_button").css({"color": "#FFFFFF"});
	$("#slider_container").animate({"left": "-1851px"},500);
  });
    $("#nav1_button").click(function(){
    $("#panel1_button").css({"background-image": "url('images/button_sel.jpg')"});
	$("#panel2_button").css({"background-image": ""});
    $("#panel3_button").css({"background-image": ""});
    $("#panel4_button").css({"background-image": ""});
	$("#panel1_button").css({"color": "#FFFFFF"});
	$("#panel2_button").css({"color": "#444444"});
	$("#panel3_button").css({"color": "#444444"});
	$("#panel4_button").css({"color": "#444444"});
	$("#nav_wrapper").fadeIn(250);
	$("#slider_container").css({"left": "0px"});
  });
  $("#nav2_button").click(function(){
    $("#panel1_button").css({"background-image": ""});
	$("#panel2_button").css({"background-image": "url('images/button_sel.jpg')"});
    $("#panel3_button").css({"background-image": ""});
    $("#panel4_button").css({"background-image": ""});
	$("#panel1_button").css({"color": "#444444"});
	$("#panel2_button").css({"color": "#FFFFFF"});
	$("#panel3_button").css({"color": "#444444"});
	$("#panel4_button").css({"color": "#444444"});
	$("#nav_wrapper").fadeIn(250);
	$("#slider_container").css({"left": "-617px"});
  });
  $("#nav3_button").click(function(){
    $("#panel1_button").css({"background-image": ""});
	$("#panel2_button").css({"background-image": ""});
    $("#panel3_button").css({"background-image": "url('images/button_sel.jpg')"});
    $("#panel4_button").css({"background-image": ""});
	$("#panel1_button").css({"color": "#444444"});
	$("#panel2_button").css({"color": "#444444"});
	$("#panel3_button").css({"color": "#FFFFFF"});
	$("#panel4_button").css({"color": "#444444"});
	$("#nav_wrapper").fadeIn(250);
	$("#slider_container").css({"left": "-1234px"});
  });
  $("#nav4_button").click(function(){
    $("#panel1_button").css({"background-image": ""});
	$("#panel2_button").css({"background-image": ""});
    $("#panel3_button").css({"background-image": ""});
    $("#panel4_button").css({"background-image": "url('images/button_sel.jpg')"});
	$("#panel1_button").css({"color": "#444444"});
	$("#panel2_button").css({"color": "#444444"});
	$("#panel3_button").css({"color": "#444444"});
	$("#panel4_button").css({"color": "#FFFFFF"});
	$("#nav_wrapper").fadeIn(250);
	$("#slider_container").css({"left": "-1851px"});
  });

  $("#client1_image").click(function(){
	$("#client_container").animate({"top": "-20px"},500);
    $("#client1_image").css({"border": "1px solid #555555"});
	$("#client2_image").css({"border": ""});
    $("#client3_image").css({"border": ""});
  });
  $("#client2_image").click(function(){
	$("#client_container").animate({"top": "-290px"},500);
	$("#client1_image").css({"border": ""});
	$("#client2_image").css({"border": "1px solid #555555"});
    $("#client3_image").css({"border": ""});
  });
  $("#client3_image").click(function(){
	$("#client_container").animate({"top": "-564px"},500);
	$("#client1_image").css({"border": ""});
	$("#client2_image").css({"border": ""});
    $("#client3_image").css({"border": "1px solid #555555"});
  });
  
  $("#closehud_button").click(function(){
    $("#nav_wrapper").fadeOut(250);
  });
  
  $("#sendlink_button").mouseenter(function(){
      $("#sendlink_button").css({"background-image": "url('images/menu_highlight.jpg')"});
  });
  $("#sendlink_button").mouseout(function(){
      $("#sendlink_button").css({"background-image": ""});
  });
    $("#download_button").mouseenter(function(){
      $("#download_button").css({"background-image": "url('images/menu_highlight.jpg')"});
  });
  $("#download_button").mouseout(function(){
      $("#download_button").css({"background-image": ""});
  });
    $("#getinfo_button").mouseenter(function(){
      $("#getinfo_button").css({"background-image": "url('images/menu_highlight.jpg')"});
  });
  $("#getinfo_button").mouseout(function(){
      $("#getinfo_button").css({"background-image": ""});
  });
  
  $("#sendlink_button").click(function(){
      $("#menu_title").html('click for options');
      $("#menu").fadeOut(0);
      $("#menu").css({"height": 32});
      window.location="mailto:yourname@example.com?subject=Check out this painting&body=Check out this painting:%0D"+document.getElementById("photo").src
  });
  $("#download_button").click(function(){
      $("#menu_title").html('click for options');
      $("#menu").fadeOut(0);
      $("#menu").css({"height": 32});
      window.location=document.getElementById("photo").src
  });
  $("#getinfo_button").click(function(){
      $("#menu_title").html('click for options');
      $("#menu").fadeOut(0);
      $("#menu").css({"height": 32});
      getExifData();
      $("#info_hud").fadeIn(250);
  });
    
});