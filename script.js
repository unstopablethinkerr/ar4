const video = document.getElementById('camera-feed');
const handFrame = document.getElementById('hand-frame');
const screenFlash = document.getElementById('screen-flash');

// HandTrack.js Model Parameters
const modelParams = {
  flipHorizontal: true, // Flip camera for mirrored view
  maxNumBoxes: 1,       // Detect a single hand
  iouThreshold: 0.5,    // Intersection over Union threshold
  scoreThreshold: 0.8,  // Confidence threshold
};

let model; // Placeholder for the hand tracking model

// Load Camera
async function initCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
  });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

// Load HandTrack.js Model
async function loadModel() {
  model = await handTrack.load(modelParams);
  console.log('HandTrack.js model loaded');
}

// Start Detection
async function startDetection() {
  try {
    await initCamera();
    await loadModel();

    function runDetection() {
      model.detect(video).then((predictions) => {
        if (predictions.length > 0) {
          // Get the first prediction
          const hand = predictions[0].bbox; // [x, y, width, height]
          updateHandFrame(hand);
          flashScreen(); // Flash green border if a hand is detected
        } else {
          handFrame.style.display = 'none';
          screenFlash.style.display = 'none';
        }
      }).catch((error) => {
        console.error('Detection error:', error);
      });

      requestAnimationFrame(runDetection);
    }

    runDetection();
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Update Hand Frame
function updateHandFrame([x, y, width, height]) {
  handFrame.style.display = 'block';
  handFrame.style.left = `${x}px`;
  handFrame.style.top = `${y}px`;
  handFrame.style.width = `${width}px`;
  handFrame.style.height = `${height}px`;
}

// Flash Green Screen
function flashScreen() {
  screenFlash.style.display = 'block';
  setTimeout(() => {
    screenFlash.style.display = 'none';
  }, 100); // Flash duration
}

// Initialize Detection
startDetection();
