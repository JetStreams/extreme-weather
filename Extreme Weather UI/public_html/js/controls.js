var initControls = function () {
  $('.dg').hover(function() {
    EW.cameraControl.enabled = false;
  }, function() {
    EW.cameraControl.enabled = true;
  });

  $('body').keydown(function(ev) {
    if(ev.which == 32) {
      EW.rotationEnabled = !EW.rotationEnabled;
    }
  });
};
