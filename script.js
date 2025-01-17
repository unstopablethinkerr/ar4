// Wait for the scene to load
document.querySelector('a-scene').addEventListener('loaded', function () {
    const sceneEl = document.querySelector('a-scene');
    const objects = [
        document.getElementById('object1'),
        document.getElementById('object2'),
        document.getElementById('object3')
    ];

    // Initialize Handpose
    let handposeModel;
    let videoElement;

    async function setupHandpose() {
        // Get the video feed from AR.js
        videoElement = document.querySelector('a-scene').systems.arjs.getSource().domElement;

        // Load the Handpose model
        handposeModel = await handpose.load();

        // Start hand detection
        detectHand();
    }

    async function detectHand() {
        if (!handposeModel || !videoElement) return;

        // Detect hands in the video feed
        const predictions = await handposeModel.estimateHands(videoElement);
        if (predictions.length > 0) {
            const hand = predictions[0];
            const indexFingerTip = hand.annotations.indexFinger[3]; // Tip of the index finger

            // Convert finger tip position to screen coordinates
            const screenX = indexFingerTip[0];
            const screenY = indexFingerTip[1];

            // Raycast to detect which object is being pointed at
            const intersection = sceneEl.components.raycaster.intersectObjects(objects);
            if (intersection.length > 0) {
                const pointedObject = intersection[0].object.el;
                animateObject(pointedObject);
            }
        }

        // Continue detecting hands
        requestAnimationFrame(detectHand);
    }

    // Function to animate the pointed object
    function animateObject(object) {
        object.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 0',
            dur: 2000,
            loop: false
        });
    }

    // Initialize Handpose
    setupHandpose();
});