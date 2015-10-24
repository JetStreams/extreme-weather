var initControls = function () {
  // Disable camera control when hovering the interface inputs with the mouse
  $('.dg').hover(function() {
    EW.cameraControl.enabled = false;
  }, function() {
    EW.cameraControl.enabled = true;
  });

  // Toggle rotation when pressing the space bar
  $('body').keydown(function(ev) {
    if(ev.which == 32) {
      EW.rotationEnabled = !EW.rotationEnabled;
    }
  });
  
  $('#maximize').click(function(ev){
      $(document).fullScreen(true)
  });
};
