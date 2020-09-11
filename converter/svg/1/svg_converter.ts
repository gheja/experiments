function svgPath(inputStrings: string, dx: number, dy: number, sx: number, sy: number, mirror: boolean)
{
    let input, inputString, points, params, output, sides, op, i, x, y, a, b;

    function round2(x)
    {
        return Math.round(x * 10) / 10;
    }

    sides = -1;
    output = "SET_SCALE, 1,\n";

    for (inputString of inputStrings.split("\n"))
    {
        input = inputString.split(" ");

        i = 0;
        x = 0;
        y = 0;

        points = [];

        while (i < input.length)
        {
            op = input[i++];
            params = [];

            while (i < input.length)
            {
                a = input[i++];

                if (/^[a-zA-Z]+$/.test(a))
                {
                    i--;
                    break;
                }

                params.push(a);
            }

            console.log(op, params);

            if (params.length > 0)
            {
                switch (op)
                {
                    case "M":
                        b = params[0].split(",");
                        x = parseFloat(b[0]);
                        y = parseFloat(b[1]);
                        points.push([x, y]);
                        break;

                    case "m":
                        b = params[0].split(",");
                        x += parseFloat(b[0]);
                        y += parseFloat(b[1]);
                        points.push([x, y]);
                        break;

                    case "H":
                        params.forEach(c =>
                        {
                            x = parseFloat(c);
                            points.push([x, y]);
                        });
                        break;

                    case "h":
                        params.forEach(c =>
                        {
                            x += parseFloat(c);
                            points.push([x, y]);
                        });
                        break;

                    case "V":
                        params.forEach(c =>
                        {
                            y = parseFloat(c);
                            points.push([x, y]);
                        });
                        break;

                    case "v":
                        params.forEach(c =>
                        {
                            y += parseFloat(c);
                            points.push([x, y]);
                        });
                        break;

                    case "L":
                        params.forEach(c =>
                        {
                            b = c.split(",");
                            x = parseFloat(b[0]);
                            y = parseFloat(b[1]);
                            points.push([x, y]);
                        });
                        break;

                    case "l":
                        params.forEach(c =>
                        {
                            b = c.split(",");
                            x += parseFloat(b[0]);
                            y += parseFloat(b[1]);
                            points.push([x, y]);
                        });
                        break;
                }
                console.log([ x, y ]);
            }
        }

        if (points.length == 0)
        {
            continue;
        }

        points.forEach((x, i, array) => { array[i] = [ (x[0] + dx) * sx, (x[1] + dy) * sy ]; })

        if (mirror)
        {
            points.forEach((x, i, array) => { array[i][1] *= -1; })
        }

        points.forEach((x, i, array) => { array[i] = [ round2(x[0]), round2(x[1]) ]; })
        // points.forEach((x, i, array) => { array[i] = [ Math.round(x[0]), Math.round(x[1]) ]; })

        if (points.length != sides)
        {
            sides = points.length;
            output += "SHAPE_SET_SIDES, " + sides + ",\n";
        }

        output += "SHAPE_SLICE_POINTS, ";
        points.forEach((x) => { output += x[0] + "," + x[1] + ","; });
        output += "\n";
    }

    console.log(output);

    return output;
}

function run()
{
    let s;

    s = svgPath((document.getElementById("input") as HTMLTextAreaElement).value,0, -297, 1, 1, true);

    (document.getElementById("result") as HTMLTextAreaElement).value = s;
}

function init()
{
    document.getElementById("go").addEventListener("click", run.bind(null));
}

window.addEventListener("load", init);
