const video = document.getElementById('camera-feed');
const handFrame = document.getElementById('hand-frame');
const greenFlash = document.getElementById('green-flash');

// Initialize MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1, // Track one hand
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5,
});

// Add the detection results callback
hands.onResults(onResults);

// Initialize the camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 1280,
  height: 720,
});

// Start the camera feed
camera.start();

/**
 * Callback to handle results from MediaPipe Hands
 * @param {Object} results - The detection results
 */
function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Extract hand landmarks
    const handLandmarks = results.multiHandLandmarks[0];

    // Calculate bounding box
    const xCoords = handLandmarks.map((point) => point.x);
    const yCoords = handLandmarks.map((point) => point.y);

    const xMin = Math.min(...xCoords) * video.videoWidth;
    const yMin = Math.min(...yCoords) * video.videoHeight;
    const xMax = Math.max(...xCoords) * video.videoWidth;
    const yMax = Math.max(...yCoords) * video.videoHeight;

    const width = xMax - xMin;
    const height = yMax - yMin;

    // Update the bounding box position and size
    handFrame.style.display = 'block';
    handFrame.style.left = `${xMin}px`;
    handFrame.style.top = `${yMin}px`;
    handFrame.style.width = `${width}px`;
    handFrame.style.height = `${height}px`;

    // Flash the green border
    greenFlash.style.display = 'block';
    setTimeout(() => {
      greenFlash.style.display = 'none';
    }, 100); // Flash duration (ms)
  } else {
    // Hide the bounding box and green flash if no hand is detected
    handFrame.style.display = 'none';
    greenFlash.style.display = 'none';
  }
}
