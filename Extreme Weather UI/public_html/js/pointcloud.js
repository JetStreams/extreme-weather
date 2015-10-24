var createPointCloud = function(scene) {
  // add points with 15 units distance from center

  var group = new THREE.Group();

  var r = 15;
  for(var i=0; i<200; i++) {
    var geometry = new THREE.SphereGeometry( 0.1, 10, 10 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );

    var a = Math.random() * Math.PI;
    var b = Math.random() * Math.PI * 2;

    var x = r * Math.sin(a) * Math.cos(b);
    var y = r * Math.sin(a) * Math.sin(b);
    var z = r * Math.cos(a);

    geometry.translate(x, y, z);
    
    var sphere = new THREE.Mesh( geometry, material );
    group.add( sphere );
  }
  group.name = 'points';
  scene.add(group);
}
