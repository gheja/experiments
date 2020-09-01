class Editor
{
    textareaDom: HTMLTextAreaElement = null;
    shapeIndex: number;
    objectIndex: number;

    constructor(id, shapeIndex, objectIndex)
    {
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
            shape = getShape1(input);
        }
        catch (e)
        {
            console.log(e);
            this.textareaDom.className = "failed";
            return;
        }

        destroyShape(this.shapeIndex);
        shapes[this.shapeIndex] = shape;
        objects[this.objectIndex].shape = shapes[this.shapeIndex];
        this.textareaDom.className = "ok";
        this.saveToLocalstorage();
    }

    onTextareaUpdate(event: Event)
    {
        this.updateFromTextarea();
    }

    loadFromLocalstorage()
    {
        let a;

        a = localStorage.getItem("webgl:4:latest_model");

        if (a === null)
        {
            a = `// base
SHAPE_SET_SIDES, 7,
SHAPE_SET_SCALE, 1,
SHAPE_SET_SLICE_SIZE, 1,
SHAPE_SET_MIRROR_X, 1,
SHAPE_SET_COLOR, 2,
SHAPE_CREATE_SLICE, -5, 27, -5, 20, -3, 20, -3, 8, -5, 8, -5, 5, 0, 0,
SHAPE_CREATE_SLICE, -5, 27, -5, 20, -3, 20, -3, 8, -5, 8, -5, 5, 0, 5,
SHAPE_SET_SLICE_SIZE, 1,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SLICE_SIZE, 0,
SHAPE_CREATE_SLICE, 0, 27, 0, 20, 0, 20, 0, 8, 0, 8, 0, 5, 0, 5,

// chimney
SHAPE_GOTO, 0,10,2,0,0,0,
SHAPE_SET_SCALE, 2.5,
SHAPE_SET_SLICE_SIZE, 3,
SHAPE_CIRCLE, 13, 1,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SCALE, 3,
SHAPE_SET_SLICE_SIZE, 1,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SLICE_SIZE, 1,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SCALE, 2,
SHAPE_SET_SLICE_SIZE, 0,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SLICE_SIZE, -1,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SCALE, 0,
SHAPE_REPEAT_SLICE,

// first dome (to be duplicated)
SHAPE_GOTO, 0,15,2,0,0,0,
SHAPE_SET_COLOR, 3,

SHAPE_COPY_BEGIN,
SHAPE_SET_SCALE, 1,
SHAPE_SET_SLICE_SIZE, 2.5,
SHAPE_CIRCLE, 13, 1,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SCALE, 0.2,
SHAPE_SET_SLICE_SIZE, 0.2,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SLICE_SIZE, 0.2,
SHAPE_REPEAT_SLICE,
SHAPE_SET_SCALE, 0,
SHAPE_SET_SLICE_SIZE, 0.1,
SHAPE_REPEAT_SLICE,
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
SHAPE_SET_SLICE_SIZE, 4,
SHAPE_CREATE_SLICE, 0, 0, 5, 0, 5, 5, 0, 5,
SHAPE_REPEAT_SLICE,
`;
        }

        this.setTextareaData(a);
    }

    saveToLocalstorage()
    {
        localStorage.setItem("webgl:4:latest_model", this.getTextareaData())
    }
}
