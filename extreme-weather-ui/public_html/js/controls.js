var initControls = function (EW) {
  // Disable camera control when hovering the interface inputs with the mouse
  $('.dg').hover(function() {
    EW.cameraControl.enabled = false;
  }, function() {
    EW.cameraControl.enabled = true;
  });

  $('body').keydown(function(ev) {
    switch(ev.which) {
      // space bar toggles camera rotation
      case 32:
        EW.rotationEnabled = !EW.rotationEnabled;
        break;

      // enter key changes camera
      case 13:
        EW.switchCamera();
        break;
    }
  });
};
