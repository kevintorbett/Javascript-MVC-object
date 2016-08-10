// Setup EPICOR.IMR.ContentUploadUtility name space
EPICOR.namespace('EPICOR.IMR.ContentUploadUtility.View');

EPICOR.IMR.ContentUploadUtility.View = function() {
    "use strict";

    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof EPICOR.IMR.ContentUploadUtility.View)) {
        return new EPICOR.IMR.ContentUploadUtility.View();
    }

    var publicInterface,
        config,
        container,
        submissionRadio,
        netsButton,
        testButton,
        fullButton,
        uploadButton,
        uploadControl,
        uploadData,
        dataSourceId,
        fileList,
        fileIndex = 0,
        arows = 0,
        //	fileObjectArray=new Array(),
        fileObjectArray = [],
        receivedDateText,
        documentNumberText,
        token,
        mapper,
        sub_type,
        supplierText;


    /**
     *
     */
    function initControls(uploadData2) {
        var i;
        uploadData = uploadData2;
        submissionRadio = container.find("." + config.CSS.SUBMISSION_TYPE_BUTTONSET);
        //uploadbutton = container.find("." + config.CSS.FILE_UPLOAD_CONTROL);
        uploadButton = container.find(".fileinput-button"); // the button shown on the UI XXX Con not change this class name because of the plugin
        fileList = container.find("." + config.CSS.FILE_LIST);
        receivedDateText = container.find("." + config.CSS.RECEIVED_DATE);
        documentNumberText = container.find("." + config.CSS.DOCUMENT_NUMBER_TEXT);
        supplierText = container.find("." + config.CSS.SUPPLIER_TEXT);
        netsButton = container.find("." + config.CSS.NETS_SUBTYPE);
        testButton = container.find("." + config.CSS.TEST_SUBTYPE);
        fullButton = container.find("." + config.CSS.FULL_SUBTYPE);
        submissionRadio.buttonset();

        receivedDateText.datepicker({
            dateFormat: 'mm/dd/yy',
            showAnim: 'scale'
        });

        // Show calendar on date picker when clicking the icon also
        container.find("." + config.CSS.DATE_PICKER_CALENDAR_IMG).on('click', function() {
            receivedDateText.datepicker("show");
        });

        uploadButton.addClass("btn btn-success ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary");

        //The button span
        uploadButton.hover(
            function() {
                uploadButton.addClass('ui-state-hover');
            },
            function() {
                uploadButton.removeClass('ui-state-hover');
            }

        );

        initUploadControl(uploadData);

        for (i = 0; i < uploadData.length; i++) {

            if (uploadData[i].name === config.CFG.SUPPLIER_FIELD) {
                supplierText.val(uploadData[i].value);
            } else if (uploadData[i].name === config.CFG.SUPPLIER_ID_FIELD) {
                supplierText.data("id", uploadData[i].value);
            } else if (uploadData[i].name === config.CFG.DOCUMENT_NUMBER_FIELD) {
                documentNumberText.val(uploadData[i].value);
            } else if (uploadData[i].name === config.CFG.RECEIVED_DATE_FIELD) {
                receivedDateText.val(uploadData[i].value);
            } else if (uploadData[i].name === config.CFG.SUBMISSION_TYPE_FIELD) {

                switch (uploadData[i].value) {
                    case config.CFG.FULL_TYPE_CODE:
                        fullButton
                            .prop('checked', true)
                            .button("refresh");
                        break;
                    case config.CFG.TEST_TYPE_CODE:
                        testButton
                            .prop('checked', true)
                            .button("refresh");
                        break;
                    case config.CFG.NETS_TYPE_CODE:
                        netsButton
                            .prop('checked', true)
                            .button("refresh");
                        break;
                }
            }
        }
        var l_date = new Date();
        var l_mn = l_date.getMonth() + 1;
        var l_dy = l_date.getDate();
        var l_yr = l_date.getFullYear();


        l_date = setTwoDigits(l_mn) + '/' + setTwoDigits(l_dy) + '/' + l_yr;
        receivedDateText.val(l_date);
        supplierText.autocomplete({
            minLength: 0,
            source: function(request, response) {
                supplierText.data("id", '');
                $(publicInterface).trigger(config.CFG.SUPPLIER_AUTOCOMPLETE_EVENT, {
                    field: config.CFG.SUPPLIER_FIELD,
                    value: supplierText.val().trim(),
                    response: response
                });

            },
            /*
             * jQuery is not consistent with autocomplete.  Label is what is displayed in the list and
             * value is the data behind the lable.  The default beahvour is to take the autocorrect
             * value from the list and place it in the text box, rather than the label that is displayed
             * in the list. The select and focus override jQuery's default behavior.
             */
            select: function(event, ui) {
                supplierText.val(ui.item.label);
                supplierText.data("id", ui.item.value2);
                event.preventDefault();
                supplierText.trigger("change");
                event.preventDefault();
            }
        });

        supplierText.change(function() {
            $(publicInterface).trigger(config.CFG.SUPPLIER_AUTOCOMPLETE_EVENT, {
                field: config.CFG.SUPPLIER_FIELD,
                value: supplierText.val(),
                id: supplierText.data("id")
            });
            $('.cuu-file-upload-fieldset-fileupload').removeAttr("disabled");
            $('#supplier_error').html(' ');
        });

        receivedDateText.change(function() {
            $(publicInterface).trigger(config.CFG.FILE_PROPERTY_CHANGE_EVENT, {
                field: config.CFG.RECEIVED_DATE_FIELD,
                value: receivedDateText.val()
            });
        });
        documentNumberText.change(function() {

            $(publicInterface).trigger(config.CFG.FILE_PROPERTY_CHANGE_EVENT, {
                field: config.CFG.DOCUMENT_NUMBER_FIELD,
                value: documentNumberText.val()
            });
        });
        documentNumberText.keyup(function() {
            $(this).val($(this).val().toUpperCase());
        });
        submissionRadio.on('click', function() {
            $(publicInterface).trigger(config.CFG.FILE_PROPERTY_CHANGE_EVENT, {
                field: config.CFG.SUBMISSION_TYPE_FIELD,
                value: getSubmissionType()
            });
        });
        $('.cuu-file-upload-fieldset-fileupload').on('click', function() {
            $('.ui-dialog-buttonpane button:contains(Upload)').show();
            var rows = container.find('.' + config.CSS.UPLOAD_TEMPLATE);
            $.each(rows, function(index, row) {
            if ($(row).hasClass(config.CSS.UPLOAD_SUCCESS)) {
                    $(row).remove();
                }
            });
        });
        if (supplierText.val().trim() === '') {
            $('.cuu-file-upload-fieldset-upload-file-list').empty();
            $('.cuu-file-upload-fieldset-fileupload').attr('disabled', 'disabled');
            $('.ui-dialog-buttonpane button:contains(Upload)').hide();
             $('#supplier_error').html(' *** Please enter a Supplier');
        } else {
            $('.cuu-file-upload-fieldset').removeClass('ui-helper-hidden');
        }

     }

    function initUploadControl(uploadData) {
        uploadControl = $("." + config.CSS.FILE_UPLOAD_CONTROL); // the actual upload control
        uploadControl.fileupload({
            filesContainer: fileList,
            url: config.URL.FILE_UPLOAD_SERVICE,
            formData: uploadData,
            autoUpload: false,
            //    maxChunkSize: 100,
            limitConcurrentUploads: 3,
            //    singleFileUploads: true,
            //    sequentialUploads: true,
            dataType: 'json',
            uploadTemplate: getFileUploadTemplate,
            add: function(e, data) {
                fileObjectArray.push(data);

                $.blueimp.fileupload.prototype.options.add.call(this, e, data);
                $(".cancel").click(function() {
                    var id = $(this).attr('id');
                    $(this).parent('div').slideUp('slow', function() {
                        $(this).remove();
                    });
                    $(this).remove();
                    delete data[id];
                    delete fileObjectArray[id];
                    var indexfile = 0;
                    $('div.cancel').each(function(i) {
                        $(this).attr('id2', indexfile);
                        $(this).attr('id', indexfile);
                        indexfile = indexfile + 1;
                    });
                });
            },
            progressall: function(e, data) {
                $(publicInterface).trigger(config.CFG.FILE_UPLOAD_PROGRESS_EVENT, data);
            },
            fail: function(e, data) {
                $(publicInterface).trigger(config.CFG.FILE_UPLOAD_FAILED_EVENT, data);
            },
            done: function(e, data) {
                $(publicInterface).trigger(config.CFG.FILE_UPLOAD_DONE_EVENT, data);
                localStorage.setItem('ref', '2');
            }
        });

    }

    function getFileUploadTemplate(data) {
        var rows = $();

        $.each(data.files, function(index, file) {
            var row = $('<div class="template-upload fade">' +
                '<div class="cancel" title="' + config.MSG.CANCEL_UPLOAD_TITLE + '" name="' + file.name + '" id2="' + arows + '" id="' + arows + '"><img src=' + config.URL.CANCEL_ICON + '></div>' +
                '<p class="name"></p>' +
                '<p class="size"></p>' +
                '<p class="percent"></p>' +
                '<div class="progress"><div class="bar" style="width: 0%;"></div></div>' +
                '</div>');

            row.find('.name').text(file.name);
            row.find('.size').text('(' + data.formatFileSize(file.size) + ')');
            arows = arows + 1;
            rows = rows.add(row);
        });

        return rows;
    }

    function setTwoDigits(p_val) {
        if (p_val.toString().length < 2) {
            return '0' + p_val.toString();
        }
        return p_val;
    }

    function getInitData() {


        var l_date = new Date();
        var l_mn = l_date.getMonth() + 1;
        var l_dy = l_date.getDate();
        var l_yr = l_date.getFullYear();


        l_date = setTwoDigits(l_mn) + '/' + setTwoDigits(l_dy) + '/' + l_yr;
        var uploadData = [{
            name: config.CFG.ITEM_DATA_SOURCE_ID_FIELD,
            value: 0
        }];
        return uploadData;
    }

    function getSubmissionType() {
        var type;

        if (fullButton.prop('checked')) {
            type = config.CFG.FULL_TYPE_CODE;
        } else if (testButton.prop('checked')) {
            type = config.CFG.TEST_TYPE_CODE;
        } else if (netsButton.prop('checked')) {
            type = config.CFG.NETS_TYPE_CODE;
        }

        return type;
    }

    //----- Public Methods -----//
    publicInterface = {

        /**
         *
         */
        init: function(pContainer, pConfig) {
            container = pContainer;
            config = pConfig;
        },
        /**
         *
         */
        cleanUp: function() {
            publicInterface = null;
            submissionRadio = null;
            uploadButton = null;
            config = null;
            container = null;
            fileList = null;
            netsButton = null;
            testButton = null;
            fullButton = null;
            uploadControl = null;
            receivedDateText = null;
            documentNumberText = null;
            supplierText = null;
        },
        /**
         *
         */
        setContentUploadUtilityHtml: function(html, uploadData) {
            var deferred = $.Deferred();

            $(publicInterface).on(config.CFG.INIT_COMPLETE, function() {
                deferred.resolve();
            });

            container.html(html);
            initControls(uploadData);
            $('.ui-dialog-buttonpane button:contains(Upload)').hide();
            return deferred.promise();
        },
        setContentUploadUtilityHtml2: function(html) {
            var deferred = $.Deferred();

            var uploadData = getInitData();
            container.html(html);
            initControls(uploadData);

            return deferred.promise();
        },

        /**
         *
         */
        setUploadData: function(uploadData) {

            if (uploadControl) {
                uploadControl.fileupload('option', 'formData', uploadData);
            }
        },
        setSupplierId: function(supplierid) {
            supplierText.data("id", supplierid);
        },
        setMapperType: function(p_mapper) {
            mapper = p_mapper;
        },
        setSubType: function(p_sub_type) {
            sub_type = p_sub_type;
        },
        /**
         *
         */
        getUploadData: function() {
            var formData;

            if (uploadControl) {
                formData = uploadControl.fileupload('option', 'formData');
            }

            return formData;
        },
        /**
         *
         */
        setSupplierAutoCompleteData: function(data) {

            if (supplierText) {
                supplierText.autocomplete("option", "source", data);

                supplierText.autocomplete("search", "");
            }
        },
        getHtmlData: function() {
            var htmldata = [];
            htmldata.supplierId = supplierText.data("id");
            htmldata.supplierText = supplierText.val();
            htmldata.receivedDateText = receivedDateText.val();
            htmldata.documentNumberText = documentNumberText.val();
            htmldata.submissionTypeCd = getSubmissionType();
            htmldata.mapperTypeCd = 'SUP';
            htmldata.descTypeId = 'D';
            return htmldata;
        },
        /**
         *
         */
        triggerUploadControl: function(itemDataSourceId, authid, appId) {
            uploadData = [{
                    name: config.CFG.AUTHORIZATION_FIELD,
                    value: authid
                }, {
                    name: config.CFG.AUTHORIZATION_APPLICATION_FIELD,
                    value: appId
                },

                {
                    name: config.CFG.ITEM_DATA_SOURCE_ID_FIELD,
                    value: itemDataSourceId

                }
            ];
            initControls(uploadData);
            for (var i in fileObjectArray) {
                if (typeof fileObjectArray[i].submit === 'function') {
                    fileObjectArray[i].submit();
                }
    
            }

        },
        showErrorDialog: function(data, title) {
            var dialog,
                deferred = $.Deferred();

            dialog = new EPICOR.IMR.DialogFactory.factory(EPICOR.IMR.DialogFactory.ModalType);
            if (title) {
                dialog.setTitle(title);
            } else {
                dialog.setTitle("Update Error");
            }

            dialog.setContent($('<img class="' + config.CSS.QUESTION_ICON_CLASS + '" src="' + config.URL.QUESTION_ICON + '"><div class="' + config.CSS.DIALOG_MESSAGE + '">' + data + '</p></div>'));
            dialog.on('ok', function() {
                deferred.resolve();
            });
            dialog.open();

            return deferred.promise();
        }
    };

    return publicInterface;
};