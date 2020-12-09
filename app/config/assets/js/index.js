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
    // Follow-up
    var btnPhoto = $('#btnPhoto');
    btnPhoto.on("click", function() {
        odkTables.launchHTML(null, 'config/assets/reg.html');
    });
}