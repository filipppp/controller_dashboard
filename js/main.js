/** Define jQuery so Bootstrap can work correctly **/
window.jQuery = window.$ = require('jquery');

const THREE = window.THREE = require('three');
require('three/examples/js/loaders/GLTFLoader.js');
require('three/examples/js/controls/OrbitControls');
const loader = new THREE.GLTFLoader();

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline');

/** Serial Port stuff **/
const port = new SerialPort("/dev/ttyUSB0", {baudRate: 9600});
const parser = port.pipe(new Readline({delimiter: '\r\n'}))

/**
 *
 * CODE
 *
 * **/
let throttle = 0;
let x_joy = 0;
let y_joy = 0;
let altitude = 0;
let temperature = 0;
let x = 0; // yaw z-achse
let y = 0; // roll
let z = 0; // pitch
let quaternion = [];


/** Wait for the HTML to be fully loaded **/
window.addEventListener("DOMContentLoaded", () => {
    parser.on('data', (data) => {
        let nums = data.split(";");
        nums = nums.map(numAsStr => Number(numAsStr));
        [throttle, x_joy, y_joy, altitude, temperature, x, y, z, quaternion[0], quaternion[1], quaternion[2], quaternion[3]] = nums;
        updateDomOnSerial();
    })
    manageNavball();
});

function updateDomOnSerial() {
    let items = document.getElementById("data-table").children;
    items[0].innerText = altitude + " m";
    items[1].innerText = temperature + " C°";
    items[2].innerText = parseInt(throttle / 1.8) + " %";
    items[3].innerText = x + "°";
    items[4].innerText = z + "°";
    items[5].innerText = y + "°";

    let throttleDiv = document.getElementById("throttle");
    throttleDiv.style.height = `${throttle / 1.8}%`;
    if (throttle <= 54) {
        throttleDiv.style.backgroundColor = "rgb(0, 255, 0)";
    } else if (throttle > 54 && throttle <= 144) {
        throttleDiv.style.backgroundColor = "rgb(255, 69, 0)";
    } else {
        throttleDiv.style.backgroundColor = "rgb(255, 0, 0)";
    }
}

function manageNavball() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    const camera = new THREE.PerspectiveCamera(90, 500 / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(500, 500);
    scene.add(new THREE.AmbientLight(0xFFFFFF, 5));

    // Controls
    // const controls = new THREE.OrbitControls(camera, renderer.domElement)
    // controls.enableDamping = true

    /** Navball **/
    const navballDiv = document.querySelector(".navball");
    let navball;
    loader.load('./assets/models/jet.glb', function (gltf) {
        navball = gltf.scene;
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
    camera.position.z = 10; // remove
    const clock = new THREE.Clock()
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        // Update objects
        // Update Orbital Controls
        // controls.update()
        if (navball) {
            navball.quaternion.w = quaternion[0];
            navball.quaternion.x = -quaternion[1];
            navball.quaternion.z = quaternion[2];
            navball.quaternion.y = quaternion[3];
        }
        // Render
        renderer.render(scene, camera)
        // Call tick again on the next frame
        requestAnimationFrame(tick)
    }
    navballDiv.appendChild(renderer.domElement);
    tick();
}