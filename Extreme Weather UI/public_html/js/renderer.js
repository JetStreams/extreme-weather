var EW = {
  camera: null,
  cameraControl: null,
  cameraId: 0,
  meshEarth: null,
  meshPoints: null,
  renderer: null,
  rotationEnabled: true,
  rotationMultiplier: 1
};
EW.webglAvailable = function() {
  try {
    var canvas = document.createElement( 'canvas' );
    return !!( window.WebGLRenderingContext && (
      canvas.getContext( 'webgl' ) ||
        canvas.getContext( 'experimental-webgl' ) )
             );
  } catch ( e ) {
    return false;
  }
};
EW.onResize = function() {
  EW.camera.aspect = window.innerWidth / window.innerHeight;
  EW.camera.updateProjectionMatrix();
  EW.renderer.setSize(window.innerWidth, window.innerHeight);
}
EW.switchCamera = function() {
  var pos = [
    { x: 15, y: 35, z:0 },
    { x: 15, y: 17, z:0 },
    { x: 35, y: 35, z:0 }
  ];

  new TWEEN
    .Tween(EW.camera.position)
    .to(pos[EW.cameraId++ % pos.length], 5000)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start(); 
} 

function initRenderer() {

    var scene;
    var camera;
    var control;
    var stats;

    // background stuff
    var composer;

    // set some camera attributes
    var VIEW_ANGLE = 45,
            ASPECT = window.innerWidth / window.innerHeight,
            NEAR = 0.1,
            FAR = 10000;

    scene = new THREE.Scene();

    // create a renderer, camera and a scene
    if ( EW.webglAvailable() ) {
      EW.renderer = new THREE.WebGLRenderer();
    } else {
      EW.renderer = new THREE.CanvasRenderer();
    }
    EW.renderer.setSize(window.innerWidth, window.innerHeight);
    EW.renderer.setClearColor(0x000000, 1.0);
    EW.renderer.shadowMap.enabled = true;

    // attach the render-supplied DOM element
    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    $('#container').append(EW.renderer.domElement);

    EW.camera = new THREE.PerspectiveCamera(
                    VIEW_ANGLE,
                    ASPECT, NEAR, FAR);
    EW.camera.position.x = 35;
    EW.camera.position.y = 35;
    EW.camera.position.z = 0;
    EW.camera.lookAt(scene.position);
    EW.cameraControl = new THREE.OrbitControls(EW.camera);
    EW.cameraControl.target.z = 10;

    // add the camera to the scene
    scene.add(EW.camera);
    //==============================================================

    EW.meshEarth = createGlobe(scene);

    //==============================================================

    EW.meshPoints = createPointCloud(scene);

    //==============================================================

    var renderPass = new THREE.RenderPass(scene, EW.camera);
    renderPass.clear = false;
    composer = createComposer(EW.renderer, renderPass);

    //==============================================================
    var addStatsObject = function () {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.bottom = '0px';

        document.body.appendChild(stats.domElement);
    };

    //==============================================================
    var addControlGui = function (controlObject) {
        var gui = new dat.GUI();
        gui.add(controlObject, 'rotationSpeed', -0.01, 0.01);
        gui.add(controlObject, 'time', -0.1, 0.1);
    };

    // setup the control object for the control gui
    control = new function () {
        this.rotationSpeed = 0.001;
        this.time = 0;
    };
    addControlGui(control);

    //==============================================================
    // draw!
    var render = function (time) {
        stats.update();
        EW.cameraControl.update();

        // Slow down or speed up rotation
        if(EW.rotationEnabled) {
          EW.rotationMultiplier = Math.min(EW.rotationMultiplier + 0.05, 1);          
        } else {
          EW.rotationMultiplier = Math.max(EW.rotationMultiplier - 0.05, 0);
        }
        var rotSpeed = control.rotationSpeed * EW.rotationMultiplier;

        EW.meshEarth.rotation.y += rotSpeed;
        EW.meshPoints.rotation.y += rotSpeed;


        // and render the scene, renderer shouldn't autoclear, we let the composer steps do that themselves
        // rendering is now done through the composer, which executes the render steps
        EW.renderer.autoClear = false;
        composer.render();

        requestAnimationFrame(render);
        TWEEN.update(time);
    };


    addStatsObject();
    render();
    window.addEventListener('resize', EW.onResize, false);
}
