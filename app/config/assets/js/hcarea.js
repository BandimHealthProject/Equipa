/**
 * Responsible for rendering the select health centre screen 
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var masterList, date, reg, regNome, assistant; // Added assistants
function display() {
    console.log("Health centre list loading");
    date = util.getQueryParameter('date');
    reg = util.getQueryParameter('reg');
    regNome = util.getQueryParameter('regNome');
    assistant = util.getQueryParameter('assistant'); // Added assistants
    var head = $('#main');
    head.prepend("<h1>" + regNome + " </br> <h3> Areas Sanitaria");
    
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
            var p = {reg: rowValues[0], regNome: rowValues[1], hcarea: rowValues[2], hcareaNome: rowValues[3], tab: rowValues[4], tabNome: rowValues[5], mor: rowValues[6], morNome: rowValues[7], listGroup: rowValues[8]};
            if (p.reg != "") { // only push rows with reg number
                masterList.push(p);
            }
    }
    console.log("masterList", masterList);
    initButtons()
}

function initButtons() {
    // Group by hcarea
    const hcareas = [];
    const map = new Map();
    for (const item of masterList) {
        if (item.reg == reg) {
            if(!map.has(item.listGroup)){
                map.set(item.listGroup, true);    // set any value to Map
                hcareas.push(item);
            }
        }
    }
    console.log("hcareas", hcareas);

    // Health centre buttons
    var ul = $('#li');
    $.each(hcareas, function() {
        var that = this;      
        
        ul.append($("<li />").append($("<button />").attr('id',this.listGroup).attr('class','btn' + this.reg).append(this.hcareaNome)));
        
        // Buttons
        var btn = ul.find('#' + this.listGroup);
        btn.on("click", function() {
            var queryParams = util.setQuerystringParams(date, that.reg, that.regNome, that.hcarea, that.hcareaNome, that.listGroup, null,  null,  null,  null, assistant);
            odkTables.launchHTML(null, 'config/assets/tab.html' + queryParams);
        })        
    });
}