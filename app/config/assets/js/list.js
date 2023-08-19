/**
 * Responsible for rendering registered pregnancies
 */
'use strict';

var MIF, children, personList, date, reg, regNome, hcarea, hcareaNome, listGroup, tab, tabNome,  mor, morNome, assistant; //removed mul
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
 //   mul = util.getQueryParameter('mul');
    assistant = util.getQueryParameter('assistant');

    var head = $('#main');
    head.prepend("<h1>" + mor + " - " + morNome + " </br> <h3> Mulheres");
    console.log(assistant); // her    15/8
    doSanityCheck();
    loadMIF();
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

// function testdate() {
//       var todayAdate2 = "D:" + today.getDate() + ",M:" + (Number(today.getMonth()) + 1) + ",Y:" + today.getFullYear();
//       console.log("todayAdate", todayAdate2);
// }

function loadMIF() {
    // SQL to get MIF - obs - see CSBCG - smart stuff for filtering - incl user accounts
     var sql = "SELECT V._id, V._savepoint_type, M.ESTADO,  M.EXITDATA,  M.FOGAO,  M.GR_LAST,  M.MIFDNASC,  M.MOR,  M.NOMEMAE,  M.MUL, M.PARPAD3,  M.REG,  M.REGDIA,  M.REGID,  M.RELA1,  M.TAB" +
     " FROM MIF AS M" + 
     " LEFT JOIN MIF_VISIT AS V ON M.REGID = V.REGID" + 
        " WHERE M.REG = " + reg + " AND M.TAB = " + tab + " AND M.MOR = " + mor + 
        " GROUP BY M.REGID" +
        // HAVING V.CONT=" + todayAdate2 + " OR V.CONT IS NULL" +
        " ORDER BY M.FOGAO, M.REGID";
    
    MIF = [];
    console.log("Querying database for Women...");
    console.log(sql);
   
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " MIF");
        for (var row = 0; row < result.getCount(); row++) {
           // Her hentes alle de variabler fra SQL ind i javascript
            var rowId = result.getData(row,"_id");                      // row række id (=_id i ODK) 
            var savepoint = result.getData(row,"_savepoint_type")       // Savepoint = Finalize vs incomplete osv
            var FOGAO = result.getData(row,"FOGAO");
            var GR_LAST = result.getData(row,"GR_LAST");
            var MOR = result.getData(row,"MOR");
            var NOMEMAE = result.getData(row,"NOMEMAE");
            var MUL = result.getData(row,"MUL");
            var PARPAD3 = result.getData(row,"PARPAD3");
            var REG = result.getData(row,"REG");
            var REGDIA = result.getData(row,"REGDIA");
            var REGID = result.getData(row,"REGID")
            var TAB = result.getData(row,"TAB");
            // har samles alle variablerne i et "object"
            var p = {type: 'woman',  rowId, savepoint, FOGAO, GR_LAST, MOR, MUL, NOMEMAE, PARPAD3, REG, REGDIA, REGID, TAB}; // 
            MIF.push(p); // Her tilføjes "object" til listen "pregnancies", der kommer til at indeholde alle graviditeterne der kommer frem fra SQL-koden
        }
        console.log("MIF:", MIF)
        
         // så kaldes næste funktion, der henter børnene
         loadChildren();
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

