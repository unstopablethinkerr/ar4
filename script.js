const handFrame = document.getElementById('hand-frame');

// Initialize MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});
hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

// Access AR.js camera feed
const videoElement = document.querySelector('a-scene canvas');

// Hand Detection
hands.onResults((results) => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const hand = results.multiHandLandmarks[0];
    const bounds = calculateBoundingBox(hand);
    updateHandFrame(bounds);
  } else {
    handFrame.style.display = 'none';
  }
});

// Calculate Bounding Box
function calculateBoundingBox(landmarks) {
  const x = landmarks.map((p) => p.x);
  const y = landmarks.map((p) => p.y);
  return {
    left: Math.min(...x) * videoElement.width,
    top: Math.min(...y) * videoElement.height,
    width: (Math.max(...x) - Math.min(...x)) * videoElement.width,
    height: (Math.max(...y) - Math.min(...y)) * videoElement.height,
  };
}

// Update Frame Position and Size
function updateHandFrame({ left, top, width, height }) {
  handFrame.style.display = 'block';
  handFrame.style.left = `${left}px`;
  handFrame.style.top = `${top}px`;
  handFrame.style.width = `${width}px`;
  handFrame.style.height = `${height}px`;
}

// Start AR.js and Hand Tracking
async function startAR() {
  hands.initialize();
  const videoTrack = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
  }).then((stream) => stream.getVideoTracks()[0]);

  const settings = videoTrack.getSettings();
  videoElement.width = settings.width || 640;
  videoElement.height = settings.height || 480;

  const context = document.createElement('canvas').getContext('2d');
  context.canvas.width = videoElement.width;
  context.canvas.height = videoElement.height;

  function processFrame() {
    context.drawImage(videoElement, 0, 0, context.canvas.width, context.canvas.height);
    hands.send({ image: context.canvas });
    requestAnimationFrame(processFrame);
  }
  
  processFrame();
}

startAR();
