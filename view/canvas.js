
const CANVAS = document.getElementById("canv");
const CTX = CANVAS.getContext("2d");

var wprop = CANVAS.width / BASEWIDTH;
var hprop = CANVAS.height / BASEHEIGHT;

CTX.textBaseline = "top";
CTX.font = (16 * hprop) + "px Luckiest Guy, Consolas";

function canvas_makePattern(canvas, image, width, height, repetitionType) {
    const tmpr = document.createElement("canvas");
    tmpr.width = width;
    tmpr.height = height;
    tmpr.getContext("2d").drawImage(image, 0, 0, width, height);
    
    return canvas.getContext("2d").createPattern(tmpr, repetitionType);
}

function makeCTile(bgcolor, shcolor, shcolor2 = bgcolor) {
    var ctile = document.createElement("canvas");
    ctile.width = ctile.height = 16;
    var ctx = ctile.getContext("2d");
    let cb = 1;
    
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, ctile.width, ctile.height);
    ctx.fillStyle = shcolor2;
    ctx.fillRect(ctile.width/2 - cb, 0, cb, ctile.height);
    ctx.fillRect(0, ctile.height/2 - cb, ctile.width, cb);
    ctx.fillStyle = shcolor;
    ctx.fillRect(ctile.width - cb, 0, cb, ctile.height);
    ctx.fillRect(0, ctile.height - cb, ctile.width, cb);
    
    return canvas_makePattern(CANVAS, ctile, CTILE_WIDTH, CTILE_WIDTH, "repeat");
}

function makeRepeatedTileFrom(image, width, height, tileWidth = TILEWIDTH, tileHeight = tileWidth) {
    const m = makeRepeatedTileFrom.multiplier;
    
    return makeStyledCanvas(canvas_makePattern(CANVAS, image, tileWidth*m, tileHeight*m, "repeat"), width*m, height*m);
}

makeRepeatedTileFrom.multiplier = 2;

function makeRadialGradientCanvas(color1, color2, width = 256, height = 256) {
    let canvas = document.createElement("canvas");
    canvas.width = width, canvas.height = height;
    
    let ctx = canvas.getContext("2d");
    
    let grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.width/16, 2/4*canvas.width, 2/4*canvas.height, canvas.width/2);
    
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    return canvas;
}

function canvas_screenshot(canvas = CANVAS) {
    try {
        let dataURL = canvas.toDataURL();
        let a = document.createElement("a");
        a.href = dataURL;
        a.download = (new Date()).toJSON().replace(/:/g, "'");
        a.click();
    } catch(error) {
        console.log(error);
    }
}

function font_getSize(font) {
    let matches = font.match(/(\d+)px/);
    
    if(matches[1]) {
        return Number(matches[1]);
    }
    
    return NaN;
}

function makeGradientCTilesCanvas(horizontalCount, verticalCount, bgTransition, shTransition) {
    let width = horizontalCount * CTILE_WIDTH;
    let height = verticalCount * CTILE_WIDTH;
    
    let c = document.createElement("canvas");
    c.width = width, c.height = height;
    let ctx = c.getContext("2d");
    
    let n = c.width + c.height - CTILE_WIDTH;
    
    bgTransition.duration = shTransition.duration = n / CTILE_WIDTH;
    
    for(let i = 0; i < n; i += CTILE_WIDTH) {
        var a = i / CTILE_WIDTH, b = n / CTILE_WIDTH;
        ctx.fillStyle = makeCTile(bgTransition.getNextStyle(), shTransition.getNextStyle());
        
        for(let x = i, y = 0; x > i - c.height && y < c.height; x -= CTILE_WIDTH, y += CTILE_WIDTH) {
            ctx.translate(x, y);
            ctx.fillRect(0, 0, CTILE_WIDTH, CTILE_WIDTH); 
            ctx.translate(-x, -y);
        }
    }
    
    return c;
}

