/**
 * Responsible for rendering the select work in tabanca or photo of ficha.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var masterList, selDay, selMon, selYea, selReg, selHC, selTab, btnHC, btnTab, date;

function display() {
    selDay = $('#selDateDay');
    selMon = $('#selDateMonth');
    selYea = $('#selDateYear');
    selReg = $('#selReg');
    selHC = $('#selHC');
    selTab = $('#selTab');

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
            var p = {reg: rowValues[0], regNome: rowValues[1], hcarea: rowValues[2], hcareaNome: rowValues[3], tab: rowValues[4], tabNome: rowValues[5]};
            if (p.reg != "" & p.hcarea !=99) { // only push rows with reg number
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
    
    // Region dropdown
    const regions = [];
    const map = new Map();
    for (const item of masterList) {
        if(!map.has(item.reg)){
            map.set(item.reg, true);    // set any value to Map
            regions.push(item);
        }
    }
    console.log("regions", regions);
    
    selReg.append($("<option />").val(-1).text(""));
    $.each(regions, function() {
        selReg.append($("<option />").val(this.reg).text(this.regNome));
    })

    // Health centre dropdown
    selHC[0].options.length = 0;
    selHC.append($("<option />").val(-1).text(""));
    selHC.add(getOption("Centro de saúde",0));
    selHC.attr('disabled', 'disabled');
    
    selReg.on("change", function() {
        populateHC(selReg.val());
        console.log("Setting reg..");
        window.localStorage.setItem('reg', selReg.val());
        window.localStorage.setItem('regNome', selReg.text());
    });

    // Tabanca dropdown
    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
    selTab.add(getOption("Tabanca",0));
    selTab.attr('disabled', 'disabled');

    selHC.on("change", function() {
        populateTab(selReg.val(), selHC.val());
        console.log("Setting HC..");
        window.localStorage.setItem('reg', selReg.val());
        window.localStorage.setItem('regNome', selReg.text());
        window.localStorage.setItem('hc', selHC.val());
        window.localStorage.setItem('hcNome', selHC.text());
        btnHC.removeAttr("disabled");
    });

    selTab.on("change", function() {
        window.localStorage.setItem('reg', selReg.val());
        window.localStorage.setItem('regNome', selReg.text());
        window.localStorage.setItem('hc', selHC.val());
        window.localStorage.setItem('hcNome', selHC.text());
        window.localStorage.setItem('tab', selTab.val());
        window.localStorage.setItem('tabNome', selTab.text());
        btnTab.removeAttr("disabled");
        initButtons();
    });

    document.getElementById("selDateDay").onchange = function() {initButtons()};
    document.getElementById("selDateMonth").onchange = function() {initButtons()};
    document.getElementById("selDateYear").onchange = function() {initButtons()};
    
    
    initButtons();
}

function populateHC(reg) {
    selHC[0].options.length = 0;
    selHC.append($("<option />").val(-1).text(""));
   
    // Group by HC
    const HC = [];
    const map = new Map();
    for (const item of masterList) {
        if (item.reg == reg) {
            if(!map.has(item.hcarea)){
                map.set(item.hcarea, true);    // set any value to Map
                HC.push(item);
            }
        }
    }
    console.log("HCs in region", HC);


    $.each(HC, function() {
        selHC.append($("<option />").val(this.hcarea).text(this.hcareaNome));
    });
    
    selHC.removeAttr("disabled");
    btnHC.attr("disabled","disabled");
    
    initButtons();
}

function populateTab(reg, hc) {
    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
   
    // Group by HC
    const tab = [];
    const map = new Map();
    for (const item of masterList) {
        if (item.reg == reg & item.hcarea == hc) {
            if(!map.has(item.tab)){
                map.set(item.tab, true);    // set any value to Map
                tab.push(item);
            }
        }
    }
    console.log("Tabancas in HC area", tab);


    $.each(tab, function() {
        selTab.append($("<option />").val(this.tab).text(this.tabNome));
    });
    
    selTab.removeAttr("disabled");
    btnTab.attr("disabled","disabled");
    
    initButtons();
}

function getOption(name,valle) {
    var option = document.createElement("option");
    option.text = name;
    option.value = valle;
    return option;
}


function initButtons() {
    var date = new Date(selYea.val(), selMon.val()-1, selDay.val());
    var reg = selReg.val();
    var HC = selHC.val();
    var tab = selTab.val();

    // HC
    btnHC = $('#btnHC');
    btnHC.on("click", function() {
        if (!reg || reg < 0) {
            selReg.css('background-color','pink');
            return false;
        }
        if (!HC || HC < 0) {
            selHC.css('background-color','pink');
            return false;
        }
        // Get names
        const names = [];
        const map = new Map();
        for (const item of masterList) {
            if (item.reg == reg & item.hcarea == HC) {
                if(!map.has(item.tab)){
                    map.set(item.tab, true);    // set any value to Map
                    names.push(item);
                }
            }
        }        

        var queryParams = util.setQuerystringParams(date, names[0].reg, names[0].regNome, names[0].hcarea, names[0].hcareaNome);
        odkTables.launchHTML(null, 'config/assets/supervisionHC.html' + queryParams);
    });
     
    // Tabancas
    btnTab = $('#btnTab');
    btnTab.on("click", function() {
        if (!reg || reg < 0) {
            selReg.css('background-color','pink');
            return false;
        }
        if (!HC || HC < 0) {
            selHC.css('background-color','pink');
            return false;
        }
        if (!tab || tab < 0) {
            selHC.css('background-color','pink');
            return false;
        }
        // Get names
        const names = [];
        const map = new Map();
        for (const item of masterList) {
            if (item.reg == reg & item.hcarea == HC & item.tab == tab) {
                if(!map.has(item.tab)){
                    map.set(item.tab, true);    // set any value to Map
                    names.push(item);
                }
            }
        }  
        var queryParams = util.setQuerystringParams(date, names[0].reg, names[0].regNome, names[0].hcarea, names[0].hcareaNome, names[0].tab, names[0].tabNome);
        odkTables.launchHTML(null, 'config/assets/supervisionTab.html' + queryParams);
    });
    
}