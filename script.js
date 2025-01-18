let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let model;
let selectedShape = null;

// Load hand detection model
handTrack.load().then(loadedModel => {
  model = loadedModel;
  handTrack.startVideo(video).then(status => {
    if (status) {
      runDetection();
    }
  });
});

// Run hand detection
function runDetection() {
  model.detect(video).then(predictions => {
    if (predictions.length > 0) {
      const hand = predictions[0];
      const x = hand.bbox[0];

      // Select shape based on hand position
      if (x < window.innerWidth / 3) {
        selectedShape = 'shape1';
      } else if (x < (2 * window.innerWidth) / 3) {
        selectedShape = 'shape2';
      } else {
        selectedShape = 'shape3';
      }

      // Load and animate the selected shape
      loadAndAnimateShape(selectedShape);
    }
    requestAnimationFrame(runDetection);
  });
}

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const loader = new THREE.GLTFLoader();
let currentModel;

// Load and animate the selected shape
function loadAndAnimateShape(shape) {
  if (currentModel) {
    scene.remove(currentModel);
  }

  loader.load(`/${shape}.glb`, gltf => {
    currentModel = gltf.scene;
    scene.add(currentModel);

    // Animate the model
    const animate = () => {
      currentModel.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Stop animation after 2 seconds
    setTimeout(() => {
      currentModel.rotation.y = 0;
    }, 2000);
  });
}

// Camera position
camera.position.z = 5;
