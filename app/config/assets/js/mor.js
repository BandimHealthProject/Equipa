/**
 * Responsible for rendering the select tabanca screen 
	* Ane - experimenting - 20230716 - > changing to select moranca screen
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var masterList, date, reg, regNome, hcarea, hcareaNome, listGroup, tab, tabNome, assistant;
function display() {
    console.log("Moranca list loading");
    date = util.getQueryParameter('date');
    reg = util.getQueryParameter('reg');
    regNome = util.getQueryParameter('regNome');
    hcarea = util.getQueryParameter('hcarea');
    hcareaNome = util.getQueryParameter('hcareaNome');
    listGroup = util.getQueryParameter('listGroup');
    tab = util.getQueryParameter('tab'); // Ane
    tabNome = util.getQueryParameter('tabNome');  // Ane
    assistant = util.getQueryParameter('assistant'); // Added assistant

    var head = $('#main');
    head.prepend("<h1>" + tabNome + " </br> <h3> Morancas");
    
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
    // Group by mor
    const mors = [];
    const map = new Map();
    for (const item of masterList) {
        if (item.reg == reg & item.listGroup == listGroup & item.tab == tab) {
            if(!map.has(item.mor)){
                map.set(item.mor, true);    // set any value to Map
                mors.push(item);
            }
        }
    }
    console.log("mors", mors);

    // Moranca buttons
    var ul = $('#li');
    $.each(mors, function() {
        var that = this;    
                ul.append($("<li />").append($("<button />").attr('id',this.mor).attr('class','btn' + this.tab).append(this.mor + ": "+ this.morNome)));

        // Buttons
        var btn = ul.find('#' + this.mor);
        btn.on("click", function() {
            var queryParams = util.setQuerystringParams(date, that.reg, that.regNome, that.hcarea, that.hcareaNome, that.listGroup, that.tab, that.tabNome, that.mor, that.morNome, assistant);
            odkTables.launchHTML(null, 'config/assets/list.html' + queryParams);
        })        
    });
}