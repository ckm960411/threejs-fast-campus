import "./style.css";
import { ExtrudeGeometryOptions } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * 렌더러 생성
 */
const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias 를 키면 끝부분이 우글우글 거리는 걸 막아준다.
renderer.shadowMap.enabled = true; // 그림자 지는게 나오도록
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

/**
 * Scene, Camera
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight, // 화면에 꽉 채우기 위해
  0.1,
  100,
);
camera.position.y = 1;
camera.position.z = 5;

/**
 * Light
 * - DirectionalLight: 직사광선
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true; // 빛의 그림자가 드리울 수 있게
directionalLight.position.set(3, 4, 5);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

/**
 * Mesh (Geometry + Material)
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.5;
mesh.castShadow = true; // castShadow 속성과 반대로 그림자를 받을 수 있게 해줌
mesh.receiveShadow = true; // castShadow 속성과 반대로 그림자를 받을 수 있게 해줌
scene.add(mesh);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // 회전값은 라디안을 이용하며 Math.PI 가 180도
floor.receiveShadow = true; // castShadow 속성과 반대로 그림자를 받을 수 있게 해줌
floor.castShadow = true;
scene.add(floor);

const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 20, 30);
const capsuleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
capsuleMesh.position.set(3, 1.75, 0);
capsuleMesh.castShadow = true;
capsuleMesh.receiveShadow = true;
scene.add(capsuleMesh);

const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.set(-3, 1, 0);
cylinderMesh.castShadow = true;
cylinderMesh.receiveShadow = true;
scene.add(cylinderMesh);

const torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(0, 0.5, 1);
torusMesh.castShadow = true;
torusMesh.receiveShadow = true;
scene.add(torusMesh);

const starShape = new THREE.Shape();
starShape.moveTo(0, 1);
starShape.lineTo(0.2, 0.2);
starShape.lineTo(1, 0.2);
starShape.lineTo(0.4, -0.1);
starShape.lineTo(0.6, -1);
starShape.lineTo(0, -0.5);
starShape.lineTo(-0.6, -1);
starShape.lineTo(-0.4, -0.1);
starShape.lineTo(-1, 0.2);
starShape.lineTo(-0.2, 0.2);

const shapeGeometry = new THREE.ShapeGeometry(starShape);
const shapeMaterial = new THREE.MeshStandardMaterial({ color: "#ff00ff" });
const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
shapeMesh.position.set(0, 1, 2);
scene.add(shapeMesh);

const extrudeSetting: ExtrudeGeometryOptions = {
  steps: 1,
  depth: 0.1,
  bevelEnabled: true,
  bevelThickness: 0.1,
  bevelSize: 0.3,
  bevelSegments: 100,
};

const extrudeGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSetting);
const extrudeMaterial = new THREE.MeshStandardMaterial({ color: "#0ddaaf" });
const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
extrudeMesh.position.set(2, 1.3, 2);
extrudeMesh.castShadow = true;
extrudeMesh.receiveShadow = true;
scene.add(extrudeMesh);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "#98daaf" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 1, -3);
// scene.add(sphere);

const numPoints = 1000;
const positions = new Float32Array(numPoints * 3);
for (let i = 0; i < numPoints; i++) {
  const x = (Math.random() - 0.5) * 1;
  const y = (Math.random() - 0.5) * 1;
  const z = (Math.random() - 0.5) * 1;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 1 + 1] = z;
}

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);
const pointsMaterial = new THREE.PointsMaterial({
  color: "#ffff00",
  size: 0.05,
});
const point = new THREE.Points(bufferGeometry, pointsMaterial);
point.position.set(0, 0, -5);
scene.add(point);

/**
 * Controls
 */
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

/**
 * 화면의 비율이 리사이즈될 때마다 리렌더링
 */
window.addEventListener("resize", () => {
  // 렌더러의 사이즈를 화면에 맞게 조정
  renderer.setSize(window.innerWidth, window.innerHeight);

  // renderer 의 크기가 수정돼도 Mesh 의 비율이 유지되도록 카메라도 비율 유지
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // ✅ 카메라의 속성이 변결될 땐 항상 updateProjectMatrix 호출!!

  // 다시 화면에 렌더링
  renderer.render(scene, camera);
});

/**
 * 브라우저가 효율적으로 렌더링할 수 있도록 애니메이션 프레임 설정
 */
const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();
