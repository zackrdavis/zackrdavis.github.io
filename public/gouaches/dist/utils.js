var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var colors = {
    black: [0, 0, 0, 255],
    red: [255, 0, 0, 255],
    green: [0, 255, 0, 255],
    blue: [0, 0, 255, 255],
};
/** Reset the pixel map */
var resetPixelMap = function () {
    pixelMap = __spreadArray([], Array(cvWidth), true).map(function (_) {
        return __spreadArray([], Array(cvHeight), true).map(function (_) { return [0, 0, 0, 0]; });
    });
};
/** get canvas coordinates from clicks */
var getCoords = function (e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    return [x, y];
};
/** Repeat a function `n` times */
var nTimes = function (fn, n) {
    for (var i = 0; i < n; i++) {
        fn();
    }
};
/** Test if color is black-ish (pencil line) */
var isPencil = function (testColor) {
    // if 2 of 3 color channels are less than 20
    // TODO: Revisit this - not quite working perceptually
    // but it does allow pencil lines over colors to contain addt'l fills
    var lowColors = testColor.slice(0, 3).filter(function (v) { return v < 100; });
    return lowColors.length > 2 && testColor[3] !== 0;
    // return (
    //   testColor[0] == 0 &&
    //   testColor[1] == 0 &&
    //   testColor[2] == 0 &&
    //   testColor[3] !== 0
    // );
};
/** get diagonal distance between coordinates, rounded */
var distance = function (_a, _b) {
    var x1 = _a[0], y1 = _a[1];
    var x2 = _b[0], y2 = _b[1];
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.round(Math.sqrt(a * a + b * b));
};
/**
 * Shuffle array in place
 *
 * From: https://stackoverflow.com/a/12646864
 */
var shuffleArray = function (array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
};
/** Compare two colors */
var isColorEq = function (colorA, colorB) {
    return (colorA[0] == colorB[0] &&
        colorA[1] == colorB[1] &&
        colorA[2] == colorB[2] &&
        colorA[3] == colorB[3]);
};
var isInBounds = function (_a) {
    var x = _a[0], y = _a[1];
    return x <= cvWidth - 1 && y <= cvHeight - 1 && x >= 0 && y >= 0;
};
/** Get the color of a canvas pixel */
var getPixelColor = function (_a) {
    var x = _a[0], y = _a[1];
    var imageData = ctx.getImageData(x, y, 1, 1).data;
    return [imageData[0], imageData[1], imageData[2], imageData[3]];
};
/** Draw a single pixel */
var drawColorPixel = function (_a, color) {
    var x = _a[0], y = _a[1];
    var r = color[0], g = color[1], b = color[2], a = color[3];
    ctx.fillStyle = "rgba(" + [r, g, b, a / 255].join() + ")";
    ctx.fillRect(x, y, 1, 1);
};
/** Draw a black line between two points */
var lineBetween = function (_a, _b) {
    var x1 = _a[0], y1 = _a[1];
    var x2 = _b[0], y2 = _b[1];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
};
//# sourceMappingURL=utils.js.map