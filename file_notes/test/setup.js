// List of dependant css files for this module
var cssFiles = [
    "/activant/jquery/ui/jquery-ui-1.10.3.custom/css/redmond/jquery-ui-1.10.3.custom.min.css",
    "/epicor/shared/file_notes/css/fn.css"];

// List of dependant JavaScript files for this module
var jsFiles = [
    "/activant/jquery/core/jquery-1.9.1.min.js",
    "/epicor/utils/js/epicor.js",
    "/epicor/shared/file_notes/js/module.js",
    "/epicor/shared/file_notes/js/controller.js",
    "/epicor/shared/file_notes/js/model.js",
    "/epicor/shared/file_notes/js/view.js",
    "/activant/jquery/ui/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js"];

// Load Style Sheet files
for (var i = 0; i < cssFiles.length; i++) {
    document.write("<link type='text/css' rel='stylesheet' href='" + cssFiles[i] + "'></link>");
}

// Load JavaScript files
for (var i = 0; i < jsFiles.length; i++) {
    document.write("<script type='text/javascript' src='" + jsFiles[i] + "'></script>");
}

// Wait until all of the css and scipts have been loaded
window.onload = function() {
    
    // Overall try catch for the file notes module
    try {
        
        // Create a new FileNotes module
        var module = new EPICOR.IMR.FileNotes($(".test_container"));
        
        document.title = module.name;
        
        module.on("complete", function() {
            console.log("Show File Notes Complete!");
        });
        
        module.showFileNotes(123);
        
        // On unload clean up from module
        $(window)
            .unbind('unload')
            .bind('unload', function () {
                
                // Perfrom module cleanup
                module.cleanUp();
                
                // Remove all css files added for this application
                for (var i = 0; i < cssFiles.length; i++) {
                    $('link[href="' + cssFiles[i] + '"]').remove();
                }
                
                // Remove all JavaScript file for this application
                for (var i = 0; i < jsFiles.length; i++) {
                    $('script[src="' + jsFiles[i] + '"]').remove();
                }
            });
    } catch(e) {
        
        // Log the error to the console also would like to log to server
        console.log(e.name + ": " + e.message);
    }
}