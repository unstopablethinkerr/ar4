// Gesture Interaction for Rotation and Scaling
AFRAME.registerComponent('gesture-rotation', {
  init: function () {
    this.scaleFactor = 1;
    this.rotationSpeed = 0.005;
    this.isRotating = false;
    this.initialScale = this.el.object3D.scale.clone();

    // Touch Start Event
    this.el.sceneEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isRotating = true;
      }
    });

    // Touch End Event
    this.el.sceneEl.addEventListener('touchend', () => {
      this.isRotating = false;
    });

    // Touch Move Event
    this.el.sceneEl.addEventListener('touchmove', (e) => {
      if (this.isRotating && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.lastX;
        this.el.object3D.rotation.y += deltaX * this.rotationSpeed;
      }
      this.lastX = e.touches[0].clientX;
    });
  }
});

AFRAME.registerComponent('gesture-scale', {
  init: function () {
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    // Touch Start Event
    this.el.sceneEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        this.initialDistance = this.getTouchDistance(e.touches);
      }
    });

    // Touch Move Event
    this.el.sceneEl.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const currentDistance = this.getTouchDistance(e.touches);
        this.scaleFactor = currentDistance / this.initialDistance;
        this.el.object3D.scale.x = this.initialScale.x * this.scaleFactor;
        this.el.object3D.scale.y = this.initialScale.y * this.scaleFactor;
        this.el.object3D.scale.z = this.initialScale.z * this.scaleFactor;
      }
    });
  },

  getTouchDistance: function (touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
});
