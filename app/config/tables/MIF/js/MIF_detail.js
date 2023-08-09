/**
 * The file for displaying detail views of the Health Facilities table.
 */
/* global $, odkTables, util, odkData */
'use strict';

var MIFResultSet = {};

function onAddVisitClick() {
	odkTables.editRowWithSurvey(null, 'MIF', MIFResultSet.get('_id'), 'MIF_LV', null, null);
}


function onLinkClick() {
    if (!$.isEmptyObject(MIFResultSet))
    {
        var rowIdQueryParams = util.getKeyToAppendToChildURL(util.motherId, MIFResultSet.get('REGID'));
        odkTables.launchHTML(null, 
            'config/tables/CRIANCA/html/CRIANCA.html' + rowIdQueryParams);
    }
}

function onAddChildClick() {
    var jsonMap = {};
    jsonMap.REGID = MIFResultSet.get('REGID');
    jsonMap.NOMEMAE = MIFResultSet.get('NOMEMAE');
	
    odkTables.addRowWithSurvey(null, 'CRIANCA', 'CRIANCA', null, jsonMap);
}

function cbSuccess(result) {

    MIFResultSet = result;

     var access = MIFResultSet.get('_effective_access');

    if (access.indexOf('w') !== -1) {
        var editButton = $('#editFacilityBtn');
        editButton.removeClass('hideButton');
    }

    if (access.indexOf('d') !== -1) {
        var deleteButton = $('#delFacilityBtn');
        deleteButton.removeClass('hideButton');
    }

    odkData.query('CRIANCA', 'REGID = ?', [MIFResultSet.get('REGID')],
        null, null, null, null, null, null, true, refrigeratorsCBSuccess, refrigeratorsCBFailure);
}

function cbFailure(error) {

    console.log('health_facility_detail getViewData CB error : ' + error);
}

function display() {

    odkData.getViewData(cbSuccess, cbFailure);
}

function refrigeratorsCBSuccess(invData) {

    $('#TITLE').text(MIFResultSet.get('NOMEMAE'));

    $('#mif_moranca').text(MIFResultSet.get('MOR'));
    $('#mif_casa').text(MIFResultSet.get('CASA'));
    $('#mif_fogao').text(MIFResultSet.get('FOGAO'));
    $('#mif_dob').text(MIFResultSet.get('MIFDNASC'));
    $('#mif_reg').text(MIFResultSet.get('REGDIA'));
    $('#mif_lastvisit').text(MIFResultSet.get('LASTVIST'));

    $('#mif_rel').text(MIFResultSet.get('RELA1'));
    $('#mif_nomerel').text(MIFResultSet.get('RELA1NOME'));
    $('#mif_mae').text(MIFResultSet.get('MIFMAE'));
    
    $('#child_list').text(invData.getCount());

}

function refrigeratorsCBFailure(error) {

    console.log('MIF_detail query CB error : ' + error);
}
