/**
 * Responsible for rendering the select tabanca screen  - Modified by Ane, to call moranca screen 20230716
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var masterList, date, reg, regNome, hcarea, hcareaNome, listGroup, assistant;
function display() {
    console.log("Tabanca list loading");
    date = util.getQueryParameter('date');
    reg = util.getQueryParameter('reg');
    regNome = util.getQueryParameter('regNome');
    hcarea = util.getQueryParameter('hcarea');
    hcareaNome = util.getQueryParameter('hcareaNome');
    listGroup = util.getQueryParameter('listGroup');
    assistant = util.getQueryParameter('assistant'); // Added assistant

    var head = $('#main');
    head.prepend("<h1>" + hcareaNome + " </br> <h3> Tabancas");
    console.log(assistant); // her    15/8 
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
    // Group by tab
    const tabs = [];
    const map = new Map();
    for (const item of masterList) {
        if (item.reg == reg & item.hcarea == hcarea) {
            if(!map.has(item.tab)){
                map.set(item.tab, true);    // set any value to Map
                tabs.push(item);
            }
        }
    }
     console.log("hcareas", hcarea);
     console.log("tabs", tabs);
    console.log("Assistant_tjek_tab", assistant);


    // Tabanca buttons
    var ul = $('#li');
    $.each(tabs, function() {
        var that = this;      
        
        ul.append($("<li />").append($("<button />").attr('id',this.tab).attr('class','btn' + this.reg).append(this.tabNome)));
        
        // Buttons
        var btn = ul.find('#' + this.tab);
        btn.on("click", function() {
            var queryParams = util.setQuerystringParams(date, that.reg, that.regNome, that.hcarea, that.hcareaNome, that.listGroup, that.tab, that.tabNome, null, null, null, assistant); //2
            odkTables.launchHTML(null, 'config/assets/mor.html' + queryParams); // Ane - list.html -> mor.html
        })        
    });
}