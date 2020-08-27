/*
    This code is based heavily on Xem's WebGL guide.
    https://xem.github.io/articles/webgl-guide.html

    Thanks Xem!
*/

// Compile a WebGL program from a vertex shader and a fragment shader
function compile(gl, vshader, fshader): WebGLProgram
{
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);

    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fshader);
    gl.compileShader(fs);

    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    console.log('vertex shader:', gl.getShaderInfoLog(vs) || 'OK');
    console.log('fragment shader:', gl.getShaderInfoLog(fs) || 'OK');
    console.log('program:', gl.getProgramInfoLog(program) || 'OK');

    return program;
}

// Bind a data buffer to an attribute, fill it with data and enable it
function buffer(gl, data, program, attribute, size, type)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    let a = gl.getAttribLocation(program, attribute);
    gl.vertexAttribPointer(a, size, type, false, 0, 0);
    gl.enableVertexAttribArray(a);
}


///// matrix
// Create an identity mat4
function identity()
{
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

// Compute the multiplication of two mat4
function multMat4Mat4(a, b)
{
    let i, ai0, ai1, ai2, ai3;
    let c = new Float32Array(16);
    for (i = 0; i < 4; i++) {
        ai0 = a[i];
        ai1 = a[i+4];
        ai2 = a[i+8];
        ai3 = a[i+12];
        c[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
        c[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
        c[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
        c[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
    return c;
}

// Create a perspective matrix
// options: fov, aspect, near, far
function perspective(options)
{
    let fov = options.fov || 1.5;
    let aspect = options.ratio || 1; // canvas.width / canvas.height
    let near = options.near || 0.01; // can't be 0
    let far = options.far || 100;
    let f = 1 / Math.tan(fov);
    let nf = 1 / (near - far);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * near * far) * nf, 0
    ]);
}

// Create an orthogonal matrix
// options: top, bottom, left, right, near, far
function orthogonal(options)
{
    let top = options.top;
    let bottom = options.bottom;
    let left = options.left;
    let right = options.right;
    let near = options.near || 0;
    let far = options.far || 100;
    let rw = 1 / (right - left);
    let rh = 1 / (top - bottom);
    let rd = 1 / (far - near);
    return new Float32Array([
        2 * rw, 0, 0, 0,
        0, 2 * rh, 0, 0,
        0, 0, -2 * rd, 0,
        -(right + left) * rw, -(top + bottom) * rh, -(far + near) * rd, 1
    ]);
}

// Transform a mat4
// options: x/y/z (translate), rx/ry/rz (rotate), sx/sy/sz (scale)
function transform(mat, options)
{

    let out = new Float32Array(mat);

    let x = options.x ?? 0;
    let y = options.y ?? 0;
    let z = options.z ?? 0;

    let sx = options.sx ?? 1;
    let sy = options.sy ?? 1;
    let sz = options.sz ?? 1;

    let rx = options.rx;
    let ry = options.ry;
    let rz = options.rz;

    // translate
    if(x || y || z){
        out[12] += out[0] * x + out[4] * y + out[8]  * z;
        out[13] += out[1] * x + out[5] * y + out[9]  * z;
        out[14] += out[2] * x + out[6] * y + out[10] * z;
        out[15] += out[3] * x + out[7] * y + out[11] * z;
    }

    // Rotate
    if(rx) out.set(multMat4Mat4(out, new Float32Array([1, 0, 0, 0, 0, Math.cos(rx), Math.sin(rx), 0, 0, -Math.sin(rx), Math.cos(rx), 0, 0, 0, 0, 1])));
    if(ry) out.set(multMat4Mat4(out, new Float32Array([Math.cos(ry), 0, -Math.sin(ry), 0, 0, 1, 0, 0, Math.sin(ry), 0, Math.cos(ry), 0, 0, 0, 0, 1])));
    if(rz) out.set(multMat4Mat4(out, new Float32Array([Math.cos(rz), Math.sin(rz), 0, 0, -Math.sin(rz), Math.cos(rz), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));

    // Scale
    if(sx !== 1){
        out[0] *= sx;
        out[1] *= sx;
        out[2] *= sx;
        out[3] *= sx;
    }
    if(sy !== 1){
        out[4] *= sy;
        out[5] *= sy;
        out[6] *= sy;
        out[7] *= sy;
    }
    if(sz !== 1){
        out[8] *= sz;
        out[9] *= sz;
        out[10] *= sz;
        out[11] *= sz;
    }

    return out;
}


// Create a matrix representing a rotation around an arbitrary axis [x, y, z]
function fromRotation(axis, angle)
{

    let x = axis[0], y = axis[1], z = axis[2];
    let len = Math.hypot(x, y, z);
    let s, c, t;

    if (!len) return null;

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(angle);
    c = Math.cos(angle);
    t = 1 - c;

    return new Float32Array([
        x * x * t + c,      y * x * t + z * s,  z * x * t - y * s,   0,
        x * y * t - z * s,  y * y * t + c,      z * y * t + x * s,   0,
        x * z * t + y * s,  y * z * t - x * s,  z * z * t + c,       0,
        0, 0, 0, 1
    ]);
}

// Apply a matrix transformation to a custom axis
function transformMat4(a, m)
{
    let x = a[0],
        y = a[1],
        z = a[2];
    let w = (m[3] * x + m[7] * y + m[11] * z + m[15])|| 1.0;

    return new Float32Array([
        (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
        (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
        (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
    ]);
}

// Get the transposed of a mat4
function transpose(m)
{
    return new Float32Array([
        m[0], m[4], m[8],  m[12],
        m[1], m[5], m[9],  m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
    ]);
}

// Get the inverse of a mat4
// The mat4 is not modified, a new mat4 is returned
function inverse(m)
{
    let inv, det, i;

    inv = new Float32Array([
        m[5]*m[10]*m[15]  - m[5]*m[11]*m[14] - m[9]*m[6]*m[15] + m[9]*m[7]*m[14] + m[13]*m[6]*m[11] - m[13]*m[7]*m[10],
        -m[1]*m[10]*m[15] + m[1]*m[11]*m[14] + m[9]*m[2]*m[15] - m[9]*m[3]*m[14] - m[13]*m[2]*m[11] + m[13]*m[3]*m[10],
        m[1]*m[6]*m[15]   - m[1]*m[7]*m[14]  - m[5]*m[2]*m[15] + m[5]*m[3]*m[14] + m[13]*m[2]*m[7]  - m[13]*m[3]*m[6],
        -m[1]*m[6]*m[11]  + m[1]*m[7]*m[10]  + m[5]*m[2]*m[11] - m[5]*m[3]*m[10] - m[9]*m[2]*m[7]   + m[9]*m[3]*m[6],
        -m[4]*m[10]*m[15] + m[4]*m[11]*m[14] + m[8]*m[6]*m[15] - m[8]*m[7]*m[14] - m[12]*m[6]*m[11] + m[12]*m[7]*m[10],
        m[0]*m[10]*m[15]  - m[0]*m[11]*m[14] - m[8]*m[2]*m[15] + m[8]*m[3]*m[14] + m[12]*m[2]*m[11] - m[12]*m[3]*m[10],
        -m[0]*m[6]*m[15]  + m[0]*m[7]*m[14]  + m[4]*m[2]*m[15] - m[4]*m[3]*m[14] - m[12]*m[2]*m[7]  + m[12]*m[3]*m[6],
        m[0]*m[6]*m[11]   - m[0]*m[7]*m[10]  - m[4]*m[2]*m[11] + m[4]*m[3]*m[10] + m[8]*m[2]*m[7]   - m[8]*m[3]*m[6],
        m[4]*m[9]*m[15]   - m[4]*m[11]*m[13] - m[8]*m[5]*m[15] + m[8]*m[7]*m[13] + m[12]*m[5]*m[11] - m[12]*m[7]*m[9],
        -m[0]*m[9]*m[15]  + m[0]*m[11]*m[13] + m[8]*m[1]*m[15] - m[8]*m[3]*m[13] - m[12]*m[1]*m[11] + m[12]*m[3]*m[9],
        m[0]*m[5]*m[15]   - m[0]*m[7]*m[13]  - m[4]*m[1]*m[15] + m[4]*m[3]*m[13] + m[12]*m[1]*m[7]  - m[12]*m[3]*m[5],
        -m[0]*m[5]*m[11]  + m[0]*m[7]*m[9]   + m[4]*m[1]*m[11] - m[4]*m[3]*m[9]  - m[8]*m[1]*m[7]   + m[8]*m[3]*m[5],
        -m[4]*m[9]*m[14]  + m[4]*m[10]*m[13] + m[8]*m[5]*m[14] - m[8]*m[6]*m[13] - m[12]*m[5]*m[10] + m[12]*m[6]*m[9],
        m[0]*m[9]*m[14]   - m[0]*m[10]*m[13] - m[8]*m[1]*m[14] + m[8]*m[2]*m[13] + m[12]*m[1]*m[10] - m[12]*m[2]*m[9],
        -m[0]*m[5]*m[14]  + m[0]*m[6]*m[13]  + m[4]*m[1]*m[14] - m[4]*m[2]*m[13] - m[12]*m[1]*m[6]  + m[12]*m[2]*m[5],
        m[0]*m[5]*m[10]   - m[0]*m[6]*m[9]   - m[4]*m[1]*m[10] + m[4]*m[2]*m[9]  + m[8]*m[1]*m[6]   - m[8]*m[2]*m[5]
    ]);

    det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];

    if(!det) return m;

    det = 1 / det;

    for(i = 0; i < 16; i++) {
        inv[i] *= det;
    }
    return inv;
}

// Get the inverse transpose of a mat4
/*
function inverseTranspose(m)
{
    return transpose(inverse(m));
}
*/

// Place a camera at the position [cameraX, cameraY, cameraZ], make it look at the point [targetX, targetY, targetZ].
// Optional: a "up" vector can be defined to tilt the camera on one side (vertical by default).
function lookAt(mat, cameraX, cameraY, cameraZ, targetX, targetY, targetZ, upX = 0, upY = 1, upZ = 0)
{
    let fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
    fx = targetX - cameraX;
    fy = targetY - cameraY;
    fz = targetZ - cameraZ;
    rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;
    sx = fy * upZ - fz * upY;
    sy = fz * upX - fx * upZ;
    sz = fx * upY - fy * upX;
    rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;
    ux = sy * fz - sz * fy;
    uy = sz * fx - sx * fz;
    uz = sx * fy - sy * fx;
    let l = new Float32Array([
        sx, ux, -fx, 0,
        sy, uy, -fy, 0,
        sz, uz, -fz, 0,
        0,  0,  0,   1
    ]);
    l = transform(l, {x: -cameraX, y: -cameraY, z: -cameraZ});
    return multMat4Mat4(mat, l);
}




function calculateNormals(vertices: Float32Array, indices: Uint16Array): Float32Array
{
    let normals: Float32Array;
    let i: number;
    let ia: number, ib: number, ic: number;
    let va, vb, vc;
    let b;
    let edgeAB, edgeAC;

    function minus(a: Float32Array, b: Float32Array): Float32Array
    {
        return new Float32Array([ a[0] - b[0], a[1] - b[1], a[2] - b[2] ]);
    }

    function cross(a: Float32Array, b: Float32Array): Float32Array
    {
/*
        cx = aybz − azby
        cy = azbx − axbz
        cz = axby − aybx
*/
        return new Float32Array([ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ]);
    }

    function add(a: Float32Array, i, b: Float32Array)
    {
/*
        a[i] = b[0];
        a[i+1] = b[1];
        a[i+2] = b[2];
*/
        a[i] += b[0];
        a[i+1] += b[1];
        a[i+2] += b[2];
    }

    normals = new Float32Array(vertices.length);

    for (i=0; i<indices.length; i+=3)
    {
        ia = indices[i] * 3;
        ib = indices[i+1] * 3;
        ic = indices[i+2] * 3;
        va = [ vertices[ia], vertices[ia + 1], vertices[ia + 2] ];
        vb = [ vertices[ib], vertices[ib + 1], vertices[ib + 2] ];
        vc = [ vertices[ic], vertices[ic + 1], vertices[ic + 2] ];
        edgeAB = minus(vb, va);
        edgeAC = minus(vc, va);
        b = cross(edgeAB, edgeAC);
        add(normals, ia, b);
        add(normals, ib, b);
        add(normals, ic, b);
    }

    for (i=0; i<normals.length; i+=3)
    {
        b = Math.sqrt(normals[i]**2 + normals[i+1]**2 + normals[i+2]**2);

        if (b != 0)
        {
            normals[i] /= b;
            normals[i+1] /= b;
            normals[i+2] /= b;
        }
    }

    return normals;
}

///// shapes
// Declare a cube (2x2x2)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)]
//
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3
function cube(): [ Float32Array, Float32Array, Uint16Array ]
{

    let vertices = new Float32Array([
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // back
    ]);

    let normals = new Float32Array([
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // back
    ]);

    let indices = new Uint16Array([
        0, 1, 2,   0, 2, 3,  // front
        4, 5, 6,   4, 6, 7,  // right
        8, 9, 10,  8, 10,11, // up
        12,13,14,  12,14,15, // left
        16,17,18,  16,18,19, // down
        20,21,22,  20,22,23  // back
    ]);

    return [vertices, normals, indices];
}

function cube2(): [ Float32Array, Uint16Array ]
{

    let vertices = new Float32Array([
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // back
    ]);

    let indices = new Uint16Array([
        0, 1, 2,   0, 2, 3,  // front
        4, 5, 6,   4, 6, 7,  // right
        8, 9, 10,  8, 10,11, // up
        12,13,14,  12,14,15, // left
        16,17,18,  16,18,19, // down
        20,21,22,  20,22,23  // back
    ]);

    return [vertices, indices];
}

// Declare a sphere (customizable precision, radius = 1)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)]
function sphere(precision = 25)
{
    let i, ai, si, ci;
    let j, aj, sj, cj;
    let p1, p2;
    let positions = [];
    let indices = [];

    // Coordinates
    for (j = 0; j <= precision; j++) {
        aj = j * Math.PI / precision;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= precision; i++) {
            ai = i * 2 * Math.PI / precision;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            positions.push(si * sj);  // X
            positions.push(cj);       // Y
            positions.push(ci * sj);  // Z
        }
    }

    // Indices
    for (j = 0; j < precision; j++) {
        for (i = 0; i < precision; i++) {
            p1 = j * (precision+1) + i;
            p2 = p1 + (precision+1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }

    return [new Float32Array(positions), new Float32Array(positions), new Uint16Array(indices)];
}

function sphere2()
{
    let a = sphere();
    return [ a[0], a[2] ];
}

// Declare a pyramid (base: 1x1 square, sides: equilateral triangles)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)]
function pyramid()
{
    let vertices = new Float32Array([
        -0.5, 0.0, 0.5,     0.5, 0.0, 0.5,   0.0, 0.866, 0.0,  // Front
        0.5, 0.0, 0.5,     0.5, 0.0, -0.5,  0.0, 0.866, 0.0,  // Right
        0.5, 0.0, -0.5,   -0.5, 0.0, -0.5,  0.0, 0.866, 0.0,  // Back
        -0.5, 0.0, -0.5,   -0.5, 0.0, 0.5,   0.0, 0.866, 0.0,  // Left
        -0.5, 0.0, 0.5,    -0.5, 0.0, -0.5,   0.5, 0.0, 0.5,   // Base 1
        -0.5, 0.0, -0.5,    0.5, 0.0, -0.5,   0.5, 0.0, 0.5    // Base 2
    ]);

    let normals = new Float32Array([
        0, -0.5, 0.866,   0, -0.5, 0.866,  0, -0.5, 0.866,  // Back
        0.866, -0.5, 0,   0.866, -0.5, 0,  0.866, -0.5, 0,  // Left
        0, -0.5, -0.866,  0, -0.5, -0.866, 0, -0.5, -0.866, // Front
        -0.866, -0.5, 0, -0.866, -0.5, 0, -0.866, -0.5, 0,  // Right
        0, 1, 0,          0, 1, 0,         0, 1, 0,         // Base
        0, 1, 0,          0, 1, 0,         0, 1, 0
    ]);

    let indices = new Uint16Array([
        0, 1, 2,    // Front
        3, 4, 5,    // Right
        6, 7, 8,    // Back
        9, 10, 11,  // Left
        12, 13, 14,  15, 16, 17 // Base
    ]);

    return [vertices, normals, indices];
}


// Draw the current shape
function drawShape(gl, program, cameraMatrix, modelMatrix, n, sx = 1, sy = 1, sz = 1)
{

    // Set the model matrix (add the custom scale if any)
    let model = gl.getUniformLocation(program, 'o');
    modelMatrix = transform(modelMatrix, {sx, sy, sz});
    gl.uniformMatrix4fv(model, false, modelMatrix);

    // Set the cube's mvp matrix (camera x model)
    let mvpMatrix = multMat4Mat4(cameraMatrix, modelMatrix);
    let mvp = gl.getUniformLocation(program, 'm');
    gl.uniformMatrix4fv(mvp, false, mvpMatrix);

    // Set the inverse transpose of the model matrix
    let inverseTransposeMatrix = transpose(inverse(modelMatrix));
    let inverseTranspose = gl.getUniformLocation(program, 'i');
    gl.uniformMatrix4fv(inverseTranspose, false, inverseTransposeMatrix);

    // Render
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

// Convert deg in radians
function deg2rad(angle)
{
    return Math.PI * angle / 180;
}
