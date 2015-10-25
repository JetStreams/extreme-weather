var convertFromSpherical = function (a1, a2) {
  var radius = 15 + 0.2; //radius of our earth model is 15

  var phi = (90 - a2) * (Math.PI / 180);
  var theta = (a1 + 180) * (Math.PI / 180);

  var x = -((radius) * Math.sin(phi) * Math.cos(theta));
  var z = ((radius) * Math.sin(phi) * Math.sin(theta));
  var y = ((radius) * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
};
var populatePointCloud= function(obj, data, filterDay) {
  obj.children = [];
  
  var col = 0xFFFFFF;
  var material = new THREE.MeshBasicMaterial({ color: col });
  material.blending = THREE.AdditiveBlending;

  for (var i in data) {
    var c = data[i];

    var day = c[4];
    var a1 = c[0];
    var a2 = c[1];
    if(day != filterDay || c[3] < 20 || a2 > 70) {
      continue;
    }
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

    obj.add(mesh);
  }

}
var createPointCloud = function (scene, data) {
  //the group to add points
  var group = new THREE.Group();
  group.name = 'points';
  scene.add(group);

  var col = 0xFFFFFF;
  var material = new THREE.MeshBasicMaterial({ color: col });
  material.blending = THREE.AdditiveBlending;

  for (var i in data) {
    var c = data[i];

    var day = c[4];
    var a1 = c[0];
    var a2 = c[1];
    if(day != 229 || c[3] < 20 || a2 > 70) {
      continue;
    }
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
  return group;

};

// Attempt to use animated particles to visualize wind
// Based on https://jsfiddle.net/8mrH7/195/
var createPointCloudNew = function (scene, callback) {

    var cloud;

    var convertFromSpherical = function (a1, a2) {
        var radius = 15 + 1.2; //radius of our earth model is 15

        var phi = (90 - a2) * (Math.PI / 180);
        var theta = (a1 + 180) * (Math.PI / 180);

        var x = -radius * Math.sin(phi) * Math.cos(theta);
        var z = radius * Math.sin(phi) * Math.sin(theta);
        var y = radius * Math.cos(phi);

        return new THREE.Vector3(x, y, z);
    };

    $.getJSON("res/data/sample_082010.json", function (data) {

      var geometry = new THREE.BufferGeometry();

      var numVertices = data.length;
      var alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex

      for( var i = 0; i < numVertices; i++ ) {
        alphas[i] = Math.random();
      }
      alphas.needUpdate = true;

      geometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

      var uniforms = {
        color: { type: "c", value: new THREE.Color( 0xFFFFFF ) },
      };

      var material = new THREE.ShaderMaterial({ 
        uniforms:       uniforms,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        transparent:    true
      });

      for (var i in data) {
        var c = data[i];
        var a1 = c[0]; // sample latitude and longitude
        var a2 = c[1];
        var dir1 = c[2]; // wind direction
        var dir2 = c[2] - Math.PI / 2;
        var dir3 = c[2] + Math.PI / 2;
        var mag = (c[3] - 15) / 7; // wind magnitude

        // create triangle
        var c1 = convertFromSpherical(a1, a2);
        geometry.vertices.push(c1); 
      }

      cloud = new THREE.Points( geometry, material );
      scene.add(cloud);
      callback(cloud);
    });
};
