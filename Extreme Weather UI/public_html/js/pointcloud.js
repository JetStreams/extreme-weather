var createPointCloud = function (scene) {


    var convert = function (coordinate) {
        var r = 15; //radius of our earth model

        var a = coordinate.x;
        var b = coordinate.y;

        var x = r * Math.sin(a) * Math.cos(b);
        var y = r * Math.sin(a) * Math.sin(b);
        var z = r * Math.cos(a);
        return {'x': x, 'y': y, 'z': z};
    };

    var group = new THREE.Group();

    for (var i = 0; i < 200; i++) {
        var geometry = new THREE.SphereGeometry(0.1, 10, 10);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000});

        var a = Math.random() * Math.PI;
        var b = Math.random() * Math.PI * 2;

        var coor = convert({'x': a, 'y': b});
        console.log(coor);
        geometry.translate(coor.x, coor.y, coor.z);

        var sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);
    }
    group.name = 'points';
    scene.add(group);
};
