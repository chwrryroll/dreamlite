import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", () => {
    initAnimalCell();
    setupTabs();
});

function setupTabs() {
    const buttons = document.querySelectorAll("#cell_bar button");
    const containers = document.querySelectorAll(".codia");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            containers.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.id.replace("btn_", "") + "_dia";
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.add("active");
                window.dispatchEvent(new Event('resize'));
            }
        });
    });
}

function initAnimalCell() {
    var container = document.getElementById('animalcell_dia');
    if (!container) return;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    scene.fog = new THREE.FogExp2(0x010103, 0.08);

    var camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(6, 6, 11);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 25;

    var ambientLight = new THREE.AmbientLight(0x0d0b21, 3.5);
    scene.add(ambientLight);

    var warmKeyLight = new THREE.DirectionalLight(0xffedd5, 5.0);
    warmKeyLight.position.set(8, 10, 6);
    scene.add(warmKeyLight);

    var coolRimLight = new THREE.DirectionalLight(0x00ffff, 4.0);
    coolRimLight.position.set(-8, -5, -4);
    scene.add(coolRimLight);

    var cellGroup = new THREE.Group();
    scene.add(cellGroup);

    var membraneGeo = new THREE.SphereGeometry(3.5, 64, 64);
    var membraneMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: 0x02334a,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
    });
    var plasmaMembrane = new THREE.Mesh(membraneGeo, membraneMat);
    cellGroup.add(plasmaMembrane);

    var nucGroup = new THREE.Group();
    var envGeo = new THREE.SphereGeometry(1.0, 32, 32);
    var envMat = new THREE.MeshStandardMaterial({ color: 0x2e085c, emissive: 0x070114, roughness: 0.4, transparent: true, opacity: 0.85 });
    var nucEnvelope = new THREE.Mesh(envGeo, envMat);
    nucGroup.add(nucEnvelope);

    var coreGeo = new THREE.SphereGeometry(0.3, 16, 16);
    var coreMat = new THREE.MeshStandardMaterial({ color: 0x8a00c2, emissive: 0x2d0044, flatShading: true });
    var nucleolus = new THREE.Mesh(coreGeo, coreMat);
    nucGroup.add(nucleolus);
    cellGroup.add(nucGroup);

    var erGroup = new THREE.Group();
    var erLayers = 4;
    for (let l = 0; l < erLayers; l++) {
        let rFactor = 1.15 + (l * 0.18);
        let shape = new THREE.Shape();
        let steps = 40;
        for (let j = 0; j <= steps; j++) {
            let angle = (j / steps) * Math.PI * 1.4 - (Math.PI * 0.7);
            let radialDist = rFactor * (1.0 + Math.sin(angle * 3.0) * 0.08);
            let x = Math.cos(angle) * radialDist;
            let z = Math.sin(angle) * radialDist;
            if (j === 0) shape.moveTo(x, z);
            else shape.lineTo(x, z);
        }
        let extOpts = { depth: 0.15, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
        let geo = new THREE.ExtrudeGeometry(shape, extOpts);
        geo.center();
        let mat = new THREE.MeshStandardMaterial({ color: 0xedc4b3, emissive: 0x24100a, roughness: 0.6 });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = (l - (erLayers / 2)) * 0.12;
        erGroup.add(mesh);
    }
    cellGroup.add(erGroup);

    var golgiGroup = new THREE.Group();
    var gLayers = 5;
    for (let i = 0; i < gLayers; i++) {
        let cFactor = 1.0 - (i * 0.05);
        let sFactor = 0.6 - (i * 0.04);
        let shape = new THREE.Shape();
        let steps = 30;
        for (let j = 0; j <= steps; j++) {
            let angle = (j / steps) * Math.PI - (Math.PI / 2);
            let rad = 1.2 * sFactor;
            let x = Math.cos(angle) * rad;
            let z = Math.sin(angle) * rad * cFactor - (i * 0.05);
            if (j === 0) shape.moveTo(x, z); else shape.lineTo(x, z);
        }
        for (let j = steps; j >= 0; j--) {
            let angle = (j / steps) * Math.PI - (Math.PI / 2);
            let rad = 1.0 * sFactor;
            let x = Math.cos(angle) * rad;
            let z = Math.sin(angle) * rad * cFactor - (i * 0.05);
            shape.lineTo(x, z);
        }
        let extOpts = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
        let geo = new THREE.ExtrudeGeometry(shape, extOpts);
        geo.center();
        let mat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = (i - (gLayers / 2)) * 0.12;
        mesh.rotation.y = Math.PI / 2;
        golgiGroup.add(mesh);
    }
    golgiGroup.position.set(-1.8, 0.4, 1.5);
    golgiGroup.rotation.set(0.2, 1.2, 0.4);
    cellGroup.add(golgiGroup);

    var mitochondriaInstances = [];
    function createMitoMesh() {
        var mInst = new THREE.Group();
        var capGeo = new THREE.CapsuleGeometry(0.25, 0.5, 16, 24);
        var capMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, emissive: 0x1a0303, roughness: 0.4, transparent: true, opacity: 0.7 });
        var cap = new THREE.Mesh(capGeo, capMat);
        mInst.add(cap);

        var innerGeo = new THREE.BufferGeometry();
        var innerPositions = [];
        for (let k = 0; k < 6; k++) {
            innerPositions.push(0, (k / 5 - 0.5) * 0.4, 0);
        }
        innerGeo.setAttribute('position', new THREE.Float32BufferAttribute(innerPositions, 3));
        var innerMat = new THREE.PointsMaterial({ color: 0xe11d48, size: 0.15 });
        var cristaePoints = new THREE.Points(innerGeo, innerMat);
        mInst.add(cristaePoints);
        return mInst;
    }

    var positionsMito = [
        new THREE.Vector3(1.8, -1.2, 1.4),
        new THREE.Vector3(-1.5, -1.6, -1.2),
        new THREE.Vector3(2.2, 1.0, -1.5)
    ];

    positionsMito.forEach((pos) => {
        let m = createMitoMesh();
        m.position.copy(pos);
        m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        cellGroup.add(m);
        mitochondriaInstances.push(m);
    });

    var lysosomes = [];
    var lysoGeo = new THREE.SphereGeometry(0.22, 16, 16);
    var lysoMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, transparent: true, opacity: 0.8 });
    var positionsLyso = [
        new THREE.Vector3(-1.2, 1.8, -1.0),
        new THREE.Vector3(1.2, -1.5, -1.8),
        new THREE.Vector3(-2.2, -0.8, 1.2)
    ];

    positionsLyso.forEach(pos => {
        let lMesh = new THREE.Mesh(lysoGeo, lysoMat);
        lMesh.position.copy(pos);
        cellGroup.add(lMesh);
        lysosomes.push({ mesh: lMesh, seed: Math.random() * 50 });
    });

    var vacuoles = [];
    var vacGeo = new THREE.SphereGeometry(0.3, 32, 32);
    var vacMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x01263a, roughness: 0.1, transparent: true, opacity: 0.75 });
    var positionsVac = [
        new THREE.Vector3(1.5, 1.8, 1.2),
        new THREE.Vector3(-2.0, 1.2, -1.8)
    ];

    positionsVac.forEach(pos => {
        let vMesh = new THREE.Mesh(vacGeo, vacMat);
        vMesh.position.copy(pos);
        cellGroup.add(vMesh);
        vacuoles.push({ mesh: vMesh, seed: Math.random() * 100 });
    });

    function animationLoop(t) {
        cellGroup.rotation.y = t / 14000;
        cellGroup.rotation.x = Math.sin(t / 20000) * 0.15;
        nucGroup.rotation.y = t / 5000;
        golgiGroup.position.y = 0.4 + Math.sin(t / 1200) * 0.04;

        mitochondriaInstances.forEach((m, idx) => {
            m.rotation.y += 0.003 * (idx + 1);
        });

        lysosomes.forEach(l => {
            l.mesh.position.y += Math.sin(t / 800 + l.seed) * 0.0015;
        });

        var posAttr = membraneGeo.attributes.position;
        var timeFactor = t / 500;
        for (let i = 0; i < posAttr.count; i++) {
            let x = posAttr.getX(i);
            let y = posAttr.getY(i);
            let z = posAttr.getZ(i);
            let wave = Math.sin(x * 1.2 + timeFactor) * 0.06 + Math.cos(z * 1.2 + timeFactor) * 0.06;
            let normalVec = new THREE.Vector3(x, y, z).normalize().multiplyScalar(3.5 + wave);
            posAttr.setXYZ(i, normalVec.x, normalVec.y, normalVec.z);
        }
        membraneGeo.computeVertexNormals();
        posAttr.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animationLoop);

    function resizeCell() {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);
        }
    }
    window.addEventListener('resize', resizeCell);
    window.addEventListener('click', () => setTimeout(resizeCell, 25));
    resizeCell();
}