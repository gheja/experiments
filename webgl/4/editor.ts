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
            a = "SHAPE_SET_SIDES, 7,\n" +
                "SHAPE_SET_SLICE_SIZE, 1,\n" +
                "SHAPE_SET_SCALE, 0.5,\n" +
                "SHAPE_SET_MIRROR_X, 1,\n" +
                "SHAPE_SET_COLOR, 2,\n" +
                "SHAPE_CREATE_SLICE, -5, 27, -5, 20, -3, 20, -3, 8, -5, 8, -5, 5, 0, 0,\n" +
                "SHAPE_CREATE_SLICE, -5, 27, -5, 20, 0, 20, 0, 8, 0, 7, 0, 6, 0, 5,\n";
        }

        this.setTextareaData(a);
    }

    saveToLocalstorage()
    {
        localStorage.setItem("webgl:4:latest_model", this.getTextareaData())
    }
}
