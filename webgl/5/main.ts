/*
    This code is based heavily on Xem's WebGL guide.
    https://xem.github.io/articles/webgl-guide.html

    Thanks Xem!
*/
let gl: WebGLRenderingContext;
let program: WebGLProgram;
let cameraMatrix: Float32Array;

let shapes;
let objects;
let ticks: number = 0;

let cam = {
    x: 0,
    y: 0,
    z: -20,
    rx: -1.1,
    ry: 0,
    rz: 0
};

let _editor: Editor;

function render()
{
    let obj;
    let modelMatrix: Float32Array;
    let mvpMatrix: Float32Array;
    let cameraMatrix2: Float32Array;
    let inverseTransposeMatrix: Float32Array;
    let a_position: GLint;
    let a_normal: GLint;
    let a_color: GLint;
    let u_model: WebGLUniformLocation;
    let u_mvp: WebGLUniformLocation;
    let u_inverseTranspose: WebGLUniformLocation;

    cameraMatrix2 = transform(cameraMatrix, cam);

    gl.useProgram(program);

    a_position = gl.getAttribLocation(program, "p");
    a_normal = gl.getAttribLocation(program, "n");
    a_color = gl.getAttribLocation(program, "c");

    u_model = gl.getUniformLocation(program, 'o');
    u_mvp = gl.getUniformLocation(program, 'm');
    u_inverseTranspose = gl.getUniformLocation(program, 'i');

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (obj of objects)
    {
        modelMatrix = identity();
        // obj has x, y, z, rx, ry, rz just like transform() requires in options
        modelMatrix = transform(modelMatrix, obj);
        gl.uniformMatrix4fv(u_model, false, modelMatrix);

        mvpMatrix = multMat4Mat4(cameraMatrix2, modelMatrix);
        gl.uniformMatrix4fv(u_mvp, false, mvpMatrix);

        inverseTransposeMatrix = transpose(inverse(modelMatrix));
        gl.uniformMatrix4fv(u_inverseTranspose, false, inverseTransposeMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.shape.b_p);
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_position);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.shape.b_n);
        gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_normal);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.shape.b_c);
        gl.vertexAttribPointer(a_color, 4, gl.UNSIGNED_BYTE, true, 0, 0);
        gl.enableVertexAttribArray(a_color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.shape.b_i);
        gl.drawElements(gl.TRIANGLES, obj.shape.indices_length, gl.UNSIGNED_SHORT, 0);
    }
}

function tick()
{
    ticks++;

    objects[1].rz += 0.01;

    render();
}

function getShape0()
{
    // Initialize a cube
    let vertices: Float32Array, indices: Uint16Array, colors: Uint8Array, colors2: Uint8Array;
    let i, b;

    [ vertices, indices, colors ] = cube2();

    colors2 = new Uint8Array(colors.length * 4);

    for (i in colors)
    {
        // @ts-ignore
        b = hsla2rgba(...COLOR_PALETTE[colors[i]]);
        colors2.set(b, i * 4);
    }

    return {
        b_p: glBuffer(vertices, gl.ARRAY_BUFFER),
        b_i: glBuffer(indices, gl.ELEMENT_ARRAY_BUFFER),
        b_n: glBuffer(calculateNormals(vertices, indices), gl.ARRAY_BUFFER),
        b_c: glBuffer(colors2, gl.ARRAY_BUFFER),
        indices_length: indices.length
    };
}

