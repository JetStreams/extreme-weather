var createPointCloud = function (scene) {
    //the group to add points
    var group = new THREE.Group();
    group.name = 'points';
    scene.add(group);

    var convert = function (coordinate) {
        var r = 15; //radius of our earth model

        var a = coordinate.x/180 * Math.PI;
        var b = coordinate.y/180 * Math.PI;

        var x = r * Math.cos(a) * Math.cos(b);
        var y = r * Math.cos(a) * Math.sin(b);
        var z = r * Math.sin(a);
        return {'x': x, 'y': y, 'z': z};
    };

    $.getJSON("res/data/sample_082010.json", function (data) {
        for (var i = 0, len = data.length; i < len; i++) {
            var c = data[i];
            
            var geometry = new THREE.SphereGeometry(0.1, 10, 10);
            var material = new THREE.MeshBasicMaterial({color: 0xff0000});

            var coor = convert({'x': c[0], 'y': c[1]});
            geometry.translate(coor.x, coor.y, coor.z);

            var sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);
        }
    });

};