// funktion der henter alle children fra SQL og gemmer dem i children-variablen
function loadChildren() {
    // SQL to get chidlren
    var sql = "SELECT _id, _savepoint_type, DATASEG, DOB, HCAREA, IDCRI, IDMUL, MOR, NOMECRI, REG, REGDIA, SEX, TAB" +
    " FROM CHILDREN" + 
    " WHERE REG = " + reg + " AND HCAREA = " + hcarea + " AND TAB = " + tab +
    " ORDER BY MOR, NOMECRI";
    
    children = [];
    console.log("Querying database for children..."); // printer til log
    console.log(sql); // printer til log
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");        // printer til log
        for (var row = 0; row < result.getCount(); row++) {             // loop over alle rækker
            // Her hentes alle de variabler fra SQL ind i javascript
            var rowId = result.getData(row,"_id");                      // row ID 
            var savepoint = result.getData(row,"_savepoint_type")

            var DATASEG = result.getData(row,"DATASEG");
            var DOB = result.getData(row,"DOB");
            var HCAREA = result.getData(row,"HCAREA");
            var REGIDC = result.getData(row,"REGIDC");
            var REGID = result.getData(row,"REGID");                    // Kan ændres til var REGID = result.getData(row,"regid"), hvis det nu er ID'et
            var MOR = result.getData(row,"MOR");
            var NOMECRI = result.getData(row,"NOMECRI");
            var REG = result.getData(row,"REG");
            var REGDIA = result.getData(row,"REGDIA");
            var SEX = result.getData(row,"SEX");
            var TAB = result.getData(row,"TAB");

            // har samles alle variablerne i et "object"
            var p = {type: 'child', rowId, savepoint, DATASEG, DOB, HCAREA, MOR, NOMECRI, REG, REGDIA, REGID, REGIDC, SEX, TAB};
            children.push(p);// Her tilføjes "object" til listen "children", der kommer til at indeholde alle børnene der kommer frem fra SQL-koden
        }
        console.log("Children:", children) // printer til log

        // så kaldes næste funktion, der samler børn og kvinder i én liste
        combinedList();
        return;
    }
    // denne funktion smider en masse fejlmeddelser i log, hvis der er noget galt med SQL-koden
    var failureFn = function( errorMsg ) {
        console.error('Failed to get children from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up children.");
    }
    // denne funktion tjekker om der er noget galt med SQL-koden
    odkData.arbitraryQuery('CHILDREN', sql, null, null, null, successFn, failureFn);
}

// funktion der samaler børn og kvinder i samme liste, og ordner dem, så børn står under deres mor
// her bruges varablen "IDMUL" fra linje 64 og 113. Derfor vigtigt, hvad man har kaldt variablen
function combinedList() {
    // make combined list
    personList = [];
    MIF.forEach(function(preg) { // VIGTIGT: "pregnacies" skal være listen med kvinderne - changed to mif
        personList.push(preg);
        var thisPregChild = children.filter(function(obj) { // VIGTIGT: "children" skal være listen med børnene
            return obj.REGID == preg.REGID;
        });
        thisPregChild.forEach(function(child) {
            personList.push(child);
            children.splice(children.findIndex(function(obj) {
                return obj.REGID == preg.REGID;
            }), 1);
        });
    });

    // Add any remaining (orphaned) children to the beginning of the list - hence 'unshift'
    children.forEach(function(child) {  
        personList.unshift(child);     
    });
    console.log('personList', personList); // printer til log

    // så kaldes næste funktion, der danner HTML-kode, så der kommer en liste med kvinder og børn
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
    
   
      // Så lave listen over alle kvinder og børn
    var ul = $('#li');
    $.each(personList, function() {
        var that = this; 
        
        // Check if visited today
        var option = '';
        if ((this.CONT == todayAdate | this.REGDIA == todayAdate) & this.savepoint == "COMPLETE") {
            option = "visited";
        }

        // set text to display
        // funktion der danner teksten som man ser på knapperne
        var displayText = setDisplayText(that);
        
        // list
        // Hvis kvinde (pregnacy)
        if (this.type == "woman") {
            ul.append($("<li />").append($("<button />").attr('id',this.REGID).attr('class', option + " " + this.type).append(displayText)));
         
            // Buttons
            var btn = ul.find('#' + this.REGID);
            btn.on("click", function() {
                // hvis man trykker på knappen kaldes funktionen der åbner formen
                openForm(that);
            }) 
        } 
        // Hvis barn
        if (this.type == "child") {
            ul.append($("<li />").append($("<button />").attr('id',this.REGIDC).attr('class', option + " " + this.type + " sex" + this.SEX).append(displayText)));
        
            // Buttons
            var btn = ul.find('#' + this.REGIDC);
            btn.on("click", function() {
                // hvis man trykker på knappen kaldes funktionen der åbner formen
                openForm(that);
            }) 
        }       
    });
}

