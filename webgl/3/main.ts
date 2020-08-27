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

let shapes;
let objects;
let ticks = 0;

function tick()
{
    let obj;

    // Set the model matrix
    let modelMatrix;
    let mvpMatrix;
    let inverseTransposeMatrix;

    ticks++;

    objects[0].ry += 0.013;
    objects[1].ry -= 0.017;
    objects[2].ry -= 0.022;
    objects[0].x += Math.cos(ticks * 0.05) * 0.05;
    objects[1].y += Math.cos(ticks * 0.03) * 0.05;
    objects[2].z += Math.cos(ticks * 0.03) * 0.05;

    gl.useProgram(program);

    let a_position = gl.getAttribLocation(program, "p");
    let a_normal = gl.getAttribLocation(program, "n");
    let a_color = gl.getAttribLocation(program, "c");

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (obj of objects)
    {
        modelMatrix = identity();
        modelMatrix = transform(modelMatrix, { ry: obj.ry, x: obj.x, y: obj.y, z: obj.z });
        gl.uniformMatrix4fv(model, false, modelMatrix);

        // Set the cube's mvp matrix (camera x model)
        mvpMatrix = multMat4Mat4(cameraMatrix, modelMatrix);
        gl.uniformMatrix4fv(mvp, false, mvpMatrix);

        // Set the inverse transpose of the model matrix
        inverseTransposeMatrix = transpose(inverse(modelMatrix));
        gl.uniformMatrix4fv(inverseTranspose, false, inverseTransposeMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.shape.b_p);
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_position);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.shape.b_n);
        gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_normal);

        gl.vertexAttrib3f(a_color, obj.color[0], obj.color[1], obj.color[2]);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.shape.b_i);
        gl.drawElements(gl.TRIANGLES, obj.shape.indices_length, gl.UNSIGNED_SHORT, 0);
    }
}

function getShape0()
{
    function buffer(x, type)
    {
        let a;

        a = gl.createBuffer();
        gl.bindBuffer(type, a);
        gl.bufferData(type, x, gl.STATIC_DRAW);

        return a;
    }

    // Initialize a cube
    let vertices, normals, indices;
    [vertices, normals, indices] = cube();

    return {
        indices: indices,
        b_p: buffer(vertices, gl.ARRAY_BUFFER),
        b_n: buffer(normals, gl.ARRAY_BUFFER),
        b_i: buffer(indices, gl.ELEMENT_ARRAY_BUFFER),
        indices_length: indices.length
    };
}

function createObject(shape, cr, cg, cb)
{
    return {
        shape: shape,
        color: [ cr, cg, cb ],
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
    cameraMatrix = transform(cameraMatrix, { z: -5 });

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
        getShape0()
    ]

    objects = [
        createObject(shapes[0],1, 0, 0),
        createObject(shapes[0],0, 1, 0),
        createObject(shapes[0],0, 0, 1)
    ];

    // Loop
    window.setInterval(tick, 16);
}

window.addEventListener("load", init);