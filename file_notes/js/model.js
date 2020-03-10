// Setup APP1.Notes name space
namespace('APP1.Notes.Model');

APP1.Notes.Model = function(config, token, appId) {
    "use strict";
    
    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof APP1.Notes.Model)) {
        return new APP1.Notes.Model();
    }
    
    var base_url = location.protocol + '//' + location.host,
        publicInterface,
        userName;
        
    function ajaxGet(url, data) {
        
        return $.ajax({
                url: base_url + url,
                type: "GET",
                cache: false,
                beforeSend: function(request) {
                    request.setRequestHeader('Authorization', token);
                    request.setRequestHeader('Authorization-Application', appId);
                },
                data: data,
                contentType: "text/json",
                dataType: "json"
            });
    }
    function ajaxPut(url, data) {
        
        return $.ajax({
                url: base_url + url,
                type: "PUT",
                cache: false,
                beforeSend: function(request) {
                    request.setRequestHeader('Authorization', token);
                    request.setRequestHeader('Authorization-Application', appId);
                },
                data: data,
                contentType: "text/json",
                dataType: "json"
            });
    }
    function ajaxPost(url, data) {
        
        return $.ajax({
                url: base_url + url,
                type: "POST",
                cache: false,
                beforeSend: function(request) {
                    request.setRequestHeader('Authorization', token);
                    request.setRequestHeader('Authorization-Application', appId);
                },
                data: data,
                contentType: "text/json",
                dataType: "json"
            });
    }
    
    // Public Interface
    publicInterface = {
        /**
         *
         */
        init: function(pConfig, pToken, pAppId) {
            config = pConfig;
            token = pToken;
            appId = pAppId;
        },
        cleanUp: function() {
            base_url = null;
            publicInterface = null;
        },
        /**
         *
         */
        getDataNotesHtml: function() {
            return $.get(base_url + config.URL_FILE_NOTES_HTML);
        },
        /**
         *
         */
        getNotesData: function(id, caller) {
            if (caller === 'd')
                {
                  return ajaxGet(config.URL_FILE_NOTE_DATASOURCE,
                                  {order: "asc",sort: "id", searchCriteria: '[{"searchType":"eq","values":["' + id + '"],"field":"Id"}]'});
              }
              
     
        },
        /**
         *
         */
        addNote: function(id, text, caller) {
            var notesText_clean=text;
            notesText_clean=notesText_clean.replace(/"/g, "&quot;");
            notesText_clean=notesText_clean.replace(/'/g, "&apos;");
         if (caller === 'd')
                {
                  return ajaxPost(config.URL_FILE_NOTE_DATASOURCE,
                                  '[{Id:"'+id+'",text:"'+notesText_clean+'"}]');
              } else if (caller === 'c'){
                  return ajaxPost(config.URL_FILE_NOTE_CONTENT,
                                  '[{contentId:"'+id+'",text:"'+notesText_clean+'"}]');
               }
               else if (caller === 'l'){
                  return ajaxPost(config.URL_FILE_NOTE_SUPPLIER_LINE,
                                  '[{suppContentDescId:"'+id+'",text:"'+notesText_clean+'"}]');
               }
               else if (caller === 's'){
                  return ajaxPost(config.URL_FILE_NOTE_SUPPLIER,
                                  '[{supplierId:"'+id+'",text:"'+notesText_clean+'"}]');
               }
               else if (caller === 'r'){
                  return ajaxPost(config.URL_FILE_NOTE_RULE,
                                  '[{ruleId:"'+id+'",text:"'+notesText_clean+'"}]');
               }
               else{
                  return ajaxPost(config.URL_FILE_NOTE_CONTENT,
                                  '[{contentId:"'+id+'",text:"'+notesText_clean+'"}]');
               }
        }
    };
    
    return publicInterface;
};