// Initialize variables
const sceneEl = document.querySelector('a-scene');
const models = [
    'https://github.com/unstopablethinkerr/ar3/raw/refs/heads/main/shape1.glb',
    'https://github.com/unstopablethinkerr/ar3/raw/refs/heads/main/shape2.glb',
    'https://github.com/unstopablethinkerr/ar3/raw/refs/heads/main/shape3.glb'
];
let currentModelIndex = 0;

// Load models into the scene
models.forEach(url => {
    const model = document.createElement('a-entity');
    model.setAttribute('gltf-model', url);
    model.setAttribute('scale', '0.1 0.1 0.1'); // Adjust scale as needed
    model.setAttribute('position', '0 0 -5'); // Adjust position as needed
    sceneEl.appendChild(model);
});

// Handpose initialization
const handpose = new Handpose();
const cameraElement = document.querySelector('a-scene video');

handpose.load().then(() => {
    handpose.detect(cameraElement).then(predictions => {
        // Process hand predictions
        // Implement gesture recognition here
        // For simplicity, we'll trigger selection on a button click
    });
});

// Function to select and animate a shape
function selectShape(index) {
    const model = sceneEl.querySelectorAll('a-entity')[index];
    // Animate the selected model
    model.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 2000; loop: once');
}

// Example: Select shape1 after 3 seconds (replace with gesture detection logic)
setTimeout(() => {
    selectShape(currentModelIndex);
    currentModelIndex = (currentModelIndex + 1) % models.length;
}, 3000);
