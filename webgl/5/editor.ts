class Editor
{
    textareaDom: HTMLTextAreaElement = null;
    shapeIndex: number;
    objectIndex: number;
    gfx: WebglGfx;

    constructor(gfx, id, shapeIndex, objectIndex)
    {
        this.gfx = gfx;
        this.textareaDom = (document.getElementById(id) as HTMLTextAreaElement);
        this.textareaDom.addEventListener("keyup", this.onTextareaUpdate.bind(this));
        this.shapeIndex = shapeIndex;
        this.objectIndex = objectIndex;

        this.loadFromLocalstorage();
        this.updateFromTextarea();
    }

    getTextareaData()
    {
        return this.textareaDom.value;
    }

    setTextareaData(a: string)
    {
        this.textareaDom.value = a;
    }

    updateFromTextarea()
    {
        this.textareaDom.className = "parsing";

        let input, shape;

        input = null;

        try
        {
            input = eval("[\n" + this.getTextareaData() + "\n]");
            shape = this.gfx.getShape1(input);
        }
        catch (e)
        {
            console.log(e);
            this.textareaDom.className = "failed";
            return;
        }

        this.gfx.destroyShape(this.shapeIndex);
        this.gfx.shapes[this.shapeIndex] = shape;
        this.gfx.objects[this.objectIndex].shape = this.gfx.shapes[this.shapeIndex];
        this.textareaDom.className = "ok";
        this.saveToLocalstorage();
    }

    onTextareaUpdate()
    {
        this.updateFromTextarea();
    }

    loadFromLocalstorage()
    {
        let a;

        a = localStorage.getItem("webgl:5:latest_model");

        if (a === null)
        {
            a = `// base
SHAPE_SET_SIDES, 7,
SHAPE_SET_SCALE, 1,
SHAPE_SLICE_SET_HEIGHT, 1,
SHAPE_SET_MIRROR_X, 1,
SHAPE_SET_COLOR, 2,
SHAPE_SLICE_POINTS, -5, 27, -5, 20, -3, 20, -3, 8, -5, 8, -5, 5, 0, 0,
SHAPE_SLICE_POINTS, -5, 27, -5, 20, -3, 20, -3, 8, -5, 8, -5, 5, 0, 5,
SHAPE_SLICE_SET_HEIGHT, 1,
SHAPE_SLICE_REPEAT,
SHAPE_SLICE_SET_HEIGHT, 0,
SHAPE_SLICE_POINTS, 0, 27, 0, 20, 0, 20, 0, 8, 0, 8, 0, 5, 0, 5,

// chimney
SHAPE_GOTO, 0,10,2,0,0,0,
SHAPE_SET_SCALE, 2.5,
SHAPE_SLICE_SET_HEIGHT, 3,
SHAPE_SLICE_CIRCLE, 13, 1,
SHAPE_SLICE_REPEAT,
SHAPE_SET_SCALE, 3,
SHAPE_SLICE_SET_HEIGHT, 1,
SHAPE_SLICE_REPEAT,
SHAPE_SLICE_SET_HEIGHT, 1,
SHAPE_SLICE_REPEAT,
SHAPE_SET_SCALE, 2,
SHAPE_SLICE_SET_HEIGHT, 0,
SHAPE_SLICE_REPEAT,
SHAPE_SLICE_SET_HEIGHT, -1,
SHAPE_SLICE_REPEAT,
SHAPE_SET_SCALE, 0,
SHAPE_SLICE_REPEAT,

// first dome (to be duplicated)
SHAPE_GOTO, 0,15,2,0,0,0,
SHAPE_SET_COLOR, 3,

SHAPE_COPY_BEGIN,
SHAPE_SET_SCALE, 1,
SHAPE_SLICE_SET_HEIGHT, 2.5,
SHAPE_SLICE_CIRCLE, 13, 1,
SHAPE_SLICE_REPEAT,
SHAPE_SET_SCALE, 0.2,
SHAPE_SLICE_SET_HEIGHT, 0.2,
SHAPE_SLICE_REPEAT,
SHAPE_SLICE_SET_HEIGHT, 0.2,
SHAPE_SLICE_REPEAT,
SHAPE_SET_SCALE, 0,
SHAPE_SLICE_SET_HEIGHT, 0.1,
SHAPE_SLICE_REPEAT,
SHAPE_COPY_END,

// second dome
SHAPE_GOTO, 0,18,2,0,0,0,
SHAPE_SET_COLOR, 4,
SHAPE_COPY_PASTE,

// third dome
SHAPE_GOTO, 0,21,2,0,0,0,
SHAPE_SET_COLOR, 8,
SHAPE_COPY_PASTE,

// cab
SHAPE_GOTO, 0,22,2,0,0,0,
SHAPE_SET_COLOR, 1,
SHAPE_SET_SCALE, 1,
SHAPE_SET_SIDES, 4,
SHAPE_SET_AUTOCLOSE, 1,
SHAPE_SLICE_SET_HEIGHT, 4,
SHAPE_SLICE_POINTS, 0, 0, 5, 0, 5, 5, 0, 5,
SHAPE_SLICE_REPEAT,
`;
        }

        this.setTextareaData(a);
    }

    saveToLocalstorage()
    {
        localStorage.setItem("webgl:5:latest_model", this.getTextareaData())
    }
}
