$(document).ready(function() {
  // Variable to maintain undo action
  var actions = [];

  $('.box').draggable({
    opacity: 0.5,
    revert: 'invalid',
    start: function(event, ui) {
      $(this).fadeTo(200, 0.5);
    },
    stop: function(event, ui) {
      $(this).fadeTo(200, 1);
    }
  });

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

        // Add animation to the movement of the destination box
        destinationBox.fadeOut(500, function() {
          destinationBox.fadeIn(500);
        });

        // Store the action for undo
        actions.push({
          source: sourceCell,
          destination: destinationCell
        });
      }
    }
  });

  $('#undo-action').on('click', function() {
    if (actions.length > 0) {
      var action = actions.pop();
      var sourceBox = action.source.find('.box');
      var destinationBox = action.destination.find('.box');

      // Swap the boxes back
      sourceBox.detach().appendTo(action.destination);
      destinationBox.detach().appendTo(action.source);
    }
  });
});
