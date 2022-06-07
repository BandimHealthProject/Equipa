/**
 * Responsible for rendering registered pregnancies
 */
'use strict';


var pregnancies, children, personList;
function display() {
    var head = $('#main');
    head.prepend("<h3> Busca mulheres e crianças");
    doSanityCheck();
    searchButton();
}

function searchButton() {
    // Search button
    var btn = $('#searchBtn')
    btn.on("click", function() {
        var input = document.getElementById("search");
        var value = input.value;
        loadPregnancies(value);
    }) 
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}


function loadPregnancies(value) {
    // SQL to get pregnancies
    var sql = "SELECT _id, DATASEG, HCAREANOME, IDMUL, NOMEMUL, REGDIA, TABNOME, TELE, VISNOMUL" +
    " FROM PREGNANCIES" + 
    " WHERE IDMUL LIKE '%" + value + "%'" + 
    " ORDER BY IDMUL, VISNOMUL";
        
    pregnancies = [];
    console.log("Querying database for pregnancies...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " pregnancies");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id"); // row ID 

            var DATASEG = result.getData(row,"DATASEG");
            var HCAREANOME = result.getData(row,"HCAREANOME");
            var IDMUL = result.getData(row,"IDMUL");
            var NOMEMUL = titleCase(result.getData(row,"NOMEMUL"));
            var REGDIA = result.getData(row,"REGDIA");
            var TABNOME = result.getData(row,"TABNOME");
            var TELE = result.getData(row,"TELE")
            var VISNOMUL = result.getData(row,"VISNOMUL");

            var p = {type: 'pregnancy', rowId, DATASEG, HCAREANOME, IDMUL, NOMEMUL, REGDIA, TABNOME, TELE, VISNOMUL};
            pregnancies.push(p);
        }
        console.log("Pregnancies:", pregnancies)
        loadChildren(value);
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

function loadChildren(value) {
    // SQL to get pregnancies
    var sql = "SELECT _id, DATASEG, DOB, HCAREANOME, IDCRI, IDMUL, NOMECRI, NOMEMUL, REGDIA, SEX, TABNOME, TELE, VISNOCRI" +
    " FROM CHILDREN" + 
    " WHERE IDCRI LIKE '%" + value + "%'" + 
    " ORDER BY IDCRI, VISNOCRI";
   
    children = [];
    console.log("Querying database for children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id"); // row ID 

            var DATASEG = result.getData(row,"DATASEG");
            var DOB = result.getData(row,"DOB");
            var HCAREANOME = result.getData(row,"HCAREANOME");
            var IDCRI = result.getData(row,"IDCRI");
            var IDMUL = result.getData(row,"IDMUL");
            var NOMECRI = titleCase(result.getData(row,"NOMECRI"));
            var NOMEMUL = titleCase(result.getData(row,"NOMEMUL"));
            var REGDIA = result.getData(row,"REGDIA");
            var SEX = result.getData(row,"SEX");
            var TABNOME = result.getData(row,"TABNOME");
            var TELE = result.getData(row,"TELE");
            var VISNOCRI = result.getData(row,"VISNOCRI");          

            var p = {type: 'child', rowId, DATASEG, DOB, HCAREANOME, IDCRI, IDMUL, NOMECRI, NOMEMUL, REGDIA, SEX, TABNOME, TELE, VISNOCRI};
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
    personList = pregnancies;
    
    // Add any remaining children to the end of the list - hence 'push'
    children.forEach(function(child) {  
        personList.push(child);     
    });
    console.log('personList', personList);

    populateView();
}

function populateView() {
    var ul = $('#li');
    ul.empty();

    // list
    $.each(personList, function() {
        var that = this; 
        var linkID = this.rowId.slice(5);

        // set text to display
        var displayText = setDisplayText(that);
        
        // list
        // preg criterias
        if (this.type == "pregnancy") {
            ul.append($("<li />").append($("<button />").attr('id',linkID).attr('class', this.type).append(displayText)));
         
            // Buttons
            var btn = ul.find('#' + linkID);
            btn.on("click", function() {
                console.log("preg",linkID);
                openForm(that);
            }) 
        } 
        // child criteria
        if (this.type == "child") {
            ul.append($("<li />").append($("<button />").attr('id',linkID).attr('class', this.type + " sex" + this.SEX).append(displayText)));
        
            // Buttons
            var btn = ul.find('#' + linkID);
            btn.on("click", function() {
                console.log("child",linkID);
                openForm(that);
            }) 
        }       
    });
    
    // empty list
    if (personList.length == 0) {
        ul.append($("<li />").append("Não encontrou mulheres ou crianças"));
    };
}

function setDisplayText(person) {
    var displayText, regdia, dataseg;
    
    if (person.type == "pregnancy") {
        regdia = formatDate(person.REGDIA);
        dataseg = formatDate(person.DATASEG);

        displayText = "ID gravidez: " + person.IDMUL + "<br />" +
        "Area: " + person.HCAREANOME + "<br />" + 
        "Tabanca: " + person.TABNOME + "<br / >" +
        "Nome: " + person.NOMEMUL + "<br />" +
        "Regdia: " + regdia + "<br />" +
        "Dataseg: " + dataseg + "<br />" +
        "Tele: " + person.TELE;

    } else {
        regdia = formatDate(person.REGDIA);
        dataseg = formatDate(person.DATASEG)
        var dob = formatDate(person.DOB);

        displayText = "ID criança: " + person.IDCRI + "<br />" +
        "Area: " + person.HCAREANOME + "<br />" + 
        "Tabanca: " + person.TABNOME + "<br / >" +
        "Nome mãe: " + person.NOMEMUL + "<br />" +
        "Nome cri: " + person.NOMECRI + "<br />" +
        "Regdia: " + regdia + "<br />" +
        "Dataseg: " + dataseg + "<br />" +
        "Nascimento: " + dob + "<br />" +
        "Tele: " + person.TELE;
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

function openForm(person) {
    console.log("Preparing form for: ", person);
    
    var rowId = person.rowId;
    
    if (person.type == 'pregnancy') { // pregnancy
        if (person.VISNOMUL == 1) {
            console.log("Edit form for pregnancy: ", person)
            odkTables.editRowWithSurvey(
                null,
                'PREGNANCIES',
                rowId,
                'PREGNANCIES',
                null,);
        } else {
            console.log("Edit form for pregnancy: ", person)
            odkTables.editRowWithSurvey(
                null,
                'PREGNANCIES',
                rowId,
                'PREGNANCYFU',
                null,);
        } 
    } else { // child
        if (person.VISNOCRI == 1) {
            console.log("Edit form for child: ", person)
            odkTables.editRowWithSurvey(
                null,
                'CHILDREN',
                rowId,
                'CHILDREN',
                null,);
        } else {
            console.log("Edit form for child: ", person)
            odkTables.editRowWithSurvey(
                null,
                'CHILDREN',
                rowId,
                'CHILDFU',
                null,);
        }
    }
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }