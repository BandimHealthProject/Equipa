/**
 * Responsible for rendering the select subarea screen 
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var masterList, date, reg, regNome, hcarea, hcareaNome;
function display() {
    console.log("Subarea list loading");
    date = util.getQueryParameter('date');
    reg = util.getQueryParameter('reg');
    regNome = util.getQueryParameter('regNome');
    hcarea = util.getQueryParameter('hcarea');
    hcareaNome = util.getQueryParameter('hcareaNome');

    var head = $('#main');
    head.prepend("<h1>" + hcareaNome + " </br> <h3> Subareas");
    
    doSanityCheck();
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
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
            var p = {reg: rowValues[0], regNome: rowValues[1], hcarea: rowValues[2], hcareaNome: rowValues[3], subarea: rowValues[4], subareaNome: rowValues[5], tab: rowValues[6], tabNome: rowValues[7]};
            if (p.reg != "") { // only push rows with reg number
                masterList.push(p);
            }
    }
    console.log("masterList", masterList);
    initButtons()
}

function initButtons() {
    // Group by subarea
    const subareas = [];
    const map = new Map();
    for (const item of masterList) {
        if (item.reg == reg & item.hcarea == hcarea) {
            if(!map.has(item.subarea)){
                map.set(item.subarea, true);    // set any value to Map
                subareas.push(item);
            }
        }
    }
    console.log("subareas", subareas);

    // Subareas buttons
    var ul = $('#li');
    $.each(subareas, function() {
        var that = this;      
        
        ul.append($("<li />").append($("<button />").attr('id',this.subarea).attr('class','btn' + this.reg).append(this.subareaNome)));
        
        // Buttons
        var btn = ul.find('#' + this.subarea);
        btn.on("click", function() {
            var queryParams = util.setQuerystringParams(date, that.reg, that.regNome, that.hcarea, that.hcareaNome, that.subarea, that.subareaNome);
            odkTables.launchHTML(null, 'config/assets/tab.html' + queryParams);
        })        
    });
}