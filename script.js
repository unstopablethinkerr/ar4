// Initialize AR.js and Three.js
AFRAME.registerComponent('hand-tracking', {
    init: function () {
        const sceneEl = this.el;
        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.width = 640;
        video.height = 480;

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                video.srcObject = stream;
                this.loadHandTrackingModel(video, sceneEl);
            })
            .catch(err => {
                console.error('Error accessing the camera: ', err);
            });
    },

    loadHandTrackingModel: async function (video, sceneEl) {
        const model = await handpose.load();
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            const hand = predictions[0];
            const indexFingerTip = hand.landmarks[8];
            const [x, y] = indexFingerTip;
            this.handleSelection(x, y, sceneEl);
        }
        requestAnimationFrame(() => this.loadHandTrackingModel(video, sceneEl));
    },

    handleSelection: function (x, y, sceneEl) {
        const shapes = ['shape1', 'shape2', 'shape3'];
        shapes.forEach(shape => {
            const entity = document.querySelector(`#${shape}`);
            if (entity) {
                const rect = entity.object3D.position;
                const distance = Math.sqrt((x - rect.x) ** 2 + (y - rect.y) ** 2);
                if (distance < 50) {
                    this.animateShape(entity);
                }
            }
        });
    },

    animateShape: function (entity) {
        entity.object3D.position.y += 0.1;
        setTimeout(() => {
            entity.object3D.position.y -= 0.1;
        }, 2000);
    }
});

// Create AR scene
const scene = document.querySelector('a-scene');
scene.setAttribute('hand-tracking', '');

// Add 3D models
const shapes = [
    { id: 'shape1', url: 'https://github.com/unstopablethinkerr/ar3/raw/refs/heads/main/shape1.glb' },
    { id: 'shape2', url: 'https://github.com/unstopablethinkerr/ar3/raw/refs/heads/main/shape2.glb' },
    { id: 'shape3', url: 'https://github.com/unstopablethinkerr/ar3/raw/refs/heads/main/shape3.glb' }
];

shapes.forEach(shape => {
    const entity = document.createElement('a-entity');
    entity.setAttribute('id', shape.id);
    entity.setAttribute('gltf-model', shape.url);
    entity.setAttribute('position', `${Math.random() * 2 - 1} 1 ${Math.random() * 2 - 1}`);
    scene.appendChild(entity);
});
