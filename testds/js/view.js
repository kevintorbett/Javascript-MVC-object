// Setup acme.xxx.DataSourceContent name space
acme.namespace('acme.xxx.DataSourceContent.Model');

acme.xxx.DataSourceContent.View = function() {
    "use strict";

    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof acme.xxx.DataSourceContent.View)) {
        return new acme.xxx.DataSourceContent.View();
    }

    var publicInterface,
        config,
        container,
        roles,
        token,
        appId,
        moduleId,
        dataFilesGrid,
        supportFilesGrid,
        toolBar,
        submitProcessButton,
        notesButton,
        fileMapButton,
        attachButton,
        deleteDataSourceButton,
        deleteFilesButton,
        addInterchangeChildButton,
        receivedDateText,
        descriptionText,
        supplierText,
        mapper,
        cont_type,
        sub_type,
        base_url = location.protocol + '//' + location.host;

    /**
     *
     */
    function initControls() {
        initDataSourceToolbarButtons();
        initDataFilesGrid();
        initSuportFilesGrid();
        // Set custom icon on refresh button for grids
        container.find('.ui-pg-div span').removeClass('ui-icon').html('<img src="' + config.URL.REFRESH_ICON + '"></img>');
        dataFilesGrid.jqGrid('navButtonAdd', '#data_files_grid_' + moduleId + '_toppager_left', {
            caption: '',
            buttonicon: 'ui-icon-circle-arrow-s',
            title: 'Expand Grid Columns',
            onClickButton: function() {
                gridGrow6();
            }
        });
        dataFilesGrid.jqGrid('navButtonAdd', '#data_files_grid_' + moduleId + '_toppager_left', {
            caption: '',
            buttonicon: 'ui-icon-circle-arrow-n',
            title: 'Collapse Grid Columns',
            onClickButton: function() {
                gridunGrow6();
            }
        });
        dataFilesGrid.jqGrid('navButtonAdd', '#data_files_pager_' + moduleId + '_left', {
            caption: '',
            buttonicon: 'ui-icon-circle-arrow-s',
            title: 'Expand Grid Columns',
            onClickButton: function() {
                gridGrow6();
            }
        });
        dataFilesGrid.jqGrid('navButtonAdd', '#data_files_pager_' + moduleId + '_left', {
            caption: '',
            buttonicon: 'ui-icon-circle-arrow-n',
            title: 'Collapse Grid Columns',
            onClickButton: function() {
                gridunGrow6();
            }
        });
    }

    /**
     *
     */
    function initDataFilesGridOptions(gridOptions) {
alert('initDataFilesGridOptions')
        // Non static options
        gridOptions.cellEdit = hasRole(config.CFG.LEVEL3_ROLE, roles);
        gridOptions.pager = "#" + config.CSS.DATA_FILES_PAGER + "_" + moduleId;
        gridOptions.onCellSelect = dataGridClickEventHandler;
        gridOptions.afterSaveCell = gridCellEditEventHandler;
        gridOptions.afterEditCell = gridCellAutoSuggestHandler;
        //gridOptions.gridComplete = gridCompleteHandler;

        gridOptions.onSelectRow = function(rowId, status, event) {
            if ($('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + rowId).is(':checked')) {
                jQuery('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + rowId).prop('checked', false);
            } else {
                jQuery('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + rowId).prop('checked', true);
            }
            toggleToolbarButtons();
            dataFilesGrid.find(".ui-state-highlight, [aria-selected='true']").removeClass('ui-state-highlight');
        };

        gridOptions.onSelectAll = function(rowIds, status) {
            toggleToolbarButtons();
        };

        gridOptions.gridComplete = function() {
            //    dataFilesGrid.trigger("jqGrid.gridComplete");
            gridCompleteHandler();

        };

        window.onresize = function() {
            dataFilesGrid.trigger("reloadGrid");
        };

        return gridOptions;
    }

    /**
     *
     */
    function initSupportFilesGridOptions(gridOptions) {

        // Non static options
        gridOptions.cellEdit = hasRole(config.CFG.LEVEL3_ROLE, roles);
        gridOptions.pager = "#" + config.CSS.SUPPORT_FILES_PAGER + "_" + moduleId;
        gridOptions.onCellSelect = supportGridClickEventHandler;
        gridOptions.afterSaveCell = gridCellEditEventHandlerSupp;
        gridOptions.afterEditCell = gridCellAutoSuggestHandler;

        gridOptions.onSelectRow = function(rowId, status, event) {
            if ($('#jqg_' + config.CSS.SUPPORT_GRID + '_' + moduleId + '_' + rowId).is(':checked')) {
                $('#jqg_' + config.CSS.SUPPORT_GRID + '_' + moduleId + '_' + rowId).prop('checked', false);
            } else {
                $('#jqg_' + config.CSS.SUPPORT_GRID + '_' + moduleId + '_' + rowId).prop('checked', true);
            }
            toggleToolbarButtons();
        };

        gridOptions.onSelectAll = function(rowIds, status) {
            toggleToolbarButtons();
        };

        gridOptions.gridComplete = function() {
            supportFilesGrid.trigger("jqGrid.gridComplete");
            gridSupportCompleteHandler();
        };

        window.onresize = function() {
            supportFilesGrid.trigger("reloadGrid");
        };

        return gridOptions;
    }

    /**
     *
     */
    function dataSourcePropertiesFormatter(val, options, row) {
        return '<span class="' + config.CSS.PROPERTIES + '" title="' + config.MSG.FILE_PROPERTIES_TIP + '"><img src="' + config.URL.PROPERTIES_ICON + '"></img></span>';
     }

    /**
     *
     */
    function dataSourceInProcessFormatter(val, options, row) {
        //
        val = (val === 'False') ? 'No' : 'Yes';

        return '<span>' + val + '</span>';
    }

    /**
     *
     */
    function dataSourceDownloadFormatter(val, options, row) {
        var url,
            paramString;

        if (row.contentTypeCode !== config.CFG.ACES_INTERCHANGE_CHILD) {
            url = base_url + config.URL.DATA_SOURCE_CONTENT_FILE_DOWNLOAD + "/" + row[config.CFG.CONTENT_ID_COLUMN_NAME];
            paramString = $.param({
                "Authorization": token,
                "Authorization-Application": appId
            });

            return '<a download href="' + url + '?' + paramString + '" title="' + config.MSG.DOWNLOAD_TIP + '"><img src="' + config.URL.DOWNLOAD_ICON + '"></img></span>';
        } else {
            return '&nbsp;';
        }
    }

    /**
     *
     */
    function dataSourceCommentFormatter(val, options, row) {
        return '<span class="' + config.CSS.NOTE + '" title="' + config.MSG.FILE_NOTES_TIP + '"><img src="' + config.URL.NOTES_ICON + '"></img></span>';
    }

    /**
     *
     */
    function dataSourceFileNameFormatter(val, options, row) {
        //
        val = (val === 'null') ? '' : val;

        return '<span>' + val + '</span>';
    }

    /**
     *
     */
    function dataSourceDocTitleFormatter(val, options, row) {
        //
        val = (val === 'null') ? 'N/A' : val;

        return '<span>' + val + '</span>';
    }

    /**
     *
     */
    function dataSourceDocNumFormatter(val, options, row) {
        //
        val = (val === 'null') ? '' : val;

        return '<span>' + val + '</span>';
    }

    /**
     *
     */
    function dataSourceDescriptionFormatter(val, options, row) {
        //
        val = (val === 'null') ? '' : val;

        return '<span>' + val + '</span>';
    }

    /**
     *
     */
    function addPointerToClickableCells() {

        $('.' + config.CSS.PROPERTIES).parent().css('cursor', 'pointer');
        $('.' + config.CSS.DOWNLOAD).parent().css('cursor', 'pointer');
        $('.' + config.CSS.NOTE).parent().css('cursor', 'pointer');
        $("#data_files_grid").jqGrid('navButtonAdd', '#data_files_pager_'+moduleId+', { caption: '', buttonicon: 'ui-icon-circle-arrow-s', title: 'Expand Grid Columns', onClickButton: function () {   gridGrow6(); }});
        $("#data_files_grid").jqGrid('navButtonAdd', '#data_files_pager_'+moduleId+', { caption: '', buttonicon: 'ui-icon-circle-arrow-n', title: 'Collapse Grid Columns', onClickButton: function () {   gridunGrow6(); }});
        $("#data_files_grid").jqGrid('navButtonAdd', '#data_files_grid_' + moduleId + '_toppager_left', {
            caption: '',
            buttonicon: 'ui-icon-circle-arrow-s',
            title: 'Expand Grid Columns',
            onClickButton: function() {
                gridGrow6();
            }
        });
        $("#data_files_grid").jqGrid('navButtonAdd', '#data_files_grid_' + moduleId + '_toppager_left', {
            caption: '',
            buttonicon: 'ui-icon-circle-arrow-n',
            title: 'Collapse Grid Columns',
            onClickButton: function() {
                gridunGrow6();
            }
        });
    }

    /**
     *
     */
    function dataGridClickEventHandler(rowId, iCol, value, event) {
        var colModel,
            rowData,
            contentId,
            cellName,
            dataSourceId;

        colModel = dataFilesGrid.jqGrid("getGridParam", "colModel");
        cellName = colModel[iCol].name;
        rowData = dataFilesGrid.jqGrid('getRowData', rowId);
        contentId = rowData[config.CFG.CONTENT_ID_CELL];
        dataSourceId = rowData[config.CFG.DATA_SOURCE_ID_COLUMN_NAME];
        $(publicInterface).trigger(config.CFG.GRID_CELL_CLICK_EVENT, {
            cellName: colModel[iCol].name,
            contentId: contentId,
            dataSourceId: dataSourceId,
            rowid: rowId
        });

    }

    /**
     *
     */
    function supportGridClickEventHandler(rowId, iCol, value, event) {
        var colModel,
            rowData,
            contentId,
            dataSourceId;

        colModel = supportFilesGrid.jqGrid("getGridParam", "colModel");
        rowData = supportFilesGrid.jqGrid('getRowData', rowId);
        contentId = rowData[config.CFG.CONTENT_ID_COLUMN_NAME];
        dataSourceId = rowData[config.CFG.DATA_SOURCE_ID_COLUMN_NAME];

        $(publicInterface).trigger(config.CFG.GRID_CELL_CLICK_EVENT, {
            cellName: colModel[iCol].name,
            contentId: contentId,
            dataSourceId: dataSourceId
        });
    }

    /*
     * Handles change event for the grid cell editing
     */
    function gridCellEditEventHandler(rowId, cellName, value, iRow, iCol) {
        var l_value = jQuery.trim(value);
        var l_cell = cellName;
        var l_rowdata = dataFilesGrid.getRowData(rowId);
        var l_content_id = l_rowdata[config.CFG.CONTENT_ID_CELL];
        var l_supplier_id = l_rowdata[config.CFG.SUPPLIER_ID_CELL];
        var l_supplier_nm = jQuery.trim(l_rowdata[config.CFG.SUPPLIER_NAME_CELL]);
        var l_desc = jQuery.trim(l_rowdata[config.CFG.DESCRIPTION_CELL]);
        var l_type = jQuery.trim(l_rowdata[config.CFG.CONTENT_TYPE_CELL]);
        var l_docnum = jQuery.trim(l_rowdata[config.CFG.DOC_NUM_CELL]);
        l_docnum = l_docnum.toUpperCase();
        if (l_cell === 'documentNum') {
            l_value = l_docnum.toUpperCase();
            dataFilesGrid.jqGrid('setCell', rowId, iCol, l_value, "ui-state-selected ui-state-highlight ");
        }
        $(publicInterface).trigger(config.CFG.GRID_CELL_EDIT_EVENT, {
            gridName: 'data',
            cellName: l_cell,
            cellValue: l_value,
            rowId: rowId,
            contentid: l_content_id,
            supplierId: l_supplier_id,
            supplierName: l_supplier_nm,
            description: l_desc,
            contentTypeText: l_type,
            documentNum: l_docnum
        });
    }

    function gridCellEditEventHandlerSupp(rowId, cellName, value, iRow, iCol) {
            var l_value = jQuery.trim(value);
            var l_cell = cellName;
            var l_rowdata = supportFilesGrid.getRowData(rowId);
            var l_content_id = l_rowdata[config.CFG.CONTENT_ID_CELL];
            var l_supplier_id = l_rowdata[config.CFG.SUPPLIER_ID_CELL];
            var l_supplier_nm = jQuery.trim(l_rowdata[config.CFG.SUPPLIER_NAME_CELL]);
            var l_desc = jQuery.trim(l_rowdata[config.CFG.DESCRIPTION_CELL]);
            var l_type = jQuery.trim(l_rowdata[config.CFG.CONTENT_TYPE_CELL]);
            var l_docnum = jQuery.trim(l_rowdata[config.CFG.DOC_NUM_CELL]);

            $(publicInterface).trigger(config.CFG.GRID_CELL_EDIT_EVENT, {
                gridName: 'supp',
                cellName: l_cell,
                cellValue: l_value,
                rowId: rowId,
                contentid: l_content_id,
                supplierId: l_supplier_id,
                supplierName: l_supplier_nm,
                description: l_desc,
                contentTypeText: l_type,
                documentNum: l_docnum
            });
        }
        /*
         *
         */
    function gridCompleteHandler() {
            dataFilesGrid.jqGrid('setColProp', 'contentTypeText', {
                editoptions: {
                    value: cont_type
                }
            });
            dataFilesGrid.jqGrid('setColProp', 'submissionTypeText', {
                editoptions: {
                    value: sub_type
                }
            });

            var l_row_id = dataFilesGrid.jqGrid('getGridParam', 'rowNum');
            var l_sub1 = 'n';
            var l_valid = 0;
            var l_type = '';
            for (var i = 0; i < l_row_id; i++) {
                var l_error = dataFilesGrid.jqGrid('getCell', i, 'errorMsg');
                if (l_error) {
                    var image2 = '<span title="' + l_error + '" ><img title="' + l_error + '" style="cursor:pointer;align:center;"  id="delsplit2"  src="/acme/shared/images/exclamation_16x16.png" /></span>';
                    dataFilesGrid.jqGrid('setCell', i, 'errorInd', image2);
                } else {
                    dataFilesGrid.jqGrid('setCell', i, 'errorInd', ' ');
                }
                var l_tipS = dataFilesGrid.jqGrid('getCell', i, 'supplierName');
                var l_tip = dataFilesGrid.jqGrid('getCell', i, 'supplierId');
                var l_sub = dataFilesGrid.jqGrid('getCell', i, 'inProcess');
                var l_stat = dataFilesGrid.jqGrid('getCell', i, 'contentStatusText');
                var l_tip2 = l_tipS + ' - ' + l_tip;
                dataFilesGrid.jqGrid('setCell', i, 'supplierName', '', '', {
                    title: l_tip2
                });
                if (hasRole(config.CFG.LEVEL3_ROLE, roles)) {
                    if (l_sub === 'No' && l_stat === 'Active') {
                        l_valid = l_valid + 1;
                        $('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + i).attr('checked', 'checked');
                        dataFilesGrid.find("tr.jqgrow")
                            .addClass("ui-state-highlight")
                            .attr("aria-selected", "true")
                            .attr('checked', 'checked');
                        if (l_row_id > 1) {
                            $('#cb_data_files_Grid').prop('checked', true);
                            if (l_sub === 'Yes') {
                                l_sub1 = 'y';
                                $('#jqg_'+config.CSS.DATA_FILES_GRID+'_'+moduleId+'_'+i).prop("disabled", true);
                            }
                            if (l_stat !== 'Active') {
                                l_sub1 = 'y';
                                $('#jqg_'+config.CSS.DATA_FILES_GRID+'_'+moduleId+'_'+i).prop("disabled", true);
                            }
                        }
                        l_type = dataFilesGrid.jqGrid('getCell', i, 'contentTypeText');
                        if (l_type === 'ACES Interchange Child') {
                            dataFilesGrid.jqGrid('setCell', i, "fileName", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "documentNum", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "submissionTypeText", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "contentStatus", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "documentTitle", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "dnld", "", "ui-state-disabled cursor: none not-editable-cell");
                        }
                    } else {
                        $('#jqg_'+config.CSS.DATA_FILES_GRID+'_'+moduleId+'_'+i).prop("disabled", true);
                        l_type = dataFilesGrid.jqGrid('getCell', i, 'contentTypeText');
                        if (l_type === 'ACES Interchange Child') {
                            dataFilesGrid.jqGrid('setCell', i, "fileName", " ", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "documentNum", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "submissionTypeText", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "contentStatus", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "documentTitle", "", "ui-state-disabled cursor: none not-editable-cell");
                            dataFilesGrid.jqGrid('setCell', i, "dnld", "", "ui-state-disabled cursor: none not-editable-cell");
                        }
                    }
                    if (l_sub === 'No' && l_stat !== 'Active') {
                        l_sub1 = 'y';
                    }
                    if (l_sub === 'Yes') {
                        l_sub1 = 'y';
                    }


                }

            }
            if (l_sub1 === 'y') {
                $('#cb_data_files_grid_' + moduleId).prop('checked', false);
                $('#cb_data_files_grid_' + moduleId).prop("disabled", true);
            } else {
                $('#cb_data_files_grid_' + moduleId).prop('checked', true);
                $('#cb_data_files_grid_' + moduleId).prop("disabled", false);
            }
            if (l_valid > 0) {
                submitProcessButton.button("enable");
                deleteFilesButton.button("enable");
            } else {
                submitProcessButton.button("disable");
                deleteFilesButton.button("disable");

            }
        }
        /*
         *
         */
    function gridSupportCompleteHandler() {
            supportFilesGrid.jqGrid('setColProp', 'contentTypeText', {
                editoptions: {
                    value: cont_type
                }
            });
            var l_row_id = supportFilesGrid.jqGrid('getGridParam', 'rowNum');
            for (var i = 0; i < l_row_id; i++) {
                var l_stat = supportFilesGrid.jqGrid('getCell', i, 'contentTypeText');
                if (l_stat === 'Document Submission Form' || l_stat === 'Formatted Interchange File') {
                    supportFilesGrid.jqGrid('setCell', i, 'contentTypeText', '', 'not-editable-cell');
                }
            }

        }
        /*
         *
         */
    function gridCellAutoSuggestHandler(rowId, cellName, value, iRow, iCol) {
        $("#data_files_grid").find('.ui-state-highlight').removeClass('ui-state-highlight');
        dataFilesGrid.find(".ui-state-highlight, [aria-selected='true']").removeClass('ui-state-highlight');
        $('#' + rowId + '_' + cellName).focus(function() {
            this.select();
        });
        dataFilesGrid.jqGrid('setCell', rowId, cellName, '', 'ui-state-highlight');
        if (cellName === 'supplierName') {
            $("#" + rowId + "_supplierName").autocomplete({
                minLength: 0,
                source: function(request, response) {
                    $(publicInterface).trigger(config.CFG.SUPPLIER_GRID_AUTOCOMPLETE_EVENT, {
                        field: config.CFG.SUPPLIER_FIELD,
                        value: $("#" + rowId + "_supplierName").val().trim(),
                        row: rowId,
                        response: response
                    });
                },
                select: function(p_event, p_ui) {
                    dataFilesGrid.jqGrid('setCell', rowId, 'supplierId', p_ui.item.id, '');
                }
            });

            		search: function() {
            		    $(publicInterface).trigger(config.CFG.SUPPLIER_GRID_AUTOCOMPLETE_EVENT, {
            			field: config.CFG.SUPPLIER_FIELD,
            			value: $("#" +rowId+"_supplierName").val(),
            			row: rowId
            		    });}
            	    },
            	    {
            		source: []
            	    }
            	    ); 
        }
        if (cellName === 'description') {
            var l_rowdata = dataFilesGrid.getRowData(rowId);
            var l_supplier_id = l_rowdata[config.CFG.SUPPLIER_ID_CELL];
            var l_supplier = l_rowdata[config.CFG.SUPPLIER_NAME_CELL];
            $("#" + rowId + "_description").autocomplete({
                minLength: 0,
                source: function(request, response) {
                        $(publicInterface).trigger(config.CFG.DESCRIPTION_GRID_AUTOCOMPLETE_EVENT, {
                            field: config.CFG.SUPPLIER_FIELD,
                            value: l_supplier,
                            field2: config.CFG.DESCRIPTION_FIELD,
                            value2: $("#" + rowId + "_description").val(),
                            row: rowId,
                            response: response
                        });
                    }
                    
            });
        }

    }

    function gridGrow6() {
        dataFilesGrid.find("tr.jqgrow td").addClass('grid-grow');
    }

    function gridunGrow6() {
        dataFilesGrid.find("tr.jqgrow td").removeClass('grid-grow');
    }

    function setDataFilesGridFilter() {
        // Filter to shown only data file content types
        dataFilesGrid.setGridParam({
            postData: {
                filters: {
                    "groupOp": "OR",
                    "rules": [{
                        "field": "contentTypeCode",
                        "op": "eq",
                        "data": config.CFG.ACES_XML_FILE
                    }, {
                        "field": "contentTypeCode",
                        "op": "eq",
                        "data": config.CFG.PIES_XML_FILE
                    }, {
                        "field": "contentTypeCode",
                        "op": "eq",
                        "data": config.CFG.ACES_INTERCHANGE_CHILD
                    }]
                }
            },
            search: true
        });
    }

    function setSupportFilesGridFilter() {
            // Filter to shown only supprt file content types
            supportFilesGrid.setGridParam({
                postData: {
                    filters: {
                        "groupOp": "OR",
                        "rules": [{
                            "field": "contentTypeCode",
                            "op": "eq",
                            "data": config.CFG.DOCUMENT_SUBMISSION_FORM
                        }, {
                            "field": "contentTypeCode",
                            "op": "eq",
                            "data": config.CFG.ATTACHED_FILE
                        }, {
                            "field": "contentTypeCode",
                            "op": "eq",
                            "data": config.CFG.RAW_INTERCHANGE_FILE
                        }]
                    }
                },
                search: true
            });
        }
         /**
         *
         */
    function initDataFilesGrid() {
        var gridOptions;

        // Set unique ID on the grid table and pager
        container.find('.' + config.CSS.DATA_FILES_GRID).attr('id', config.CSS.DATA_FILES_GRID + "_" + moduleId);
        container.find('.' + config.CSS.DATA_FILES_PAGER).attr('id', config.CSS.DATA_FILES_PAGER + "_" + moduleId);

        // Set object references to the grid
        dataFilesGrid = container.find('#' + config.CSS.DATA_FILES_GRID + "_" + moduleId);

        // Add non static grid options
        gridOptions = initDataFilesGridOptions(config.CFG.DATA_GRID_OPTIONS);
 console.log(gridOptions)
        // Initialize the grid
        dataFilesGrid.jqGrid(gridOptions);

        // Set custom column formatters
        dataFilesGrid.jqGrid('setColProp', 'inProcess', {formatter: dataSourceInProcessFormatter});
        dataFilesGrid.jqGrid('setColProp', config.CFG.FILE_NAME_CELL, {
            formatter: dataSourceFileNameFormatter
        });
        dataFilesGrid.jqGrid('setColProp', config.CFG.DOC_TITLE_CELL, {
            formatter: dataSourceDocTitleFormatter
        });
        dataFilesGrid.jqGrid('setColProp', config.CFG.DOC_NUM_CELL, {formatter: dataSourceDocNumFormatter});
        dataFilesGrid.jqGrid('setColProp', config.CFG.FILE_NAME_CELL, {
            formatter: dataSourceFileNameFormatter
        });
        dataFilesGrid.jqGrid('setColProp', config.CFG.PROPERTY_CELL, {
            formatter: dataSourcePropertiesFormatter
        });
        dataFilesGrid.jqGrid('setColProp', config.CFG.DOWNLOAD_CELL, {
            formatter: dataSourceDownloadFormatter
        });
        if (hasRole(config.CFG.LEVEL2_ROLE, roles)) {
            dataFilesGrid.jqGrid('setColProp', config.CFG.NOTE_CELL, {
                formatter: dataSourceCommentFormatter
            });
        }
          dataFilesGrid.jqGrid('setColProp', config.CFG.DESCRIPTION_CELL, {formatter: dataSourceDescriptionFormatter});

        // Filter to shown only data file content types
        setDataFilesGridFilter();

        dataFilesGrid.navGrid(dataFilesGrid.getGridParam('pager'), {
            search: false,
            refresh: true,
            edit: false,
            add: false,
            del: false,
            cloneToTop: true,
            afterRefresh: function() {
                // Forces the filter to be set on refresh
                setDataFilesGridFilter();
                $("#data_files_grid").clearGridData(true);
                $(publicInterface).trigger(config.CFG.REFRESH_EVENT);
                toggleToolbarButtons();
            }
        });
    }

    /**
     *
     */
    function initSuportFilesGrid() {
        var gridOptions;

        // Set unique ID on the grid table and pager
        container.find('.' + config.CSS.SUPPORT_FILES_GRID).attr('id', config.CSS.SUPPORT_FILES_GRID + "_" + moduleId);
        container.find('.' + config.CSS.SUPPORT_FILES_PAGER).attr('id', config.CSS.SUPPORT_FILES_PAGER + "_" + moduleId);

        // Set object references to the grid
        supportFilesGrid = container.find('#' + config.CSS.SUPPORT_FILES_GRID + "_" + moduleId);

        // Add non static grid options
        gridOptions = initSupportFilesGridOptions(config.CFG.SUPPORT_GRID_OPTIONS);

        // Initialize the grid
        supportFilesGrid.jqGrid(gridOptions);

        // Set custom column formatters
        supportFilesGrid.jqGrid('setColProp', config.CFG.PROPERTY_CELL, {
            formatter: dataSourcePropertiesFormatter
        });
        supportFilesGrid.jqGrid('setColProp', config.CFG.DOWNLOAD_CELL, {
            formatter: dataSourceDownloadFormatter
        });
        if (hasRole(config.CFG.LEVEL2_ROLE, roles)) {
            supportFilesGrid.jqGrid('setColProp', config.CFG.NOTE_CELL, {
                formatter: dataSourceCommentFormatter
            });
        }
        supportFilesGrid.jqGrid('setColProp', config.CFG.DESCRIPTION_CELL, {
            formatter: dataSourceDescriptionFormatter
        });

        // Filter to shown only supprt file content types
        setSupportFilesGridFilter();

        supportFilesGrid.navGrid(supportFilesGrid.getGridParam('pager'), {
            search: false,
            refresh: true,
            edit: false,
            add: false,
            del: false,
            afterRefresh: function() {
                // Forces the filter to be set on refresh
                setSupportFilesGridFilter();
                //     supportFilesGrid.trigger("reloadGrid");
                $("#data_files_grid").clearGridData(true);
                $(publicInterface).trigger(config.CFG.REFRESH_EVENT);
                toggleToolbarButtons();
            }
        });
    }

    /**
     * Note: Using container.find() to set the button instance variables bacause it might be
     * possible to have another DSC container on a page
     *
     */
    function initDataSourceToolbarButtons() {

        // Init variables for the toolbar controls
        toolBar = container.find("." + config.CSS.DATA_SOURCE_TOOLBAR);
        submitProcessButton = toolBar.find("." + config.CSS.DATA_SOURCE_PROCESS);
        notesButton = toolBar.find("." + config.CSS.DATA_SOURCE_NOTE);
        fileMapButton = toolBar.find("." + config.CSS.DATA_SOURCE_FILE_MAP);
        attachButton = toolBar.find("." + config.CSS.DATA_SOURCE_ATTACH);
        deleteDataSourceButton = toolBar.find("." + config.CSS.DATA_SOURCE_DELETE);
        deleteFilesButton = toolBar.find("." + config.CSS.DATA_SOURCE_DELETE_FILES);
        addInterchangeChildButton = toolBar.find("." + config.CSS.DATA_SOURCE_ADD_INTERCHANGE);

        // Init toolbar Button
        submitProcessButton.button();
        notesButton.button();
        fileMapButton.button();
        attachButton.button();
        deleteDataSourceButton.button();
        deleteFilesButton.button();
        addInterchangeChildButton.button();
        submitProcessButton.button("disable");
        deleteFilesButton.button("disable");
        deleteDataSourceButton.button("disable");
        attachButton.button("disable");
        notesButton.button("disable");
        addInterchangeChildButton.button("disable");
        if (hasRole(config.CFG.LEVEL3_ROLE, roles)) {
            deleteDataSourceButton.button("enable");
            attachButton.button("enable");
            deleteFilesButton.button("enable");
            deleteDataSourceButton.button("enable");
        }
        if (hasRole(config.CFG.LEVEL2_ROLE, roles)) {
            attachButton.button("enable");
        }
        if (hasRole(config.CFG.LEVEL3_ROLE, roles)) {
            submitProcessButton.button("enable");
        }
        if (hasRole(config.CFG.LEVEL2_ROLE, roles)) {
            addInterchangeChildButton.button("enable");
            notesButton.button("enable");
        }
        // Disable these until a data file or support file is slected
        //submitProcessButton.button("disable");
        //deleteFilesButton.button("disable");

        /*
         * Event deligation to the containing div for the button toolbar.
         * This pattern reduces the number of event handerlers.
         */
        toolBar.on('click', 'button', function(event) {

            // Prevent event propogation or "bubbling up"
            event.preventDefault();

             var classList = $(event.currentTarget).attr('class'),
                classArray = classList.split(" "),
                uniqueClass;

            if (classArray.length >= 2) {
                // Second class in list is the unique class for the button
                uniqueClass = classArray[1].trim();

                // Make sure the class is what we are looking for
                if (uniqueClass.indexOf('data-source-') >= 0) {
                    $(publicInterface).trigger(config.CFG.TOOL_BAR_CLICK_EVENT, {
                        button: uniqueClass
                    });
                }
            }
        });

       }

    /*
     *
     */
    function toggleToolbarButtons() {

            var selectedDataFiles = 0;
            var l_row_id = dataFilesGrid.jqGrid('getGridParam', 'records') + 1;
            for (var i = 0; i < l_row_id; i++) {

                if ($('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + i).is(':checked')) {
                    selectedDataFiles = selectedDataFiles + 1;
                }
            }
            var selectedSupportFiles = 0;
            var l_row_id2 = supportFilesGrid.jqGrid('getGridParam', 'records') + 1;
            for (i = 0; i < l_row_id2; i++) {
                if ($('#jqg_' + config.CSS.SUPPORT_FILES_GRID + '_' + moduleId + '_' + i).is(':checked')) {

                    selectedSupportFiles = selectedSupportFiles + 1;
                }
            }
             if ((selectedDataFiles > 0 || selectedSupportFiles > 0)) {
                if (hasRole(config.CFG.LEVEL3_ROLE, roles)) {
                    deleteFilesButton.button('enable');
                    if (selectedDataFiles > 0) {
                        submitProcessButton.button('enable');
                    }
                }

            } else {
                deleteFilesButton.button('disable');
                submitProcessButton.button('disable');
            }
        }
        /*
         *
         */
    function setCheckboxes() {
            var l_rows = dataFilesGrid.jqGrid('getGridParam', 'records');
            var l_limit = l_rows + 1;
            if (l_rows > 0) {
                for (var i = 1; i < l_limit; i++) {
                    jQuery('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + i).attr('checked', 'checked');
                    jQuery("#jqg_data_files_Grid_" + i).attr('checked','checked');
                 }
            }

        }
        /**
         *
         */
    function getSelectedDataFileContentId() {
        var selectedRows = dataFilesGrid.jqGrid('getGridParam', 'records') + 1;
        var slectedContentIds = [],
            rowData = [],
            i,
            selcnt = 0;
        for (i = 0; i < selectedRows; i++) {
            if ($('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + i).is(':checked')) {
                rowData = dataFilesGrid.getRowData(i);
                slectedContentIds[selcnt] = rowData.contentid;
                selcnt = selcnt + 1;

            }
        }
        return slectedContentIds;
    }

    /**
     *
     */
    function getSelectedSupportFileContentId() {
        var selectedRows = supportFilesGrid.jqGrid('getGridParam', 'selarrrow'),
            slectedContentIds = [],
            rowData = [],
            i;

        for (i = 0; i < selectedRows.length; i++) {
            rowData = supportFilesGrid.jqGrid('getRowData', selectedRows[i]);
            slectedContentIds[i] = rowData[config.CFG.CONTENT_ID_COLUMN_NAME];
        }

        return slectedContentIds;
    }

    /**
     *
     */
    function clearSupportFilesGridData() {
        supportFilesGrid.jqGrid("clearGridData", true).trigger("reloadGrid");
    }

    /**
     *
     */
    function clearDataFilesGridData() {
        dataFilesGrid.jqGrid("clearGridData", true).trigger("reloadGrid");
    }

    /**
     *
     */
    function hasRole(role, roles) {
        var role1 = roles.indexOf(role);
        var role2 = roles.indexOf(config.CFG.SUPER_USER_ROLE);
        if (role2 > 0) {
            return true;
        }
        if (role1 < 1) {
            return false;
        } else {
            return true;
        }
        // return (roles.indexOf(role) >= 0) || (roles.indexOf(config.CFG.SUPER_USER_ROLE));
    }

    function setTwoDigits(p_val) {
        if (p_val.toString().length < 2) {
            return '0' + p_val.toString();
        }
        return p_val;
    }

    function initInterchange(data) {
        var i;

        receivedDateText = container.find("." + config.CSS.RECEIVED_DATE);
        descriptionText = container.find("." + config.CSS.DESCRIPTION);
        supplierText = container.find("." + config.CSS.SUPPLIER_TEXT);
        receivedDateText.datepicker({
            dateFormat: 'mm/dd/yy',
            showAnim: 'scale'
        });
        var l_date = new Date();
        var l_mn = l_date.getMonth() + 1;
        var l_dy = l_date.getDate();
        var l_yr = l_date.getFullYear();

        var date2 = setTwoDigits(l_mn) + '/' + setTwoDigits(l_dy) + '/' + l_yr;
        // Show calendar on date picker when clicking the icon also
        container.find(".interchange img").on('click', function() {
            receivedDateText.datepicker("show");
        });
        $('.supplier-text').val(data.items[0].supplierName);
        $('.supplier-text').attr({
            rval: data.items[0].supplierId
        });
        $('.supplier-id').val(data.items[0].supplierId);
        $('.choose-date')
            .val(date2)
            .datepicker({
                showAnim: 'scale',
                showOn: "button",
                buttonImage: "/acme/shared/images/calendar.png",
                buttonImageOnly: true
            });

        $('.supplier-text').autocomplete({
            minLength: 0,
            source: function(request, response) {
                $(publicInterface).trigger(config.CFG.SUPPLIER_AUTOCOMPLETE_EVENT, {
                    field: config.CFG.SUPPLIER_FIELD,
                    value: $('.supplier-text').val(),
                    response: response
                });
            },
            select: function(p_event, p_ui) {
                $('.supplier-id').val(p_ui.item.id);
                dataFilesGrid.jqGrid('setCell',rowId,'supplierId',p_ui.item.id, '');
            }
        });
        $('.description-text').autocomplete({
            minLength: 0,
            source: function(request, response) {
                    $(publicInterface).trigger(config.CFG.DESCRIPTION_AUTOCOMPLETE_EVENT, {
                        field: config.CFG.SUPPLIER_FIELD,
                        value: $('.supplier-text').val(),
                        field2: config.CFG.DESCRIPTION_FIELD,
                        value2: $('.description-text').val(),
                        response: response
                    });
                }
          });
       

        $(publicInterface).trigger(config.CFG.INIT_COMPLETE);
    }

    function autocompleteSelectFocusEventHandling(p_obj, p_event, p_ui) {
        jQuery(p_obj)
            .val(p_ui.item.label)
            .attr({
                title: p_ui.item.value + ': ' + p_ui.item.label,
                rval: p_ui.item.value
            });
        return false;
    }

    function autocompleteChangeEventHandling(p_obj, p_event, p_ui) {
            var l_match = false;
            jQuery('.ui-autocomplete').children().each(function(id, obj) {
                if (jQuery(obj).find('a').html().toLowerCase() === jQuery(p_obj).val().toLowerCase()) {
                    l_match = true;
                } else {
                    if (jQuery(p_obj).attr('title')) {
                        var t_val = jQuery(p_obj).attr('title').split(':')[1];
                        if (t_val) {
                            if (jQuery.trim(jQuery(obj).find('a').html().toLowerCase()) === jQuery.trim(t_val.toLowerCase().replace(/&/g, '&amp;'))) {
                                jQuery(p_obj).val(jQuery.trim(t_val));
                                l_match = true;
                            }
                        }
                    }
                }
            });

            if (l_match === false) {
                jQuery(p_obj).attr({
                    rval: 0
                });
            }
            return false;
        }
        /**
         *
         */
    function showProcessDialog(title, msg, errorInd, errMsg, content) {
            var dialog,
                module,
                container;

            container = $('<div>');
             if (errorInd === '1') {
                dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.BasicType);
            } else {
                dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.OkCancelType);
            }
            dialog.setTitle(title);
            dialog.setContent($('<img class="' + config.CSS.QUESTION_ICON_CLASS + '" src="' + config.URL.QUESTION_ICON + '"><div class="' + config.CSS.DIALOG_MESSAGE + '">' + msg + errMsg + '</p></div>'));
            dialog.on('ok', function() {

                if (errorInd === '0') {
                    $(publicInterface).trigger(config.CFG.SUBMIT_CONTENT, {
                        field: 'contentids',
                        value: content
                    });
                }
            });
            dialog.open();


        }
        //----- Public Methods -----//
    publicInterface = {

        /**
         *
         */
        init: function(pContainer, pConfig, id, pRoles, pToken, pAppId) {
            container = pContainer;
            config = pConfig;
            moduleId = id;
            roles = pRoles;
            token = pToken;
            appId = pAppId;
        },
        /**
         *
         */
        cleanUp: function() {
            publicInterface = null;
            container = null;
            dataFilesGrid = null;
            supportFilesGrid = null;
            config = null;
            moduleId = null;
            roles = null;
            token = null;
            appId = null;
         },
        /**
         *
         */
        setDataSourceContentHtml: function(data) {
            container.html(data);
            initControls();
        },
        /**
         *
         */
        setSubmissionTypeDropDownData: function(data) {
            dataFilesGrid.jqGrid('setColProp', config.CFG.SUBMISSION_TYPE_CELL, {
                editoptions: {
                    value: data
                }
            });
        },
        /**
         *
         */
        setContentTypeDropDownData: function(data) {
            supportFilesGrid.jqGrid('setColProp', config.CFG.CONTENT_TYPE_CELL, {
                editoptions: {
                    value: data
                }
            });
        },
        /**
         *
         */
        setCellAutoSuggestData: function(cellId, data) {
            var cell = container.find("#" + cellId);

            cell.autocomplete({
                source: data
            });
        },
        /**
         *
         */
        loadFileGrids: function(data) {alert('d')
            var deferred = $.Deferred();
            dataFilesGrid.on('jqGrid.gridComplete', function() {
                deferred.resolve();
            });

            supportFilesGrid.on('jqGrid.gridComplete', function() {
                deferred.resolve();
            });

            // Undocumented method for loading data in grid
            dataFilesGrid[0].p.data = data;
            supportFilesGrid[0].p.data = data;

            // Get the grid to display the data loaded
            supportFilesGrid.trigger("reloadGrid");
            dataFilesGrid.trigger("reloadGrid");

            addPointerToClickableCells();

            return deferred.promise();
        },
        setContType: function(p_cont_type) {
            cont_type = p_cont_type;
        },
        setMapperType: function(p_mapper) {
            mapper = p_mapper;
        },
        setSubType: function(p_sub_type) {
            sub_type = p_sub_type;
        },
        loadGridCell: function(data, rowId, cellName, errorInd, lerrorMsg) {
            var errorMsg = lerrorMsg;
            if (data[0].errorInd !== 0) {
                errorMsg = data[0].errorMsg;
            }
            if (errorInd !== 0) {
                errorMsg = lerrorMsg;
            }
            var deferred = $.Deferred();
              if (cellName === 'contentTypeText') {
                supportFilesGrid.jqGrid('setCell', rowId, 'contentTypeText', data[0].contentTypeText);
            } else {
                var image2 = '';
                 if (data[0].errorInd === '0' && errorInd === 0) {
                    image2 = '<span title="' + errorMsg + '" ></span>';
                    dataFilesGrid.jqGrid('setCell', rowId, 'errorMsg', '0');
                    dataFilesGrid.jqGrid('setCell', rowId, 'errorInd', image2);
                } else {
                    if (data[0].errorInd === '0' && errorInd === 0) {
                        image2 = '<span title="' + errorMsg + '" ></span>';
                        dataFilesGrid.jqGrid('setCell', rowId, 'errorMsg', '0');
                    } else {
                        if (errorInd === 0) {

                            image2 = '<span title="' + errorMsg + '" ><img title="' + errorMsg + '" style="cursor:pointer;align:center;"  id="delsplit2"  src="/acme/shared/images/exclamation_16x16.png" /></span>';
                        } else {
                            image2 = '<span title="' + errorMsg + '" ><img title="' + errorMsg + '" style="cursor:pointer;align:center;"  id="delsplit2"  src="/acme/shared/images/exclamation_16x16.png" /></span>';

                        }
                    }
                    dataFilesGrid.jqGrid('setCell', rowId, 'errorMsg', errorMsg);
                    dataFilesGrid.jqGrid('setCell', rowId, 'errorInd', image2);
                    jQuery("#jqg_data_files_grid_" + rowId).attr('checked', 'checked');
                }

    
                addPointerToClickableCells();


            }
            return deferred.promise();

        },
        /**
         *
         */
        showAttachDataSourceDialog: function(dataSourceId) {
            var promise,
                dialog,
                l_refresh,
                buttons,
                module;
            localStorage.setItem('ref', '1');
            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.CustomType);
            module = new acme.xxx.ContentUploadUtility(token, appId, {}, []); // XXX no options no roles
            buttons = {
                   //     },
                Upload: function() {
                    dialog.trigger("upload");
                }
            };
            dialog.setButtons(buttons);
            dialog.setContent(module.getContent());
            dialog.setTitle('Attach Files');
            dialog.attr('id', 'uploadutil');
            dialog.on("upload", function() {
                module.submitFileForUpload();
            });
            promise = module.getContentUploadUtility(dataSourceId, 'A');

            promise.done(function() {
                dialog.open();
            });

            dialog.on("close", function() {
                var l_refresh = localStorage.getItem('ref');
                if (l_refresh === '2') {
                    publicInterface.clearGrids();
                    $(publicInterface).trigger(config.CFG.ATTACH_FILES_COMPLETE_EVENT);
                    	    localStorage.clear();
                    $(this).dialog("destroy").remove();
                }
            });
        },
        showDeleteDataSourceDialog: function(dataSourceId) {
            var promise,
                dialog,
                module;

            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.OkCancelType);
            dialog.setContent($('<img class="' + config.CSS.QUESTION_ICON_CLASS + '" src="' + config.URL.QUESTION_ICON + '"><div class="' + config.CSS.DIALOG_MESSAGE + '">Are you sure? <br><br>This will delete all files associated with this datasource</p></div>'));

            dialog.setTitle('Delete Datasource');

              dialog.open();
            //    });

            dialog.on("ok", function() {
                $(publicInterface).trigger(config.CFG.DATA_SOURCE_DELETE);
                localStorage.setItem('ref', '2');
                dialog.trigger("close");
            });
            dialog.on("close", function() {
                $(this).dialog("destroy").remove();
            });
        },
        /**
         *
         */
        showFileNotesDialog: function(id, type) {
            var dialog,
                module,
                container,
                promise;

            container = $('<div>');
            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.CustomType);
            module = new acme.xxx.FileNotes(token, appId, {}, []); //  no options no roles

            dialog.setContent(module.getContent());
            dialog.setTitle(module.name);
            if (type === 'd') {
                dialog.setTitle("Data Source Notes");
            } else {
                dialog.setTitle(module.name);
            }
            promise = module.showFileNotes(id, type);
            promise.done(function() {
                dialog.open();
            });
            dialog.on("close", function() {
                $(this).dialog("destroy").remove();
            });
            promise.fail(function() {
                alert("Error displaying Notes dialog"); 
            });
        },
        /**
         *
         */
        showFileMapDialog: function(data) {
            var dialog,
                module,
                promise;
            var l_data = '<div id="fileItemdata"><table class="map-info ui-widget-content">' +
                '<tr class="ui-widget-header"><th>File</th><th>Path</th</tr>';
            jQuery.each(data, function(l_id, l_obj) {
                l_data = l_data + '<tr><td class="file-item-settings">' + l_obj.fileName + '</td><td class="file-item-settings">' + l_obj.fullPath + '</td></tr>';
             });

            l_data = l_data + '</table></div>';
            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.CustomType);
            dialog.setContent(l_data);

            dialog.open();
            $('.map-info tr:even').css('background-color', '#dddddd');
            dialog.on('ok', function() {});
            dialog.on("close", function() {
                $(this).dialog("destroy").remove();
            });
            dialog.setTitle('File Map for Data Source - ' + data[0].itemDataSourceId);
            //

        },
        /**
         *
         */
        showAddInterchangeDialog: function(data, html) {
            var dialog,
                module,
                container;

            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.AddCancelType);
            dialog.setContent(html);

            dialog.open();

            dialog.on('Add', function() {
                $(publicInterface).trigger(config.CFG.INTERCHANGE_EVENT);
             });
            dialog.on("close", function() {
                $(this).dialog("destroy").remove();
            });
            dialog.setTitle('Add Interchange Child');
            dialog.attr('id', 'Interchange');
            initInterchange(data);
        },
        submitForProcessing: function() {
            var i = 0;
            var rowdata = '';
            var l_uid = '';
            var l_fileName = '';
            var l_supplier = '';
            var l_errorInd = '';
            var l_errorMsg = '';
            var l_status = '';
            var l_process = null;
            var l_docNum = '';
            var l_desc = '';
            var l_submit = true;
            var l_submit2 = true;
            var l_notChecked = false;
            var l_notChecked2 = false;
            var l_prevsub = false;
            var l_title = 'Submit for Processing';
            var l_msg = '';
            var l_type = '';
            var l_cb = '';
            var l_errormsg = '';
            var l_height = 0;
            var l_button = false;
            var l_content_id = "[";
            var l_rows = dataFilesGrid.getGridParam("records");
            var l_limit = l_rows + 1;
            if (l_rows > 0) {
                for (i = 1; i < l_limit; i++) {
                    rowdata = dataFilesGrid.getRowData(i);
                    l_cb = jQuery('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + i).is(':checked') ? 1 : 0;
                    //       alert(l_cb)

                    l_uid = rowdata.contentid;
                    l_fileName = rowdata.fileName;
                    l_supplier = rowdata.supplierName;
                    l_errorInd = rowdata.errorInd;
                    l_errorMsg = rowdata.errorMsg;
                    l_status = rowdata.contentStatusText;
                    l_process = rowdata.inProcess;
                    l_docNum = rowdata.documentNum;
                    l_desc = rowdata.description;
                    l_type = rowdata.contentTypeText;
                    if (l_status === 'Active' && l_process === 'No' && l_cb) {
                        l_content_id = l_content_id + l_uid + ",";
                    }
                    if (l_cb) {
                        l_desc = jQuery.trim(l_desc);
                        l_docNum = jQuery.trim(l_docNum);
                        if (l_desc === '' || l_desc === 'null') {
                            l_errormsg = 'There is a file with a missing Description.';

                            l_submit = false;
                            break;
                        }
                        l_supplier = jQuery.trim(l_supplier);
                        if (l_supplier === '' || l_supplier === 'null') {
                            l_errormsg = 'There is a file with a missing Supplier.';
                            l_submit = false;
                            break;
                        }
                        l_errorMsg = jQuery.trim(l_errorMsg);
                        if (l_errorMsg === '0') {
                            l_errorMsg = '';
                        }
                        if (l_errorMsg !== '') {
                            l_errormsg = l_errorMsg;
                            l_submit = false;
                            break;
                        }
                        if (l_type !== 'ACES Interchange Child') {
                            if (l_docNum === '' || l_docNum === 'null') {
                                l_errormsg = 'There is a file with a missing Document Number';
                                l_submit = false;
                                break;
                            }
                        }
                        if (l_process === 'Yes') {
                            l_errormsg = 'Selected File(s) Already Submitted.';
                            l_prevsub = true;
                            l_submit = false;
                            break;
                        }
                    }
                }
            }
            if (l_rows > 0) {
                for (i = 1; i < l_limit; i++) {
                    rowdata = dataFilesGrid.getRowData(i);
                    l_cb = $('#jqg_' + config.CSS.DATA_FILES_GRID + '_' + moduleId + '_' + i).is(':checked') ? 1 : 0;


                    l_uid = rowdata.contentid;
                    l_fileName = rowdata.fileName;
                    l_supplier = rowdata.supplierName;
                    l_errorInd = rowdata.errorInd;
                    l_errorMsg = rowdata.errorMsg;
                    l_status = rowdata.contentStatusText;
                    l_process = rowdata.inProcess;
                    l_docNum = rowdata.documentNum;
                    l_desc = rowdata.description;
                    l_type = rowdata.contentTypeText;
                    if (l_cb === 0 && l_process === 'No') {
                        l_notChecked = true;
                        l_desc = jQuery.trim(l_desc);
                        l_docNum = jQuery.trim(l_docNum);
                        l_errorMsg = jQuery.trim(l_errorMsg);

                        if (l_desc === '' || l_desc === 'null') {
                            l_errormsg = 'There is a file with a missing Description.';
                            l_submit2 = false;
                            break;
                        }
                        l_supplier = jQuery.trim(l_supplier);
                        if (l_supplier === '' || l_supplier === 'null') {
                            l_errormsg = 'There is a file with a missing Supplier.';
                            l_submit2 = false;
                            break;
                        }
                        l_errorMsg = jQuery.trim(l_errorMsg);
                        if (l_errorMsg === '0') {
                            l_errorMsg = '';
                        }
                        if (l_errorMsg !== '') {
                            l_errormsg = l_errorMsg;
                            l_submit2 = false;
                            break;
                        }
                        if (l_type !== 'ACES Interchange Child') {
                            if (l_docNum === '' || l_docNum === 'null') {
                                l_errormsg = 'There is a file with a missing Document Number.';
                                l_submit2 = false;
                                break;
                            }
                        }
                    }
                    if (l_submit2 === false) {
                        l_notChecked2 = true;
                    }
                }
            }
            l_errormsg = '';

            var l_len = l_content_id.length - 1;
            l_content_id = l_content_id.substring(0, l_len);

            if (l_content_id !== '') {
                l_content_id = l_content_id + "]";
                if (l_submit && l_submit2 && l_notChecked) {
                    l_title = 'Submit for Processing';
                    l_msg = 'Are you sure you want to submit the selected files?<br><br>One or more files have not been selected!';
                    showProcessDialog(l_title, l_msg, '0', l_errormsg, l_content_id);
                } else if (l_submit && l_submit2) {
                    l_title = 'Submit for Processing';
                    //    l_msg = 'There are currently no active files to submit!';

                    if (l_content_id.length > 1) {
                        l_title = 'Submit for Processing';
                        l_errormsg = 'Are you sure you want to submit the selected files?';
                        showProcessDialog(l_title, l_msg, '0', l_errormsg, l_content_id);
                    } else {
                        l_title = 'Submit for Processing - Error';
                        l_errormsg = 'There are currently no active files to submit!';
                        showProcessDialog(l_title, l_msg, '1', l_errormsg);
                    }
                } else if (l_submit === false && l_prevsub === false) {
                    l_title = 'Submit for Processing - Error';
                    l_msg = 'One or more selected files are invalid!<br><br>';
                    showProcessDialog(l_title, l_msg, '1', l_errormsg);
                } else if (l_submit && l_notChecked && l_submit2 === false && l_prevsub === false) {
                    l_title = 'Submit for Processing';
                    l_msg = 'Are you sure you want to submit the selected files?<br><br>One or more un-selected files are invalid!<br><br>';
                    showProcessDialog(l_title, l_msg, '0', l_errormsg, l_content_id);
                }
                if (l_submit === false && l_prevsub === true) {
                    l_title = 'Submit for Processing - Error';
                    l_msg = 'One or more selected File(s) Already Submitted.<br><br>';
                    showProcessDialog(l_title, l_msg, '0', l_errormsg, l_content_id);
                }


            }
        },
        /**
         *
         */
        showFilePropertiesDialog: function(contentId, dataSourceId) {
            var dialog,
                module,
                promise;
            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.CustomType);
            module = new acme.xxx.FileProperties(token, appId, {}, []); // XXX no options no roles

            promise = module.getFileProperties(contentId, dataSourceId);
            dialog.setContent(module.getContent());
            dialog.setTitle(module.name);
            //
            promise.done(function() {
                dialog.open();
            }).fail(function() {
            });
        },
        /**
         *
         */
        getSelectedContentIds: function() {
            var ids = [];

            ids = ids.concat(getSelectedDataFileContentId());
            ids = ids.concat(getSelectedSupportFileContentId());

            return ids;
        },
        clearGrids: function() {
            clearSupportFilesGridData();
            clearDataFilesGridData();
            toggleToolbarButtons();
        },
        showDeleteFilesConfirmationDialog: function() {
            var dialog,
                deferred = $.Deferred();

            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.OkCancelType);

            dialog.setTitle("Confirm File(s) Delete");
            dialog.setContent($('<img class="' + config.CSS.QUESTION_ICON_CLASS + '" src="' + config.URL.QUESTION_ICON + '"><div class="' + config.CSS.DIALOG_MESSAGE + '"><p>Are you Sure?</p><p>This will delete the selected files.</p></div>'));
            dialog.on('ok', function() {
                deferred.resolve();
            });
            dialog.open();

            return deferred.promise();
        },
        showUpdateDeniedDialog: function(data) {
            var dialog,
                deferred = $.Deferred();

            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.BasicType);

            dialog.setTitle("Change Description");
            dialog.setContent($('<img class="' + config.CSS.QUESTION_ICON_CLASS + '" src="' + config.URL.QUESTION_ICON + '"><div class="' + config.CSS.DIALOG_MESSAGE + '">' + data + '<br>This description can only be changed in Supplier Admin</p></div>'));
            dialog.on('ok', function() {
                deferred.resolve();
            });
            dialog.open();

            return deferred.promise();
        },
        showUpdateErrorDialog: function(data, title) {
            var dialog,
                deferred = $.Deferred();

            dialog = new acme.xxx.DialogFactory.factory(acme.xxx.DialogFactory.ModalType);
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