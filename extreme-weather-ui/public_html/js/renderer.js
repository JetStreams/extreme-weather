var Renderer = (function () {
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
        jsonData: null,
        positions: null
    };

    EW.onResize = function () {
        EW.camera.aspect = window.innerWidth / window.innerHeight;
        EW.camera.updateProjectionMatrix();
        EW.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    EW.switchCamera = function () {
        var pos = EW.positions;

        new TWEEN
                .Tween(EW.camera.position)
                .to(pos[EW.cameraId++ % pos.length], 5000)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .start();
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

        buildCloudPoints("res/data/2010_JJA_wind_min_2weeks.json", scene, EW);

        //============================================================

        readCameraPositions("res/data/camera_positions.json", EW);
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
            if (EW.meshPoints) {
                EW.meshPoints.rotation.y += rotSpeed;
            }

            EW.renderer.render(scene, EW.camera);

            requestAnimationFrame(render);
            TWEEN.update(time);
        };


        addStatsObject();
         //==============================================================
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
        addControlGui(control, EW);
        initControls(EW);
        //================================================================
        
        render();
        window.addEventListener('resize', EW.onResize, false);
    }

    /** public visible */
    return {
        run: function () {
            initRenderer();
            DateInfo.refresh(229);
        }
    };

})();
