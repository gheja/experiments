const COLOR_PALETTE: tColorPalette = [
    [ 0.32, 0.7, 0.5 ],
    [ 0.2, 1, 0.5 ],
    [ 0.0, 0, 0.3 ],
    [ 0.4, 1, 0.5 ],
    [ 0.5, 1, 0.5 ],
    [ 0.6, 1, 0.5 ],
    [ 0.7, 1, 0.5 ],
    [ 0.8, 1, 0.5 ],
    [ 0.0, 0.95, 0.5 ],
];

const SHAPE_TEST1: tShapeDefinition = [
    SHAPE_SET_SIDES, 4,
    SHAPE_SET_COLOR, 0,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_SLICE_SET_HEIGHT, 0.3,
    SHAPE_SET_AUTOCLOSE, 1,
    SHAPE_SLICE_POINTS, -1, -1, 1, -1, 1, 1, -1, 1,
    SHAPE_SET_SCALE, 0.3,
    SHAPE_SET_COLOR, 1,
    SHAPE_SLICE_REPEAT,
    SHAPE_SET_SCALE, 0.5,
    SHAPE_SET_COLOR, 2,
    SHAPE_SLICE_REPEAT,
    SHAPE_SET_SCALE, 1,
    SHAPE_SET_COLOR, 3,
    SHAPE_SLICE_REPEAT,
    SHAPE_SET_COLOR, 4,
    SHAPE_SET_SCALE, 0.1,
    SHAPE_SLICE_REPEAT,
];

const SHAPE_TEST2: tShapeDefinition = [
    SHAPE_SET_SIDES, 3,
    SHAPE_SET_COLOR, 0,
    SHAPE_SET_SCALE, 0.1,
    SHAPE_SLICE_SET_HEIGHT, 2,
    SHAPE_SET_AUTOCLOSE, 1,
    SHAPE_SLICE_POINTS, 5, 3.5, -5, 3.5, 0, -5.5,
    SHAPE_SLICE_REPEAT,
    SHAPE_SLICE_SET_HEIGHT, 1,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_SLICE_REPEAT,
    SHAPE_SET_SCALE, 0.3,
    SHAPE_SLICE_REPEAT,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_SLICE_REPEAT,
    SHAPE_SET_SCALE, 0,
    SHAPE_SLICE_SET_HEIGHT, 0.5,
    SHAPE_SLICE_REPEAT,
];

const SHAPE_PLANE: tShapeDefinition = [
    SHAPE_SET_SIDES, 4,
    SHAPE_SLICE_SET_HEIGHT, 0,
    SHAPE_SET_SCALE, 50,
    SHAPE_SET_COLOR, 0,
    SHAPE_SLICE_POINTS, -1, -1, 1, -1, 1, 1, -1, 1,
    SHAPE_SLICE_POINTS, 0, 0, 0, 0, 0, 0, 0, 0,
];

const SHAPE_TRAIN1: tShapeDefinition = [
    SHAPE_SET_SIDES, 7,
    SHAPE_SLICE_SET_HEIGHT, 1,
    SHAPE_SET_SCALE, 0.5,
    SHAPE_SET_MIRROR_X, 1,
    SHAPE_SET_COLOR, 2,
    SHAPE_SLICE_POINTS, -5, 27, -5, 20, -3, 20, -3, 8, -5, 8, -5, 5, 0, 0,
    SHAPE_SLICE_POINTS, -5, 27, -5, 20, 0, 20, 0, 8, 0, 7, 0, 6, 0, 5,
];
