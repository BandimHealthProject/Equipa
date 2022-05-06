/**
 * Responsible for rendering the select work in tabanca or photo of ficha.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

function display() {
    doSanityCheck();
    initButtons();
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function initButtons() {
    // Tabancas
    var btnTab = $('#btnTab');
    btnTab.on("click", function() {
        odkTables.launchHTML(null, 'config/assets/reg.html');
    });
    // Sync
    var btnSync = $('#btnSync');
    btnSync.on("click", function() {
        odkCommon.doAction(null, "org.opendatakit.services.sync.actions.activities.SyncActivity", {"componentPackage": "org.opendatakit.services", "componentActivity": "org.opendatakit.services.sync.actions.activities.SyncActivity"});   
    });
    // Supervise
    var user = odkCommon.getActiveUser();
    console.log("user", user);
    if (user == "username:ajensen" | user == "username:jvedel" | user == "username:afisker" | user == "username:ibhp" | user == "username:jbhp" | user == "username:lbhp" | user == "username:abhp" | user == "username:cbhp" | user == "username:fbhp" | user == "username:student") {
        var ul = $('#li');
        ul.append($("<li />").append($("<button />").attr('id',"btnSup").attr('class',"btnSup").append("Supervisão")));
        
        var btnSup = $('#btnSup')
        btnSup.on("click", function() {
            odkTables.launchHTML(null, 'config/assets/supervision.html');
        });
    }
}