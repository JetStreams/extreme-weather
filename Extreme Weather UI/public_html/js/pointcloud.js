var createPointCloud = function (scene) {
    //the group to add points
    var group = new THREE.Group();
    group.name = 'points';
    scene.add(group);

    var convert = function (coordinate) {
        var radius = 15; //radius of our earth model

        var phi = (90 - coordinate.x) * (Math.PI / 180);
        var theta = (coordinate.y + 180) * (Math.PI / 180);

        var x = -((radius) * Math.sin(phi) * Math.cos(theta));
        var z = ((radius) * Math.sin(phi) * Math.sin(theta));
        var y = ((radius) * Math.cos(phi));

        return {'x': x, 'y': y, 'z': z};
    };

    $.getJSON("res/data/sample_082010.json", function (data) {
        for (var i = 0, len = data.length; i < len; i++) {
            var c = data[i];

            var geometry = new THREE.SphereGeometry(0.1, 10, 10);

            var col = 0xff0000;
            var material = new THREE.MeshBasicMaterial({color: col});

            var coor = convert({'x': c[0], 'y': c[1]});
            geometry.translate(coor.x, coor.y, coor.z);

            var sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);
        }
    });

        var coor = convert({'x': a, 'y': b});
        geometry.translate(coor.x, coor.y, coor.z);

        var sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);
    }
    scene.add(group);

    return group;
};
