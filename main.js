import "./style.css";

import gsap from 'gsap';
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Background

const canbas = document.querySelector("#webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * GLTF Loader
 */

let donut = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./assets/donut/scene.gltf", (gltf) => {
  donut = gltf.scene;

  // Donut Rotation
  donut.position.x = 1.5;
  donut.rotation.x = Math.PI * 0.2;
  donut.rotation.z = Math.PI * 0.15;

  const radius = 8.5;
  donut.scale.set(radius, radius, radius);
  scene.add(donut);
});

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 2, 3);

directionalLight.castShadow = true;
scene.add(directionalLight);

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

const transformDonut = [{
        rotationZ: 0.45,
        positionX: 1.5
    },
    {
        rotationZ: -0.45,
        positionX: -1.5
    },
    {
        rotationZ: 0.0314,
        positionX: 0
    },
    {
        rotationZ: 0.0314,
        positionX: 0
    },
]

window.addEventListener('scroll', () => {

    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    console.log(newSection);

    if (newSection != currentSection) {
        currentSection = newSection

        if (!!donut) {
            gsap.to(
                donut.rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    z: transformDonut[currentSection].rotationZ
                }
            )
            gsap.to(
                donut.position, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: transformDonut[currentSection].positionX
                }
            )

            // gsap.to(
            //     sphereShadow.position, {
            //         duration: 1.5,
            //         ease: 'power2.inOut',
            //         x: transformDonut[currentSection].positionX - 0.2
            //     }
            // )
        }
    }
})


/**
 * Sizes
 */
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canbas,
  antialias: true,
  alpha: true,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate (Game Loop)
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  if (!!donut) {
    donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
