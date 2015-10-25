var EW = {
  camera: null,
  cameraControl: null,
  cameraId: 0,
  meshEarth: null,
  meshPoints: null,
  meshStars: null,
  renderer: null,
  rotationEnabled: true,
  rotationMultiplier: 1,
  jsonData: null
};

EW.onResize = function () {
    EW.camera.aspect = window.innerWidth / window.innerHeight;
    EW.camera.updateProjectionMatrix();
    EW.renderer.setSize(window.innerWidth, window.innerHeight);
};

EW.switchCamera = function () {
    var pos = [
        {x: 15, y: 35, z: 0},
        {x: 15, y: 17, z: 0},
        {x: 35, y: 35, z: 0}
    ];

    new TWEEN
            .Tween(EW.camera.position)
            .to(pos[EW.cameraId++ % pos.length], 5000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .start();
};

var refreshDate = function (increment) {
    var date = new Date(2010, 0, 0);
    date.setDate(date.getDate() + increment);
    $('#date').text($.format.date(date, 'dd MMM yyyy'));
};

function initRenderer() {
    var fullScreen = false;
    var scene;
    var control;
    var stats;

    // set some camera attributes
    var VIEW_ANGLE = 45,
            ASPECT = window.innerWidth / window.innerHeight,
            NEAR = 0.1,
            FAR = 10000;

    // create a renderer, camera and a scene
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        EW.renderer = new THREE.CanvasRenderer();
    } else {
        EW.renderer = new THREE.WebGLRenderer();
        EW.renderer.shadowMap.enabled = true;
    }

    scene = new THREE.Scene();

    EW.renderer.setSize(window.innerWidth, window.innerHeight);
    EW.renderer.setClearColor(0x000000, 1.0);
    

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
    EW.meshStars = createStars(scene);

    //==============================================================

    $.getJSON("res/data/2010_JJA_wind_min_2weeks.json", function (data) {
      EW.jsonData = data;

      EW.meshPoints = createPointCloud(scene, EW.jsonData);
    });


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
        gui.add(controlObject, 'days', 229, 243).step(1).onChange(function (newValue) {
            refreshDate(newValue);
            populatePointCloud(EW.meshPoints, EW.jsonData, newValue);
        });
        gui.add(controlObject, 'nextCamera');
        gui.add(controlObject, 'toggleScreen');
    };

    // setup the control object for the control gui
    control = new function () {
        this.rotationSpeed = 0.001;
        this.days = 229;
        this.toggleScreen = function () {
            fullScreen = !fullScreen;
            $(document).fullScreen(fullScreen);
        };
        this.nextCamera = function () {
            EW.switchCamera();
        }
    };
    addControlGui(control);

    //==============================================================
    // draw!
    var render = function (time) {
        stats.update();
        EW.cameraControl.update();

        // Slow down or speed up rotation
        if (EW.rotationEnabled) {
            EW.rotationMultiplier = Math.min(EW.rotationMultiplier + 0.05, 1);
        } else {
            EW.rotationMultiplier = Math.max(EW.rotationMultiplier - 0.05, 0);
        }
        var rotSpeed = control.rotationSpeed * EW.rotationMultiplier;

        EW.meshEarth.rotation.y += rotSpeed;
        if(EW.meshPoints) {
          EW.meshPoints.rotation.y += rotSpeed;
        }

        EW.renderer.render(scene, EW.camera);

        requestAnimationFrame(render);
        TWEEN.update(time);
    };


    addStatsObject();
    render();
    window.addEventListener('resize', EW.onResize, false);
}
