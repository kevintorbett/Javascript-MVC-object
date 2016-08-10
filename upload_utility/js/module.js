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
// Setup EPICOR.IMR.ContentUploadUtility name space
EPICOR.namespace('EPICOR.IMR.ContentUploadUtility');

// ContentUploadUtility module
EPICOR.IMR.ContentUploadUtility = (function() {
    "use strict";
    
    // Static reference to the default configuration object
    var config = {
            URL: {
                CONTENT_UPLOAD_UTILITY_HTML: "/epicor/shared/content_upload_utility/cuu.html",
                FILE_UPLOAD_SERVICE: "/IMDBMiddlewareService/api/imr/batch/upload",
                DATA_SOURCE_ITEM_SERVICE: "/IMDBMiddlewareService/api/imr/batch/itemDataSource/content/default",
                SUPPLIER_AUTOCOMPLETE: "/IMDBMiddlewareService/api/imr/supplierMaint/autoSugg/supplier?context=",
                FILE_DATASOURCE_SERVICE: "/IMDBMiddlewareService/api/imr/batch/itemDataSource",
                DATA_SOURCE_SUBMISSION_TYPES_DATA: "/IMDBMiddlewareService/api/imr/batch/submission",
                DATA_SOURCE_CONTENT_TYPES_DATA: "/IMDBMiddlewareService/api/imr/content/type/updatable",
                DATA_SOURCE_MAPPER_TYPES_DATA: "/IMDBMiddlewareService/api/imr/batch/mapper",
                QUESTION_ICON: "/epicor/shared/images/question-medium.png",
                CALENDAR_ICON: "/epicor/shared/images/calendar.png",
                CANCEL_ICON: "/epicor/shared/images/cancel.png",
                SUCCESS_ICON: "/epicor/shared/images/check.png",
                ERROR_ICON: "/epicor/shared/images/x.png"
            },
            CSS: {
                MODULE_CONTAINER: "cuu",
                SUBMISSION_TYPE_BUTTONSET: "cuu-file-properties-fieldset-buttonset",
                FILE_UPLOAD: "cuu-file-upload",
                FILE_LIST: "cuu-file-upload-fieldset-upload-file-list",
                FILE_UPLOAD_CONTROL: "cuu-file-upload-fieldset-fileupload",
                FILE_TEXT: "formatted-file-text",
                FILE_UPLOAD_BUTTON: "file-upload-button",
                FILE_UPLOAD_PROCESS_BUTTON: "file-upload-button-process",
                RECEIVED_DATE: "cuu-file-properties-fieldset-recieved-date",
                SUPPLIER_TEXT: "cuu-file-properties-fieldset-supplier",
                DOCUMENT_NUMBER_TEXT: "cuu-file-properties-fieldset-document-number",
                DIALOG_MESSAGE: "dialog-message",
                DATE_PICKER_CALENDAR_IMG: "cuu-file-properties-fieldset-cal-img",
                QUESTION_ICON_CLASS: "question-icon",
                UPLOAD_TEMPLATE: "template-upload",
                UPLOAD_ERROR: "upload-error",
                PERCENTAGE_COMPLETE: "percent",
                PROGRESS_DIV: "progress",
                PROGRESS_BAR: "bar",
                CANCEL_UPLOAD: "cancel",
                FILE_NAME_DIV: "name",
                UPLOAD_SUCCESS: "upload-success",
                TEST_SUBTYPE: "cuu-file-properties-fieldset-buttonset-test",
                FULL_SUBTYPE: "cuu-file-properties-fieldset-buttonset-full",
                NETS_SUBTYPE: "cuu-file-properties-fieldset-buttonset-nets",
                UPLOAD_FIELDSET: "cuu-file-upload-fieldset"
            },
            CFG: {
                FORMATTED_FILE_UPLOAD_EVENT: "formatted-file-upload-event",
                FILE_PROPERTY_CHANGE_EVENT: "filePropertiesChange",
                FILE_UPLOAD_PROGRESS_EVENT: "fileUploadProgress",
                FILE_UPLOAD_FAILED_EVENT: "fileUploadFailed",
                FILE_UPLOAD_DONE_EVENT: "fileUploadDone",
                FILE_UPLOAD_SUBMIT_EVENT: "fileUploadSubmit",
                SUPPLIER_AUTOCOMPLETE_EVENT: "supplierAutoComplete",
                INIT_COMPLETE: "initComplete",
                FULL_TYPE_CODE: "F",
                TEST_TYPE_CODE: "T",
                NETS_TYPE_CODE: "N",
                SUPPLIER_FIELD: "supplierName",
                RECEIVED_DATE_FIELD: "receiveDate",
                DOCUMENT_NUMBER_FIELD: "documentNum",
                SUBMISSION_TYPE_FIELD: "submissionType",
                AUTHORIZATION_FIELD: "Authorization",
                AUTHORIZATION_APPLICATION_FIELD: "Authorization-Application",
                ITEM_DATA_SOURCE_ID_FIELD: "itemDataSourceId",
                SUPPLIER_ID_FIELD: "supplierId",
                DESCRIPTION_FIELD: "description",
                DESCRIPTION_TYPE_CODE_FIELD: "descriptionTypeCode",
                MAPPER_TYPE_FIELD: "mapperType"
            },
            MSG: {
                CANCEL_UPLOAD_TITLE: "Cancel file upload.",
                SUPPLIER_PLACE_HOLDER: "Enter a valid supplier name",
                DOCUMENT_NUMBERPLACE_HOLDER: "Enter a document number"
            }
        };
    
    // Module constructor
    var Constructor = function(token, appId, options, roles) {
        var controller,
            container,
            newConfig = {},
            publicInterface;
        
        container = $("<div>").addClass(config.CSS.MODULE_CONTAINER);
        options = options || {};
        
        // Recursive merge of options with the config object
        $.extend(true, newConfig, config, options);

        try {
            // Create a new controller object and pass in the model and view objects
            controller = new EPICOR.IMR.ContentUploadUtility.Controller(newConfig, container, token, appId, new EPICOR.IMR.ContentUploadUtility.Model(), new EPICOR.IMR.ContentUploadUtility.View());

            controller.init();
        } catch(e) {
            // Log the error to the console also would like to log to server
        }
        
        publicInterface = {
            vendor: "Epicor Software Corporation",
            authors: "Timothy Graf/Kevin Torbett",
            version: "@VERSION@",
            date: "@BUILD-DATE@",
            name: "New Data Source",
            cleanUp: function() {
                controller.cleanUp();
                
                controller = null;
                container = null;
                config = null;
            },
            getContentUploadUtility: function(dataSourceId,Type) {
                return controller.getContentUploadUtility(dataSourceId,Type);
            },
            getContent: function() {
                return container;
            },
            on: function(eventName, eventFunction) {
                container.on(eventName, eventFunction);
            },
            off: function(eventName, eventFunction) {
                container.off(eventName, eventFunction);
            },
            submitFileForUpload: function() {
                controller.submitFileForUpload();
            }
        };
        
        publicInterface.prototype = {
            constructor: EPICOR.IMR.ContentUploadUtility
        };
        
        return publicInterface;
    };

    // Return the constructor to be assigned to the new namespace
    return Constructor;
})();