function makeGradientCTilesPattern(horizontalCount, verticalCount, bgTransition, shTransition) {
    // return canvas_makePattern(CANVAS, makeGradientCTilesCanvas(horizontalCount, verticalCount, bgTransition, shTransition), width / 2 * wprop, height / 2 * hprop, "repeat");
    return canvas_makePattern(CANVAS, makeGradientCTilesCanvas(horizontalCount, verticalCount, bgTransition, shTransition), horizontalCount * CTILE_WIDTH, verticalCount * CTILE_WIDTH, "repeat");
}

// makeGradientCTiles(64, 64, new ColorTransition([255, 0, 0, 1], [0, 255, 255, 1], 7), new ColorTransition([255, 255, 255, 1], [0, 0, 0, 1], 7));
// makeGradientCTiles(16, 256, new ColorTransition([255, 0, 0, 1], [0, 255, 255, 1]), new ColorTransition([255, 255, 255, 1], [0, 0, 0, 1]));

function makeTextCanvas(content, fontHeight = 75, fontFamily = "Luckiest Guy", fillStyle = "black", strokeStyle) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    
    canvas.height = fontHeight;
    
    ctx.font = fontHeight + "px " + fontFamily;
    canvas.width = ctx.measureText(content).width;
    
    ctx.textBaseline = "top";
    ctx.font = fontHeight + "px " + fontFamily;
    
    ctx.fillStyle = fillStyle;
    ctx.fillText(content, 0, 0);
    
    if(strokeStyle !== undefined) {
        ctx.strokeStyle = strokeStyle;
        ctx.strokeText(content, 0, 0);
    }
    
    return canvas;
}

const tfparams = {
    "positioning" : 0,
    "padding-left" : 0,
    "positioning-y" : 0,
    "padding-top" : 0
};

function makeTextFit(content, width, height, fontFamily = "Luckiest Guy", fillStyle = "black", strokeStyle) {
    let finalCanvas = document.createElement("canvas");
    finalCanvas.width = width, finalCanvas.height = height;
    let ctx = finalCanvas.getContext("2d");
    
    let textCanvas = makeTextCanvas(content, undefined, fontFamily, fillStyle, strokeStyle);
    
    if(textCanvas.width != 0) {
        // ctx.drawImage(textCanvas, 0, 0, textCanvas.width * height / textCanvas.height, height);
        ctx.drawImage(textCanvas, tfparams["padding-left"] + tfparams.positioning * (finalCanvas.width - textCanvas.width * height / textCanvas.height), tfparams["padding-top"], textCanvas.width * height / textCanvas.height, height);
    }
    
    return finalCanvas;
}

function makeUnderwaterPattern(height) {
    return makeGradientCTiles(1, height, new ColorTransition([0, 255, 255, 0.125], [0, 0, 255, 0.125]), new ColorTransition([0, 15, 239, 0.125], [0, 239, 239, 0.125]));
}

function makeStyledCanvas(style, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = style;
    context.fillRect(0, 0, width, height);
    
    return canvas;
}

function makeCommandLabel(label, font = "Segoe UI", fillStyle = "#00007F", strokeStyle) {
    let c = document.createElement("canvas");
    c.width = CANVAS.width / 2, c.height = CANVAS.height / 9;
    let ctx = c.getContext("2d");
    
    let oc = makeTextFit(label, CANVAS.width / 2 - 32, CANVAS.height / 9 - 32, font, fillStyle);
    
    ctx.fillStyle = "#FFFF1F";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(oc, 16, 16);
    
    return c;
}

function makeCheckerPattern(style1, style2) {
    let c = document.createElement("canvas");
    c.width = 32, c.height = 16;
    let ctx = c.getContext("2d");
    
    ctx.fillStyle = style1;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = style2;
    ctx.fillRect(16, 0, 16, 16);
    
    return CANVAS.getContext("2d").createPattern(c, "repeat");
}

function makeGradientCanvas(ColorTransition, width = 16, height = 16) {
    let c = document.createElement("canvas");
    c.width = width, c.height = height;
    let ctx = c.getContext("2d");
    
    let n = width + height - 1;
    
    ColorTransition.duration = n;
    
    for(let i = 0; i < n; ++i) {
        ctx.fillStyle = ColorTransition.getNextStyle();
        
        for(let x = i, y = 0; x > i - height && y < height; --x, ++y) {
            ctx.translate(x, y);
            ctx.fillRect(0, 0, 1, 1);
            ctx.translate(-x, -y);
        }
    }
    
    return c;
}

