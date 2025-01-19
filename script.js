const video = document.getElementById('camera-feed');
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

// Start Camera
async function initCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
  });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

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
    left: Math.min(...x) * video.videoWidth,
    top: Math.min(...y) * video.videoHeight,
    width: (Math.max(...x) - Math.min(...x)) * video.videoWidth,
    height: (Math.max(...y) - Math.min(...y)) * video.videoHeight,
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

// Main Function
async function main() {
  await initCamera();
  const camera = new Camera(video, {
    onFrame: async () => await hands.send({ image: video }),
  });
  camera.start();
}

main();
