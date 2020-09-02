/*
    This code is based heavily on Xem's WebGL guide.
    https://xem.github.io/articles/webgl-guide.html

    Thanks Xem!
*/


class WebglBase
{
    gl: WebGLRenderingContext;

    constructor(id: string)
    {
        this.gl = (document.getElementById(id) as HTMLCanvasElement).getContext("webgl");
    }

    // Compile a WebGL program from a vertex shader and a fragment shader
    compile(vshader: string, fshader: string): WebGLProgram
    {
        let vs = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vs, vshader);
        this.gl.compileShader(vs);

        let fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fs, fshader);
        this.gl.compileShader(fs);

        let program = this.gl.createProgram();
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);
        this.gl.linkProgram(program);
        this.gl.useProgram(program);

        console.log('vertex shader:', this.gl.getShaderInfoLog(vs) || 'OK');
        console.log('fragment shader:', this.gl.getShaderInfoLog(fs) || 'OK');
        console.log('program:', this.gl.getProgramInfoLog(program) || 'OK');

        return program;
    }

    calculateNormals(vertices: Float32Array, indices: Uint16Array): Float32Array
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
            return new Float32Array([a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]);
        }

        function add(a: Float32Array, i: number, b: Float32Array)
        {
            a[i] += b[0];
            a[i + 1] += b[1];
            a[i + 2] += b[2];
        }

        normals = new Float32Array(vertices.length);

        // Add all face normals
        for (i = 0; i < indices.length; i += 3)
        {
            ia = indices[i] * 3;
            ib = indices[i + 1] * 3;
            ic = indices[i + 2] * 3;
            va = [vertices[ia], vertices[ia + 1], vertices[ia + 2]];
            vb = [vertices[ib], vertices[ib + 1], vertices[ib + 2]];
            vc = [vertices[ic], vertices[ic + 1], vertices[ic + 2]];
            edgeAB = minus(vb, va);
            edgeAC = minus(vc, va);
            b = cross(edgeAB, edgeAC);
            add(normals, ia, b);
            add(normals, ib, b);
            add(normals, ic, b);
        }

        // Normalize the vectors
        for (i = 0; i < normals.length; i += 3)
        {
            b = Math.sqrt(normals[i] ** 2 + normals[i + 1] ** 2 + normals[i + 2] ** 2);

            if (b != 0)
            {
                normals[i] /= b;
                normals[i + 1] /= b;
                normals[i + 2] /= b;
            }
        }

        return normals;
    }

    createBuffer(x: any, type: number)
    {
        let a;

        a = this.gl.createBuffer();
        this.gl.bindBuffer(type, a);
        this.gl.bufferData(type, x, this.gl.STATIC_DRAW);

        return a;
    }
}