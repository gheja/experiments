class ObjConverter
{
    constructor()
    {
    }

    parse(input)
    {
        let i: number;
        let lines: Array<string>;
        let line: string;
        let a: Array<string>;
        let v: Array<number>;
        let vertices: Array<Array<number>>;
        let indices: Array<Array<number>>;
        let result: Array<any>;
        let s: string;

        function firstNumber(x: string)
        {
            let a;
            a = /^[0-9]+/.exec(x);

            if (a.length > 0)
            {
                return a[0];
            }

            throw new Error("Could not find the first number.");
        }

        vertices = [];
        indices = [];

        lines = input.split("\n");

        for (line of lines)
        {
            line = line.trim();

            if (line.startsWith("#"))
            {
                continue;
            }

            a = line.split(" ");

            switch (a[0])
            {
                case "v":
                    vertices.push([ parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3]) ]);
                break;

                case "f":
                    indices.push([ firstNumber(a[1]) - 1, firstNumber(a[2]) - 1, firstNumber(a[3]) - 1 ]);

                    if (a.length == 5)
                    {
                        indices.push([ firstNumber(a[1]) - 1, firstNumber(a[3]) - 1, firstNumber(a[4]) - 1 ]);
                    }
                break;

                case "mtllib":
                case "o":
                case "vt":
                case "vn":
                case "usemtl":
                case "s":
                break;

                default:
                    console.log(`Unknown keyword "${a[0]}"`);
                break;
            }
        }


        function getNumber(a: Array<Array<number>>, index: number): Array<number>
        {
            let result: Array<number>;
            let b: Array<number>;

            result = [];

            for (b of a)
            {
                result.push(b[index]);
            }

            return result;
        }

        let resolution = 100;
        let minX, minY, minZ, maxX, maxY, maxZ, padX, padY, padZ, scaleX, scaleY, scaleZ;

        minX = Math.min(...getNumber(vertices, 0));
        maxX = Math.max(...getNumber(vertices, 0));
        minY = Math.min(...getNumber(vertices, 1));
        maxY = Math.max(...getNumber(vertices, 1));
        minZ = Math.min(...getNumber(vertices, 2));
        maxZ = Math.max(...getNumber(vertices, 2));

        scaleX = (maxX - minX) / resolution;
        scaleY = (maxY - minY) / resolution;
        scaleZ = (maxZ - minZ) / resolution;
        padX = minX / scaleX;
        padY = minY / scaleY;
        padZ = minZ / scaleZ;

        for (v of vertices)
        {
            v[0] = Math.round((v[0]) / scaleX - padX);
            v[1] = Math.round((v[1]) / scaleY - padY);
            v[2] = Math.round((v[2]) / scaleZ - padZ);
        }

        result = [ Math.round(padX), Math.round(padY), Math.round(padZ), scaleX, scaleY, scaleZ, vertices, indices ];
        s = JSON.stringify(result)

        console.log(s);
        console.log(s.length);
    }
}
