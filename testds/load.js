var i,
    cssFiles,
    jsFiles;
            
// List of dependant css files for this module
cssFiles = [
    "/acme/libs/jquery/ui/jquery-ui-1.10.3.custom/css/redmond/jquery-ui-1.10.3.custom.min.css",
    "/acme/libs/jquery.jqGrid-4.6.0/css/ui.jqgrid.css",
    "/acme/libs/jquery.jqGrid-4.6.0/plugins/acme.jqGrid.search.3.0.css"];
   
// List of dependant js files for the module
jsFiles = [
    "/acme/libs/jquery/core/jquery-2.1.1.min.js",
   //  "/acme/libs/jquery/core/jquery-1.10.2.min.js",
    "/acme/libs/jquery/ui/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js",
    "/acme/libs/jQuery-File-Upload-9.0.1/js/jquery.fileupload.js",
    "/acme/libs/jQuery-File-Upload-9.0.1/js/jquery.fileupload-ui.js",
    "/acme/libs/jQuery-File-Upload-9.0.1/js/jquery.fileupload-process.js",
    "/acme/jquery/plugins/tree/ui-tree-widget-1.0/js/tree.min.js",
    "/acme/libs/jquery.jqGrid-4.6.0/js/i18n/grid.locale-en.js",
    "/acme/libs/jquery.jqGrid-4.6.0/js/minified/jquery.jqGrid.min.js",
    "/acme/libs/jquery.jqGrid-4.6.0/plugins/activant.jqGrid.search.3.0.js",
    "/acme/utils/js/acme.js",
    "/acme/utils/js/formatter.js",
    "/acme/utils/js/dialog-factory.js",
    "js/module.js",     // XXX integrating app with main portal
    "js/controller.js", // XXX integrating app with main portal
    "js/model.js",      // XXX integrating app with main portal
    "js/view.js",       // XXX integrating app with main portal
    "/dev/acme/shared/base_model/base-model.js"];
 
// Load Style Sheet files
for (i = 0; i < cssFiles.length; i++) {
    document.write("<link type='text/css' rel='stylesheet' href='" + cssFiles[i] + "'></link>");
}

// Load JavaScript files
for (i = 0; i < jsFiles.length; i++) {
    document.write("<script type='text/javascript' src='" + jsFiles[i] + "'></script>");
}



// Wait until all of the css and scipts have been loaded
window.onload = function() {
    var DataSourceContent = new acme.IMR.DataSourceContent();
}