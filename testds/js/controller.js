// Setup acme.xxx.DataSourceContent name space
acme.namespace('acme.xxx.DataSourceContent.Controller');

acme.xxx.DataSourceContent.Controller = function(config, container, roles, userName, token, appId, model, view) {
    "use strict";

    // Static variable to keep count of the data source content for use with the data grid IDs
    acme.xxx.DataSourceContent.Controller.count = ++acme.xxx.DataSourceContent.Controller.count || 0;

    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof acme.xxx.DataSourceContent.Controller)) {
        return new acme.xxx.DataSourceContent.Controller(config, container, roles, userName, token, appId, model, view);
    }

    var viewInterface,
        publicInterface,
        id,
        itemDataSourceId,
        contentId;


    // Instance ID based on current static count
    id = "DSC_" + acme.xxx.DataSourceContent.Controller.count;
    /**
     *
     */
    function massageAutosuggest(data) {
        var dataItems = data.items,
            autSuggData = [],
            itemLen,
            i;

        for (i = 0, itemLen = dataItems.length; i < itemLen; i++) {
            autSuggData.push(dataItems[i].text);
        }

        return autSuggData;
    }

    function handleGridCellEvent(event, data) {
        var promise = model.saveContentCell(data);
        contentId = data.contentid;
        promise.done(function(data2) {
            switch (data2[0].dbReturnCode) {
                case 0:
                    publicInterface.updateCell(contentId, data.rowId, data.cellName, data2[0].dbReturnCode, data2[0].dbReturnMessage);
                    break;
                case 1:
                    publicInterface.showDataSourceError(contentId, data.rowId, data.cellName, data2[0].dbReturnCode, data2[0].dbReturnMessage);
                    break;
                case 2:
                    publicInterface.showDataSourceError(contentId, data.rowId, data.cellName, data2[0].dbReturnCode, data2[0].dbReturnMessage);
                    break;
                case 3:
                    publicInterface.showDataSourceError(contentId, data.rowId, data.cellName, data2[0].dbReturnCode, data2[0].dbReturnMessage);
                    break;
                case 6:
                    publicInterface.showDataSourceError(contentId, data.rowId, data.cellName, data2[0].dbReturnCode, data2[0].dbReturnMessage);
                    break;
                default:
                    view.showUpdateErrorDialog(data2[0].dbReturnMessage);
                    publicInterface.showDataSourceError(contentId, data.rowId, data.cellName, data2[0].dbReturnCode, data2[0].dbReturnMessage);
            }
        });
        promise.fail(function(responseText) {
            view.showUpdateErrorDialog(responseText.responseText, 'Error updating Grid cell');
        });
    }

    function handleContentSubmit(event, data) {
        var promise = model.processDatasource(data);
        promise.done(function(data2) {
            if (data2[0].dbReturnCode === 0) {
                   view.clearDataFilesGridData();
                   publicInterface.showDataSourceContent(itemDataSourceId);
                localStorage.setItem('ref', '2');
                $(".ui-dialog-content").dialog("close").trigger("close");
            } else {
                view.showUpdateErrorDialog(data2[0].dbReturnMessage);
                publicInterface.showProcessError(data2[0].contentId,0,' ',data2[0].dbReturnCode,data2[0].dbReturnMessage);
            }
        });
        promise.fail(function(responseText) {
            view.showUpdateErrorDialog(responseText.responseText, 'Error submitting content');
        });
    }

    function handleDatasourceDelete(event, data) {
        var promise = model.deleteDataSource(itemDataSourceId);
        promise.done(function(data2) {
            if (data2[0].dbReturnCode === 0) {
                  view.clearDataFilesGridData();
                  publicInterface.showDataSourceContent(itemDataSourceId);
                  $(".ui-dialog-content").dialog("close").trigger("close");
                  dialog.trigger("close");
                  localStorage.setItem('ref', '2');
            } else {
                view.showUpdateErrorDialog(data2[0].dbReturnMessage);
                      publicInterface.showDataSourceError(contentId,data.rowId,data.cellName,data2[0].dbReturnCode,data2[0].dbReturnMessage);
            }
        });
        promise.fail(function(responseText) {
            view.showUpdateErrorDialog(responseText.responseText, 'Error deleteing datasource');
        });
    }

    function handleSupplierAutoComplete(event, data) {
        var promise = model.getSupplierAutoCompleteData(data.value);

        promise.done(function(results) {
            data.response(results);

        });
    }

    function handleDescriptionAutoComplete(event, data) {
        var promise = model.getDescriptionAutoCompleteData(data);
        promise.done(function(results) {
            data.response(results);

        });
    }

    function handleSupplierGridAutoComplete(event, data) {
        var promise = model.getSupplierAutoCompleteData(data.value);
           promise.done(function(data2) {
           view.setSupplierGridAutoCompleteData(data2,data.row);
          });
        promise.done(function(results) {
            data.response(results);

        });

    }

    function handleDescriptionGridAutoComplete(event, data) {
        var promise = model.getDescriptionAutoCompleteData(data);
        promise.done(function(results) {
            data.response(results);
        });
    }

    function handleInterchangeComplete(event, data) {
        var l_metadata = {};
        l_metadata.supplierId = $('.supplier-id').val(),
            l_metadata.description = $('.description-text').val(),
            l_metadata.descriptionTypeCode = 'M';
        l_metadata.receiveDate = $('.choose-date').val(),
            l_metadata.submissionType = 'F';
        l_metadata.mapperType = 'SUP';
        l_metadata.documentNum = 'N/A';
        var deferred = new jQuery.Deferred(),
            promise,
            dataSourceId = "",
            massagedData;

        promise = model.addInterchangeChild(l_metadata, itemDataSourceId);

        promise.done(function(data) {
            deferred.resolve(data);
            if (data[0].dbReturnCode === 0) {
                localStorage.setItem('ref', '2');
                reloadGrids();
                $('#Interchange').dialog("close").trigger("close");
            } else {
                view.showUpdateErrorDialog(data[0].dbReturnMessage, 'Add Interchange Child - Error');
            }
        });
        promise.fail(function(responseText) {
            view.showUpdateErrorDialog(responseText.responseText, 'Add Interchange Child - Error');
        });

        return deferred.promise();
    }

    function handleAttachComplete(event, data) {
        reloadGrids();
    }

    function parseContentData(data) {
        var l_data = [];
        var l_obj = {};
        jQuery.each(data.items, function(idx, obj) {
            l_obj = {};

            l_obj.contentid = obj.id;
            l_obj.contentStatusText = obj.contentStatusText;
            l_obj.contentTypeCode = obj.contentTypeCode;
            l_obj.contentTypeText = obj.contentTypeText;
            l_obj.submissionTypeText = obj.submissionTypeText;
            l_obj.documentNum = (obj.documentNum !== 'null') ? obj.documentNum : '';
            l_obj.description = (obj.description !== 'null') ? obj.description : '';
            l_obj.documentNum = jQuery.trim(l_obj.documentNum);
            if (l_obj.description === '') {
                l_obj.errorInd = '1';
                l_obj.errorMsg = 'Missing or invalid Description';
            } else {
                l_obj.errorInd = '0';
                l_obj.errorMsg = '';
            }
            if (l_obj.contentTypeText !== 'ACES Interchange Child') {
                if (l_obj.documentNum === '') {
                    l_obj.errorInd = '1';
                    l_obj.errorMsg = 'Missing Document Number';
                }
            }
            l_obj.documentTitle = (obj.documentTitle !== 'null') ? obj.documentTitle : 'N/A';
            if (obj.upLoadDate) {
                l_obj.upLoadDate = obj.upLoadDate;
            }
            l_obj.fileName = (obj.fileName !== 'null') ? obj.fileName : '';
            l_obj.fullPath = obj.fullPath;
            l_obj.itemDataSourceId = obj.itemDataSourceId;
            l_obj.mapperTypeCode = obj.mapperTypeCode;
            l_obj.mapperTypeText = obj.mapperTypeText;
            l_obj.modifiedDate = obj.modifiedDateString;
            l_obj.receiveDateString = obj.receiveDateString;
            l_obj.receiveDate = obj.receiveDate;
            l_obj.supplierId = obj.supplierId;
            l_obj.supplierName = jQuery.trim(obj.supplierName);
            l_obj.userAdded = obj.userAdded;
            l_obj.size = obj.size;
            if (obj.inProcess === 'False') {
                l_obj.inProcess = "No";
            } else {
                l_obj.inProcess = "Yes";
            }
            l_data.push(l_obj);
            l_obj = null;
        });
        return l_data;
    }
    /**
     *
     */
    function massageSubmissionTypes(data) {
        var metadata_sub_types = {};
        metadata_sub_types = data.items;
        var l_sub_type = '';
        var ldata = metadata_sub_types;
        for (var i = 0; i < ldata.length; i++) {
            l_sub_type += ldata[i].id + ':' + ldata[i].text + ';';
        }
        var l_len = l_sub_type.length - 1;
        l_sub_type = l_sub_type.substring(0, l_len);
        return l_sub_type;
    }
    /**
     *
     */
    function massageMapperTypes(data) {
        var mapperTypeData = {};
        var l_mapper = '';
        mapperTypeData = data.items;
        var ldata = mapperTypeData;
        for (var i = 0; i < ldata.length; i++) {
            l_mapper += ldata[i].id + ':' + ldata[i].text + ';';
        }
        var l_len = l_mapper.length - 1;
        l_mapper = l_mapper.substring(0, l_len);
        return l_mapper;
    }
    /**
     *
     */
    function massageContentTypes(data) {
        var l_cont_type = '';
        for (var i = 0; i < data.items.length; i++) {
            l_cont_type += data.items[i].id + ':' + data.items[i].text + ';';
        }
        var l_len = l_cont_type.length - 1;
        l_cont_type = l_cont_type.substring(0, l_len);
        return l_cont_type;
    }
    /**
     *
     */
    function getSubmissionTypes() {
        var deferred = new jQuery.Deferred(),
            promise,
            dataSourceId = "",
            massagedData;

        promise = model.getSubmissionTypes(dataSourceId);

        promise = promise.done(function(data) {

            massagedData = massageContentTypes(data);
            deferred.resolve(massagedData);
        });
        return deferred.promise();
    }
    /**
     *
     */
    function getMapperTypes() {
        var deferred = new jQuery.Deferred(),
            promise,
            dataSourceId = "",
            massagedData;

        promise = model.getMapperTypes(dataSourceId);

        promise = promise.done(function(data) {

            massagedData = massageContentTypes(data);
            deferred.resolve(massagedData);
        });
        return deferred.promise();
    }
    /**
     *
     */
    function getContentTypes() {
        var promise,
            massagedData,
            deferred = $.Deferred();

        promise = model.getContentTypes();

        promise = promise.done(function(data) {

            massagedData = massageContentTypes(data);
            deferred.resolve(massagedData);
        });
        return deferred.promise();
    }

    function getContent() {
        var promise,
            mapper,
            cont_type,
            sub_type,
            deferred = $.Deferred();
        getContentTypes()
            .done(function(messagedata) {
                deferred.resolve(messagedata);
                cont_type = messagedata;
            });
        return deferred.promise();

    }

    function getData(itemDataSourceId) {
        var promise,
            massagedData,
            deferred = $.Deferred();
        promise = model.getDataSourceFiles(itemDataSourceId);

        promise = promise.done(function(massagedData) {
            deferred.resolve(massagedData);
        });
        return deferred.promise();

    }
    /**
     *
     */
    function reloadGrids() {
        publicInterface.showDataSourceContent(itemDataSourceId);
    }

    /**
     *
     */
    function handleToolBarClick(event, data) {
        var promise;

        switch (data.button) {
            case config.CSS.DATA_SOURCE_PROCESS:
                view.submitForProcessing(); 

                break;
            case config.CSS.DATA_SOURCE_PROPERTIES:
                promise = model.getDefaultFilePropertiesHtml();

                promise.done(function(html) {
                    view.showDefaultFilePropertiesDialog(contentId, html);       
                });

                promise.fail(function() {
                    view.showUpdateErrorDialog('Error - getDefaultFilePropertiesHtml');
                });

                break;
            case config.CSS.DATA_SOURCE_ADD_INTERCHANGE:
                promise = model.getAddInterchangeChildHtml();
                promise.done(function(html) {
                    promise = model.getDefaultFileProperties(itemDataSourceId);
                    promise.done(function(data) {
                        view.showAddInterchangeDialog(data, html);
                    });
                });

                promise.fail(function() {
                    view.showUpdateErrorDialog('Error - getAddInterchangeChildHtml');
                });

                break;
            case config.CSS.DATA_SOURCE_NOTE:
                view.showFileNotesDialog(itemDataSourceId, 'd');

                break;
            case config.CSS.DATA_SOURCE_FILE_MAP:
                promise = model.getDataMapTypes(itemDataSourceId);
                promise.done(function(data) {
                    view.showFileMapDialog(data.items);
                });

                promise.fail(function() {
                    view.showUpdateErrorDialog('Error - getDataMapTypes');
                });
                break;
            case config.CSS.DATA_SOURCE_ATTACH:
                view.showAttachDataSourceDialog(itemDataSourceId, 'A');

                break;
            case config.CSS.DATA_SOURCE_DELETE:
                view.showDeleteDataSourceDialog(itemDataSourceId);
                break;
            case config.CSS.DATA_SOURCE_DELETE_FILES:
                var viewPromise = view.showDeleteFilesConfirmationDialog();
                viewPromise.done(function() {
                    promise = model.deleteFiles(view.getSelectedContentIds());

                    promise.done(function(data) {
                        if (data[0].dbReturnCode > 0) {
                            view.showUpdateErrorDialog('Error - ' + data[0].dbReturnMessage, 'Delete Error');
                        }
                        localStorage.setItem('ref', '2');
                        view.clearGrids();
                        reloadGrids();
                    });

                    promise.fail(function() {
                        view.showUpdateErrorDialog('Error - deleteFiles');
                    });
                });

                break;

                // Default do nothing
        }
    }

    function refreshData(event) {
        reloadGrids();
    }
    /**
     *
     */
    function handleCellClick(event, data) {
        switch (data.cellName) {
            case config.CFG.PROPERTY_CELL:
                view.showFilePropertiesDialog(data.contentId, data.dataSourceId);

                break;
            case config.CFG.NOTE_CELL:
                view.showFileNotesDialog(data.contentId, 'c');

                break;
                // Default do nothing
        }
    }

    // Public Interface - any methods defined here should be well documented
    publicInterface = {
        /*
         *
         */
        init: function() {
            var promise;
            model.init(config, token, appId, userName);
            view.init(container, config, id, roles, token, appId);

            promise = model.getDataSourceContentHtml();

            promise.done(function(data) {

                view.setDataSourceContentHtml(data);

            });

            // Event handlers
            /*
                   $(view).on(config.CFG.FILE_PROPERTY_CHANGE_EVENT, function(event, data) {
                      switch(data.field) {
                      case config.CFG.SUPPLIER_FIELD:
                          handleSupplierChange(data.value);
                          break;
                      case config.CFG.RECEIVED_DATE_FIELD:
                          handleDateChange(data.value);
                          break;
                      case config.CFG.DESCRIPTION_FIELD:
                          handleDescriptionChange(data.value);
                          break;
                        }
                  });
             */
            $(view).on(config.CFG.SUBMIT_CONTENT, handleContentSubmit);
            $(view).on(config.CFG.GRID_CELL_EDIT_EVENT, handleGridCellEvent);
            $(view).on(config.CFG.SUPPLIER_AUTOCOMPLETE_EVENT, handleSupplierAutoComplete);
            $(view).on(config.CFG.DESCRIPTION_AUTOCOMPLETE_EVENT, handleDescriptionAutoComplete);
            $(view).on(config.CFG.SUPPLIER_GRID_AUTOCOMPLETE_EVENT, handleSupplierGridAutoComplete);
            $(view).on(config.CFG.DESCRIPTION_GRID_AUTOCOMPLETE_EVENT, handleDescriptionGridAutoComplete);
            $(view).on(config.CFG.DATA_SOURCE_DELETE, handleDatasourceDelete);
            $(view).on(config.CFG.INTERCHANGE_EVENT, handleInterchangeComplete);
            $(view).on(config.CFG.ATTACH_FILES_COMPLETE_EVENT, handleAttachComplete);
            $(view).on(config.CFG.TOOL_BAR_CLICK_EVENT, handleToolBarClick);
            $(view).on(config.CFG.GRID_CELL_CLICK_EVENT, handleCellClick);
            $(view).on(config.CFG.REFRESH_EVENT, refreshData);
        },
        /**
         *
         */
        showDataSourceContent: function(pItemDataSourceId) {
            alert('d')
            var promise,
                mapper,
                cont_type,
                ldata,
                sub_type,
                deferred = $.Deferred();
            itemDataSourceId = pItemDataSourceId;
            //     getSubmissionTypes()
            //     .done(function(messagedata){
            //         sub_type=messagedata;
            //         view.setSubType(sub_type);
            //           getMapperTypes()
            //             .done(function(messagedata1){
            //             mapper=messagedata1;
            //              view.setMapperType(mapper);
            //               getContentTypes()
            //                 .done(function(messagedata2){
            //                 cont_type=messagedata2;
            //                 view.setContType(cont_type);
            getData(itemDataSourceId)
                //        .done(function(messagedata3){ 
                //         ldata=messagedata3;
            view.loadFileGrids(parseContentData(ldata))
                .done(function() {
                    deferred.resolve();
                });

            //    });
            return deferred.promise();
            //   alert('cont_type222222='+cont_type)
            //   view.loadFileGrids(parseContentData(ldata),sub_type,mapper,cont_type);
            //    return deferred.resolve();


            //       return deferred.promise();
            //   getContentTypes()
            //    .done(function(messagedata){
            //       cont_type=messagedata;
            //         alert('cont_type='+cont_type)
            //    });
            /*
              alert('cont_type='+cont_type)
               itemDataSourceId = pItemDataSourceId; // Save this since it's used again
                promise = model.getDataSourceFiles(itemDataSourceId);
                
                promise = promise.then(function(data) {
                    return view.loadFileGrids(parseContentData(data),sub_type,mapper,cont_type);
                });
                
                promise.done(function() {
                    deferred.resolve();
                });
                    
                return deferred.promise();
                */
        },
        showDataSourceError: function(contentId, rowId, cellName, errorInd, errorMsg) {
            var promise,
                deferred = $.Deferred();

            promise = model.getDataSourceCell(contentId);

            promise = promise.then(function(data) {

                return view.loadGridCell(parseContentData(data), rowId, cellName, errorInd, errorMsg);
            });
            promise.done(function() {
                deferred.resolve();
            });

            return deferred.promise();
        },
        updateCell: function(contentId, rowId, cellName, errorInd, errorMsg) {
            var promise,
                deferred = $.Deferred();
            promise = model.getDataSourceCell(contentId);
            promise = promise.then(function(data) {
                return view.loadGridCell(parseContentData(data), rowId, cellName, errorInd, errorMsg);
            });
            promise.done(function() {
                deferred.resolve();
            });

            return deferred.promise();
        },
        /*
         *
         */
        cleanUp: function() {
            view.cleanUp();
            model.cleanUp();

            viewInterface = null;
            publicInterface = null;
        }
    };

    // View's interface to the controller
    viewInterface = {

        /**
         *
         */
        getAutoSuggestList: function(cellName) {
            var deffer = new jQuery.Deferred(),
                dataSourceId = "",
                massagedData,
                modelPromise;

            switch (cellName) {
                case config.CFG.DESCRIPTION_CELL:
                    modelPromise = model.getDescriptionAutoSuggest(dataSourceId, "", "");

                    break;
                case config.CFG.SUPPLIER_NAME_CELL:
                    modelPromise = model.getSupplierAutoSuggest(dataSourceId, "", "");

                    break;

                    // Default do nothing
            }

            modelPromise.done(function(data) {
                massagedData = massageAutosuggest(data);
                deffer.resolve(massagedData);
            });
            return deffer.promise();
        },
        /**
         *
         */
        saveCellEdit: function(cellName) {
            //
            switch (cellName) {
                case config.CFG.DESCRIPTION_CELL:
                    model.setDescription();
                    break;
                case config.CFG.DOCUMENT_NUMBER_CELL:
                    model.setDocumentNumber();
                    break;
                case config.CFG.RECEIVE_DATE_CELL:
                    model.setRecievedDate();
                    break;
                case config.CFG.SUBMISSION_TYPE_CELL:
                    model.setSubmissionType();
                    break;
                case config.CFG.SUPPLIER_NAME_CELL:
                    model.setSupplierName();
                    break;
                    // Default do nothing
            }
        }

    };

    return publicInterface;
};