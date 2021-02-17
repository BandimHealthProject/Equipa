/**
 * Responsible for rendering registered pregnancies
 */
'use strict';

var pregnancies, children, personList, date, reg, regNome, hcarea, hcareaNome, tab, tabNome;
function display() {
    console.log("Person list loading");
    date = util.getQueryParameter('date');
    reg = util.getQueryParameter('reg');
    regNome = util.getQueryParameter('regNome');
    hcarea = util.getQueryParameter('hcarea');
    hcareaNome = util.getQueryParameter('hcareaNome');
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
    var sql = "SELECT _id, _savepoint_type, CHWREG, CICATRIZMUL, CONSENT, DATASEG, ESCO, ESTADOGRAV, ESTADOMUL, GRAV, HCAREA, IDADE, MOR, NOMEMUL, IDMUL, PARITY, REG, REGDIA, TAB, TELE, VISNOMUL" +
        " FROM PREGNANCIES" + 
        " WHERE REG = " + reg + " AND HCAREA = " + hcarea + " AND TAB = " + tab + 
        " GROUP BY IDMUL HAVING MAX(VISNOMUL)" +
        " ORDER BY MOR, NOMEMUL";
    pregnancies = [];
    console.log("Querying database for pregnancies...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " pregnancies");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id"); // row ID 
            var savepoint = result.getData(row,"_savepoint_type")

            var CHWREG = result.getData(row,"CHWREG");
            var CICATRIZMUL = result.getData(row,"CICATRIZMUL");
            var CONSENT = result.getData(row,"CONSENT");
            var DATASEG = result.getData(row,"DATASEG");
            var ESCO = result.getData(row,"ESCO");
            var ESTADOGRAV = result.getData(row,"ESTADOGRAV");
            var ESTADOMUL = result.getData(row,"ESTADOMUL");
            var GRAV = result.getData(row,"GRAV");
            var HCAREA = result.getData(row,"HCAREA");
            var IDADE = result.getData(row,"IDADE");
            var MOR = result.getData(row,"MOR");
            var NOMEMUL = result.getData(row,"NOMEMUL");
            var IDMUL = result.getData(row,"IDMUL");
            var PARITY = result.getData(row,"PARITY");
            var REG = result.getData(row,"REG");
            var REGDIA = result.getData(row,"REGDIA");
            var TAB = result.getData(row,"TAB");
            var TELE = result.getData(row,"TELE")
            var VISNOMUL = result.getData(row,"VISNOMUL");

            var p = {type: 'pregnancy', rowId, savepoint, CHWREG, CICATRIZMUL, CONSENT, DATASEG, ESCO, ESTADOGRAV, ESTADOMUL, GRAV, HCAREA, IDADE, MOR, NOMEMUL, IDMUL, PARITY, REG, REGDIA, TAB, TELE, VISNOMUL};
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
    var sql = "SELECT _id, _savepoint_type, BCG, BCGDATA, DATASEG, DOB, GRAV, HCAREA, MOR, NOMEMUL, NOMECRI, IDMUL, IDCRI, POLIO, POLIODATA, REG, REGDIA, SEX, TAB, VISNOCRI" +
        " FROM CHILDREN" + 
        " WHERE REG = " + reg + " AND HCAREA = " + hcarea + " AND TAB = " + tab + 
        " GROUP BY IDCRI HAVING MAX(VISNOCRI)" +
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
            var BCGDATA = result.getData(row,"BCGDATA");
            var DATASEG = result.getData(row,"DATASEG");
            var DOB = result.getData(row,"DOB");
            var GRAV = result.getData(row,"GRAV");
            var HCAREA = result.getData(row,"HCAREA");
            var MOR = result.getData(row,"MOR");
            var NOMEMUL = result.getData(row,"NOMEMUL");
            var NOMECRI = result.getData(row,"NOMECRI");
            var IDMUL = result.getData(row,"IDMUL");
            var IDCRI = result.getData(row,"IDCRI");
            var POLIO = result.getData(row,"POLIO");
            var POLIODATA = result.getData(row,"POLIODATA");
            var REG = result.getData(row,"REG");
            var REGDIA = result.getData(row,"REGDIA");
            var SEX = result.getData(row,"SEX");
            var TAB = result.getData(row,"TAB");
            var VISNOCRI = result.getData(row,"VISNOCRI");

            var p = {type: 'child', rowId, savepoint, BCG, BCGDATA, DATASEG, DOB, GRAV, HCAREA, MOR, NOMEMUL, NOMECRI, IDMUL, IDCRI, POLIO, POLIODATA, REG, REGDIA, SEX, TAB, VISNOCRI};
            children.push(p);
        }
        console.log("Children:", children)
        combinedList();
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