// funktionen der laver tekst til knapperne (elementerne i listen)
function setDisplayText(person) {
    var displayText, regdia;
    
    // hvis kvinde (pregnancy)
    if (person.type == "woman") {
        // funtion der formaterer dato til noget der er pænt at se på
        regdia = formatDate(person.REGDIA);
        
        // teksten
        displayText = "Morança: " + person.MOR +"Mul:" + person.MUL + "<br />" +
        "Nome: " + person.NOMEMAE  + "<br />" + 
        "Regdia: " + regdia + "<br />" +
        "ID mulher: " + person.REGID;
        
        
    } else { // hvis barn
        // funtion der formaterer dato til noget der er pænt at se på
        regdia = formatDate(person.REGDIA);
        var dob = formatDate(person.DOB);
        
        var sex = "Não sabe";
        if (person.SEX == 1) {
            sex = "Masculino";
        } else if (person.SEX == 2) {
            sex = "Fêmea";
        } 

        // teksten
        displayText = "Morança: " + person.MOR + "<br />" +
            "Nome da criança: " + person.NOMECRI + "<br />" + 
            "Sexo: " + sex + "<br />" + 
            "Dia de nascimento: " + dob + "<br />" + 
            "Dia de inclusão: " + regdia + "<br />" +
            "ID criança: " + person.REGIDC; 
    }
    return displayText
}

// funtktionen der laver datoer pæne
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

// funktionen der kaldes hvis man trykker på knap for ny graviditet
function openFormNewPreg() {
    console.log("Preparing form for new pregnancy"); // printer til log

    // her sættes de værdier, der automatisk skal skrives, når man starter en ny form(/række i SQL)
    var defaults = {};
    defaults['HCAREA'] = hcarea;
    defaults['HCAREANOME'] = hcareaNome;
    defaults['REG'] = reg;
    defaults['REGNOME'] = regNome;
    defaults['REGDIA'] = toAdate(date);
    defaults['TAB'] = tab;
    defaults['TABNOME'] = tabNome;
    
    console.log("Opening form with: ", defaults); // printer til log
    
    // ODK-funktion der tilføje ny række til SQL-tabel 
    odkTables.addRowWithSurvey(
        null,
        'PREGNANCIES', // navn på table i SQL
        'PREGNANCIES', // navn på den form der skal åbnes
        null,
        defaults);
}


