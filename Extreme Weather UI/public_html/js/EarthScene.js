var createGlobe = function (scene) {

    var loadTexture = function (path) {
        var texloader = new THREE.TextureLoader();
        return texloader.load(path);
    };

    var createMaterial = function (path) {
        var material = new THREE.MeshPhongMaterial();
        material.map = loadTexture(path);
        return material;
    };

    var createEarthMaterial = function () {
        var material = createMaterial("res/textures/planets/earthmap4k.jpg");
        material.normalMap = loadTexture("res/textures/planets/earth_normalmap_flat4k.jpg");
        material.normalScale = new THREE.Vector2(0.5, 0.7);
        material.specularMap = loadTexture("res/textures/planets/earthspec4k.jpg");
        material.specular = new THREE.Color(0x262626);
        return material;
    };

    var sphereGeometry = new THREE.SphereGeometry(15, 60, 60); // 6371km = 15 units
    var sphereMaterial = createEarthMaterial();
    var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = 'earth';
    scene.add(earthMesh);

    //-------------------------------------------------------------------------
    var cloudGeometry = new
            THREE.SphereGeometry(sphereGeometry.parameters.radius * 1.01,
                    sphereGeometry.parameters.widthSegments,
                    sphereGeometry.parameters.heightSegments);
    var cloudMaterial = createMaterial("res/textures/planets/fair_clouds_4k.png");
    cloudMaterial.transparent = true;
    var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.name = 'clouds';
    scene.add(cloudMesh);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.x = 400;
    directionalLight.position.y = 0;
    directionalLight.position.z = 0;
    directionalLight.name = 'directional';
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    
    var axis = new THREE.AxisHelper(20);
    scene.add(axis);
};

