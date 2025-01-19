const handFrame = document.getElementById('hand-frame');

// HandTrack.js Model Configuration
const modelParams = {
  flipHorizontal: false, // Don't flip, as AR.js uses the back camera
  maxNumBoxes: 1,       // Only detect one hand
  iouThreshold: 0.5,    // Intersection over Union threshold
  scoreThreshold: 0.8,  // Confidence threshold
};

let model;

// Load HandTrack.js Model
handTrack.load(modelParams).then((loadedModel) => {
  model = loadedModel;
  console.log("HandTrack.js model loaded.");
  startHandTracking();
});

// Access AR.js Camera Feed
const arCamera = document.querySelector('a-scene canvas');

// Start Hand Tracking
function startHandTracking() {
  // Ensure AR.js feed is ready
  if (!arCamera) {
    console.error("AR.js camera feed not found.");
    return;
  }

  function detectHands() {
    model.detect(arCamera).then((predictions) => {
      if (predictions.length > 0) {
        const hand = predictions[0].bbox; // Bounding box: [x, y, width, height]
        updateHandFrame(hand);
      } else {
        handFrame.style.display = 'none';
      }
      requestAnimationFrame(detectHands); // Loop for real-time detection
    });
  }

  detectHands();
}

// Update Frame Position and Size
function updateHandFrame([x, y, width, height]) {
  handFrame.style.display = 'block';
  handFrame.style.left = `${x}px`;
  handFrame.style.top = `${y}px`;
  handFrame.style.width = `${width}px`;
  handFrame.style.height = `${height}px`;
}
