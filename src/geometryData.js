export const vertices = new Float32Array([
  1, 0, 0,  // Right vertex
 -1, 0, 0,  // Left vertex
  0, 1, 0,  // Top vertex
  0, -1, 0, // Bottom vertex
  0, 0, 1,  // Front vertex
  0, 0, -1  // Back vertex
]);

export const indices = new Uint16Array([
  0, 2, 4,  // Top front right triangle
  0, 4, 3,  // Bottom front right triangle
  0, 3, 5,  // Bottom back right triangle
  0, 5, 2,  // Top back right triangle
  1, 4, 2,  // Top front left triangle
  1, 3, 4,  // Bottom front left triangle
  1, 5, 3,  // Bottom back left triangle
  1, 2, 5   // Top back left triangle
]);