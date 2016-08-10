// Setup EPICOR.IMR..imr.ContentUploadUtility name space
EPICOR.namespace('EPICOR.IMR.imr.ContentUploadUtility.Controller');

EPICOR.IMR.ContentUploadUtility.Controller = function(config, container, token, appId, model, view) {
    "use strict";

    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof EPICOR.IMR.ContentUploadUtility.Controller)) {
        return new EPICOR.IMR.ContentUploadUtility.Controller(config, container, token, appId, model, view);
    }
    var itemDataSourceId,
        row_files = 0,
        rows_loaded = 0,
        rows_total = 0,
        rows_not_loaded = 0,
        type,
        publicInterface;

    function handleSupplierChange(supplierName, supplierId) {
        var i,
            uploadData = view.getUploadData();

        for (i = 0; i < uploadData.length; i++) {

            if (uploadData[i].name === config.CFG.SUPPLIER_FIELD) {
                uploadData[i].value = supplierName;
            }

            if (uploadData[i].name === config.CFG.SUPPLIER_ID_FIELD) {
                uploadData[i].value = supplierId;

            }

        }
        //       config.CFG.SUPPLIER_FIELD.val(supplierName);
        view.setUploadData(uploadData);
    }

    function handleDateChange(date) {
        var i,
            uploadData = view.getUploadData();

        for (i = 0; i < uploadData.length; i++) {

            if (uploadData[i].name === config.CFG.RECEIVED_DATE_FIELD) {
                uploadData[i].value = date;
            }
        }

        view.setUploadData(uploadData);
    }

    function handleDocumentNumberChange(documentNumber) {
        var i,
            uploadData = view.getUploadData();

        for (i = 0; i < uploadData.length; i++) {

            if (uploadData[i].name === config.CFG.DOCUMENT_NUMBER_FIELD) {
                uploadData[i].value = documentNumber;
            }
        }

        view.setUploadData(uploadData);
    }

    function handleSubmissionTypeChange(type) {
            var i,
                uploadData = view.getUploadData();

            for (i = 0; i < uploadData.length; i++) {

                if (uploadData[i].name === config.CFG.SUBMISSION_TYPE_FIELD) {
                    uploadData[i].value = type;
                }
            }

            view.setUploadData(uploadData);
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

    function handleUploadProgress(event, data) {
        var rows,
            barWidth,
            prnWidth,
            percent;

        rows = container.find('.bar');

        $.each(rows, function(index, row) {

            if ((!$(row).parent().hasClass(config.CSS.UPLOAD_ERROR)) && (!$(row).parent().hasClass(config.CSS.UPLOAD_SUCCESS))) {
                barWidth = isNaN($(row).width()) ? 0 : $(row).width();
                prnWidth = isNaN($(row).parent().width()) ? 0 : $(row).parent().width();
                percent = parseInt(barWidth / prnWidth * 100, 10);
                percent = isNaN(percent) ? 0 : percent;

                $(row).parent().parent().find('.percent').text(' - ' + percent + '%');
            }
        });
    }

    function handleUploadDone(event, data) {
        var rows,
            name;

        rows = container.find('.' + config.CSS.UPLOAD_TEMPLATE);
        $.each(rows, function(index, row) {
            name = $(row).find('.' + config.CSS.FILE_NAME_DIV).text();

            if (name === data.files[0].name) {

                if ((!$(row).hasClass(config.CSS.UPLOAD_ERROR)) && (!$(row).hasClass(config.CSS.UPLOAD_SUCCESS))) {

                    $(row).addClass(config.CSS.UPLOAD_SUCCESS);
                    $(row).find('.' + config.CSS.PROGRESS_DIV).addClass(config.CSS.UPLOAD_SUCCESS);
                    $(row).find('.' + config.CSS.PROGRESS_BAR).width(0);
                    $(row).find('.' + config.CSS.CANCEL_UPLOAD).attr('title', '');
                    $(row).find('.' + config.CSS.CANCEL_UPLOAD).css('cursor', 'default');
                    $(row).find('img').attr('src', config.URL.SUCCESS_ICON);
                    $(row).find('.' + config.CSS.PERCENTAGE_COMPLETE).text(data.textStatus.toUpperCase());
                    if ($(row).hasClass(config.CSS.UPLOAD_SUCCESS)) {

                        rows_loaded = rows_loaded + 1;
                        //     alert('rows_loaded='+rows_loaded+'row_files='+row_files)
                        if (rows_loaded === row_files) {
                            $('#uploadutil').trigger("close");
                            $('#uploadutil').dialog("close");
                        }
                    }
                    if ($(row).hasClass(config.CSS.UPLOAD_ERROR)) {
                        rows_not_loaded = rows_not_loaded + 1;
                    }
                    rows_total = rows_total + 1;
                    if (rows_total === row_files && rows_not_loaded > 0) {
                        view.showErrorDialog('Files not loaded - ' + rows_not_loaded, 'Upload - Error');
                    }
                }
            }
        });
    }

    function handleUploadSubmit(event, data) {
        var rows,
            name;

    }

    function handleUploadFail(event, data) {
        var rows,
            name,
            errorText;
     //   if (data.response().jqXHR.responseText === undefined) {
            errorText = data.textStatus.toUpperCase();
     //   } else {
     //       errorText = data.response().jqXHR.responseText.split('<')[0]; // TWG ignore HTML portion of message
     //   }

        rows = container.find('.' + config.CSS.UPLOAD_TEMPLATE);
        //    var row_files=rows.length;
        // alert('row_files='+row_files)
        $.each(rows, function(index, row) {
            name = $(row).find('.' + config.CSS.FILE_NAME_DIV).text();

            if (name === data.files[0].name) {

                if ((!$(row).hasClass(config.CSS.UPLOAD_ERROR)) && (!$(row).hasClass(config.CSS.UPLOAD_SUCCESS))) {

                    $(row).addClass(config.CSS.UPLOAD_ERROR);
                    $(row).find('.' + config.CSS.PROGRESS_DIV).addClass(config.CSS.UPLOAD_ERROR);
                    $(row).find('.' + config.CSS.PROGRESS_BAR).width(0);
                    $(row).find('.' + config.CSS.CANCEL_UPLOAD).attr('title', '');
                    $(row).find('.' + config.CSS.CANCEL_UPLOAD).css('cursor', 'default');
                    $(row).find('img').attr('src', config.URL.ERROR_ICON);
                    $(row).find('.' + config.CSS.PERCENTAGE_COMPLETE).text(errorText);
                }
            }
        });
    }

    function handleSupplierAutoComplete(event, data) {
        var promise = model.getSupplierAutoCompleteData(data.value);

        promise.done(function(results) {
            data.response($.map(results, function(item, index) {
                return {
                    label: item.text,
                    value: item.text,
                    value2: item.id
                };
            }));
        });
        
    }

    function handleFilePropertyChange(event, data) {
        switch (data.field) {
            case config.CFG.SUPPLIER_FIELD:
                handleSupplierChange(data.value, data.id);
                break;
            case config.CFG.RECEIVED_DATE_FIELD:
                handleDateChange(data.value);
                break;
            case config.CFG.DOCUMENT_NUMBER_FIELD:
                handleDocumentNumberChange(data.value);
                break;
            case config.CFG.SUBMISSION_TYPE_FIELD:
                handleSubmissionTypeChange(data.value);
                break;
        }
    }

    // Public Interface - any methods defined here should be well documented
    publicInterface = {
        /**
         *
         */
        init: function() {
            view.init(container, config,appId);
            model.init(config, token, appId);

            // Event handling from view
            $(view).on(config.CFG.FILE_PROPERTY_CHANGE_EVENT, handleFilePropertyChange);
            $(view).on(config.CFG.FILE_UPLOAD_PROGRESS_EVENT, handleUploadProgress);
            $(view).on(config.CFG.FILE_UPLOAD_FAILED_EVENT, handleUploadFail);
            $(view).on(config.CFG.FILE_UPLOAD_SUBMIT_EVENT, handleUploadSubmit);
            $(view).on(config.CFG.FILE_UPLOAD_DONE_EVENT, handleUploadDone);
            $(view).on(config.CFG.SUPPLIER_AUTOCOMPLETE_EVENT, handleSupplierAutoComplete);
        },
        /*
         *
         */
        getContentUploadUtility: function(dataSourceId, Type) {
            type = Type;
            itemDataSourceId = dataSourceId;

            var deferred = $.Deferred(),
                mapper,
                sub_type;
            //     var dialog = '';
            // Nested due to jQuery 1.7 if we upgrade jQuery can use .then() without nesting
            if (Type === 'A') {
                model.getContentUploadUtilityHtml()
                    .done(function(html) {

                        model.getFileUploadServiceData(dataSourceId)
                            .done(function(uploadData) {
                                view.setContentUploadUtilityHtml(html, uploadData,appId);
                                deferred.resolve();
                            })
                            .fail(function() {
                                deferred.reject();
                            });
                    })
                    .fail(function() {
                        deferred.reject();
                    });

                return deferred.promise();
            } else {
                model.getContentUploadUtilityHtml()
                    .done(function(html) {
                        getSubmissionTypes()
                            .done(function(messagedata) {
                                sub_type = messagedata;
                                view.setSubType(sub_type);
                                getMapperTypes()
                                    .done(function(messagedata1) {
                                        mapper = messagedata1;
                                        view.setMapperType(mapper);
                                        view.setContentUploadUtilityHtml2(html);
                                        deferred.resolve();
                                    })
                                    .fail(function() {
                                        deferred.reject();
                                    });
                            })
                            .fail(function(addmsg) {});
                    })
                    .fail(function(addmsg) {});
                return deferred.promise();

            }
        },
        submitFileForUpload: function() {
            var error = 'n';
            if ($('.cuu-file-properties-fieldset-supplier').val().trim() === '') {
                //    $('.cuu-file-upload-fieldset-upload-file-list').empty();
                //$('.cuu-file-upload-fieldset-fileupload').attr('disabled','disabled');
                //$('#fileupload table tbody tr.template-download').remove();
                //$('#supplier_error').html(' *** Please enter a Supplier');
                view.showErrorDialog('Missing or Invalid Supplier', 'Upload - Error');
                error = 'y';
            }
            //    if ($('.cuu-file-properties-fieldset-supplier').data("id").trim()==='') {
            //   view.showErrorDialog('Missing or Invalid Supplier','Upload - Error');
            //error='y';
            //}
            //   alert($('.cuu-file-properties-fieldset-supplier').data("id"))
            //   error='y';
            if ($('.cuu-file-properties-fieldset-recieved-date').val().trim() === '') {
                //    $('.cuu-file-upload-fieldset-upload-file-list').empty();
                //$('.cuu-file-upload-fieldset-fileupload').attr('disabled','disabled');
                //$('#fileupload table tbody tr.template-download').remove();
                //$('#date_error').html(' *** Please enter a Received Date');
                view.showErrorDialog('Missing or Invalid Received Date', 'Upload - Error');
                error = 'y';
            }
            var filelist = container.find('.bar');
            row_files = filelist.length;
            //    alert(row_files)
            if (error !== 'y' && row_files > 0) {
                //  var filelist = container.find('.bar');
                //  var row_files=filelist.length;
                //   alert(row_files)
                //   console.log($('.file-upload-button'))
                //   $('.file-upload-button').attr('disabled','disabled');
                $('.ui-dialog-buttonpane button:contains(Upload)').hide();

                var promise;
                var id;
                var deferred = $.Deferred();
                promise = model.getFileUploadDataSourceId(view.getHtmlData());

                promise = promise.done(function(data2) {
                    deferred.resolve(data2);
                    if (data2[0].dbRetCdSuppId === 1) {
                        view.showErrorDialog(data2[0].dbRetMsgSuppId, 'Upload - Error');
                        deferred.reject();
                    } else {

                        id = data2[0].dataSrcId;
                        view.setSupplierId(data2[0].supplierId);

                        if (type === 'A') {
                            id = itemDataSourceId;
                        }
                        promise = model.updateDataSourceId(id, view.getHtmlData());
                        promise = promise.done(function(data3) {
                                deferred.resolve(data3);
                                view.triggerUploadControl(id, token, appId, filelist);
                            })
                            .done(function() {
                                localStorage.setItem('ref', '2');
                                //          $('#uploadutil').dialog("close").trigger("close");
                                //$(this).parents(".ui-dialog-content").dialog('close')
                            })
                            .fail(function() {
                                view.showErrorDialog('Error inserting default data', 'Upload - Error');
                                deferred.reject();
                            });


                    }
                    //    return deferred.promise();
                }).fail(function() {
                    view.showErrorDialog('Error inserting default DataSourceId', 'Upload - Error');
                    deferred.reject();
                });
            }

        },
        /*
         *
         */
        cleanUp: function() {
            view.cleanUp();
            model.cleanUp();

            publicInterface = null;
        }
    };

    return publicInterface;
};