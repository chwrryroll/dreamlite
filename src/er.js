import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initER() {
    var container = document.getElementById('er_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);

    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(4, 4, 8);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1);
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var ambient = new THREE.AmbientLight(0x2d1b18, 3.0);
    scene.add(ambient);

    var dLight = new THREE.DirectionalLight(0xffedd5, 5.0);
    dLight.position.set(5, 8, 4);
    scene.add(dLight);

    var erGroup = new THREE.Group();
    scene.add(erGroup);

    var layerCount = 5;
    var sheets = [];

    for (let l = 0; l < layerCount; l++) {
        let rFactor = 0.6 + (l * 0.35);
        let shape = new THREE.Shape();
        let steps = 60;
        
        for (let j = 0; j <= steps; j++) {
            let angle = (j / steps) * Math.PI * 1.5 - (Math.PI * 0.75);
            let radialDist = rFactor * (1.0 + Math.sin(angle * 4.0) * 0.12);
            let x = Math.cos(angle) * radialDist;
            let z = Math.sin(angle) * radialDist;
            if (j === 0) shape.moveTo(x, z);
            else shape.lineTo(x, z);
        }

        let extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 };
        let geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();

        let mat = new THREE.MeshStandardMaterial({
            color: l % 2 === 0 ? 0xedc4b3 : 0xe8b49f,
            emissive: 0x3d1e14,
            roughness: 0.5,
            metalness: 0.05
        });

        let sheetMesh = new THREE.Mesh(geo, mat);
        sheetMesh.position.y = (l - (layerCount / 2)) * 0.3;
        sheetMesh.rotation.x = Math.PI / 2;
        erGroup.add(sheetMesh);
        sheets.push(sheetMesh);

        for (let r = 0; r < 20; r++) {
            let riboGeo = new THREE.SphereGeometry(0.045, 8, 8);
            let riboMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
            let ribo = new THREE.Mesh(riboGeo, riboMat);
            let edgeAngle = (Math.random() - 0.5) * Math.PI * 1.3;
            let rad = rFactor + 0.04;
            ribo.position.set(Math.cos(edgeAngle) * rad, sheetMesh.position.y + (Math.random() - 0.5) * 0.2, Math.sin(edgeAngle) * rad);
            erGroup.add(ribo);
        }
    }

    function animationLoop(t) {
        erGroup.rotation.y = t / 8000;
        sheets.forEach((sheet, idx) => {
            sheet.position.y = ((idx - (layerCount / 2)) * 0.3) + Math.sin(t / 800 + idx) * 0.02;
        });
        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeER() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }
    window.addEventListener('resize', resizeER);
    resizeER();
}