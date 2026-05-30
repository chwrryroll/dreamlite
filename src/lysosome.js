import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initLysosomes() {
    var container = document.getElementById('lysosomes_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);

    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1);
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var ambient = new THREE.AmbientLight(0x450a0a, 3.0);
    scene.add(ambient);

    var dLight = new THREE.DirectionalLight(0xdc2626, 6.0);
    dLight.position.set(4, 5, 3);
    scene.add(dLight);

    var pLight = new THREE.PointLight(0xd97706, 5.0, 4.0);
    pLight.position.set(0, 0, 0);
    scene.add(pLight);

    var lysoGroup = new THREE.Group();
    scene.add(lysoGroup);

    var mainSphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
    var mainSphereMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    var membrane = new THREE.Mesh(mainSphereGeo, mainSphereMat);
    lysoGroup.add(membrane);

    var enzymeGroup = new THREE.Group();
    lysoGroup.add(enzymeGroup);

    var enzymeCount = 35;
    var enzymes = [];
    var enzGeo = new THREE.SphereGeometry(0.08, 8, 8);
    var enzMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, flatShading: true });

    for (let i = 0; i < enzymeCount; i++) {
        let mesh = new THREE.Mesh(enzGeo, enzMat);
        let u = Math.random();
        let th = Math.random() * Math.PI * 2;
        let ph = Math.acos(2 * Math.random() - 1);
        let r = u * 0.95;

        mesh.position.set(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
        enzymeGroup.add(mesh);
        enzymes.push({ mesh: mesh, velocity: new THREE.Vector3((Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01) });
    }

    function animationLoop(t) {
        lysoGroup.rotation.y = t / 9000;
        enzymeGroup.rotation.x = t / 12000;

        enzymes.forEach(e => {
            e.mesh.position.add(e.velocity);
            if (e.mesh.position.length() > 0.98) {
                e.velocity.reflect(e.mesh.position.clone().normalize());
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeLysosomes() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }
    window.addEventListener('resize', resizeLysosomes);
    resizeLysosomes();
}