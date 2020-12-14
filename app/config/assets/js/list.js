/**
 * Responsible for rendering registered pregnancies
 */
'use strict';

var pregnancies, children, date, reg, regNome, hcarea, hcareaNome, subarea, subareaNome, tab, tabNome;
function display() {
    console.log("Person list loading");
    date = util.getQueryParameter('date');
    reg = util.getQueryParameter('reg');
    regNome = util.getQueryParameter('regNome');
    hcarea = util.getQueryParameter('hcarea');
    hcareaNome = util.getQueryParameter('hcareaNome');
    subarea = util.getQueryParameter('subarea');
    subareaNome = util.getQueryParameter('subareaNome');
    tab = util.getQueryParameter('tab');
    tabNome = util.getQueryParameter('tabNome');

    var head = $('#main');
    head.prepend("<h1>" + tabNome + " </br> <h3> Pessoas");
    
    doSanityCheck();
    loadPregnancies();
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function loadPregnancies() {
    // SQL to get pregnancies
    var sql = "SELECT P._id, P._savepoint_type, P.CICATRIZMAE, P.CONSENT, P.ESTADOMUL, P.HCAREA, P.IDADE, P.MOR, P.NOME, P.NUMEST, P.REG, P.REGDIA, P.SUBAREA, P.TAB, P.VISNO" +
        " SELECT F._id, F._savepoint_type, F.CICATRIZMAE, F.CONSENT, F.DATASEG, F.ESTADOGRAV, F.ESTADOMUL, F.MOR, F.NOME, F.VISNO" + 
        " FROM PREGNANCIES AS P, PREGNACYFU AS F" + 
        " WHERE REG = " + reg + " AND HCAREA = " + hcarea + " AND SUBARAEA = " + subarea + " AND TAB = " + tab + 
        " GROUP BY POID HAVING MAX(F.VISNO) OR F.VISNO IS NULL" +
        " ORDER BY P.MOR, P.NOME";
        pregnancies = [];
    console.log("Querying database for pregnancies...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " pregnancies");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"P._id"); // row ID 
            var savepoint = result.getData(row,"P._savepoint_type")

            var CICATRIZMAE = result.getData(row,"P.CICATRIZMAE");
            var CONSENT = result.getData(row,"P.CONSENT");
            var ESTADOMUL = result.getData(row,"P.ESTADOMUL");
            var HCAREA = result.getData(row,"P.HCAREA");
            var IDADE = result.getData(row,"P.IDADE");
            var MOR = result.getData(row,"P.MOR");
            var NOME = result.getData(row,"P.NOME");
            var NUMEST = result.getData(row,"P.NUMEST");
            var REG = result.getData(row,"P.REG");
            var REGDIA = result.getData(row,"P.REGDIA");
            var SUBAREA = result.getData(row,"P.SUBAREA");
            var TAB = result.getData(row,"P.TAB");
            var VISNO = result.getData(row,"P.VISNO");
            
            var DATASEG = result.getData(row,"F.DATASEG");
            var ESTADOGRAV = result.getData(row,"F.ESTADOGRAV");

            if (ESTADOGRAV != null) {
                rowIdFU = result.getData(row,"F._id"); // row ID FU
                savepoint = result.getData(row,"F._savepoint_type")
                CICATRIZMAE = result.getData(row,"F.CICATRIZMAE");
                CONSENT = result.getData(row,"F.CONSENT");
                ESTADOMUL = result.getData(row,"F.ESTADOMUL");
                MOR = result.getData(row,"F.MOR");
                NOME = result.getData(row,"F.NOME");
                VISNO = result.getData(row,"F.VISNO");
            }

            var p = {type: 'pregnancy', rowId, savepoint, CICATRIZMAE, CONSENT, ESTADOMUL, HCAREA, MOR, NOME, NUMEST, REG, REGDIA, SUBAREA, TAB, VISNO, DATASEG, ESTADOGRAV};
            pregnancies.push(p);
        }
        console.log("Pregnancies:", pregnancies)
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get pregnancies from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up pregnancies.");
    }
    odkData.arbitraryQuery('PREGNANCIES', sql, null, null, null, successFn, failureFn);
}

function populateView() {
    var today = new Date(date);
    var todayAdate = "D:" + today.getDate() + ",M:" + (Number(today.getMonth()) + 1) + ",Y:" + today.getFullYear();
    console.log("today", today);
    console.log("todayAdate", todayAdate);
    
    var ul = $('#li');

    // list
    $.each(pregnancies, function() {
        var that = this;  

        // Check if called today
        var called = '';
        if ((this.DATSEG == todayAdate | this.REGDIA == todayAdate) & this.savepoint == "COMPLETE") {
            called = "called";
        };

        // set text to display
        var displayText = setDisplayText(that);
        
        // list
        if (this.ESTADOMUL != null) {
            ul.append($("<li />").append($("<button />").attr('id',this.NUMEST).attr('class', called + ' btn ' + this.type).append(displayText)));
        }
        
        // Buttons
        var btn = ul.find('#' + this.NUMEST);
        btn.on("click", function() {
            openForm(that);
        })        
    });
}

function setDisplayText(woman) {
    
    var regdia = formatDate(woman.REGDIA);

    var displayText = "Morança: " + woman.MOR + "<br />" +
        "Nome: " + woman.NOME + "<br />" + 
        "Idade: " + woman.IDADE + "<br />" +
        "Inclusão: " + regdia;
    return displayText
}

function formatDate(adate) {
    var d = adate.slice(2, adate.search("M")-1);
    var m = adate.slice(adate.search("M")+2, adate.search("Y")-1);
    var y = adate.slice(adate.search("Y")+2);
    var date = d + "/" + m + "/" + y;
    return date;
}

function openForm(person) {
    console.log("Preparing form for: ", person);

    var today = new Date(date);
    var todayAdate = "D:" + today.getDate() + ",M:" + (Number(today.getMonth()) + 1) + ",Y:" + today.getFullYear();

    var rowId = person.rowId;
    var tableId = 'OPVCOVID'; // Change according to woman/child
    var formId = 'OPVCOVID'; // Change according to woman/child
    
    if (person.REGDIA == todayAdate | person.DATASEG == todayAdate) {
        odkTables.editRowWithSurvey(
            null,
            tableId,
            rowId,
            formId,
            null,);
        }
    else {
        var defaults = getDefaults(person);
        console.log("Opening form with: ", defaults); 
        odkTables.addRowWithSurvey(
            null,
            tableId,
            formId,
            null,
            defaults);
    }
}

function toAdate(date) {
    var jsDate = new Date(date);
    return "D:" + jsDate.getDate() + ",M:" + (Number(jsDate.getMonth()) + 1) + ",Y:" + jsDate.getFullYear();
}

function getDefaultsWoman(person) {
    var defaults = {};
    defaults['CICATRIZMAE'] = person.CICATRIZMAE;
    defaults['CONSENT'] = person.CONSENT;
    defaults['DATASEG'] = toAdate(date);
    defaults['HCAREA'] = hcarea;
    defaults['HCAREANOME'] = hcareaNome;
    defaults['MOR'] = person.MOR;
    defaults['NOME'] = person.NOME;
    defaults['NUMEST'] = person.NUMEST;
    defaults['REG'] = reg;
    defaults['REGNOME'] = regNome;
    defaults['REGDIA'] = person.REGDIA;
    defaults['SUBAREA'] = subarea;
    defaults['SUBAREANOME'] = subareaNome;
    defaults['TAB'] = tab;
    defaults['TABNOME'] = tabNome;
    defaults['VISNO'] = person.VISNO + 1;
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }