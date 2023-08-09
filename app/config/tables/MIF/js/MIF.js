/**
 * This is the file that will create the list view for the table.
 */
/* global $, odkCommon, odkData, odkTables, util, listViewLogic */
/* exported display, handleClick, getResults */
'use strict';

var listQuery = 'SELECT * FROM MIF';

var searchParams = '(MOR LIKE ?)';


function resumeFunc(state) {
    if (state === 'init') {
        // set the parameters for the list view
        listViewLogic.setTableId('MIF');
        listViewLogic.setFormId('MIF_LV');
        listViewLogic.setListQuery(listQuery);
        listViewLogic.setSearchParams(searchParams);
        listViewLogic.setListElement('#list');
        listViewLogic.setSearchTextElement('#search');
        listViewLogic.setLimitElement('#limitDropdown');
        listViewLogic.setPrevAndNextButtons('#prevButton', '#nextButton');
        listViewLogic.setNavTextElements('#navTextLimit', '#navTextOffset', '#navTextCnt');
        listViewLogic.showEditAndDeleteButtons(false);
        listViewLogic.setLastvisit('LASTVISIT');
        
        listViewLogic.detailView(true);
        
        listViewLogic.setColIdsToDisplayInList(null, 'NOMEMAE',
        		'Relação 1', 'RELA1', null, 'RELA1NOME', 
        		'Relação 2', 'RELA2', null, 'RELA2NOME',
        		'Morança', 'MOR', 'Casa', 'CASA', 'Fogao', 'FOGAO');
    }

    listViewLogic.resumeFn(state);
    
 // create button that adds patients to the system - launches diagnosticQuick form
    var addClient = document.createElement('p');
    addClient.onclick = function() {
        odkTables.addRowWithSurvey(
        		null,
                'MIF',
                'MIF',
                null,
                null);
    };
    addClient.setAttribute('class', 'launchForm');
    addClient.innerHTML = 'Nova mulher';
    document.getElementById('searchBox').appendChild(addClient);
}

function clearListResults() {
    listViewLogic.clearResults();
}

function prevListResults() {
    listViewLogic.prevResults();
}

function nextListResults() {
    listViewLogic.nextResults();
}

function getSearchListResults(){
    listViewLogic.getSearchResults();
}

function newListLimit(){
    listViewLogic.newLimit();
}