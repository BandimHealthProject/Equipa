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
    var sql = "SELECT _id, _savepoint_type, CHWREG, CICATRIZMAE, CONSENT, DATASEG, ESCO, ESTADOGRAV, ESTADOMUL, GRAV, HCAREA, IDADE, MOR, NOME, NUMEST, PARITY, REG, REGDIA, SUBAREA, TAB, VISNO" +
        " FROM PREGNANCIES" + 
        " WHERE REG = " + reg + " AND HCAREA = " + hcarea + " AND SUBAREA = " + subarea + " AND TAB = " + tab + 
        " GROUP BY NUMEST HAVING MAX(VISNO)" +
        " ORDER BY MOR, NOME";
    pregnancies = [];
    console.log("Querying database for pregnancies...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " pregnancies");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id"); // row ID 
            var savepoint = result.getData(row,"_savepoint_type")

            var CHWREG = result.getData(row,"CHWREG");
            var CICATRIZMAE = result.getData(row,"CICATRIZMAE");
            var CONSENT = result.getData(row,"CONSENT");
            var DATASEG = result.getData(row,"DATASEG");
            var ESCO = result.getData(row,"ESCO");
            var ESTADOGRAV = result.getData(row,"ESTADOGRAV");
            var ESTADOMUL = result.getData(row,"ESTADOMUL");
            var GRAV = result.getData(row,"GRAV");
            var HCAREA = result.getData(row,"HCAREA");
            var IDADE = result.getData(row,"IDADE");
            var MOR = result.getData(row,"MOR");
            var NOME = result.getData(row,"NOME");
            var NUMEST = result.getData(row,"NUMEST");
            var PARITY = result.getData(row,"PARITY");
            var REG = result.getData(row,"REG");
            var REGDIA = result.getData(row,"REGDIA");
            var SUBAREA = result.getData(row,"SUBAREA");
            var TAB = result.getData(row,"TAB");
            var VISNO = result.getData(row,"VISNO");

            var p = {type: 'pregnancy', rowId, savepoint, CHWREG, CICATRIZMAE, CONSENT, DATASEG, ESCO, ESTADOGRAV, ESTADOMUL, GRAV, HCAREA, IDADE, MOR, NOME, NUMEST, PARITY, REG, REGDIA, SUBAREA, TAB, VISNO};
            pregnancies.push(p);
        }
        console.log("Pregnancies:", pregnancies)
        loadChildren();
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

