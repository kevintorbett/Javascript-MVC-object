// Setup EPICOR.IMR.ContentUploadUtility name space
EPICOR.namespace('EPICOR.IMR.ContentUploadUtility.Model');

EPICOR.IMR.ContentUploadUtility.Model = function() {
    "use strict";
    
    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof EPICOR.IMR.ContentUploadUtility.Model)) {
        return new EPICOR.IMR.ContentUploadUtility.Model();
    }
    
    var base_url = location.protocol + '//' + location.host,
        publicInterface,
        config,
        token,
        appId;
    
    function ajaxGet(url, data) {
        return $.ajax({
            url: base_url + url,
            type: "GET",
            cache: false,
            beforeSend: function(request) {
                request.setRequestHeader(config.CFG.AUTHORIZATION_FIELD, token);
                request.setRequestHeader(config.CFG.AUTHORIZATION_APPLICATION_FIELD, appId);
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
    function setTwoDigits(p_val) {
      if ( p_val.toString().length < 2 ) {
        return '0'+p_val.toString();
      }
      return p_val;
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
        /**
         *
         */
        cleanUp: function() {
            base_url = null;
            publicInterface = null;
        },
        /**
         *
         */
        getContentUploadUtilityHtml: function() {
            return $.get(base_url + config.URL.CONTENT_UPLOAD_UTILITY_HTML);
        },
        /**
         *
         */
        getFileUploadServiceData: function(dataSourceId) {
            var deferred = new jQuery.Deferred(),
                promise,
                uploadData;
            
            promise = ajaxGet(config.URL.DATA_SOURCE_ITEM_SERVICE, {searchCriteria: '[{"searchType":"eq","values":["' + dataSourceId + '"],"field":"id"}]'});
            
            promise.done(function(data) {
            
                
                uploadData = [
                    
                   
                   {
                        name: config.CFG.AUTHORIZATION_FIELD,
                        value: token
                    },
                    {
                        name: config.CFG.AUTHORIZATION_APPLICATION_FIELD,
                        value: appId
                    },
                    {
                        name: config.CFG.ITEM_DATA_SOURCE_ID_FIELD,
                        value: dataSourceId
                    },
                    {
                        name: config.CFG.SUPPLIER_FIELD,
                        value: data.items[0].supplierName
                    },
                    {
                        name: config.CFG.SUPPLIER_ID_FIELD,
                        value: data.items[0].supplierId
                    },
                    {
                        name: config.CFG.DOCUMENT_NUMBER_FIELD,
               //         value: data.items[0].documentNum
                          value: ''
                    },
                    {
                        name: config.CFG.DESCRIPTION_FIELD,
                        value: data.items[0].description
                    },
                    {
                        name: config.CFG.DESCRIPTION_TYPE_CODE_FIELD,
                        value: data.items[0].descriptionTypeCode
                    },
                    {
                        name: config.CFG.RECEIVED_DATE_FIELD,
                        value: data.items[0].receiveDateString
                    },
                    {
                        name: config.CFG.SUBMISSION_TYPE_FIELD,
                        value: data.items[0].submissionTypeCode
                    },
                    {
                        name: config.CFG.MAPPER_TYPE_FIELD,
                        value: data.items[0].mapperTypeCode
                    }
                  
                ];
                    
         //   console.log(uploadData)
                deferred.resolve(uploadData);
            })
            .fail(function(responseText) {
                deferred.reject(responseText);
            });
            
            return deferred.promise();
        },
        getFileUploadDataSourceId: function(data) {
            var deferred = new jQuery.Deferred(),
                promise,
                uploadData;
            var supplierText_clean = data.supplierText;
            supplierText_clean=supplierText_clean.replace(/"/g, "&quot;");
            supplierText_clean=supplierText_clean.replace(/'/g, "&apos;");
     //       supplierText_clean = encodeURIComponent(supplierText_clean);
            var docText_clean = data.documentNumberText;
            docText_clean=docText_clean.toUpperCase(); 
            docText_clean=docText_clean.replace(/"/g, "&quot;");
            docText_clean=docText_clean.replace(/'/g, "&apos;");
           promise = ajaxPost(config.URL.FILE_DATASOURCE_SERVICE,  '[{fileDesc:"Test",supplierText:"'+supplierText_clean+'",descTypeId:"'+data.descTypeId+'",submissionTypeCd:"'+data.submissionTypeCd +'",mapperTypeCd:"'+data.mapperTypeCd+'",receiveDate:"'+data.receivedDateText+'",docNum:"'+docText_clean+'"}]');
            
            promise.done(function(data) {
            
                      
                        var l_date = new Date();
                        var l_mn = l_date.getMonth() + 1;
                        var l_dy = l_date.getDate();
                        var l_yr = l_date.getFullYear();
                        
                        
                        l_date= setTwoDigits(l_mn) + '/' + setTwoDigits(l_dy) + '/' + l_yr ; 
                        uploadData=[
                                      
                                      {
                        name: config.CFG.AUTHORIZATION_FIELD,
                        value: token
                    },
                    {
                        name: config.CFG.AUTHORIZATION_APPLICATION_FIELD,
                        value: appId
                    },
                    {
                        name: config.CFG.ITEM_DATA_SOURCE_ID_FIELD,
                        value: data[0].dataSrcId
                    },
                    {
                        name: config.CFG.DOCUMENT_NUMBER_FIELD,
                         value: ''
                    },
                    {
                         name: config.CFG.SUPPLIER_ID_FIELD,
                        value: 0
                    },
                    {
                        name: config.CFG.RECEIVED_DATE_FIELD,
                        value: l_date
                    },
                    {
                        name: config.CFG.SUBMISSION_TYPE_FIELD,
                        value: 'F'
                    },
                    {
                        name: config.CFG.MAPPER_TYPE_FIELD,
                        value: 'SUP'
                    },
                    {
                        name: config.CFG.DESCRIPTION_TYPE_CODE_FIELD,
                        value: 'D'
                    }
                    ];
            
       //         deferred.resolve(uploadData);
        deferred.resolve(data);
            })
            .fail(function(responseText) {
                deferred.reject(responseText);
            });
            
            return deferred.promise();
        },
        updateDataSourceId: function(data1,data) {
            var deferred = new jQuery.Deferred(),
                promise,
                uploadData;
            
            promise = ajaxPost(config.URL.DATA_SOURCE_ITEM_SERVICE,  "[{id:'"+data1+"',supplierId:'"+data.supplierId +"',descriptionTypeCode:'"+data.descTypeId+"',submissionTypeCode:'"+data.submissionTypeCd +"',mapperTypeCode:'"+data.mapperTypeCd+"',receiveDate:'"+data.receivedDateText+"',documentNum:'"+data.documentNumberText+"'}]");
            
            promise.done(function(data) {
            
                      
                        var l_date = new Date();
                        var l_mn = l_date.getMonth() + 1;
                        var l_dy = l_date.getDate();
                        var l_yr = l_date.getFullYear();
                        
                        
                        l_date= setTwoDigits(l_mn) + '/' + setTwoDigits(l_dy) + '/' + l_yr ; 
                        uploadData=[
                                      
                                      {
                        name: config.CFG.AUTHORIZATION_FIELD,
                        value: token
                    },
                    {
                        name: config.CFG.AUTHORIZATION_APPLICATION_FIELD,
                        value: appId
                    },
                    {
                        name: config.CFG.ITEM_DATA_SOURCE_ID_FIELD,
                        value: data[0].dataSrcId
                    },
                    {
                        name: config.CFG.DOCUMENT_NUMBER_FIELD,
                         value: ''
                    },
                    {
                         name: config.CFG.SUPPLIER_ID_FIELD,
                        value: 0
                    },
                    {
                        name: config.CFG.RECEIVED_DATE_FIELD,
                        value: l_date
                    },
                    {
                        name: config.CFG.SUBMISSION_TYPE_FIELD,
                        value: 'F'
                    },
                    {
                        name: config.CFG.MAPPER_TYPE_FIELD,
                        value: 'SUP'
                    },
                    {
                        name: config.CFG.DESCRIPTION_TYPE_CODE_FIELD,
                        value: 'D'
                    }
                    ];
            
        deferred.resolve(data);
            })
            .fail(function(responseText) {
                deferred.reject(responseText);
            });
            
            return deferred.promise();
        },
        /**
         *
         */
        getSubmissionTypes: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_SUBMISSION_TYPES_DATA,
                           {order: "asc"});
        },
        /**
         *
         */
        getMapperTypes: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_MAPPER_TYPES_DATA,
                           {order: "asc"});
        },
        /**
         *
         */
        getSupplierAutoCompleteData: function(supplierText) {
            var deferred = new jQuery.Deferred(),
                promise;
           
            var supplierText_clean = supplierText;
            supplierText_clean.replace(/"/g, "&quot;");
            supplierText_clean.replace(/'/g, "&apos;");
            promise = ajaxGet(config.URL.SUPPLIER_AUTOCOMPLETE+supplierText+'');
                       //                          {searchCriteria: '[{"searchType":"ilike","values":["' + supplierText + '%"],"field":"supplierTxt"}]'});
                                            //       { supplierText};
                                            //       '{supplierText+'}');
            
            
            promise.done(function(data) {
                var autoSuggestData,
                    i;
                    
                autoSuggestData = [];
                
                for (i = 0; i < data.length; i++) {
                    autoSuggestData.push({
                        text: data[i].text,
                        id: data[i].id
                    });
                }
                
                deferred.resolve(autoSuggestData);
            })
            .fail(function(responseText) {
                deferred.reject(responseText);
            });
                              
            return deferred.promise();
        }
    };
    
    return publicInterface;
};