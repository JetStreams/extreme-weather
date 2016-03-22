function buildCloudPoints(source, scene, EW) {
    $.getJSON(source, function (data) {
        EW.jsonData = data;

        EW.meshPoints = createPointCloud(scene, EW.jsonData);
    });
}

//read available camera positions
function readCameraPositions(source, EW) {
    var items = [];
    $.getJSON(source, function (data) {
        $.each(data, function (key, val) {
            items.push(val);
        });
    });
    EW.positions = items;
}

    