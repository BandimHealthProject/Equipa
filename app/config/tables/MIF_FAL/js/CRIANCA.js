/**
 * This is the file that will create the list view for the table.
 */
/* global $, odkCommon, odkData, odkTables, util, listViewLogic */
/* exported display, handleClick, getResults */
'use strict';


var listQuery = 'SELECT * FROM CRIANCA';

var searchParams = '(MOR LIKE ?)';

function resumeFunc(state) {
    if (state === 'init') {
        // set the parameters for the list view
        listViewLogic.setTableId('CRIANCA');
        listViewLogic.setFormId('CRIANCA_LV');
        listViewLogic.setListQuery(listQuery);
        listViewLogic.setSearchParams(searchParams);
        listViewLogic.setListElement('#list');
        listViewLogic.setSearchTextElement('#search');
        listViewLogic.setLimitElement('#limitDropdown');
        listViewLogic.setPrevAndNextButtons('#prevButton', '#nextButton');
        listViewLogic.setNavTextElements('#navTextLimit', '#navTextOffset', '#navTextCnt');
        listViewLogic.showEditAndDeleteButtons(false);
        listViewLogic.setLastvisit('LASTVISIT');
        
        listViewLogic.detailView(false);
     
        listViewLogic.setColIdsToDisplayInList(null, 'NAME',
        		'Idade', 'IDADE', null, null, 
        		'Sexo', 'SEX', null, null,
        		'Nome de mãe', 'NOMEMAE', null, null, null, null);
    }

    listViewLogic.resumeFn(state);
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