import * as THREE from 'three';

//cell
const container = document.getElementById('canva_cell');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const geometry = new THREE.ShepreGeometry(1, 32,32);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true });
const cell = new THREE.Mesh(geometry, material);
scene.add(cell);
