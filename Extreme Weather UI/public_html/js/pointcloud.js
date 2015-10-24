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
        var col = 0xFFFFFF;
        var material = new THREE.MeshBasicMaterial({ color: col });
        material.blending = THREE.AdditiveBlending;
        
        for (var i in data) {
            var c = data[i];
            var a1 = c[0];
            var a2 = c[1];
            var dir1 = c[2];
            var dir2 = c[2] - Math.PI / 2;
            var dir3 = c[2] + Math.PI / 2;
            var mag = (c[3] - 15) / 7;

            var c1 = convertFromSpherical(a1 + mag * Math.cos(dir1), a2 + mag * Math.sin(dir1));
            var c2 = convertFromSpherical(a1 + mag * Math.cos(dir2) * 0.1, a2 + mag * Math.sin(dir2) * 0.1);
            var c3 = convertFromSpherical(a1 + mag * Math.cos(dir3) * 0.1, a2 + mag * Math.sin(dir3) * 0.1);
            var geometry = new THREE.Geometry();
            geometry.vertices.push(c1, c2, c3); 
            geometry.faces.push(new THREE.Face3(0, 2, 1));

            var mesh = new THREE.Mesh( geometry, material );

            group.add(mesh);
        }
    });

    return group;
};