function loadChildren() {
    // SQL to get pregnancies
    var sql = "SELECT _id, _savepoint_type, BCG, BCGDATA, DATASEG, DOB, GRAV, HCAREA, MOR, NOME, NOMECRI, NUMEST, NUMESTCRI, POLIO, POLIODATA, REG, REGDIA, REGDIACRI, SEX, SUBAREA, TAB, VISNO" +
        " FROM CHILDREN" + 
        " WHERE REG = " + reg + " AND HCAREA = " + hcarea + " AND SUBAREA = " + subarea + " AND TAB = " + tab + 
        " GROUP BY NUMESTCRI HAVING MAX(VISNO)" +
        " ORDER BY MOR, NOMECRI";
    children = [];
    console.log("Querying database for children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id"); // row ID 
            var savepoint = result.getData(row,"_savepoint_type")

            var BCG = result.getData(row,"BCG");
            var BCGDATA = result.getData(row,"CICATRIZMAE");
            var DATASEG = result.getData(row,"DATASEG");
            var DOB = result.getData(row,"DOB");
            var GRAV = result.getData(row,"GRAV");
            var HCAREA = result.getData(row,"HCAREA");
            var MOR = result.getData(row,"MOR");
            var NOME = result.getData(row,"NOME");
            var NOMECRI = result.getData(row,"NOMECRI");
            var NUMEST = result.getData(row,"NUMEST");
            var NUMESTCRI = result.getData(row,"NUMESTCRI");
            var POLIO = result.getData(row,"POLIO");
            var POLIODATA = result.getData(row,"POLIODATA");
            var REG = result.getData(row,"REG");
            var REGDIA = result.getData(row,"REGDIA");
            var REGDIACRI = result.getData(row,"REGDIACRI");
            var SEX = result.getData(row,"SEX");
            var SUBAREA = result.getData(row,"SUBAREA");
            var TAB = result.getData(row,"TAB");
            var VISNO = result.getData(row,"VISNO");

            var p = {type: 'child', rowId, savepoint, BCG, BCGDATA, DATASEG, DOB, GRAV, HCAREA, MOR, NOME, NOMECRI, NUMEST, NUMESTCRI, POLIO, POLIODATA, REG, REGDIA, REGDIACRI, SEX, SUBAREA, TAB, VISNO};
            children.push(p);
        }
        console.log("Children:", children)
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get children from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up children.");
    }
    odkData.arbitraryQuery('CHILDREN', sql, null, null, null, successFn, failureFn);
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
    $.each(pregnancies, function() {
        var that = this;  

        // Check if visited today
        var visited = '';
        if ((this.DATASEG == todayAdate | this.REGDIA == todayAdate) & this.savepoint == "COMPLETE") {
            visited = "visited";
        };

        // set text to display
        var displayText = setDisplayText(that);
        
        // list
        if (this.ESTADOMUL != null) {
            ul.append($("<li />").append($("<button />").attr('id',this.NUMEST).attr('class', visited + ' btn ' + this.type).append(displayText)));
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

    var obs = "";
    if (woman.CICATRIZMAE == null & woman.CONSENT == null) {
        obs = "Cicatriz & consentimento"
    } else if (woman.CICATRIZMAE == null) {
        obs = "Cicatriz"
    } else if (woman.CONSENT == null) {
        obs = "Consentimento"
    }

    var displayText = "Morança: " + woman.MOR + "<br />" +
        "Nome: " + woman.NOME + "<br />" + 
        "Idade: " + woman.IDADE + "<br />" +
        "Inclusão: " + regdia+ "<br />" +
        "OBS: " + obs;
    return displayText
}

function formatDate(adate) {
    var d = adate.slice(2, adate.search("M")-1);
    var m = adate.slice(adate.search("M")+2, adate.search("Y")-1);
    var y = adate.slice(adate.search("Y")+2);
    var date = d + "/" + m + "/" + y;
    return date;
}

function openFormNewPreg() {
    console.log("Preparing form for new pregnancy");

    var defaults = {};
    defaults['GRAV'] = getGrav();
    defaults['HCAREA'] = hcarea;
    defaults['HCAREANOME'] = hcareaNome;
    defaults['NUMEST'] = getNumest();
    defaults['REG'] = reg;
    defaults['REGNOME'] = regNome;
    defaults['REGDIA'] = toAdate(date);
    defaults['SUBAREA'] = subarea;
    defaults['SUBAREANOME'] = subareaNome;
    defaults['TAB'] = tab;
    defaults['TABNOME'] = tabNome;
    defaults['VISNO'] = 1;
    
    console.log("Opening form with: ", defaults); 
    odkTables.addRowWithSurvey(
        null,
        'PREGNANCIES',
        'PREGNANCIES',
        null,
        defaults);
}

function getGrav() {
    var grav = Math.max.apply(Math, pregnancies.map(function(preg) {return preg.GRAV;}));
    if (grav < 0) {
        grav = 1;
    } else {
        grav = grav + 1;
    }
    return grav;
}

function getNumest() {
    var numest;
    var grav = getGrav();
    numest = ((reg*100+hcarea)*100+tab)*10000+grav;
    return numest;
}

function openForm(person) {
    console.log("Preparing form for: ", person);
    var today = new Date(date);
    var todayAdate = "D:" + today.getDate() + ",M:" + (Number(today.getMonth()) + 1) + ",Y:" + today.getFullYear();

    var rowId = person.rowId;
    
    if (person.type == 'pregnancy') { // pregnancy
        if (person.REGDIA == todayAdate) {
            console.log("Edit form for pregnancy: ", person)
            odkTables.editRowWithSurvey(
                null,
                'PREGNANCIES',
                rowId,
                'PREGNANCIES',
                null,);
        } else if (person.DATASEG == todayAdate) {
            console.log("Edit form for pregnancy: ", person)
            odkTables.editRowWithSurvey(
                null,
                'PREGNANCIES',
                rowId,
                'PREGNANCYFU',
                null,);
        } else {
            var defaults = getDefaults(person);
            console.log("Opening pregnancy follow-up form with: ", defaults); 
            odkTables.addRowWithSurvey(
                null,
                'PREGNANCIES',
                'PREGNANCYFU',
                null,
                defaults);
        }
    } else { // child
        if (person.REGDIACRI == todayAdate) {
            console.log("Edit form for child: ", person)
            odkTables.editRowWithSurvey(
                null,
                'CHILDREN',
                rowId,
                'CHILDREN',
                null,);
        } else if (person.DATASEG == todayAdate) {
            console.log("Edit form for child: ", person)
            odkTables.editRowWithSurvey(
                null,
                'CHILDREN',
                rowId,
                'CHILDFU',
                null,);
        } else {
            var defaults = getDefaults(person);
            console.log("Opening child follow-up form with: ", defaults); 
            odkTables.addRowWithSurvey(
                null,
                'CHILDREN',
                'CHILDFU',
                null,
                defaults);
        }
    }
}

function toAdate(date) {
    var jsDate = new Date(date);
    return "D:" + jsDate.getDate() + ",M:" + (Number(jsDate.getMonth()) + 1) + ",Y:" + jsDate.getFullYear();
}

function getDefaults(person) {
    var defaults = {};
    if (person.type == "pregnancy") { // pregnancy defaults 
        defaults['CHWREG'] = person.CHWREG;
        defaults['CICATRIZMAE'] = person.CICATRIZMAE;
        defaults['cicatrizmae'] = person.CICATRIZMAE;
        defaults['CONSENT'] = person.CONSENT;
        defaults['ESCO'] = person.ESCO;
        defaults['DATASEG'] = toAdate(date);
        defaults['GRAV'] = person.GRAV;
        defaults['HCAREA'] = hcarea;
        defaults['HCAREANOME'] = hcareaNome;
        defaults['IDADE'] = person.IDADE;
        defaults['MOR'] = person.MOR;
        defaults['NOME'] = person.NOME;
        defaults['NUMEST'] = person.NUMEST;
        defaults['PARITY'] = person.PARITY;
        defaults['REG'] = reg;
        defaults['REGNOME'] = regNome;
        defaults['REGDIA'] = person.REGDIA;
        defaults['SUBAREA'] = subarea;
        defaults['SUBAREANOME'] = subareaNome;
        defaults['TAB'] = tab;
        defaults['TABNOME'] = tabNome;
        defaults['VISNO'] = person.VISNO + 1;
    } else { // child defaults: missing a lot 
        defaults['BCG'] = person.BCG;
        defaults['BCGDATA'] = person.BCGDATA;
        defaults['DATASEG'] = toAdate(date);
        defaults['DOB'] = person.DOB;
        defaults['GRAV'] = person.GRAV;
        defaults['HCAREA'] = hcarea;
        defaults['HCAREANOME'] = hcareaNome;
        defaults['MOR'] = person.MOR;
        defaults['NOME'] = person.NOME;
        defaults['NOMECRI'] = person.NOMECRI;
        defaults['NUMEST'] = person.NUMEST;
        defaults['NUMESTCRI'] = person.NUMESTCRI;
        defaults['POLIO'] = person.POLIO;
        defaults['POLIODATA'] = person.POLIODATA;
        defaults['REG'] = reg;
        defaults['REGNOME'] = regNome;
        defaults['REGDIA'] = person.REGDIA;
        defaults['REGDIACRI'] = person.REGDIACRI;
        defaults['SEX'] = person.SEX;
        defaults['SUBAREA'] = subarea;
        defaults['SUBAREANOME'] = subareaNome;
        defaults['TAB'] = tab;
        defaults['TABNOME'] = tabNome;
        defaults['VISNO'] = person.VISNO + 1;
    }
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }