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
// Setup APP1.FileNotes name space
namespace('APP1.FileNotes');
// FileNotes module
APP1.FileNotes = (function() {
    "use strict";
    
    // Local reference to the FileInformation controller object
    var controller,
    newConfig = {},
        container,
        config = {
            URL_FILE_NOTES_HTML: "//shared/file_notes/fn.html",
            URL_POST_FILE_NOTE: "",
            URL_FILE_NOTE_CONTENT: "/MiddlewareService/api/APP1/content/comment",
            URL_FILE_NOTE_DATASOURCE: "/MiddlewareService/api/APP1/general/itemDataSource/comment",
            URL_FILE_NOTE_SUPPLIER_LINE: "/MiddlewareService/api/APP1/supplierMaint/desc/comments",
            URL_FILE_NOTE_SUPPLIER: "/MiddlewareService/api/APP1/supplierMaint/supplier/comments",
            URL_FILE_NOTE_RULE: "/MiddlewareService/api/APP1/supplierMaint/rule/comments",
            CSS_MODULE_CONTAINER: "fn_container",
            CSS_NOTES_AREA: "comment-text-area",
            NOTE_BAR_CLICK_EVENT: "NoteBarClick",
            QUESTION_ICON_CLASS: "question-icon",
            QUESTION_ICON: "//shared/images/question-medium.png",
            DIALOG_MESSAGE: "dialog-message",
            CSS_NOTES_BUTTONS_CONTAINER: "notes_buttons",
            CSS_NOTES_POST_BUTTON: "comment_post",
            CSS_NOTES_CLEAR_BUTTON: "comment_clear",
            CSS_ADD_BUTTON: "comment_post",
            CSS_CLEAR_BUTTON: "comment_clear",
            MSG_ELEMENT_IN_DOM: "Element must be in the DOM."
        };
    
    // Module constructor
    var Constructor = function( token, appId, options, roles) {
        
    //    if (!$.contains(document, contentContainer[0])) {
   //         throw new Error(config.MSG_ELEMENT_IN_DOM);
  //      }
        
        container = $("<div>").addClass(config.CSS_MODULE_CONTAINER);
    
      //  contentContainer.append(container);
      //  
        options = options || {};
        
        // Combine options with the config object
       $.extend(true, config, options);
        
        try {
            // Create a new controller object and pass in the model and view objects
            controller = new APP1.FileNotes.Controller(config, new APP1.FileNotes.Model(config, token, appId), new APP1.FileNotes.View(config, container));
      controller.init();
        } catch(e) {
            // Log the error to the console also would like to log to server
        }
    };
    
    // Public API -- prototype
    Constructor.prototype = {
        constructor: APP1.FileNotes,
        vendor: " Software Corporation",
        authors: "Kevin Torbett",
        version: "@VERSION@",
        date: "@BUILD-DATE@",
        name: "File Notes",
        cleanUp: function() {
            controller.cleanUp();
            
            controller = null;
            container = null;
            config = null;
        },
        showFileNotes : function(id,type) {
              return controller.showFileNotes(id,type);
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
    
    // Return the constructor to be assigned to the new namespace
    return Constructor;
}());
 