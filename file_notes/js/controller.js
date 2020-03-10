// Setup APP1.FileNotes name space
namespace('APP1.FileNotes.Controller');


APP1.FileNotes.Controller = function(config, model, view) {
    "use strict";

    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof APP1.FileNotes.Controller)) {
        return new APP1.FileNotes.Controller(config, model, view);
    }

    var viewInterface,
        publicInterface,
        id,
        caller;

    function handleToolBarClick(event, data) {
            var promise;
            var deferred = $.Deferred();
            switch (data.button) {
                case config.CSS_NOTES_CLEAR_BUTTON:
                    view.clearNotesTextArea();
                    break;
                case config.CSS_NOTES_POST_BUTTON:
                    var text = $('.comment-text-area').val();
                    promise = model.addNote(id, text, caller);

                    promise.done(function() {
                            model.getFileNotesData(id, caller)
                                .done(function(uploadData) {
                                    view.buildCommentContainer(uploadData);
                                });

                            promise.done(function() {
                                deferred.resolve();
                            });

                        })
                        .fail(function() {
                            //          view.showUpdateErrorDialog(data,'Error adding Note');
                            deferred.reject();
                        });
                    promise.fail(function(data) {
                        view.showUpdateErrorDialog(data, 'Error adding Note');
                    });
                    view.clearNotesTextArea();
                    break;

                    // Default do nothing
            }
        }
        // Public Interface - any methods defined here should be well documented
    publicInterface = {
        /**
         *
         */
        init: function() {
            var promise;
            $(view).on(config.NOTE_BAR_CLICK_EVENT, handleToolBarClick);
        },

        showFileNotes: function(Id, Caller1) {
            id = Id;
            caller = Caller1;
            var deferred = $.Deferred();
            var promise;
            promise = model.getDataFileNotesHtml();

            promise.done(function(html) {
                view.setFileNotesHtml(html);
            });
            model.getFileNotesData(Id, caller)
                .done(function(uploadData) {
                    view.buildCommentContainer(uploadData);
                })
                .fail(function() {
                    deferred.reject();
                });

            promise.done(function() {
                deferred.resolve();
            });
            return deferred;
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
   
    // Set the view interfaces for the controller in the view object
    // view.setController(viewInterface);
    // View's interface to the controller
    viewInterface = {
        // No controller methods required on the view interface
    };

    return publicInterface;
};