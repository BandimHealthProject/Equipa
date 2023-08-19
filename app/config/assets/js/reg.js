/**
 * Responsible for rendering the select region screen 
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var assistants, masterList, selDay, selMon, selYea, selAssistant, date;
function display() {
    console.log("Region list loading");
    selDay = $('#selDateDay');
    selMon = $('#selDateMonth');
    selYea = $('#selDateYear');
    selAssistant = $('#selAssistant');

    var head = $('#main');
    head.prepend("<h1> Regiões");
    
    doSanityCheck();
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

// Get assistants from CSV
$.ajax({
    url: 'assistants.csv',
    dataType: ' ',
}).done(getAssistants);

function getAssistants(data) {
    assistants = [];
    var allRows = data.split(/\r?\n|\r/);
    for (var row = 1; row < allRows.length; row++) {  // start at row = 1 to skip header
        var rowValues = allRows[row].split(",");
        var p = {code: rowValues[0], name: rowValues[1]};
        assistants.push(p);
    }
    console.log('Assistants', assistants);
}

// Get masterlList from CSV
$.ajax({
    url: 'masterList.csv',
    dataType: ' ',
}).done(getMasterList);

function getMasterList(data) {
    masterList = [];
    var allRows = data.split(/\r?\n|\r/);
    for (var row = 1; row < allRows.length; row++) {  // start at row = 1 to skip header
            allRows[row] = allRows[row].replace(/"/g,""); // remove quotes from strings
            var rowValues = allRows[row].split(",");
            var p = {reg: rowValues[0], regNome: rowValues[1], hcarea: rowValues[2], hcareaNome: rowValues[3], tab: rowValues[4], tabNome: rowValues[5], mor: rowValues[6], morNome: rowValues[7]};
            if (p.reg != "") { // only push rows with reg number
                masterList.push(p);
            }
    }
    console.log("masterList", masterList);
    initDate()
}

function initDate() {
    // Date dropdown
    // Set default date
    var today = new Date();
    var defaultDay = today.getDate();
    var defaultMon = today.getMonth()+1;
    var defaultYea = today.getFullYear();

    // List of date, months, years
    var days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    var months = [1,2,3,4,5,6,7,8,9,10,11,12];
    var years = [defaultYea-1, defaultYea, defaultYea+1];

    $.each(days, function() {
        if (this == defaultDay) {
            selDay.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selDay.append($("<option />").val(this).text(this));
        }
    })

    $.each(months, function() {
        if (this == defaultMon) {
            selMon.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selMon.append($("<option />").val(this).text(this));
        }
    })

    $.each(years, function() {
        if (this == defaultYea) {
            selYea.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selYea.append($("<option />").val(this).text(this));
        }
    })

     // Assistants dropdown
     selAssistant.append($("<option />").val(-1).text("Assistente"));
     $.each(assistants, function() {
         selAssistant.append($("<option />").val(this.code).text(this.name));
     })
    
    document.getElementById("selDateDay").onchange = function() {initButtons()};
    document.getElementById("selDateMonth").onchange = function() {initButtons()};
    document.getElementById("selDateYear").onchange = function() {initButtons()};
    document.getElementById("selAssistant").onchange = function() {initButtons()};

    initButtons();
}

function initButtons() {
 //Herfra
 var assistant = selAssistant.val();
 console.log("assbtn", assistant)
 //Hertil
 
 // Group by region
    const regions = [];
    const map = new Map();
    for (const item of masterList) {
        if(!map.has(item.reg)){
            map.set(item.reg, true);    // set any value to Map
            regions.push(item);
        }
    }
    console.log("regions", regions);

    // Region buttons
    document.getElementById("li").outerHTML = "<ul id='li'> </ul>";
    var ul = $('#li');
    $.each(regions, function() {
        var that = this;      
        
        ul.append($("<li />").append($("<button />").attr('id',this.reg).attr('class','btn' + this.reg).append(this.regNome)));
        
        // Buttons
        var btn = ul.find('#' + this.reg);
        btn.on("click", function() {
        // herfra
        if (!assistant || assistant < 0 ) {
            selAssistant.css('background-color','pink');
            return false;
        }
        // hertil       // set date
            var date = new Date(selYea.val(), selMon.val()-1, selDay.val());
            var queryParams = util.setQuerystringParams(date, that.reg, that.regNome, null, null, null, null, null, null, null, null, assistant); //7s
//     7       var queryParams = util.setQuerystringParams(date, that.reg, that.regNome, null, null, null, null , null, null, null, null, assistant);
            odkTables.launchHTML(null, 'config/assets/hcarea.html' + queryParams);
        })        
    });
}