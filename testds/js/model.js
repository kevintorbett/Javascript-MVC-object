// Setup acme.xxx.DataSourceContent name space
acme.namespace('acme.xxx.DataSourceContent.Model');

acme.xxx.DataSourceContent.Model = function(config, token, appId) {
    "use strict";

    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof acme.xxx.DataSourceContent.Model)) {
        return new acme.xxx.DataSourceContent.Model();
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
        init: function(pConfig, pToken, pAppId, pUserName) {
            config = pConfig;
            token = pToken;
            appId = pAppId;
            userName = pUserName;
        },
        /**
         *
         */
        cleanUp: function() {
            base_url = null;
            publicInterface = null;
            config = null;
            token = null;
            appId = null;
        },
        /**
         *
         */
        getDataSourceContentHtml: function() {
            return $.get(base_url + config.URL.DATA_SOURCE_CONTENT_HTML);
        },
        /**
         *
         */
        getDefaultFilePropertiesHtml: function() {
            return $.get(base_url + config.URL.DEFAULT_FILE_PROPERTIES_HTML);
        },
        /**
         *
         */
        getAddInterchangeChildHtml: function() {
            return $.get(base_url + config.URL.ADD_INTERCHANGE_CHILD_HTML);
        },
        /**
         *
         */
        getDataSourceFiles: function(dataSourceId) {
            var input = {
                "items": [{
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "null",
                    "documentNum": "null",
                    "documentTitle": "Brembo BBHN Catalog",
                    "fileName": "ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "fullPath": "5177.ARC.zip/ACES_XML_v2_20120926114541_BremboRotors.zip/ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "id": 4693,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-26T18:48:42Z",
                    "modifiedDateString": "09/26/2012 11:48:42",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 10627095,
                    "submissionTypeCode": "T",
                    "submissionTypeText": "Test",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:52:33Z",
                    "userAdded": "rickey.okimura"
                }, {
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "null",
                    "documentNum": "null",
                    "documentTitle": "Brembo BBHN Catalog",
                    "fileName": "ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "fullPath": "5177.ARC.zip/ACES_XML_v2_20120926114541_BremboRotors.zip/ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "id": 4693,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-26T18:48:42Z",
                    "modifiedDateString": "09/26/2012 11:48:42",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 10627095,
                    "submissionTypeCode": "T",
                    "submissionTypeText": "Test",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:52:33Z",
                    "userAdded": "rickey.okimura"
                }, {
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "null",
                    "documentNum": "null",
                    "documentTitle": "Brembo BBHN Catalog",
                    "fileName": "ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "fullPath": "5177.ARC.zip/ACES_XML_v2_20120926114541_BremboRotors.zip/ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "id": 4693,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-26T18:48:42Z",
                    "modifiedDateString": "09/26/2012 11:48:42",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 10627095,
                    "submissionTypeCode": "T",
                    "submissionTypeText": "Test",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:52:33Z",
                    "userAdded": "rickey.okimura"
                }, {
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "null",
                    "documentNum": "null",
                    "documentTitle": "Brembo BBHN Catalog",
                    "fileName": "ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "fullPath": "5177.ARC.zip/ACES_XML_v2_20120926114541_BremboRotors.zip/ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "id": 4693,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-26T18:48:42Z",
                    "modifiedDateString": "09/26/2012 11:48:42",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 10627095,
                    "submissionTypeCode": "T",
                    "submissionTypeText": "Test",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:52:33Z",
                    "userAdded": "rickey.okimura"
                }, {
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "null",
                    "documentNum": "null",
                    "documentTitle": "Brembo BBHN Catalog",
                    "fileName": "ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "fullPath": "5177.ARC.zip/ACES_XML_v2_20120926114541_BremboRotors.zip/ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "id": 4693,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-26T18:48:42Z",
                    "modifiedDateString": "09/26/2012 11:48:42",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 10627095,
                    "submissionTypeCode": "T",
                    "submissionTypeText": "Test",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:52:33Z",
                    "userAdded": "rickey.okimura"
                }, {
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "null",
                    "documentNum": "null",
                    "documentTitle": "Brembo BBHN Catalog",
                    "fileName": "ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "fullPath": "5177.ARC.zip/ACES_XML_v2_20120926114541_BremboRotors.zip/ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "id": 4693,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-26T18:48:42Z",
                    "modifiedDateString": "09/26/2012 11:48:42",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 10627095,
                    "submissionTypeCode": "T",
                    "submissionTypeText": "Test",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:52:33Z",
                    "userAdded": "rickey.okimura"
                }, {
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "null",
                    "documentNum": "null",
                    "documentTitle": "Brembo BBHN Catalog",
                    "fileName": "ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "fullPath": "5177.ARC.zip/ACES_XML_v2_20120926114541_BremboRotors.zip/ACES_XML_v2_20120926114541_BremboRotors.xml",
                    "id": 4693,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-26T18:48:42Z",
                    "modifiedDateString": "09/26/2012 11:48:42",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 10627095,
                    "submissionTypeCode": "T",
                    "submissionTypeText": "Test",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:52:33Z",
                    "userAdded": "rickey.okimura"
                }, {
                    "contentStatusId": 0,
                    "contentStatusText": "Active",
                    "contentTypeCode": "AXL",
                    "contentTypeText": "ACES XML File",
                    "description": "Test 46",
                    "documentNum": "null",
                    "documentTitle": "Davico Manufacturing CCML Catalog",
                    "fileName": "ACES_XML_v2_for_acme_20120914082637_CatConverters.xml",
                    "fullPath": "2568.ARC.zip/ACES_XML_v2_for_acme_20120914082637_CatConverters.zip/ACES_XML_v2_for_acme_20120914082637_CatConverters.xml",
                    "id": 4666,
                    "inProcess": "False",
                    "itemDataSourceId": 2259961,
                    "mapperTypeCode": "SUP",
                    "mapperTypeText": "Supplier",
                    "modifiedDate": "2012-09-14T15:27:48Z",
                    "modifiedDateString": "09/14/2012 08:27:48",
                    "receiveDate": "2013-07-11T07:00:00Z",
                    "receiveDateString": "07/11/2013",
                    "size": 6014421,
                    "submissionTypeCode": "F",
                    "submissionTypeText": "Full",
                    "supplierId": 600,
                    "supplierName": "Sears/Belts & Cooling",
                    "upLoadDate": "2013-08-27T17:05:29Z",
                    "userAdded": "rickey.okimura"
                }],
                "totalCount": 2
            };

            ajaxGet(config.URL.DATA_SOURCE_CONTENT_FILES, {
                order: "asc",
                searchCriteria: '[{"searchType":"eq","values":["' + dataSourceId + '"],"field":"itemDataSourceId"}]'
            });
            return input;
        },
        /**
         *
         */
        getDataMapTypes: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_CONTENT_FILES, {
                order: "asc",
                searchCriteria: '[{"searchType":"eq","values":["' + dataSourceId + '"],"field":"itemDataSourceId"}]'
            });
        },
        /**
         *
         */
        getDataSourceCell: function(contentId) {
            return ajaxGet(config.URL.DATA_SOURCE_CONTENT_FILES, {
                order: "asc",
                searchCriteria: '[{"searchType":"eq","values":["' + contentId + '"],"field":"id"}]'
            });
        },
        /**
         *
         */
        getSupplierAutoCompleteData: function(supplierText) {
            var deferred = new jQuery.Deferred(),
                promise;
            var l_supplier = encodeURIComponent(supplierText);
            promise = ajaxGet(config.URL.SUPPLIER_AUTOCOMPLETE + l_supplier + '');


            promise.done(function(data) {
                    var autoSuggestData,
                        i;

                    autoSuggestData = [];

                    for (i = 0; i < data.length; i++) {
                        autoSuggestData.push({
                            label: data[i].text,
                            value: data[i].text,
                            id: data[i].id
                        });
                    }
                    deferred.resolve(autoSuggestData);
                })
                .fail(function(responseText) {
                    deferred.reject(responseText);
                });

            return deferred.promise();
        },
        /**
         *
         */
        getDescriptionAutoCompleteData: function(data) {
            var deferred = new jQuery.Deferred(),
                promise;
            var l_data = encodeURIComponent(data.value2);
            var l_supplier = encodeURIComponent(data.value);
            promise = ajaxGet(config.URL.DESCRIPTION_AUTOCOMPLETE + '?context=' + l_data + '&max=10&supplier=' + l_supplier + '');
            promise.done(function(data) {
                    var autoSuggestData = [],
                        i;
                    var l_obj = null;

                    jQuery.each(data, function(p_idx, p_obj) {
                        l_obj = p_obj;
                        l_obj.label = p_obj.text;
                        l_obj.value = p_obj.text;
                        l_obj.id = p_obj.id;
                        autoSuggestData.push(l_obj);
                        l_obj = null;
                    });
                    deferred.resolve(autoSuggestData);
                })
                .fail(function(responseText) {
                    deferred.reject(responseText);
                });

            return deferred.promise();
        },
     
        getDefaultFileProperties: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_CONTENT_FILES, {
                order: "asc",
                searchCriteria: '[{"searchType":"eq","values":["' + dataSourceId + '"],"field":"itemDataSourceId"}]'
            });
        },
        /**
         *
         */
        getDescriptionAutoSuggest: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_AUTOSUGGEST_DATA, {
                order: "asc",
                searchCriteria: '[{"searchType":"eq","values":["' + dataSourceId + '"],"field":"itemDataSourceId"}]'
            });
        },
        /**
         *
         */
        getSupplierAutoSuggest: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_AUTOSUGGEST_DATA, {
                order: "asc",
                searchCriteria: '[{"searchType":"eq","values":["' + dataSourceId + '"],"field":"itemDataSourceId"}]'
            });
        },
        /**
         *
         */
        getDocumentNumberAutoSuggest: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_AUTOSUGGEST_DATA, {
                order: "asc",
                searchCriteria: '[{"searchType":"eq","values":["' + dataSourceId + '"],"field":"itemDataSourceId"}]'
            });
        },
        /**
         *
         */
         getSubmissionTypes: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_SUBMISSION_TYPES_DATA, {
                order: "asc"
            });
        },
        /**
         *
         */
        getMapperTypes: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_MAPPER_TYPES_DATA, {
                order: "asc"
            });
        },
        /**
         *
         */
        getContentTypes: function(dataSourceId) {
            return ajaxGet(config.URL.DATA_SOURCE_CONTENT_TYPES_DATA, {
                order: "asc"
            });
        },
        /**
         *
         */
        saveContentCell: function(data) {
            var supplierText_clean = data.supplierName;
            supplierText_clean = supplierText_clean.replace(/"/g, "&quot;");
            supplierText_clean = supplierText_clean.replace(/'/g, "&apos;");
            var docText_clean = data.documentNum;
            docText_clean = docText_clean.replace(/"/g, "&quot;");
            docText_clean = docText_clean.replace(/'/g, "&apos;");
            var descText_clean = data.description;
            descText_clean = descText_clean.replace(/"/g, "&quot;");
            descText_clean = descText_clean.replace(/'/g, "&apos;");
            docText_clean = docText_clean.toUpperCase();
            var l_col = data.cellName;
            var l_data = '';
            if (data.cellName === "mapperTypeText") {
                l_col = "mapperTypeCode";
            } else if (data.cellName === "receiveDateString") {
                l_col = "receiveDate";
            } else if (data.cellName === "supplierName") {
                l_col = "supplierId";
            } else if (data.cellName === "submissionTypeText") {
                l_col = "submissionTypeCode";
            } else if (data.cellName === "contentTypeText") {
                l_col = "contentTypeCode";
            }
            l_data = '{id="' + data.contentid + '",' + l_col + '="' + data.cellValue + '"}';
            if (l_col === "supplierName" || l_col === "supplierId") {
                l_col = "supplierTxt";
            }

            if (l_col === "documentNum" || l_col === "supplierTxt" || l_col === "description") {
                l_data = '{id="' + data.contentid + '",description="' + descText_clean + '",supplierTxt="' + supplierText_clean + '",documentNum="' + docText_clean + '"}';
                return ajaxPut(config.URL.DATA_SOURCE_CONTENT_MAIN,
                    '[' + l_data + ']');
            } else {
                l_data = '{id="' + data.contentid + '",' + l_col + '="' + data.cellValue + '"}';
                return ajaxPut(config.URL.DATA_SOURCE_CONTENT_FILES,
                    '[' + l_data + ']');
            }
        },
        /**
         *
         */
        processDatasource: function(data) {
            return ajaxPost(config.URL.DATA_SOURCE_PROCESS,
                '{contentIds:' + data.value + ',email:' + userName + '}');

        },
         /**
         *
         */
        deleteDataSource: function(itemDataSourceId) {
            return ajaxPut(config.URL.DATA_SOURCE_DELETE,
                '[{id:' + itemDataSourceId + '}]');
        },
        /**
         *
         */
        deleteFiles: function(ids) {
            return ajaxPost(config.URL.DELETE_CONTENT_FILES,
                '[{username:' + userName + ',contentIds:[' + ids + ']}]');

        },
        /**
         *
         */
        addInterchangeChild: function(data, id) {
            var l_data = 'id:' + id;
            jQuery.each(data, function(l_id, l_obj) {
                if (l_data !== '[{') {
                    l_data += ',';
                }
                l_data += l_id + ":'" + l_obj + "'";
            });
         return ajaxPost(config.URL.DATA_SOURCE_INTERCHANGE_CHILD,
                '[{' + l_data + '}]');

        }
    };

    return publicInterface;
};