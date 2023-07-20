/**
 * Responsible for rendering registered pregnancies
 */
'use strict';

var MIF, date, reg, regNome, hcarea, hcareaNome, listGroup, tab, tabNome,  mor, morNome;
function display() {
    console.log("Person list loading");
    date = util.getQueryParameter('date');
    reg = util.getQueryParameter('reg');
    regNome = util.getQueryParameter('regNome');
    hcarea = util.getQueryParameter('hcarea');
    hcareaNome = util.getQueryParameter('hcareaNome');
    listGroup = util.getQueryParameter('listGroup');
    tab = util.getQueryParameter('tab');
    tabNome = util.getQueryParameter('tabNome');
    mor = util.getQueryParameter('mor');
    morNome = util.getQueryParameter('morNome');

    var head = $('#main');
    head.prepend("<h1>" + mor + " - " + morNome +  </br> <h3> "Mulheres");
    
    doSanityCheck();
    loadMIF();
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function loadMIF() {
    // SQL to get MIF - obs - see CSBCG - smart stuff for filtering
    console.log("user:" + user);
    var sql = "SELECT MOR, NOMEMUL, ESTADO, EXITDATA, FOGAO, MIFDNASC, MOR, REG, REGDIA, REGID, RELA1" 
        " FROM MIF" + 
        " WHERE REG = " + reg + " AND TAB = " + tab + " AND MOR = " + MOR + 
        " ORDER BY FOGAO, REGID";
    //}
    
    MIF = [];
    console.log("Querying database for Women...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " MIF");
        for (var row = 0; row < result.getCount(); row++) {
            var MOR = result.getData(row,"MOR");
            var NOMEMUL = result.getData(row,"NOMEMUL");
            var REG = result.getData(row,"REG");
            var REGDIA = result.getData(row,"REGDIA");
            var TAB = result.getData(row,"TAB");
    
            var p = {type: 'woman', MOR, NOMEMUL, REG, REGDIA, TAB};
            MIF.push(p);
        }
        console.log("Women:", MIF)
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get pregnancies from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up pregnancies.");
    }
    odkData.arbitraryQuery('MIF', sql, null, null, null, successFn, failureFn);
}

// add children here when get there

function combinedList() {
    // make combined list
    personList = [];
    MIF.forEach(function(preg) {
        personList.push(preg);
    }); 
    populateView();
}

function populateView() {
    var today = new Date(date);
    var todayAdate = "D:" + today.getDate() + ",M:" + (Number(today.getMonth()) + 1) + ",Y:" + today.getFullYear();
    console.log("today", today);
    console.log("todayAdate", todayAdate);

    // button for new pregnancy
    var newPreg = $('#newPreg')
    newPreg.on("click", function() {
        openFormNewPreg();
    })
    
    var ul = $('#li');

    // list
    $.each(personList, function() {
        var that = this; 
        
        // Check if visited today
        var option = '';
        if ((this.CONT == todayAdate | this.REGDIA == todayAdate) & this.savepoint == "COMPLETE") {
            option = "visited";
        }
      
        // set text to display
        var displayText = setDisplayText(that);
        
        // list
        // preg criterias
          


function setDisplayText(person) {
    var displayText, regdia;
    
    if (person.type == "MIF") {
        regdia = formatDate(person.REGDIA);
        var obs = "";

{
            displayText = "Morança: " + person.MOR + "<br />" +
            "Nome: " + person.NOMEMUL + "<br />" + 
            "Dia de inclusão: " + regdia + "<br />" +
                 }

    return displayText
}

function formatDate(adate) {
    if (adate == null) {
        var date = " "
        return date;
    } else {
        var d = adate.slice(2, adate.search("M")-1);
        var m = adate.slice(adate.search("M")+2, adate.search("Y")-1);
        var y = adate.slice(adate.search("Y")+2);
        var date = d + "/" + m + "/" + y;
        return date;
    }
    
}

function openFormMIF() {
    console.log("Preparing form for new pregnancy");

    var defaults = {};
    defaults['HCAREA'] = hcarea;
    defaults['HCAREANOME'] = hcareaNome;
    defaults['REG'] = reg;
    defaults['REGNOME'] = regNome;
    defaults['REGDIA'] = toAdate(date);
    defaults['TAB'] = tab;
    defaults['TABNOME'] = tabNome;
    
    console.log("Opening form with: ", defaults); 
    odkTables.addRowWithSurvey(
        null,
        'MIF_VISIT',
        'MIF_VISIT',
        null,
        defaults);
}

