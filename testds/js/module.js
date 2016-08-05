/*
 * Module Pattern
 *
 * Description: modules provide structure and helps organize code as it grows.
 * The module pattern provides the tools to create self contained decoupled
 * pieces of code.
 *
 * This was adapted from Stoyan Stefanov's Book,
 * "JavaScript Patterns" (2010) O'Reilly Media Inc.
 * 
 */
// Setup acme.xxx.DataSourceContent name space
acme.namespace('acme.xxx.DataSourceContent');

// DataSourceContent module
acme.xxx.DataSourceContent = (function() {
    "use strict";

    // Static reference to the default configuration object
    var config = {
        URL: {
            DATA_SOURCE_CONTENT_HTML: "/acme/shared/data_source_content/dsc.html",
            DEFAULT_FILE_PROPERTIES_HTML: "/acme/shared/data_source_content/dfp.html",
            ADD_INTERCHANGE_CHILD_HTML: "/acme/shared/data_source_content/aic.html",
            DATA_SOURCE_CONTENT_FILE_DOWNLOAD: "/MiddlewareService/api/xxx/batch/download",
            DATA_SOURCE_INTERCHANGE_CHILD: "/MiddlewareService/api/xxx/batch/itemDataSource/content/datasource",
            DATA_SOURCE_CONTENT_MAIN: "/MiddlewareService/api/xxx/batch/itemDataSource/content/datasource/supDescDocNum",
            DATA_SOURCE_CONTENT_FILES: "/MiddlewareService/api/xxx/batch/itemDataSource/content/datasource",
            DATA_SOURCE_CONTENT_DEFAULT: "/MiddlewareService/api/xxx/batch/itemDataSource/content/datasource",
            DELETE_CONTENT_FILES: "/MiddlewareService/api/xxx/content/expired",
            DATA_SOURCE_AUTOSUGGEST_DATA: "/acme/shared/data_source_content/test/autosuggest.json",
            DATA_SOURCE_PROCESS: "/MiddlewareService/api/xxx/batch/acespies/process",
            DATA_SOURCE_DELETE: "/MiddlewareService/api/xxx/batch/itemDataSource/delete",
            DATA_SOURCE_SUBMISSION_TYPES_DATA: "/MiddlewareService/api/xxx/batch/submission",
            DATA_SOURCE_CONTENT_TYPES_DATA: "/MiddlewareService/api/xxx/content/type/updatable",
            DATA_SOURCE_MAPPER_TYPES_DATA: "/MiddlewareService/api/xxx/batch/mapper",
            PROPERTIES_ICON: "/acme/shared/images/properties_16x16.png",
            DOWNLOAD_ICON: "/acme/shared/images/download_16x16.png",
            NOTES_ICON: "/acme/shared/images/notes_16x16.png",
            REFRESH_ICON: "/acme/shared/images/refresh_16x16.png",
            QUESTION_ICON: "/acme/shared/images/question-medium.png",
            SUPPLIER_AUTOCOMPLETE: "/MiddlewareService/api/xxx/supplierMaint/autoSugg/supplier?context=",
            DESCRIPTION_AUTOCOMPLETE: "/MiddlewareService/api/xxx/supplierMaint/autoSugg/desc",
            CALENDAR_ICON: "/acme/shared/images/calendar_16x16.png",
            CANCEL_ICON: "/acme/shared/images/cancel_16x16.png",
            SUCCESS_ICON: "/acme/shared/images/check_16x16.png",
            ERROR_ICON: "/acme/shared/images/x_16x16.png"
        },
        CSS: {
            MODULE_CONTAINER: "data",
            DATA_SOURCE_TOOLBAR: "data-source-toolbar",
            DATA_SOURCE_PROCESS: "data-source-process",
            DATA_SOURCE_NOTE: "data-source-note",
            DATA_SOURCE_FILE_MAP: "data-source-file-map",
            DATA_SOURCE_ATTACH: "data-source-attach",
            DATA_SOURCE_DELETE: "data-source-delete",
            DATA_SOURCE_DELETE_FILES: "data-source-delete-files",
            DATA_SOURCE_ADD_INTERCHANGE: "data-source-add-interchange",
            SUBMISSION_TYPE_BUTTONSET: "submissionType-buttonset",
            QUESTION_ICON_CLASS: "question-icon",
            DIALOG_MESSAGE: "dialog-message",
            DATA_FILES_GRID: "data_files_grid",
            DATA_FILES_PAGER: "data_files_pager",
            SUPPORT_FILES_GRID: "support_files_grid",
            SUPPORT_FILES_PAGER: "support_files_pager",
            SUPPLIER_TEXT: "supplier-text",
            RECEIVED_DATE: "choose-date",
            DESCRIPTION: "description-text",
            PROPERTIES: "properties-cell",
            DOWNLOAD: "download-cell",
            INTERCHANGE_FIELDSET: "interchange-fieldset",
            NOTE: "note-cell"
        },
        MSG: {
            ELEMENT_IN_DOM: "Element must be in the DOM.",
            INTERCHANGE_DIALOG_TITLE: "Add Interchange Child",
            FILE_MAP_DIALOG_TITLE: "FileMap for Data Source - ",
            FILE_SUBMIT_DIALOG_TITLE: "Submit for Processing",
            DEFAULT_FILE_PROPERTIES_DIALOG_TITLE: "Default File Properties",
            FILE_PROPERTIES_TIP: "View File Properties",
            DOWNLOAD_TIP: "Download File",
            FILE_NOTES_TIP: "View/Add File Notes"
        },
        CFG: {
            INTERCHANGE_EVENT: "interchangeChange",
            FILE_PROPERTY_CHANGE_EVENT: "filePropertiesChange",
            ATTACH_FILES_COMPLETE_EVENT: "attachFilesComplete",
            TOOL_BAR_CLICK_EVENT: "toolBarClick",
            GRID_CELL_CLICK_EVENT: "gridCellClick",
            GRID_CELL_EDIT_EVENT: "gridCellEdit",
            PROPERTY_CELL: "info",
            DOWNLOAD_CELL: "dnld",
            REFRESH_EVENT: "refresh",
            NOTE_CELL: "comment",
            SUPPLIER_FIELD: "supplierName",
            SUPPLIER_AUTOCOMPLETE_EVENT: "supplierAutoComplete",
            DESCRIPTION_AUTOCOMPLETE_EVENT: "descriptionAutoComplete",
            SUPPLIER_GRID_AUTOCOMPLETE_EVENT: "supplierGridAutoComplete",
            DESCRIPTION_GRID_AUTOCOMPLETE_EVENT: "descriptionGridAutoComplete",
            INIT_COMPLETE: "initComplete",
            RECEIVED_DATE_FIELD: "receiveDate",
            DESCRIPTION_FIELD: "description",
            DESCRIPTION_CELL: "description",
            DOCUMENT_NUMBER_CELL: "documentNum",
            RECEIVE_DATE_CELL: "receiveDateString",
            SUBMISSION_TYPE_CELL: "submissionTypeText",
            CONTENT_TYPE_CELL: "contentTypeText",
            SUPPLIER_NAME_CELL: "supplierName",
            SUPPLIER_ID_CELL: "supplierId",
            CONTENT_ID_CELL: "contentid",
            FILE_NAME_CELL: "fileName",
            DOC_TITLE_CELL: "documentTitle",
            DOC_NUM_CELL: "documentNum",
            CONTENT_ID_COLUMN_NAME: "contentid",
            DATA_SOURCE_ID_COLUMN_NAME: "itemDataSourceId",
            CONTENT_EDIT_ROLE: "CONTENT_EDIT",
            PROPERTIES_EDIT_ROLE: "METADATA_EDIT",
            DELETE_DATA_SOURCE_ROLE: "DATA_SOURCE_DELETE",
            DATA_SOURCE_DELETE: "DATA_SOURCE_DELETE",
            DATA_SOURCE_UPLOAD: "DATA_SOURCE_UPLOAD",
            PROCESS_CONTENT_ROLE: "CONTENT_PROCESS",
            LEVEL1_ROLE: "LEVEL1",
            LEVEL2_ROLE: "LEVEL2",
            LEVEL3_ROLE: "LEVEL3",
            SUBMIT_CONTENT: "CONTENT_SUBMIT",
            SUPER_USER_ROLE: "SUPER",
            ACES_XML_FILE: "AXL",
            PIES_XML_FILE: "PXL",
            RAW_INTERCHANGE_FILE: "RIF",
            DOCUMENT_SUBMISSION_FORM: "DSF",
            ATTACHED_FILE: "ATT",
            ACES_INTERCHANGE_CHILD: "AIC",
            DATA_GRID_OPTIONS: {
                datatype: "local",
                height: "auto",
                hidegrid: false,
                cellEdit: false,
                cellsubmit: "clientArray",
                multiselect: true,
                altRows: true,
                shrinkToFit: false,
                forceFit: false,
                caption: "Data Files",
                viewrecords: true,
                sortorder: "desc",
                toppager: true,
                rowNum: 200,
                //    recreateFilter: true,
                colNames: [
                    " ",
                    " ",
                    " ",
                    " ",
                    "File Name",
                    "Supplier",
                    " ",
                    "Doc Title",
                    "Description",
                    "Doc Num",
                    " ",
                    " ",
                    " ",
                    "Rec Date",
                    " ",
                    "Content Type",
                    "Type",
                    "Status",
                    "Sub",
                    "Prop",
                    "Dnld",
                    "Notes"
                ],
                colModel: [{
                    name: "contentTypeCode",
                    index: "contentTypeCode",
                    hidden: true
                }, {
                    name: "itemDataSourceId",
                    index: "itemDataSourceId",
                    hidden: true
                }, {
                    name: "contentid",
                    index: "contentid",
                    hidden: true
                }, {
                    name: "fullPath",
                    index: "fullPath",
                    hidden: true
                }, {
                    name: "fileName",
                    index: "fileName",
                    sortable: true,
                    width: 200
                }, {
                    name: "supplierName",
                    index: "supplierName",
                    sortable: true,
                    width: 160,
                    editable: true,
                    edittype: 'text'
                }, {
                    name: "supplierId",
                    index: "supplierId",
                    width: 10,
                    hidden: true
                }, {
                    name: "documentTitle",
                    index: "documentTitle",
                    sortable: true,
                    width: 125
                }, {
                    name: "description",
                    index: "description",
                    sortable: true,
                    editable: true,
                    edittype: 'text',
                    width: 150
                }, {
                    name: "documentNum",
                    index: "documentNum",
                    sortable: true,
                    editable: true,
                    edittype: 'text',
                    editoptions: {
                        dataInit: function(el) {
                            jQuery(el).css('text-transform', 'uppercase');
                        }
                    },
                    width: 130
                }, {
                    name: "supplierNm",
                    index: "supplierNm",
                    hidden: true
                }, {
                    name: 'errorMsg',
                    index: 'errorMsg',
                    sortable: false,
                    width: 60,
                    datatype: 'text',
                    hidden: true,
                    editable: true
                }, {
                    name: 'errorInd',
                    index: 'errorInd',
                    sortable: false,
                    width: 14,
                    hidden: false,
                    editable: false,
                    dtype: 'content-error'
                }, {
                    name: "receiveDateString",
                    index: "receiveDateString",
                    editable: true,
                    sortable: true,
                    width: 68,
                    datefmt: "mm/dd/yyyy",
                    editrules: {
                        date: true
                    }
                }, {
                    name: "receiveDate",
                    index: "receiveDate",
                    hidden: true
                }, {
                    name: "contentTypeText",
                    index: "contentTypeText",
                    width: 80,
                    sortable: true
                }, {
                    name: "submissionTypeText",
                    index: "submissionTypeText",
                    sortable: true,
                    editable: true,
                    width: 28,
                    edittype: "select",
                    editoptions: {}
                }, {
                    name: "contentStatusText",
                    index: "contentStatusText",
                    width: 38
                }, {
                    name: "inProcess",
                    index: "inProcess",
                    width: 25,
                    sortable: true,
                    //editable: false, XXX Disable for release 2.9
                    edittype: "checkbox",
                    editoptions: {
                        value: "Yes:No"
                    }
                }, {
                    name: "info",
                    index: "info",
                    sortable: false,
                    width: 27,
                    align: "center"
                }, {
                    name: "dnld",
                    index: "dnld",
                    sortable: false,
                    width: 28,
                    align: " center"
                }, {
                    name: "comment",
                    index: "comment",
                    sortable: false,
                    align: "center",
                    width: 27
                }]
            },
            SUPPORT_GRID_OPTIONS: {
                datatype: "local",
                height: "auto",
                multiselect: true,
                hidegrid: false,
                cellsubmit: "clientArray",
                altRows: true,
                caption: "Support Files",
                viewrecords: true,
                sortorder: "desc",
                topPager: false,
                rowNum: 5,
                colNames: [
                    " ",
                    " ",
                    " ",
                    "File Name ",
                    " ",
                    " ",
                    "Description",
                    "Content Type",
                    "Rec Date",
                    " ",
                    "Prop",
                    "Dnld",
                    "Notes"
                ],
                colModel: [{
                    name: "contentTypeCode",
                    index: "contentTypeCode",
                    hidden: true
                }, {
                    name: "id",
                    index: "id",
                    hidden: true
                }, {
                    name: "contentid",
                    index: "contentid",
                    hidden: true
                }, {
                    name: "fileName",
                    index: "fileName",
                    sortable: true,
                    width: 540
                }, {
                    name: "itemDataSourceId",
                    index: "itemDataSourceId",
                    hidden: true
                }, {
                    name: "fullPath",
                    index: "fullPath",
                    hidden: true
                }, {
                    name: "description",
                    index: "description",
                    sortable: true,
                    editable: false,
                    width: 290,
                    hidden: true
                }, {
                    name: "contentTypeText",
                    index: "contentTypeText",
                    sortable: true,
                    editable: true,
                    width: 400,
                    edittype: "select",
                    editoptions: {}
                }, {
                    name: "receiveDateString",
                    index: "receiveDateString",
                    editable: true,
                    sortable: true,
                    width: 80,
                    datefmt: "mm/dd/yyyy",
                    editrules: {
                        date: true
                    }
                }, {
                    name: "receiveDate",
                    index: "receiveDate",
                    hidden: true
                }, {
                    name: "info",
                    index: "info",
                    sortable: false,
                    width: 40,
                    align: "center"
                }, {
                    name: "dnld",
                    index: "dnld",
                    sortable: false,
                    width: 40,
                    align: "center"
                }, {
                    name: "comment",
                    index: "comment",
                    sortable: false,
                    width: 40,
                    align: "center"
                }]
            }
        }
    };

    // Module constructor
    var Constructor = function(token, appId, options, userName, roles) {
        // Private Instance variables 
        var controller,
            container,
            newConfig = {},
            publicInterface;

        container = $("<div>").addClass(config.CSS_MODULE_CONTAINER);
        options = options || {};

        // Combine options with the config object
        $.extend(true, newConfig, config, options);

        try {

            // Create a new controller object and pass in the model and view objects
            controller = new acme.xxx.DataSourceContent.Controller(newConfig, container, roles, userName, token, appId, new acme.xxx.DataSourceContent.Model(), new acme.xxx.DataSourceContent.View());

            controller.init();
            controller.showDataSourceContent('123');
        } catch (e) {
            // Log the error to the console also would like to log to server
        }

        // Public API
        publicInterface = {
            vendor: "acme Software Corporation",
            authors: "Kevin Torbett",
            version: "@VERSION@",
            date: "@BUILD-DATE@",
            name: "Data Source Content",
            cleanUp: function() {
                controller.cleanUp();

                controller = null;
                container = null;
                config = null;
            },
            showDataSourceContent: function(itemDataSourceId) {
                var dataz = controller.showDataSourceContent(itemDataSourceId);
                return dataz;
            },
            getContent: function() {
                return container;
            },
            on: function(evantName, eventFunction) {
                container.on(evantName, eventFunction);
            },
            off: function(evantName, eventFunction) {
                container.off(evantName, eventFunction);
            }
        };

        // Public API -- prototype
        publicInterface.prototype = {
            constructor: acme.xxx.DataSourceContent
        };

        return publicInterface;
    };

    // Return the constructor to be assigned to the new namespace
    return Constructor;
}());