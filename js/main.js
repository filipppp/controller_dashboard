const THREE = window.THREE = require('three');
require('three/examples/js/loaders/GLTFLoader.js');
const loader = new THREE.GLTFLoader();

const SerialPort = require('serialport')
const port = new SerialPort("COM5", {baudRate: 9600});
// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data:', data)
})

/** Define jQuery so Bootstrap can work correctly **/
window.jQuery = window.$ = require('jquery');

/** Wait for the HTML to be fully loaded **/
window.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xff0000);
    const camera = new THREE.PerspectiveCamera(75, 500/500, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    const navballDiv = document.querySelector(".navball");

    renderer.setSize(500, 500);
    navballDiv.appendChild(renderer.domElement);
    // loader.load('./assets/models/navball.glb', function (gltf) {
    //     scene.add(gltf.scene);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

    scene.add(new THREE.AmbientLight(0xFFFFFF, 0.5));

    const clock = new THREE.Clock()
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        // Update objects
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        // Update Orbital Controls
        // controls.update()
        // Render
        renderer.render(scene, camera)
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
});