const CANVAS_WATER = makeGradientCanvas(new ColorTransition([0, 191, 255, 1], [64, 159, 191, 1]), 4, 4);

function addBorder(c = document.createElement("canvas"), width = 8, height = 8) {
    let ctx = c.getContext("2d");
    
    
}

function makeSelectCommandLabel(label, font = "Segoe UI", fillStyle = "#00FFFF", strokeStyle) {
    let c = document.createElement("canvas");
    c.width = CANVAS.width / 2, c.height = CANVAS.height / 9;
    let ctx = c.getContext("2d");
    
    let oc = makeTextFit(label, CANVAS.width / 2 - 32, CANVAS.height / 9 - 32, font, fillStyle);
    
    ctx.fillStyle = "#FFEF3F";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(oc, 16, 16);
    
    return c;
}

function canvas_clone(canvas) {
    let clone = document.createElement("canvas");
    
    clone.width = canvas.width;
    clone.height = canvas.height;
    
    clone.getContext("2d").drawImage(canvas, 0, 0);
    
    return clone;
}

function canvas_clear(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    
    return canvas;
}

function canvas_setResolution(resolution = 80) {
    CANVAS.width = resolution * 16;
    CANVAS.height = resolution * 9;
}

function makeClearElementCanvas(canvasWidth, canvasHeight, drawFn, surroundingColor = "black") {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = surroundingColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "destination-out";
    drawFn(ctx, canvas);
    ctx.globalCompositeOperation = "source-over";
    
    return canvas;
}

makeClearElementCanvas.paddingTop = 16;
makeClearElementCanvas.paddingRight = 16;
makeClearElementCanvas.paddingBottom = 16;
makeClearElementCanvas.paddingLeft = 16;
makeClearElementCanvas.circlePaddingHorizontal = 16;
makeClearElementCanvas.circlePaddingVertical = 16;

makeClearElementCanvas.reset = function reset() {
    makeClearElementCanvas.paddingTop = 16;
    makeClearElementCanvas.paddingRight = 16;
    makeClearElementCanvas.paddingBottom = 16;
    makeClearElementCanvas.paddingLeft = 16;
    makeClearElementCanvas.circlePaddingHorizontal = 16;
    makeClearElementCanvas.circlePaddingVertical = 16;
};

function makeClearImageCanvas(img, surroundingColor = "black") {
    const pTop = makeClearElementCanvas.paddingTop;
    const pRight = makeClearElementCanvas.paddingRight;
    const pBottom = makeClearElementCanvas.paddingBottom;
    const pLeft = makeClearElementCanvas.paddingLeft;
    
    return makeClearElementCanvas(img.width + pLeft + pRight, img.height + pTop + pBottom, function(ctx, canvas) {
        // ctx.drawImage(img, 0, 0);
        ctx.drawImage(img, pLeft, pTop, img.width - pLeft - pRight, img.height - pTop - pBottom);
    }, surroundingColor);
}

function makeClearCircleCanvas(radius, surroundingColor = "black") {
    const pHorizontal = makeClearElementCanvas.circlePaddingHorizontal;
    const pVertical = makeClearElementCanvas.circlePaddingVertical;
    
    return makeClearElementCanvas(2*(radius+pHorizontal), 2*(radius+pVertical), function(ctx, canvas) {
        ctx.beginPath();
        // ctx.arc(radius, radius, radius, 0, 2*Math.PI);
        ctx.arc(radius+pHorizontal, radius+pVertical, radius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }, surroundingColor);
}

function makeResizedCanvas(canvas, canvasWidth, canvasHeight, canvasX = (canvasWidth-canvas.width)/2, canvasY = (canvasHeight-canvas.height)/2) {
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = canvasWidth;
    resizedCanvas.height = canvasHeight;
    
    const ctx = resizedCanvas.getContext("2d");
    
    ctx.drawImage(canvas, canvasX, canvasY);
    
    return resizedCanvas;
}