function getShape1(input: Array<number>)
{
    function fuzzyHsla(x: tHslaArray, y: number): tHslaArray
    {
        return [
            (x[0] + 1 + y * (Math.random() - 0.5)) % 1,
            x[1],
            x[2],
            x[3]
        ];
    }

    // Initialize a cube
    let vertices: Float32Array, indices: Uint16Array, colors: Uint8Array, colors2: Uint8Array;
    let i, b;

/*
    [ vertices, indices, colors ] = createShape(
        [
            SHAPE_SET_SIDES, 4,
            SHAPE_SET_COLOR, 0,
            SHAPE_SET_SCALE, 1,
            SHAPE_CREATE_SLICE, -1, -1,  -1, 1,  1, 1,  1, -1,
            SHAPE_CREATE_SLICE, -1, -1,  -1, 1,  1, 1,  1, -1,
        ]
    );
*/

    [ vertices, indices, colors ] = createShape(input);

    colors2 = new Uint8Array(colors.length * 4);

/*
    // per vertex
    for (i in colors)
    {
        b = hsla2rgba(...fuzzyHsla(colorPalette[colors[i]], 0.02));
        colors2.set(b, i * 4);
    }
*/

/*
    // per triangle
    for (i=0; i<colors.length; i+=3)
    {
        b = hsla2rgba(...fuzzyHsla(colorPalette[colors[i]], 0.02));
        colors2.set(b, i * 4);
        colors2.set(b, (i+1) * 4);
        colors2.set(b, (i+2) * 4);
    }
*/
    // per face
    for (i=0; i<colors.length; i+=6)
    {
        // @ts-ignore
        b = hsla2rgba(...fuzzyHsla([ ...COLOR_PALETTE[colors[i]], 255 ], 0.02));
        colors2.set(b, i * 4);
        colors2.set(b, (i+1) * 4);
        colors2.set(b, (i+2) * 4);
        colors2.set(b, (i+3) * 4);
        colors2.set(b, (i+4) * 4);
        colors2.set(b, (i+5) * 4);
    }

    return {
        b_p: glBuffer(vertices, gl.ARRAY_BUFFER),
        b_i: glBuffer(indices, gl.ELEMENT_ARRAY_BUFFER),
        b_n: glBuffer(calculateNormals(vertices, indices), gl.ARRAY_BUFFER),
        b_c: glBuffer(colors2, gl.ARRAY_BUFFER),
        indices_length: indices.length
    };
}

function destroyShape(index)
{
    let shape;

    shape = shapes[index];
    gl.deleteBuffer(shape.b_p);
    gl.deleteBuffer(shape.b_i);
    gl.deleteBuffer(shape.b_n);
    gl.deleteBuffer(shape.b_c);
    shapes[index] = null;
}

function createObject(shape, cr, cg, cb)
{
    return {
        shape: shape,
        rx: 0,
        ry: 0,
        rz: 0,
        x: 0,
        y: 0,
        z: 0
    };
}

function init() {
    let vshader: string;
    let fshader: string;

    gl = (document.getElementById("canvas") as HTMLCanvasElement).getContext('webgl');
    vshader = `attribute vec4 p,c,n;uniform mat4 m,o,i;varying vec4 vc;varying vec3 vn,vp;void main(){gl_Position=m*p;vp=vec3(o*p);vn=normalize(vec3(i*n));vc=c;}`;
    fshader = `precision mediump float;uniform vec3 lc,lp,al;varying vec3 vn,vp;varying vec4 vc;void main(){vec3 l=normalize(lp-vp);float n=max(dot(l,vn),0.0);vec3 q=lc*vc.rgb*n+al*vc.rgb;gl_FragColor=vec4(q,1.0);}`;
    program = compile(gl, vshader, fshader);

    gl.clearColor(0, 0, 0.2, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    // Set the camera
    cameraMatrix = perspective({ fov: 0.5, aspect: 1, near: 1, far: 1000 });


    // Set the point light color and position
    let lightColor = gl.getUniformLocation(program, 'lc');
    gl.uniform3f(lightColor, 1, 1, 1);

    let lightPosition = gl.getUniformLocation(program, 'lp');
    gl.uniform3f(lightPosition, 3, -20, 20);

    // Set the ambient light color
    let ambientLight = gl.getUniformLocation(program, 'al');
    gl.uniform3f(ambientLight, 0.1, 0.1, 0.1);

    shapes = [
        getShape1(SHAPE_PLANE),
        getShape1(SHAPE_TRAIN1),
    ];

    objects = [
        createObject(shapes[0],0, 0, 0),
        createObject(shapes[1],0, 0, 0),
    ];

    _editor = new Editor("editor", 1, 1);

    window.setInterval(tick, 1000/60);
}

window.addEventListener("load", init);
