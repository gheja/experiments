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

function glBuffer(x, type)
{
    let a;

    a = gl.createBuffer();
    gl.bindBuffer(type, a);
    gl.bufferData(type, x, gl.STATIC_DRAW);

    return a;
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
function cube2(): tShapeWebglDefinition
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

    let colors = new Uint8Array([
        0, 0, 0, 0,
        1, 1, 1, 1,
        2, 2, 2, 2,
        3, 3, 3, 3,
        4, 4, 4, 4,
        5, 5, 5, 5
    ]);

    return [ vertices, indices, colors ];
}

function cube3(): tShapeWebglDefinition
{
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3
    let vertices = new Float32Array([
        1, 1, 1,   -1, 1, 1,   -1,-1, 1,   1,-1, 1, // front
        1, -1, -1,  1, 1, -1,  -1, 1, -1, -1, -1, -1 // back
    ]);

    let indices = new Uint16Array([
        0, 1, 2,  0, 2, 3,
        5, 0, 3,  5, 3, 4,
        6, 5, 4,  6, 4, 7,
        6, 7, 2,  6, 2, 1,
        3, 2, 7,  3, 7, 4,
        5, 6, 1,  5, 1, 0
    ]);

    let colors = new Uint8Array([
        0, 1, 2, 3,
        2, 3, 4, 5,
    ]);

    return [ vertices, indices, colors ];
}

function createShape(input: tShapeDefinition): tShapeWebglDefinition
{
    let i: number;
    let j: number;
    let c: number;
    let n: number;
    let z1: number, z2: number;
    let autoclose: boolean;
    let scale1: number, scale2: number;
    let sides: number;
    let slice_size: number;
    let mirror_x: boolean;
    let points: Array<Array<number>>;
    let lastPoints: Array<Array<number>>;

    let vertices: Array<number>;
    let indices: Array<number>;
    let colors: Array<number>;

/*
    vertices = new Float32Array()
    indices = new Uint16Array
    colors = new Uint8Array;
*/
    scale2 = 1;
    slice_size = 1;
    vertices = [];
    indices = [];
    colors = [];
    points = [];
    autoclose = true;
    mirror_x = false;

    function createTriangleStrip()
    {
        let i, j;

        for (i=0; i<points.length - 1; i++)
        {
            vertices.push(
                points[i][0] * scale2, points[i][1] * scale2, z2,
                lastPoints[i][0] * scale1, lastPoints[i][1] * scale1, z1,
                points[i+1][0] * scale2, points[i+1][1] * scale2, z2,

                points[i+1][0] * scale2, points[i+1][1] * scale2, z2,
                lastPoints[i][0] * scale1, lastPoints[i][1] * scale1, z1,
                lastPoints[i+1][0] * scale1, lastPoints[i+1][1] * scale1, z1
            );

            for (j=0; j<6; j++)
            {
                // colors.push(...colorPalette[c]);
                colors.push(c);
            }

            indices.push(n++, n++, n++, n++, n++, n++);
        }

        scale1 = scale2;
    }

    i = 0;
    n = 0;
    z2 = 0;

    while (i<input.length)
    {
        switch (input[i++])
        {
            case SHAPE_SET_SCALE:
                scale2 = input[i++];

                if(scale1 === undefined)
                {
                    scale1 = scale2;
                }
            break;

            case SHAPE_SET_COLOR:
                c = input[i++];
            break;

            case SHAPE_SET_SIDES:
                sides = input[i++];
                points = [];
            break;

            case SHAPE_SET_AUTOCLOSE:
                autoclose = !!input[i++];
            break;

            case SHAPE_SET_SLICE_SIZE:
                slice_size = input[i++];
            break;

            case SHAPE_SET_MIRROR_X:
                mirror_x = !!input[i++];
            break;

            case SHAPE_CREATE_SLICE:
                lastPoints = points.slice();
                points = [];

                for (j=0; j<sides; j++)
                {
                    points.push([ input[i++], input[i++] ]);
                }

                if (mirror_x)
                {
                    for (j = points.length - 1; j >= 0; j--)
                    {
                        points.push([ points[j][0] * -1, points[j][1] ]);
                    }
                }
                else if (autoclose)
                {
                    points.push(points[0]);
                }

                if (lastPoints.length > 0)
                {
                    z1 = z2;
                    z2 += slice_size;

                    createTriangleStrip();
                }
            break;

            case SHAPE_REPEAT_SLICE:
                lastPoints = points.slice();

                z1 = z2;
                z2 += slice_size;

                createTriangleStrip();
            break;

            case SHAPE_CLOSE:
                lastPoints = points.slice();
                points = [];
                scale2 = 0;

                for (j=0; j<sides; j++)
                {
                    points.push([ 0, 0 ]);
                }
                if (autoclose)
                {
                    points.push(points[0]);
                }
                createTriangleStrip();
            break;
        }
    }

    return [ new Float32Array(vertices), new Uint16Array(indices), new Uint8Array(colors) ];
}
