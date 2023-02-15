// initialize scene, camera and renderer
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // add ambient light to the scene
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // add directional light to the scene
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(10, 10, 10);
      scene.add(directionalLight);

      // load planet textures

      var textureLoader = new THREE.TextureLoader();
      var mercuryTexture = textureLoader.load("2k_mercury.jpg");
      var venusTexture = textureLoader.load("2k_venus_atmosphere.jpg");
      var earthTexture = textureLoader.load("2k_earth_daymap.jpg");
      var marsTexture = textureLoader.load("2k_mars.jpg");
      var jupiterTexture = textureLoader.load("8k_jupiter.jpg");
      var saturnTexture = textureLoader.load("2k_saturn.jpg");
      var uranusTexture = textureLoader.load("2k_uranus.jpg");
      var neptuneTexture = textureLoader.load("2k_neptune.jpg");
      var saturnRingTexture = textureLoader.load("2k_saturn_ring_alpha.png");
      var texture = textureLoader.load("2k_sun.jpg");
      var LensFlareTexture = textureLoader.load("flare.jpg");

      // load texture to the sun
      // add sun to the scene
      var sunGeometry = new THREE.SphereGeometry(5, 32, 32);
      var sunMaterial = new THREE.MeshLambertMaterial({ map: texture });
      var sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);



      // add planets to the scene
      var planetGeometries = [
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.SphereGeometry(0.75, 32, 32),
        new THREE.SphereGeometry(0.95, 32, 32),
        new THREE.SphereGeometry(1.95, 32, 32),

        new THREE.SphereGeometry(1.35, 32, 32),
        new THREE.SphereGeometry(1.25, 32, 32),
      ];
      var planetMaterials = [
        new THREE.MeshLambertMaterial({ map: mercuryTexture }),
        new THREE.MeshLambertMaterial({ map: venusTexture }),
        new THREE.MeshLambertMaterial({ map: earthTexture }),
        new THREE.MeshLambertMaterial({ map: marsTexture }),
        new THREE.MeshLambertMaterial({ map: jupiterTexture }),
        new THREE.MeshLambertMaterial({ map: saturnTexture }),
        new THREE.MeshLambertMaterial({ map: uranusTexture }),
      ];

      var planets = [];
      var orbitGeometries = [];
      var orbitMaterials = [];
      var distances = [8, 12, 15, 17, 34, 44, 50];

      for (var i = 0; i < planetGeometries.length; i++) {
        var planet = new THREE.Mesh(planetGeometries[i], planetMaterials[i]);
        planet.position.set(distances[i], 0, 0);
        planets.push(planet);
        scene.add(planet);

        var orbitGeometry = new THREE.CircleGeometry(distances[i], 208);
        orbitGeometries.push(orbitGeometry);
        orbitMaterials.push(new THREE.LineBasicMaterial({ color: 0x555555 }));
      }
      for (var i = 0; i < orbitGeometries.length; i++) {
        orbitGeometries[i].vertices.shift();
        var firstPoint = orbitGeometries[i].vertices[0].clone();
        orbitGeometries[i].vertices.push(firstPoint);
        var orbit = new THREE.Line(orbitGeometries[i], orbitMaterials[i]);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
      }

      // add saturn ring
      var saturnRingGeometry = new THREE.RingGeometry(2, 2.7, 32);
      var saturnRingMaterial = new THREE.MeshBasicMaterial({
        map: saturnRingTexture,
        side: THREE.DoubleSide,
      });
      var saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
      saturnRing.rotation.x = Math.PI / 2;
      planets[5].add(saturnRing);

      // add camera controls
      var controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // add ambient light to the scene
      var ambientLight = new THREE.AmbientLight(0xffffff, -0.5);
      scene.add(ambientLight);

      // add point light to the scene
      var pointLight = new THREE.PointLight(0xffffff, 1.7);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);

      // render the scene
      camera.position.z = 80;
      camera.lookAt(0, 0, 0);
      function render() {
        requestAnimationFrame(render);
        for (var i = 0; i < planets.length; i++) {
          var planet = planets[i];
          var distance = distances[i];
          var angle = (Date.now() * 0.0018) / Math.sqrt(distance);
          planet.position.set(
            distance * Math.sin(angle),
            0,
            distance * Math.cos(angle)
          );
        }
        renderer.alpha = true;
        renderer.setClearColor(0x000000, 0); // 0x000000 is black and 0 is transparent
        renderer.render(scene, camera);
      }
      render();