// funktionen der kaldes hvis man trykker på en kvinde eller barn
function openForm(person) {
    console.log("Preparing form for: ", person); // printer til log
    
    // dags dato 
    var today = new Date(date);
    var todayAdate = "D:" + today.getDate() + ",M:" + (Number(today.getMonth()) + 1) + ",Y:" + today.getFullYear();

    // række-id fra SQL-tabel, hvis man skal rætte i en række (en der allerede er besøgt)
    var rowId = person.rowId;
    
    // hvis kvinde (pregnancy)
    if (person.type == 'woman') { // pregnancy
        // hvis besøgt allerede (registeret i dag), så skal man rette i en række, der allerede eksisterer
        if (person.REGDIA == todayAdate) {
            console.log("Edit form for MIF visit1: ", person) // printer til log
            odkTables.editRowWithSurvey(
                null,
                'MIF_VISIT',  // navn på table i SQL
                rowId,          //_id for rækken man vil ændre
                'MIF_VISIT',  // navn på den form der skal åbnes
                null,);
        // hvis besøgt allerede, så skal man rette i en række, der allerede eksisterer
        } else if (person.CONT == todayAdate) {
            console.log("Edit form for MIF Visit2: ", person) // printer til log
            odkTables.editRowWithSurvey(
                null,
                'MIF_VISIT',  // navn på table i SQL
                rowId,          //_id for rækken man vil ændre
                'MIF_VISIT',  // navn på den form der skal åbnes
                null,);
        // hvis ikke besøgt, skal man lave en ny række i SQL (som med openFromNewPreg()-funktionen)
        } else {
            // her sættes de værdier, der automatisk skal skrives, når man starter en ny form(/række i SQL) - denne gang er der bare en seperat funktion til dette
            var defaults = getDefaults(person);
            console.log("Opening MIF visit form with3: ", defaults); // printer til log
            odkTables.addRowWithSurvey(
                null,
                'MIF_VISIT',  // navn på table i SQL
                'MIF_VISIT', // navn på den form der skal åbnes
                null,
                defaults);
        }
    // hvis barn
    } else { // child
        // hvis besøgt allerede, så skal man rette i en række, der allerede eksisterer
        if (person.DATASEG == todayAdate) {
            console.log("Edit form for child: ", person) // printer til log
            odkTables.editRowWithSurvey(
                null,
                'CHILDREN', // navn på table i SQL
                rowId,      //_id for rækken man vil ændre
                'CHILDREN', // navn på den form der skal åbnes
                null,);
        // hvis ikke besøgt, skal man lave en ny række i SQL (som med openFromNewPreg()-funktionen)
        } else {
            // her sættes de værdier, der automatisk skal skrives, når man starter en ny form(/række i SQL) - denne gang er der bare en seperat funktion til dette
            var defaults = getDefaults(person);
            console.log("Opening child follow-up form with: ", defaults); // printer til log
            odkTables.addRowWithSurvey(
                null,
                'CHILDREN', // navn på table i SQL
                'CHILDFU', // navn på den form der skal åbnes
                null,
                defaults);
        }
    }
}

// laber dato til "adate"-format
function toAdate(date) {
    var jsDate = new Date(date);
    return "D:" + jsDate.getDate() + ",M:" + (Number(jsDate.getMonth()) + 1) + ",Y:" + jsDate.getFullYear();
}

// funktionen der sætter de værdier, der automatisk skal skrives, når man starter en ny form(/række i SQL) 
function getDefaults(person) {
    var defaults = {};
    // hvis kvinde
    if (person.type == "woman") { // pregnancy defaults 
        defaults['ASSISTANT'] = assistant;
        defaults['CONT'] = toAdate(date);
        defaults['GR_LAST'] = person.GR_LAST;
   //     defaults['HCAREA'] = hcarea;
    //    defaults['HCAREANOME'] = hcareaNome;
        //    defaults['MOR'] = person.MOR;
        defaults['NOMEMAE'] = person.NOMEMAE;
        defaults['PARPAD3'] = person.PARPAD3;
        defaults['REGID'] = person.REGID; 
    //    defaults['REGNOME'] = regNome;
    //    defaults['REGDIA'] = person.REGDIA;
    //    defaults['TAB'] = tab;
    //    defaults['TABNOME'] = tabNome;
    // Herover fjernet en masse variabler som ikke er i formen - kunne det være forklaringen=

    // hvis barn
    } else { // child defaults
        defaults['DATASEG'] = toAdate(date);
        defaults['DOB'] = person.DOB;
        defaults['HCAREA'] = hcarea;
        defaults['HCAREANOME'] = hcareaNome;
        defaults['REGIDC'] = person.REGIDC;
        defaults['REGID'] = person.REGID;
        defaults['MOR'] = person.MOR;
        defaults['NOMECRI'] = person.NOMECRI;
        defaults['REG'] = reg;
        defaults['REGNOME'] = regNome;
        defaults['REGDIA'] = person.REGDIA;
        defaults['SEX'] = person.SEX;
        defaults['TAB'] = tab;
    }
    return defaults;
}
   
 