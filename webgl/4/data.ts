const COLOR_PALETTE: tColorPalette = [
    [ 0.1, 1, 0.5 ],
    [ 0.2, 1, 0.5 ],
    [ 0.3, 1, 0.5 ],
    [ 0.4, 1, 0.5 ],
    [ 0.5, 1, 0.5 ],
    [ 0.6, 1, 0.5 ],
    [ 0.7, 1, 0.5 ],
    [ 0.8, 1, 0.5 ],
];

const SHAPE_TEST1: tShapeDefinition = [
    SHAPE_SET_SIDES, 4,
    SHAPE_SET_COLOR, 0,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_SET_SLICE_SIZE, 0.3,
    SHAPE_SET_AUTOCLOSE, 1,
    SHAPE_CREATE_SLICE, -1, -1, 1, -1, 1, 1, -1, 1,
    SHAPE_SET_SCALE, 0.3,
    SHAPE_SET_COLOR, 1,
    SHAPE_REPEAT_SLICE,
    SHAPE_SET_SCALE, 0.5,
    SHAPE_SET_COLOR, 2,
    SHAPE_REPEAT_SLICE,
    SHAPE_SET_SCALE, 1,
    SHAPE_SET_COLOR, 3,
    SHAPE_REPEAT_SLICE,
    SHAPE_SET_COLOR, 4,
    SHAPE_SET_SCALE, 0.1,
    SHAPE_REPEAT_SLICE,
];

const SHAPE_TEST2: tShapeDefinition = [
    SHAPE_SET_SIDES, 3,
    SHAPE_SET_COLOR, 0,
    SHAPE_SET_SCALE, 0.1,
    SHAPE_SET_SLICE_SIZE, 2,
    SHAPE_SET_AUTOCLOSE, 1,
    SHAPE_CREATE_SLICE, 5, 3.5, -5, 3.5, 0, -5.5,
    SHAPE_REPEAT_SLICE,
    SHAPE_SET_SLICE_SIZE, 1,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_REPEAT_SLICE,
    SHAPE_SET_SCALE, 0.3,
    SHAPE_REPEAT_SLICE,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_REPEAT_SLICE,
    SHAPE_SET_SCALE, 0,
    SHAPE_SET_SLICE_SIZE, 0.5,
    SHAPE_REPEAT_SLICE,
];

const SHAPE_PLANE: tShapeDefinition = [
    SHAPE_SET_SIDES, 4,
    SHAPE_SET_COLOR, 0,
    SHAPE_SET_SCALE, 50,
    SHAPE_SET_SLICE_SIZE, 0,
    SHAPE_SET_AUTOCLOSE, 1,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_SET_COLOR, 1,
    SHAPE_CREATE_SLICE, -1, -1, 1, -1, 1, 1, -1, 1,
    SHAPE_CREATE_SLICE, 0, 0, 0, 0, 0, 0, 0, 0,
];
