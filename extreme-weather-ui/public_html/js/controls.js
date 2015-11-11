var initControls = function (EW) {
    // Disable camera control when hovering the interface inputs with the mouse
    $('.dg').hover(function () {
        EW.cameraControl.enabled = false;
    }, function () {
        EW.cameraControl.enabled = true;
    });

    $('body').keydown(function (ev) {
        switch (ev.which) {
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

var addControlGui = function (controlObject, EW) {
    var gui = new dat.GUI();
    gui.add(controlObject, 'rotationSpeed', -0.01, 0.01);
    gui.add(controlObject, 'days', 229, 243).step(1).onFinishChange(function (newValue) {
        DateInfo.refresh(newValue);
        populatePointCloud(EW.meshPoints, EW.jsonData, newValue);
    });
    gui.add(controlObject, 'nextCamera');
    gui.add(controlObject, 'toggleScreen');
};