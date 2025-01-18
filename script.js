// Get video and canvas elements
const video = document.getElementById('camera-feed');
const canvas = document.getElementById('overlay');
const context = canvas.getContext('2d');

// Function to enable the back camera
async function enableBackCamera() {
  try {
    // Get all available video devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    // Find the back camera (usually labeled as "environment")
    const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));

    if (!backCamera) {
      throw new Error('Back camera not found.');
    }

    // Set up video constraints for the back camera
    const constraints = {
      video: {
        deviceId: backCamera.deviceId ? { exact: backCamera.deviceId } : undefined,
        facingMode: { exact: 'environment' }, // Ensures the back camera is used
        width: { ideal: window.innerWidth },
        height: { ideal: window.innerHeight },
      },
    };

    // Start the video stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    // Wait for the video to load
    video.onloadedmetadata = () => {
      video.play();
      console.log('Back camera is enabled and streaming.');
    };
  } catch (error) {
    console.error('Error accessing the back camera:', error);
    alert('Unable to access the back camera. Please ensure you are on a supported device.');
  }
}

// Call the function to enable the back camera
enableBackCamera();

// Optional: Add logic to draw on the canvas overlay
function drawOnCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  context.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Example: Red semi-transparent rectangle
  context.fillRect(50, 50, 100, 100); // Draw a rectangle
}

// Example: Draw on the canvas every frame
function animate() {
  drawOnCanvas();
  requestAnimationFrame(animate);
}

animate();