import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initMitochondria() {
    var container = document.getElementById('mitochondria_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    scene.fog = new THREE.FogExp2(0x010103, 0.12);

    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(5, 5, 9);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(1, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 15;

    var ambientLight = new THREE.AmbientLight(0x0a101d, 3.0);
    scene.add(ambientLight);

    var light1 = new THREE.DirectionalLight(0xffa6c9, 5.0);
    light1.position.set(6, 6, 4);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0x00aaff, 3.0);
    light2.position.set(-6, -4, -3);
    scene.add(light2);

    var mitoGroup = new THREE.Group();
    scene.add(mitoGroup);

    var outerGeo = new THREE.CapsuleGeometry(1.2, 2.2, 32, 64);
    var outerMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        emissive: 0x220505,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
    });
    var outerMembrane = new THREE.Mesh(outerGeo, outerMat);
    mitoGroup.add(outerMembrane);

    var innerGroup = new THREE.Group();
    mitoGroup.add(innerGroup);

    var cristaeCount = 14;
    var cristaeMeshes = [];
    
    for (let i = 0; i < cristaeCount; i++) {
        var pct = i / (cristaeCount - 1);
        var yPos = (pct - 0.5) * 2.4;
        var radiusFactor = Math.cos((pct - 0.5) * Math.PI * 0.7) * 0.95;
        
        var cristaShape = new THREE.Shape();
        var steps = 40;
        for (let j = 0; j <= steps; j++) {
            var angle = (j / steps) * Math.PI * 2;
            var r = radiusFactor * (0.8 + Math.sin(angle * 5) * 0.22);
            var x = Math.cos(angle) * r;
            var z = Math.sin(angle) * r;
            if (j === 0) cristaShape.moveTo(x, z);
            else cristaShape.lineTo(x, z);
        }

        var extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
        var cristaGeo = new THREE.ExtrudeGeometry(cristaShape, extrudeSettings);
        cristaGeo.center();
        
        var cristaMat = new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0x4c0519,
            roughness: 0.4,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        
        var cristaMesh = new THREE.Mesh(cristaGeo, cristaMat);
        cristaMesh.position.y = yPos;
        cristaMesh.rotation.x = Math.PI / 2;
        cristaMesh.rotation.z = (i * Math.PI / 4);
        
        innerGroup.add(cristaMesh);
        cristaeMeshes.push({
            mesh: cristaMesh,
            baseRotation: cristaMesh.rotation.z,
            phase: i * 0.5
        });
    }

    var riboCount = 25;
    var riboGeo = new THREE.SphereGeometry(0.025, 8, 8);
    var riboMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    for (let i = 0; i < riboCount; i++) {
        var rMesh = new THREE.Mesh(riboGeo, riboMat);
        var t = Math.random() * Math.PI * 2;
        var u = Math.random() + Math.random();
        var r = (u > 1 ? 2 - u : u) * 0.75;
        rMesh.position.set(Math.cos(t) * r, (Math.random() - 0.5) * 1.8, Math.sin(t) * r);
        innerGroup.add(rMesh);
    }

    var dnaGroup = new THREE.Group();
    innerGroup.add(dnaGroup);

    var dnaCount = 4;
    var dnaLoops = [];
    for (let d = 0; d < dnaCount; d++) {
        let loopPoints = [];
        let segments = 32;
        let baseRadius = 0.18 + Math.random() * 0.08;
        
        for (let s = 0; s <= segments; s++) {
            let angle = (s / segments) * Math.PI * 2;
            let waveFactor = 1.0 + Math.sin(angle * 5.0) * 0.15;
            let lx = Math.cos(angle) * baseRadius * waveFactor;
            let lz = Math.sin(angle) * baseRadius * waveFactor;
            loopPoints.push(new THREE.Vector3(lx, 0, lz));
        }

        let dnaCurve = new THREE.CatmullRomCurve3(loopPoints);
        let dnaGeo = new THREE.TubeGeometry(dnaCurve, 40, 0.012, 6, true);
        let dnaMat = new THREE.MeshStandardMaterial({
            color: 0x22c55e,
            emissive: 0x052e16,
            roughness: 0.3,
            transparent: true,
            opacity: 0.95
        });

        let dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
        
        dnaMesh.position.set(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 1.4,
            (Math.random() - 0.5) * 0.6
        );
        dnaMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dnaGroup.add(dnaMesh);
        
        dnaLoops.push({
            mesh: dnaMesh,
            seed: Math.random() * 50,
            speed: 0.5 + Math.random() * 0.8
        });
    }

    function animationLoop(t) {
        mitoGroup.rotation.y = t / 7000;
        mitoGroup.rotation.x = Math.sin(t / 9000) * 0.2;

        for (let i = 0; i < cristaeMeshes.length; i++) {
            var c = cristaeMeshes[i];
            if(!c) continue;
            var scaleWave = 1 + Math.sin(t / 1200 + c.phase) * 0.06;
            c.mesh.scale.set(scaleWave, scaleWave, 1);
            c.mesh.rotation.z = c.baseRotation + Math.cos(t / 2000 + c.phase) * 0.05;
        }

        dnaLoops.forEach(d => {
            d.mesh.rotation.y += 0.005 * d.speed;
            d.mesh.position.y += Math.sin(t / 1000 + d.seed) * 0.0005;
        });

        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeMito() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }

    window.addEventListener('resize', resizeMito);
    resizeMito();
}