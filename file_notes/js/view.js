// Setup APP1.FileNotes name space
namespace('APP1.FileNotes.View');

APP1.FileNotes.View = function(config, container) {
    "use strict";

    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof APP1.FileNotes.View)) {
        return new APP1.FileNotes.View(config, container);
    }

    var publicInterface,
        controller,
        notesTextArea,
        buttonContainer,
        addNoteButton,
        clearNoteButton;

    /**
     *
     */
    function initControls() {
        notesTextArea = container.find("." + config.CSS_NOTES_AREA);
        buttonContainer = container.find("." + config.CSS_NOTES_BUTTONS_CONTAINER);
        addNoteButton = container.find("." + config.CSS_ADD_BUTTON);
        clearNoteButton = container.find("." + config.CSS_CLEAR_BUTTON);

        addNoteButton.button();
        clearNoteButton.button();

        /*
         * Event deligation to the containing div for the button toolbar.
         * This pattern reduces the number of event handerlers.
         */
        container.on("click", "button", function(event) {
            // Prevent event propogation or "bubbling up"
            event.preventDefault();

            var classList = $(event.currentTarget).attr('class'),
                classArray = classList.split(" "),
                uniqueClass;
            if (classArray.length >= 2) {
                // Second class in list is the unique class for the button
                uniqueClass = classArray[1].trim();
            }
            $(publicInterface).trigger(config.NOTE_BAR_CLICK_EVENT, {
                button: uniqueClass
            });
        });

    }

    function addCommentsToContainer(p_obj) {
        var l_date = APP1.Formatter.formatUTCDateTime(p_obj.receiveDate);
        return '<div class="ui-widget-content ui-corner-all comment">' +
            '<div>' + p_obj.text + '</div>' +
            '<div class="comment-footer"><span>Posted by: ' + p_obj.userAdded + '</span><span> on ' + l_date + '</span></div>' +
            '</div>';
    }




    //----- Public Methods -----//
    publicInterface = {

        /**
         *
         */
        cleanUp: function() {
            publicInterface = null;
            controller = null;
            notesTextArea = null;
            buttonContainer = null;
            addNoteButton = null;
            clearNoteButton = null;
        },
        /**
         *
         */
        setController: function(controllerInterface) {
            controller = controllerInterface;
        },
        /**
         *
         */
        setFileNotesHtml: function(data) {

            container.html(data);
            //    console.log(container)
            initControls();
        },
        clearNotesTextArea: function() {
            notesTextArea.val('');
            //    $('.comment-text-area').val('');
        },

        buildCommentContainer: function(p_data) {
            container.find('.comment_list').html('');
            //    $('#comment-text-area').val('');

            var l_html = '';
            var l_cnt = p_data.totalCount;
            if (l_cnt > 0) {
                for (var i = 0; i < l_cnt; i++) {
                    l_html += addCommentsToContainer(p_data.items[i]);
                }

            }
            container.find('.comment_list').append(l_html);
        },
        showUpdateErrorDialog: function(data, title) {
            var dialog,
                deferred = $.Deferred();

            dialog = new APP1.DialogFactory.factory(APP1.DialogFactory.ModalType);

            if (title) {
                dialog.setTitle(title);
            } else {
                dialog.setTitle("Update Error");
            }
            dialog.setContent($('<img class="' + config.QUESTION_ICON_CLASS + '" src="' + config.QUESTION_ICON + '"><div class="' + config.DIALOG_MESSAGE + '">' + data.responseText + '</p></div>'));
            dialog.on('ok', function() {
                deferred.resolve();
            });
            dialog.open();

            return deferred.promise();
        }
    };

    return publicInterface;
};