function combinedList() {
    // make combined list
    personList = [];
    pregnancies.forEach(function(preg) {
        personList.push(preg);
        var thisPregChild = children.filter(function(obj) {
            return obj.IDMUL == preg.IDMUL;
        });
        thisPregChild.forEach(function(child) {
            personList.push(child);
            children.splice(children.findIndex(function(obj) {
                return obj.IDMUL == preg.IDMUL;
            }), 1);
        });
    });

    // Add any remaining (orphaned) children to the beginning of the list - hence 'unshift'
    children.forEach(function(child) {  
        personList.unshift(child);     
    });
    console.log('personList', personList);

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
        if ((this.DATASEG == todayAdate | this.REGDIA == todayAdate) & this.savepoint == "COMPLETE") {
            option = "visited";
        }
        if (this.CONSENT == 2 & this.savepoint == "COMPLETE") {
            option = "refused";
        }

        // set text to display
        var displayText = setDisplayText(that);
        
        // list
        // preg criterias
        if (this.type == "pregnancy") {
            ul.append($("<li />").append($("<button />").attr('id',this.IDMUL).attr('class', option + " " + this.type).append(displayText)));
         
            // Buttons
            var btn = ul.find('#' + this.IDMUL);
            btn.on("click", function() {
                openForm(that);
            }) 
        } 
        // child criteria
        if (this.type == "child") {
            ul.append($("<li />").append($("<button />").attr('id',this.IDCRI).attr('class', option + " " + this.type + " sex" + this.SEX).append(displayText)));
        
            // Buttons
            var btn = ul.find('#' + this.IDCRI);
            btn.on("click", function() {
                openForm(that);
            }) 
        }       
    });
}

function setDisplayText(person) {
    var displayText, regdia;
    
    if (person.type == "pregnancy") {
        regdia = formatDate(person.REGDIA);
        var obs = "";
        if (person.CICATRIZMUL == null & person.CONSENT == null) {
            obs = "Cicatriz & consentimento"
        } else if (person.CICATRIZMUL == null) {
            obs = "Cicatriz"
        } else if (person.CONSENT == null) {
            obs = "Consentimento"
        }

        if (person.CONSENT == 2) {
            displayText = "Morança: " + person.MOR + "<br />" +
            "Nome: " + person.NOMEMUL + "<br />" +
            "Inclusão: " + regdia+ "<br />" +
            "OBS: Participação recusada! <br />" + 
            "Não pergunte novamente";
        } else {
            displayText = "Morança: " + person.MOR + "<br />" +
            "Nome: " + person.NOMEMUL + "<br />" + 
            "Idade: " + person.IDADE + "<br />" +
            "Inclusão: " + regdia+ "<br />" +
            "OBS: " + obs;
        }
        
    } else {
        regdia = formatDate(person.REGDIA);
        var dob = formatDate(person.DOB);
        var sex = "Não sabe";
        if (person.SEX == 1) {
            sex = "Masculino";
        } else if (person.SEX == 2) {
            sex = "Fêmea";
        }

        displayText = "Nome: " + person.NOMECRI + "<br />" + 
            "Sexo: " + sex + "<br />" + 
            "Dia de nascimento: " + dob + "<br />" +
            "Nome da mãe: " + person.NOMEMUL + "<br />" + 
            "Inclusão: " + regdia;
    }
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
    defaults['IDMUL'] = getIdMul();
    defaults['REG'] = reg;
    defaults['REGNOME'] = regNome;
    defaults['REGDIA'] = toAdate(date);
    defaults['TAB'] = tab;
    defaults['TABNOME'] = tabNome;
    defaults['VISNOMUL'] = 1;
    
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

function getIdMul() {
    var idmul;
    var grav = getGrav();
    idmul = ((Number(reg)*100+Number(hcarea))*100+Number(tab))*1000+Number(grav);
    return idmul;
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
        if (person.DATASEG == todayAdate & person.VISNOCRI == 1) {
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
        defaults['CICATRIZMUL'] = person.CICATRIZMUL;
        defaults['cicatrizmul'] = person.CICATRIZMUL;
        defaults['CONSENT'] = person.CONSENT;
        defaults['consent'] = person.CONSENT;
        defaults['ESCO'] = person.ESCO;
        defaults['DATASEG'] = toAdate(date);
        defaults['GRAV'] = person.GRAV;
        defaults['HCAREA'] = hcarea;
        defaults['HCAREANOME'] = hcareaNome;
        defaults['IDADE'] = person.IDADE;
        defaults['MOR'] = person.MOR;
        defaults['NOMEMUL'] = person.NOMEMUL;
        defaults['IDMUL'] = person.IDMUL;
        defaults['PARITY'] = person.PARITY;
        defaults['REG'] = reg;
        defaults['REGNOME'] = regNome;
        defaults['REGDIA'] = person.REGDIA;
        defaults['TAB'] = tab;
        defaults['TABNOME'] = tabNome;
        defaults['TELE'] = person.TELE;
        defaults['VISNOMUL'] = Number(person.VISNOMUL) + 1;
    } else { // child defaults
        defaults['BCG'] = person.BCG;
        defaults['BCGDATA'] = person.BCGDATA;
        defaults['DATASEG'] = toAdate(date);
        defaults['DOB'] = person.DOB;
        defaults['GRAV'] = person.GRAV;
        defaults['HCAREA'] = hcarea;
        defaults['HCAREANOME'] = hcareaNome;
        defaults['MOR'] = person.MOR;
        defaults['NOMEMUL'] = person.NOMEMUL;
        defaults['NOMECRI'] = person.NOMECRI;
        defaults['IDMUL'] = person.IDMUL;
        defaults['IDCRI'] = person.IDCRI;
        defaults['POLIO'] = person.POLIO;
        defaults['POLIODATA'] = person.POLIODATA;
        defaults['REG'] = reg;
        defaults['REGNOME'] = regNome;
        defaults['REGDIA'] = person.REGDIA;
        defaults['SEX'] = person.SEX;
        defaults['TAB'] = tab;
        defaults['TABNOME'] = tabNome;
        defaults['VISNOCRI'] = Number(person.VISNOCRI) + 1;
    }
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }