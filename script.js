//Generate random colors
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}


$(document).ready(function() {
    // Variable to maintain undo action
    var actions = [];
    var undoButton = $('#undo-action');
    var addRowButton = $('#add-row-action');

    undoButton.on('click', function() {
        if (actions.length > 0) {
            var action = actions.pop();
            var sourceBox = action.source.find('.box');
            var destinationBox = action.destination.find('.box');

            // Swap the boxes back
            sourceBox.detach().appendTo(action.destination);
            destinationBox.detach().appendTo(action.source);

            updateUndoButtonLabel();

            if (actions.length === 0) {
                undoButton.prop('disabled', true);
            }
        }
    });

    addRowButton.on('click', function() {
        var newRow = $('<tr></tr>');
        var boxLength = $('.box').length + 1;

        for (var i = 0; i < 3; i++) {
            var boxNumber = (boxLength + i) * 100;
            var boxColor = getRandomColor();

            var newCell = $('<td></td>');
            var newBox = $('<div></div>').attr('id', 'box-' + boxNumber).addClass('box').text(boxNumber).css('background-color', boxColor);

            newBox.draggable({
                opacity: 0.5,
                revert: 'invalid',
                start: function(event, ui) {
                    $(this).fadeTo(200, 0.5);
                },
                stop: function(event, ui) {
                    $(this).fadeTo(200, 1);
                }
            });

            newCell.append(newBox);
            newRow.append(newCell);
        }

        $('#table').append(newRow);

        $('td').droppable({
            drop: function(event, ui) {
                var sourceBox = $(ui.draggable);
                var destinationBox = $(this).find('.box');

                if (destinationBox.length === 1) {
                    // Swap the boxes
                    var sourceCell = sourceBox.parent('td');
                    var destinationCell = destinationBox.parent('td');

                    sourceBox.detach().appendTo(destinationCell);
                    destinationBox.detach().appendTo(sourceCell);
                    sourceBox[0].style.left = null;
                    sourceBox[0].style.top = null;

                    $('td').css('padding', '');

                    // Add animation to the movement of the destination box
                    destinationBox.fadeOut(500, function() {
                        destinationBox.fadeIn(500);
                    });

                    actions.push({
                        source: sourceCell,
                        destination: destinationCell
                    });

                    updateUndoButtonLabel();
                    undoButton.prop('disabled', false);
                }
            }
        });
    });

    // Updating the label buttons for better understanding to the user
    function updateUndoButtonLabel() {
        if (actions.length > 0) {
            var lastAction = actions[actions.length - 1];
            var sourceNumber = lastAction.source.find('.box').text();
            var destinationNumber = lastAction.destination.find('.box').text();
            undoButton.text('Undo Swap ' + sourceNumber + ' and ' + destinationNumber);
        } else {
            undoButton.text('Undo');
        }
    }

    addRowButton.click();
    addRowButton.click();
    addRowButton.click();
});