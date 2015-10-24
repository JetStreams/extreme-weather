// add background using a camera
var createComposer = function (renderer, renderPass) {
    var cameraBG = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
    cameraBG.position.z = 50;
    var sceneBG = new THREE.Scene();

    var texloader = new THREE.TextureLoader();
    var materialColor = new THREE.MeshBasicMaterial({map: texloader.load("res/textures/planets/starry_background.jpg"), depthTest: false});
    var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialColor);
    bgPlane.position.z = -100;
    bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
    sceneBG.add(bgPlane);

    // setup the composer steps
    // first render the background
    var bgPass = new THREE.RenderPass(sceneBG, cameraBG);
    // next render the scene (rotating earth), without clearing the current output

    // finally copy the result to the screen
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    // add these passes to the composer
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(bgPass);
    composer.addPass(renderPass);
    composer.addPass(effectCopy);
    return composer;
};

