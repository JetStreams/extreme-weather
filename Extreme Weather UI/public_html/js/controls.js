var initControls = function () {
  $('.dg').hover(function() {
    EW.cameraControl.enabled = false;
  }, function() {
    EW.cameraControl.enabled = true;
  });
};
