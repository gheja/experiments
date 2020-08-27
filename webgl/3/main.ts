/*
    This code is based heavily on Xem's WebGL guide.
    https://xem.github.io/articles/webgl-guide.html

    Thanks Xem!
*/
let gl;
let program;
let cameraMatrix;
let model;
let mvp;
let inverseTranspose;
let indicesLength;

let shapes;

function tick()
{
    let shape;

    // Set the model matrix
    let modelMatrix;
    let mvpMatrix;
    let inverseTransposeMatrix;

    shapes[0].ry += 0.01;
    shapes[1].ry -= 0.02;

    gl.useProgram(program);
/*
    function buffer(gl, data, program, attribute, size, type)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        let a = gl.getAttribLocation(program, attribute);
        gl.vertexAttribPointer(a, size, type, false, 0, 0);
        gl.enableVertexAttribArray(a);
*/
    let a_p = gl.getAttribLocation(program, "p");
    let a_n = gl.getAttribLocation(program, "n");
    let a_c = gl.getAttribLocation(program, "c");

    let b_p = gl.createBuffer();
    let b_n = gl.createBuffer();
    let b_i = gl.createBuffer();

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (shape of shapes)
    {
        modelMatrix = identity();
        modelMatrix = transform(modelMatrix, { ry: shape.ry });
        gl.uniformMatrix4fv(model, false, modelMatrix);

        // Set the cube's mvp matrix (camera x model)
        mvpMatrix = multMat4Mat4(cameraMatrix, modelMatrix);
        gl.uniformMatrix4fv(mvp, false, mvpMatrix);

        // Set the inverse transpose of the model matrix
        inverseTransposeMatrix = transpose(inverse(modelMatrix));
        gl.uniformMatrix4fv(inverseTranspose, false, inverseTransposeMatrix);

        // gl.bindVertexArray(shape.vao);
        gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);

        // Count vertices
        indicesLength = shape.indices.length;

        // Set position, normal buffers
        // buffer(gl, shape.vertices, program, 'p', 3, gl.FLOAT);
        // buffer(gl, shape.normals, program, 'n', 3, gl.FLOAT);

        gl.bindBuffer(gl.ARRAY_BUFFER, b_p);
        gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_p, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, b_n);
        gl.bufferData(gl.ARRAY_BUFFER, shape.normals, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_n, 3, gl.FLOAT, false, 0, 0);

        // Set indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b_i);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shape.indices, gl.STATIC_DRAW);

        // Set cube color
        gl.vertexAttrib3f(a_c, shape.color[0], shape.color[1], shape.color[2]);

        gl.enableVertexAttribArray(a_p);
        gl.enableVertexAttribArray(a_n);

    }

}

function getShape(cr, cg, cb)
{
    // Initialize a cube
    let vertices, normals, indices;
    [vertices, normals, indices] = cube();

    return {
        vertices: vertices,
        normals: normals,
        indices: indices,
        color: [ cr, cg, cb ],
        vao: 0,
        ry: 0,
        x: 0,
        y: 0,
        z: 0
    };
}

function init() {
    // WebGL canvas context
    gl = (document.getElementById("canvas") as HTMLCanvasElement).getContext('webgl');
    let vshader = `attribute vec4 p,c,n;uniform mat4 m,o,i;varying vec4 vc;varying vec3 vn,vp;void main(){gl_Position=m*p;vp=vec3(o*p);vn=normalize(vec3(i*n));vc=c;}`;
    let fshader = `precision mediump float;uniform vec3 lc,lp,al;varying vec3 vn,vp;varying vec4 vc;void main(){vec3 l=normalize(lp-vp);float n=max(dot(l,vn),0.0);vec3 q=lc*vc.rgb*n+al*vc.rgb;gl_FragColor=vec4(q,1.0);}`;

    program = compile(gl, vshader, fshader);

    gl.clearColor(0, 0, 0.2, 1);
    gl.enable(gl.DEPTH_TEST);

    // Set the camera
    cameraMatrix = perspective({ fov: 0.5, aspect: 1, near: 1, far: 100 });
    cameraMatrix = transform(cameraMatrix, { z: -3.5, rx: .5, ry: -.5 });

    // Set the point light color and position
    let lightColor = gl.getUniformLocation(program, 'lc');
    gl.uniform3f(lightColor, 1, 1, 1);

    let lightPosition = gl.getUniformLocation(program, 'lp');
    gl.uniform3f(lightPosition, 1.5, 1.5, 1.5);

    // Set the ambient light color
    let ambientLight = gl.getUniformLocation(program, 'al');
    gl.uniform3f(ambientLight, 0.1, 0.1, 0.1);

    // Get uniforms used in the loop
    model = gl.getUniformLocation(program, 'o');
    mvp = gl.getUniformLocation(program, 'm');
    inverseTranspose = gl.getUniformLocation(program, 'i');

    shapes = [
        getShape(1, 0, 0),
        getShape(0, 1, 0)
    ];

    // Loop
    window.setInterval(tick, 16);
}

window.addEventListener("load", init);