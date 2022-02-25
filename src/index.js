import * as THREE from 'three';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const parameters = {
  color: 0xff0000,
};
const material = new THREE.MeshBasicMaterial({ color: parameters.color });
const geometry = new THREE.BoxGeometry(1, 1, 1);
const mesh = new THREE.Mesh(geometry, material);
const gui = new dat.GUI();
parameters.spin = function spin() {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};
/*
    const geometry = new THREE.BufferGeometry()
    const points=[];
    const vertex1 = new THREE.Vector3(0, 0, 0)
    points.push(vertex1);

    const vertex2 = new THREE.Vector3(0, 1, 0)
    points.push(vertex2);

    const vertex3 = new THREE.Vector3(1, 0, 0)
    points.push(vertex3);
    geometry.setFromPoints(points);
    */
// geometry.computeVertexNormals();

gui.add(mesh.position, 'y');
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
gui.add(parameters, 'spin');
gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color);
});
/*
const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = - 1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube3.position.x = 1.5
group.add(cube3)
*/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector('canvas.webgl');

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
camera.position.z = 3;
// const axesHelper = new THREE.AxesHelper(2)
camera.lookAt(mesh.position);
// scene.add(axesHelper)
scene.add(mesh);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
// const clock = new THREE.Clock();
const cursor = {
  x: 0,
  y: 0,
};
// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
const tick = () => {
  // Update camera
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  camera.position.y = cursor.y * 3;
  camera.lookAt(mesh.position);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
});
