var createStars = function (scene) {
    var loadTexture = function (path) {
        var texloader = new THREE.TextureLoader();
        return texloader.load(path);
    };

    var material = new THREE.MeshBasicMaterial();
    material.map = loadTexture("res/textures/galaxy_starfield.png");
    material.side = THREE.BackSide;

    var geometry = new THREE.SphereGeometry(100, 60, 60);
    var mesh = new THREE.Mesh(geometry, material);
    
    scene.add(mesh);

    return mesh;
};

