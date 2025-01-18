// Wait for the scene to load
document.querySelector('a-scene').addEventListener('loaded', () => {
  const model = document.querySelector('#model');

  // Pin the object to a specific location in the real world
  let isPinned = false;
  let pinnedPosition = null;
  let pinnedRotation = null;

  // Pin the object when the user taps the screen
  window.addEventListener('touchstart', () => {
    if (!isPinned) {
      // Get the current camera position and rotation
      const camera = document.querySelector('[camera]').object3D;
      const cameraPosition = camera.getWorldPosition(new THREE.Vector3());
      const cameraRotation = camera.getWorldQuaternion(new THREE.Quaternion());

      // Set the object's position and rotation relative to the camera
      pinnedPosition = cameraPosition.clone();
      pinnedRotation = cameraRotation.clone();

      // Mark the object as pinned
      isPinned = true;
    }
  });

  // Update the object's position and rotation based on the camera's movement
  document.querySelector('a-scene').addEventListener('renderstart', () => {
    if (isPinned) {
      const camera = document.querySelector('[camera]').object3D;
      const cameraPosition = camera.getWorldPosition(new THREE.Vector3());
      const cameraRotation = camera.getWorldQuaternion(new THREE.Quaternion());

      // Calculate the object's new position and rotation
      const newPosition = pinnedPosition.clone().sub(cameraPosition);
      const newRotation = pinnedRotation.clone().multiply(cameraRotation.inverse());

      // Update the object's position and rotation
      model.object3D.position.copy(newPosition);
      model.object3D.quaternion.copy(newRotation);
    }
  });
});
