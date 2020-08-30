const COLOR_PALETTE: Array<Array<number>> = [
    [ 0.1, 1, 0.5, 255 ],
    [ 0.2, 1, 0.5, 255 ],
    [ 0.3, 1, 0.5, 255 ],
    [ 0.4, 1, 0.5, 255 ],
    [ 0.5, 1, 0.5, 255 ],
    [ 0.6, 1, 0.5, 255 ],
    [ 0.7, 1, 0.5, 255 ],
    [ 0.8, 1, 0.5, 255 ],
];

const SHAPE_TEST1 = [
    SHAPE_SET_SIDES, 3,
    SHAPE_SET_COLOR, 0,
    SHAPE_SET_SCALE, 0.2,
    SHAPE_SET_SLICE_SIZE, 3,
    SHAPE_SET_AUTOCLOSE, 1,
    SHAPE_CREATE_SLICE, 0, 0, 0, 0, 0, 0, 0, 0,
    SHAPE_CREATE_SLICE, -1, -1, 1, -1, 1, 1, -1, 1,
    SHAPE_SET_COLOR, 1,
    SHAPE_CREATE_SLICE, -1.5, -1.5, 1.5, -1.5, 1.5, 1.5, -1.5, 1.5,
    SHAPE_SET_COLOR, 2,
    SHAPE_CREATE_SLICE, -1, -1, 1, -1, 1, 1, -1, 1,
    SHAPE_SET_COLOR, 3,
    SHAPE_CREATE_SLICE, 0, 0, 0, 0, 0, 0, 0, 0
];
