function initRenderer() {

    var renderer;
    var scene;
    var camera;
    var control;
    var stats;
    var cameraControl;

    // background stuff
    var composer;

    // set some camera attributes
    var VIEW_ANGLE = 45,
            ASPECT = window.innerWidth / window.innerHeight,
            NEAR = 0.1,
            FAR = 10000;

    scene = new THREE.Scene();

    // create a WebGL renderer, camera
    // and a scene
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1.0);
    renderer.shadowMap.enabled = true;

    // attach the render-supplied DOM element
    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    $('#container').append(renderer.domElement);

    camera =
            new THREE.PerspectiveCamera(
                    VIEW_ANGLE,
                    ASPECT, NEAR, FAR);
    camera.position.x = 35;
    camera.position.y = 0;
    camera.position.z = 23;
    camera.lookAt(scene.position);
    cameraControl = new THREE.OrbitControls(camera);

    // add the camera to the scene
    scene.add(camera);
    //==============================================================

    createGlobe(scene);

    //==============================================================

    var renderPass = new THREE.RenderPass(scene, camera);
    renderPass.clear = false;
    composer = createComposer(renderer, renderPass);

    //==============================================================
    var addStatsObject = function () {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.bottom = '0px';

        document.body.appendChild(stats.domElement);
    };

    var addControlGui = function (controlObject) {
        var gui = new dat.GUI();
        gui.add(controlObject, 'rotationSpeed', -0.1, 0.1);
    };

    // setup the control object for the control gui
    control = new function () {
        this.rotationSpeed = 0.001;
    };
    addControlGui(control);

    // draw!
    var render = function () {
        stats.update();
        cameraControl.update();

        var rotSpeed = control.rotationSpeed;
        var earth = scene.getObjectByName('earth');
        var clouds = scene.getObjectByName('clouds');

        earth.rotation.y += rotSpeed;
        clouds.rotation.y += rotSpeed;

        // and render the scene, renderer shouldn't autoclear, we let the composer steps do that themselves
        // rendering is now done through the composer, which executes the render steps
        renderer.autoClear = false;
        composer.render();

        requestAnimationFrame(render);
    };

    var onResize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    addStatsObject();
    render();
    window.addEventListener('resize', onResize, false);
}
