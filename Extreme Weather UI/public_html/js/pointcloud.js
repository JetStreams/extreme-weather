var createPointCloud = function (scene) {
    //the group to add points
    var group = new THREE.Group();
    group.name = 'points';
    scene.add(group);

    var convertFromSpherical = function (a1, a2) {
        var radius = 15 + 0.2; //radius of our earth model is 15

        var phi = (90 - a2) * (Math.PI / 180);
        var theta = (a1 + 180) * (Math.PI / 180);

        var x = -((radius) * Math.sin(phi) * Math.cos(theta));
        var z = ((radius) * Math.sin(phi) * Math.sin(theta));
        var y = ((radius) * Math.cos(phi));

        return new THREE.Vector3(x, y, z);
    };

    $.getJSON("res/data/sample_082010.json", function (data) {
        var col = 0xff0000;
        var material = new THREE.LineBasicMaterial({ color: col });
        
        for (var i in data) {
            var c = data[i];
            var a1 = c[0];
            var a2 = c[1];
            var dir = c[2];
            var mag = (c[3] - 18) / 5;

            var coor1 = convertFromSpherical(a1, a2);
            var coor2 = convertFromSpherical(a1 + 2 * Math.cos(dir), a2 + 2 * Math.sin(dir));
            var geometry = new THREE.Geometry();
            geometry.vertices.push(coor1, coor2);
            var line = new THREE.Line( geometry, material );

            group.add(line);
        }
    });

    return group;
};
