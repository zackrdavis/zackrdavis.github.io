var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var swatches = document.querySelectorAll(".swatch");
var canvas = document.querySelector("canvas");
var cvWidth = canvas.width;
var cvHeight = canvas.height;
var ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.strokeStyle = "black";
var selectedColor = colors.black;
// is user currently drawing a line? If so from where?
var isDrawingFrom = false;
// set and clear this timer when filling or finished
var fillInterval = 0;
// store where the fill began
var fillStart = [0, 0];
// queue of pixels to test/fill
var testStack = [];
// 2D array to track already-filled pixels by qualities other than color
var pixelMap;
// init pixelMap
resetPixelMap();
var fill = function (diagonal) {
    if (diagonal === void 0) { diagonal = false; }
    if (testStack.length > 0) {
        // pull from the beginning of the stack
        // spreads around start point instead of column-by-column
        // actual queue might be more efficient
        var _a = testStack.shift(), x = _a[0], y = _a[1];
        if (
        // is not a wax pencil line
        !isPencil(getPixelColor([x, y])) &&
            // has not been set as part of this fill
            isColorEq(pixelMap[x][y], [0, 0, 0, 0])) {
            // new color will be selectedColor faded by distanceFromStart
            var newColor = __spreadArray([], selectedColor, true);
            newColor[3] = Math.max(selectedColor[3] - distance(fillStart, [x, y]), 20);
            drawColorPixel([x, y], newColor);
            // save where we drew the new color
            pixelMap[x][y] = selectedColor;
            // By alternating NSEW and diagonals, and randomizing the order
            // of the test stack, we get a rounded-square fill area.
            // Skips some pixels but that looks nice too :)
            var neighbors = !diagonal
                ? [
                    [x + 1, y],
                    [x - 1, y],
                    [x, y + 1],
                    [x, y - 1],
                ].filter(isInBounds)
                : [
                    [x + 1, y + 1],
                    [x - 1, y - 1],
                    [x - 1, y + 1],
                    [x + 1, y - 1],
                ].filter(isInBounds);
            // shuffle in place
            shuffleArray(neighbors);
            testStack.push.apply(testStack, neighbors);
        }
    }
};
var startFill = function (pos) {
    fillStart = pos;
    testStack.push(pos);
    fillInterval = setInterval(function () {
        return nTimes(function () {
            // fill once for NSEW
            fill();
            // fill again for diagonals
            fill(true);
        }, 
        // increase loops-per-second at same rate that testStack is growing
        testStack.length);
    }, 10);
};
var handleMouseDown = function (e) {
    var _a = getCoords(e), x = _a[0], y = _a[1];
    if (selectedColor == colors.black) {
        // If pencil selected, save as starting position for a potential line
        isDrawingFrom = [x, y];
        // initial pixel
        drawColorPixel([x, y], selectedColor);
    }
    else {
        // otherwise begin fill
        startFill([x, y]);
    }
};
var handleMouseMove = function (e) {
    if (isDrawingFrom) {
        var _a = getCoords(e), x = _a[0], y = _a[1];
        lineBetween(isDrawingFrom, [x, y]);
        // save the new starting position
        isDrawingFrom = [x, y];
    }
};
var handleMouseUp = function (e) {
    // reset everything
    isDrawingFrom = false;
    clearInterval(fillInterval);
    testStack = [];
    resetPixelMap();
};
var handleSwatchClick = function (e) {
    // get the color name from the div's style
    var target = e.target;
    var colorName = target.style.background;
    // set selectedColor
    selectedColor = colors[colorName];
    // set line color for canvas
    ctx.strokeStyle = "rgba(".concat(selectedColor.join(","), ")");
};
canvas.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mousemove", handleMouseMove);
// listeners for palette swatches
swatches.forEach(function (swatch) {
    return swatch.addEventListener("click", handleSwatchClick);
});
//# sourceMappingURL=index.js.map