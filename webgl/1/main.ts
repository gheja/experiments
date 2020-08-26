/*
    This code is based heavily on Xem's WebGL guide.
    https://xem.github.io/articles/webgl-guide.html

    Thanks Xem!
*/
let gl;
let cubeAngle;
let cameraMatrix;
let model;
let mvp;
let inverseTranspose;
let indicesLength;

function tick()
{
    cubeAngle += .01;

    // Set the model matrix
    let modelMatrix = identity();
    modelMatrix = transform(modelMatrix, {ry: cubeAngle});
    gl.uniformMatrix4fv(model, false, modelMatrix);

    // Set the cube's mvp matrix (camera x model)
    let mvpMatrix = multMat4Mat4(cameraMatrix, modelMatrix);
    gl.uniformMatrix4fv(mvp, false, mvpMatrix);

    // Set the inverse transpose of the model matrix
    let inverseTransposeMatrix = transpose(inverse(modelMatrix));
    gl.uniformMatrix4fv(inverseTranspose, false, inverseTransposeMatrix);

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);
}

function init() {
    // WebGL canvas context
    gl = document.getElementById("canvas").getContext('webgl');

    let vshader = `
attribute vec4 position; 
attribute vec4 color;
attribute vec4 normal;
uniform mat4 mvp;
uniform mat4 model;            // model matrix
uniform mat4 inverseTranspose; // inversed transposed model matrix
varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_position;
void main() {

  // Apply the model matrix and the camera matrix to the vertex position
  gl_Position = mvp * position;
  
  // Set varying position for the fragment shader
  v_position = vec3(model * position);
  
  // Recompute the face normal
  v_normal = normalize(vec3(inverseTranspose * normal));
  
  // Set the color
  v_color = color;
}`;


// Fragment shader program
    let fshader = `
precision mediump float;
uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientLight;
varying vec3 v_normal;
varying vec3 v_position;
varying vec4 v_color;
void main() {

  // Compute direction between the light and the current point
  vec3 lightDirection = normalize(lightPosition - v_position);

  // Compute angle between the normal and that direction
  float nDotL = max(dot(lightDirection, v_normal), 0.0);

  // Compute diffuse light proportional to this angle
  vec3 diffuse = lightColor * v_color.rgb * nDotL;

  // Compute ambient light
  vec3 ambient = ambientLight * v_color.rgb;

  // Compute total light (diffuse + ambient)
  gl_FragColor = vec4(diffuse + ambient, 1.0);
}
`;


    // Compile program
    let program = compile(gl, vshader, fshader);

    // Initialize a cube
    let vertices, normals, indices;
    [vertices, normals, indices] = cube();

    // Count vertices
    indicesLength = indices.length;

    // Set position, normal buffers
    buffer(gl, vertices, program, 'position', 3, gl.FLOAT);
    buffer(gl, normals, program, 'normal', 3, gl.FLOAT);

    // Set indices
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Set cube color
    let color = gl.getAttribLocation(program, 'color');
    gl.vertexAttrib3f(color, 1, 0, 0);

    // Set the clear color and enable the depth test
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    // Set the camera
    cameraMatrix = perspective({fov: deg2rad(30), aspect: 1, near: 1, far: 100});
    cameraMatrix = transform(cameraMatrix, {z: -3.5, rx: .5, ry: -.5});

    // Set the point light color and position
    let lightColor = gl.getUniformLocation(program, 'lightColor');
    gl.uniform3f(lightColor, 1, 1, 1);

    let lightPosition = gl.getUniformLocation(program, 'lightPosition');
    gl.uniform3f(lightPosition, 1.5, 1.5, 1.5);

    // Set the ambient light color
    let ambientLight = gl.getUniformLocation(program, 'ambientLight');
    gl.uniform3f(ambientLight, 0.1, 0.1, 0.1);

    // Get uniforms used in the loop
    model = gl.getUniformLocation(program, 'model');
    mvp = gl.getUniformLocation(program, 'mvp');
    inverseTranspose = gl.getUniformLocation(program, 'inverseTranspose');

    cubeAngle = 0;

    // Loop
    window.setInterval(tick, 16);
}

window.addEventListener("load", init);