// noinspection JSUnreachableSwitchBranches

//#region init variables
let blue = "#68788c";
let red = "#c98777";
let yellow = "#f4dfad";
let orange = "#d2af84";
let deepOrange = "#e5a76a";
let lightBlue = "#8abdd6";
let black = "#3c372f";
let pink = "#edd1be";
let washedPink = "#d5bfb0";
let grey = "#d8d6ca";
let green = "#889180";
let deepGrey = "#595147";
let lightGrey = "#d8d6ca";
let bgColor = "#fbf9ee";
let black2 = "#383838";
let black3 = "#1c1a16";
let red2 = "#ecb4b1";
let blue2 = "#c8e1e1";
let orange2 = "#f5d0a1";
let biggestObjectArea = 0;
let backgroundArea = 0;
let numShapes = 0;
let area = 0;
let totalAngle = 0;
let total = 0;
let mean = 0;
let std = 0;
let myShapes;
let myShapeNoise = [];
let myColors = [black,
    blue,
    red,
    yellow,
    black,
    blue,
    red,
    yellow,
    green,
    blue,
    black,
    green,
    pink,
    black,
    deepOrange,
    yellow,
    blue,
    black,
    lightBlue,
    black,
    green,
    orange,
    black,
    green,
    red,
    blue,
    washedPink,
    grey,
    black,
    green];
let myColors2 = [black2, red2, yellow, blue2, green, orange2, lightBlue, black2, blue2, red2, black2, yellow, green];
let myColorsSparkle = ["#f2cfe0", "#e1ffd5", "#c6ffe4", "#cfdeff", "#e9c8ff"];
let myColorsGrayScale = [black, grey, deepGrey, lightGrey];
//#endregion init variables

//#region init hashPairs
// Turn the hash into hash pairs.
// This means 0xeca4cf6288eb455f388301c28ac01a8da5746781d22101a65cb78a96a49512c8
// turns into ["ec", "a4", "cf", "62", "88", "eb", ...]
const hashPairs = [];
for (let j = 0; j < 32; j++) {
    hashPairs.push(hash.slice(2 + (j * 2), 4 + (j * 2)));
}

// Parse the hash pairs into ints. Hash pairs are base 16 so "ec" becomes 236.
// Each pair will become a value ranging from 0 - 255
const decPairs = hashPairs.map(x => {
    return parseInt(x, 16);
});
let decPairsMyColors = hashPairs.map(x => {
    return parseInt(x, 16) % myColors.length
});
let decPairsMyColors2 = hashPairs.map(x => {
    return parseInt(x, 16) % myColors2.length
});
let decPairsMyColorsSparkle = hashPairs.map(x => {
    return parseInt(x, 16) % myColorsSparkle.length
});
let decPairsMyColorsGrayScale = hashPairs.map(x => {
    return parseInt(x, 16) % myColorsGrayScale.length
});

//Returns a list of ints that can be used to index the colors.
let decPairs4 = hashPairs.map(x => {
    return parseInt(x, 16) % 4
}); //Ints 0-3
let decPairs2 = hashPairs.map(x => {
    return parseInt(x, 16) % 2
}); //Ints 0 or 1
let decPairs7 = hashPairs.map(x => {
    return parseInt(x, 16) % 7
}); //Ints 0-6
let decPairs10 = hashPairs.map(x => {
    return parseInt(x, 16) % 10
}); //Ints 0-9
let decPairs30 = hashPairs.map(x => {
    return parseInt(x, 16) % 30
}); //Ints 0-29
let decPairs15 = hashPairs.map(x => {
    return parseInt(x, 16) % 15
}); //Ints 0-29

let decPairs50 = hashPairs.map(x => {
    return parseInt(x, 16) % 50
}); //Ints 0-29

// Grab the first 16 values of the hash to use as a noise seed.
const seed = parseInt(hash.slice(0, 16), 16);
//#endregion init hashPairs

let features = {
    numShapes: 0,
    isBlackOut: decPairs30[1] === 16,
    isGrayScale: decPairs[0] < 20,
    isWithLongRectangle: decPairs[0] === 18 || decPairs30[0] === 19,
    has3D: decPairs30[0] === 19 || decPairs30[15] === 0 || decPairs30[14] === 0,
    hasArc: decPairs15[0] === 0,
    isBlackBackground: decPairs50[0] === 0,
    isTanBackground: decPairs[0] !== 100,
    isWhiteBackground: false,
    hasRectangle: false,
    hasLine: false,
    hasCircle: false,
    hasTriangle: false,
    hasQuadratic: false,
    hasBlack: false,
    hasBlue: false,
    hasRed: false,
    hasYellow: false,
    hasOrange: false,
    hasDeepOrange: false,
    hasLightBlue: false,
    hasPink: false,
    hasWashedPink: false,
    hasGrey: false,
    hasDeepGrey: false,
    hasLightGrey: false,
    hasGreen: false,
    hasOutline: false,
    isColorSchemeAlpha: !this.isColorSchemeBeta,
    isColorSchemeBeta: decPairs[7] === 2,
    isColorSchemeSparkle: false
}

let hasSmallBabies = decPairs7[11] === 0;
let noMoreSmallBabies = false;
let myColorsLength =
    features.isColorSchemeSparkle ? decPairsMyColorsSparkle.length : features.isColorSchemeBeta.length ? decPairsMyColors2 : decPairsMyColors.length;
let tryAgain = 0;
let finalBgColor;
let canvas;
let pg;
let myWidth = 750;
let myHeight = 1000;

function setup() {
    const smallerDimension = windowWidth < windowHeight ? windowWidth : windowHeight;
    canvas = createCanvas(smallerDimension * (3000 / 4000), smallerDimension);
    pg = createGraphics(myWidth, myHeight);
    pg.noStroke();
    pg.colorMode(RGB, 255);
    canvas.mouseClicked(onClick);
    backgroundArea = myHeight * myWidth;
    biggestObjectArea = backgroundArea;
    if (features.isBlackBackground) {
        pg.fill(black3);
        finalBgColor = black3;
    } else if (features.isColorSchemeSparkle) {
        pg.fill(black3);
        finalBgColor = black3;
    } else {
        pg.fill(bgColor);
        features.isTanBackground = true;
        finalBgColor = bgColor;
    }
    pg.rect(0, 0, myWidth, myHeight);

    noiseSeed(seed);
    myShapeNoise = [];
    //get mean and std to normalize the decPairs
    //only use ~half of the decPairs so we do not have too many shapes
    let temp = decPairs10[4];
    temp = temp <= 1 ? 4 : temp;
    for (let i = 0; i < decPairs.length / 2 + tryAgain; i++) {
        total += decPairs[i];
        myShapeNoise.push(decPairs[i]);
        numShapes++;
    }

    mean = total / numShapes;
    std = getStandardDeviation(myShapeNoise, mean);

    let myShapesNoiseNormalized = getNormalizedList(myShapeNoise, mean, std);
    numShapes = (int)(numShapes);
    myShapes = new Array(numShapes);
    pg.translate(myWidth / 6, myHeight / 6);
    for (let i = 0; i < 10; i++) {

        if (features.has3D && i === 7) {
            continue;
        }
        totalAngle += PI / Math.abs(myShapesNoiseNormalized[i]);
        if (i % 4 === 0 && decPairs4[i] === 0) {
            let x1 = Math.abs(myWidth / 2 * (noise(decPairs[i])));
            let y1 = myHeight * (noise(decPairs[i]));
            let h = Math.abs((myShapeNoise[i] * noise(i) * Math.abs(myShapesNoiseNormalized[i])));
            let w = Math.abs(myShapeNoise[i] - (myHeight * Math.abs(myShapesNoiseNormalized[i])));
            myShapes.push(createCurve(x1,
                y1,
                x1 + myWidth * .75,
                y1 + (h / 4 / (noise(decPairs[i]))),
                x1 + (w / 2 / (noise(decPairs[i]))),
                y1 + (h / 2 / (noise(decPairs[i]))),
                x1 + (w * .75 / (noise(decPairs[i]))),
                y1 + myHeight * .75,
                totalAngle,
                getRandomColor(i)));
        } else if (decPairs4[i] === 2) {
            myShapes[i] = createTriangle(
                myWidth / 3 * (noise(i)),
                myHeight * (noise(i) * decPairs[i]),
                Math.abs((myShapeNoise[i] * noise(i) * Math.abs(myShapesNoiseNormalized[i]))),
                Math.abs(myShapeNoise[i] - (myHeight * Math.abs(myShapesNoiseNormalized[i]))),
                totalAngle,
                getRandomColor(i),
                decPairs[i] % 3 === 0,
                decPairs[i] % 4 === 0);
        } else if (decPairs4[i] === 3) {
            myShapes.push(createRectangle(
                myWidth / 2 * (noise(i)),
                myHeight * (noise(i)),
                Math.abs((myShapeNoise[i] * Math.abs(myShapesNoiseNormalized[i])) / (decPairs2[i] + 1)) + 1,
                Math.abs(myShapeNoise[i] + (myHeight * Math.abs(myShapesNoiseNormalized[i]))) + 1,
                i % 4 === 0 ? 0 : totalAngle,
                getRandomColor(i),
                noise(i) > .7,
                decPairs[i] % 6 === 0,
                decPairs[i] % 5 === 0,
                noise(i) * decPairs4.length));
        } else if (decPairs4[i] === 1) {
            myShapes.push(createCircle(Math.abs(myWidth / 2 * (noise(decPairs[i]))),
                myHeight * (noise(decPairs[i])),
                Math.abs((myShapeNoise[i] * noise(decPairs[i]) * Math.abs(myShapesNoiseNormalized[i]))),
                i % 4 === 0 ? 0 : totalAngle,
                getRandomColor(i),
                decPairs10[i] < 3));
        }
    }

    if (features.has3D) {
        myShapes.push(create3D(
            myWidth / 3 * (noise(0)),
            myHeight * (noise(0) * decPairs[7]),
            Math.abs((myShapeNoise[1] * Math.abs(myShapesNoiseNormalized[0]))),
            Math.abs(myShapeNoise[1] - (myHeight * Math.abs(myShapesNoiseNormalized[0]))),
            totalAngle,
            features.isGrayScale ? decPairs[7] : features.isBlackOut ? getRandomColor(0) : black,
            features.isGrayScale ? decPairs[8] : deepGrey,
            features.isGrayScale ? decPairs[9] : lightGrey
        ));
    }

    myShapes.sort((a, b) => (a.area > b.area) ? -1 : 1);
    if (tryAgain > 8) {
        myShapes.push(create3D(
            myWidth / 3 * (noise(0)),
            myHeight * (noise(0) * decPairs[7]),
            Math.abs((myShapeNoise[1] * Math.abs(myShapesNoiseNormalized[0]))),
            Math.abs(myShapeNoise[1] - (myHeight * Math.abs(myShapesNoiseNormalized[0]))),
            totalAngle,
            features.isGrayScale ? decPairs[7] : features.isBlackOut ? getRandomColor(0) : black,
            features.isGrayScale ? decPairs[8] : deepGrey,
            features.isGrayScale ? decPairs[9] : lightGrey
        ));
    }
    if (features.isWithLongRectangle) {
        features.numShapes++;
        pg.noStroke();
        pg.fill(getRandomColor(0));
        pg.rect(Math.abs(myWidth / 2 - decPairs[0] - decPairs[1] - decPairs[3] / 2), 0 - (decPairs[3] / 3), decPairs[3] / 3, myHeight);
    }
    smooth();
    for (let i = 0; i < myShapes.length; i++) {
        if (typeof (myShapes[i]) !== "undefined") {
            myShapes[i].draw();
            features.numShapes++;
        }
    }
    frameRate(3);
    let traits = [];
    if (features.isBlackBackground) {
        traits.push({"value": "Black Background"});
    }
    if (features.isTanBackground) {
        traits.push({"value": "Tan Background"});
    }
    if (features.isWhiteBackground) {
        traits.push({"value": "White Background"});
    }
    if (features.hasBlack) {
        traits.push({"value": "Black"});
    }
    if (features.hasBlue) {
        traits.push({"value": "Blue"});
    }
    if (features.hasRed) {
        traits.push({"value": "Red"});
    }
    if (features.hasYellow) {
        traits.push({"value": "Yellow"});
    }
    if (features.hasOrange) {
        traits.push({"value": "Orange"});
    }
    if (features.hasDeepOrange) {
        traits.push({"value": "Deep Orange"});
    }
    if (features.hasLightBlue) {
        traits.push({"value": "Light Blue"});
    }
    if (features.hasPink) {
        traits.push({"value": "Pink"});
    }
    if (features.hasWashedPink) {
        traits.push({"value": "Washed Pink"});
    }
    if (features.hasGrey) {
        traits.push({"value": "Grey"});
    }
    if (features.hasDeepGrey) {
        traits.push({"value": "Deep Grey"});
    }
    if (features.hasLightGrey) {
        traits.push({"value": "Light Grey"});
    }
    if (features.hasGreen) {
        traits.push({"value": "Green"});
    }
    if (features.hasOutline) {
        traits.push({"value": "Outline"});
    }
    if (features.has3D) {
        traits.push({"value": "Trompe l`oeil "});
    }
    imageMode(CORNER);
    image(pg, 0, 0, width, myHeight * width / myWidth);
}

let hasShape = 0;

function draw() {
    let bgC = color(finalBgColor)
    let r;
    let g;
    let b;
    let a;
    loadPixels();

    const d = pixelDensity();

    for (let x = 0; x < myWidth; x++) {
        for (let y = 0; y < myHeight; y++) {
            const i = 4 * d * (y * d * myWidth + x);
            if (hasShape > 50) {
                break;
            }
            r = pixels[i];
            g = pixels[i + 1];
            b = pixels[i + 2];
            a = pixels[i + 3];
            if (!isColor(r, g, b, a, bgC)) {
                hasShape++;
            }
        }

    }
    pg.remove();
    if (hasShape > 10) {
        noLoop();
    } else {
        clear();
        setup();
    }
}

function onClick() {
    clear();
    setup();
    loop();
}

//#region initializers

function createRectangle(x, y, w, h, angle, color, withBabies, withShearX, withShearY, seed) {
    features.hasRectangle = true;
    let withFriend = noise(x, y) < .5;
    return new myRectangle(x, y, w, h, angle, color, withBabies, withShearX, withShearY, withFriend, seed);
}

function createCircle(x, y, d, angle, color, withBabies) {
    features.hasCircle = true;
    return new myCircle(x, y, d, angle, color, withBabies, false);
}

function createCurve(x1, y1, x2, y2, x3, y3, x4, y4, angle, color) {
    return new myCurve(x1, y1, x2, y2, x3, y3, x4, y4, angle, color);
}

function createTriangle(x, y, w, h, angle, color, withShearX, withShearY) {
    features.hasTriangle = true;
    let rand = noise(w, h);
    let withFriend = noise(x, y) < .4;
    return new myTriangle(x, y, rand > .5 ? h : w, rand > .5 ? w : h, angle, color, withShearX, withShearY, false, withFriend);
}

function create3D(x, y, w, h, angle, color, color2, color3) {
    let rand = noise(w, h);
    return new my3D(x, y, rand > .5 ? h : w, rand > .5 ? w : h, angle, color, color2, color3);
}

//#endregion

//#region classes

class myShape {
    constructor(area) {
        this.area = area;
    }
}

class myRectangle extends myShape {
    constructor(x, y, w, h, angle, color, withBabies, withShearX, withShearY, withFriend, seed, isFriend = false) {
        let isTooBig = false;
        if (decPairs30[8] === 0) {
            w = h;
        }
        while ((h * w) > (biggestObjectArea / 3) && !(h < 1) && !(w < 1)) {
            h--;
            w--;
            isTooBig = true;
        }

        while ((y + h > myHeight || y + w > myHeight) && !(y < 1) && !(h < 1) && !(w < 1)) {
            y--;

        }
        while ((y + w > myWidth || y + w > myHeight) && !(y < 1)) {
            y--;

        }
        while ((x + h > myHeight || x + h > myWidth) && !(h < 1) && !(x < 1)) {
            h--;
        }
        while ((x + w > myHeight || x + w > myWidth) && !(w < 1)) {
            w--;
        }


        if (w < 10 && decPairs30[8] !== 0) {
            if (decPairs7[4] === 4) {
                w = decPairs30[4];
            } else if (decPairs10[4] === 0) {
                w = 50;
            } else if (w < 3) {
                w = decPairs30[0];
            }
        }

        area = h * w;
        if (isTooBig) {
            biggestObjectArea = area;
        }

        super(area);
        this.isFriend = isFriend;
        this.x = x;
        this.y = y;
        this.w = (int)(w < 5 ? 20 : w);
        this.h = h;
        this.color = color;
        this.angle = angle;
        this.withShearX = withShearX;
        this.withShearY = withShearY;
        this.shearX = this.x * noise(x);
        this.shearY = this.y * noise(h);
        this.withBabies = this.w < 20 ? false : withBabies;
        this.withFriend = withFriend;
        this.rotatedY = getRotatedY(x, y, angle);
        this.rotatedX = getRotatedX(x, y, angle);
        let noiseXY = noise(this.x + this.y);
        this.outlineOnly = this.h === this.w ? noiseXY > .6 : noiseXY > .7;
        this.Friend = null;
        this.Seed = seed;
        this.Seed2 = (int)(decPairs2.length * (noise(this.Seed)));
        this.Seed3 = decPairs10[5];
        this.Seed4 = (int)(decPairs4.length * (noise(this.Seed2)));
        this.IsPerfect = decPairs4[this.Seed4] === 3 || decPairs4[this.Seed2] === 3;
        this.x1 = this.x + this.w;
        this.y1 = this.y;
        this.x2 = this.x + this.w;
        this.y2 = this.y + this.h;
        this.x3 = this.x;
        this.y3 = this.y + this.h;
        this.x4 = this.x;
        this.y4 = this.y;
        if (this.withFriend && !this.withShearX && !this.withShearY) {
            let rand = noise(x, y);
            let rand2 = noise(x + 1, y + 1);
            let isCircle = rand2 < .5;
            let r = w / 4;
            if (rand >= .75) {
                if (isCircle) {
                    this.Friend = new myCircle(x + w + r / 2, y - r / 2, w / 4, angle, getRandomColor((int)(rand * myColorsLength)), Math.pow(((w / 2) / 2), 2) * PI, false, true);
                } else {
                    this.Friend = new myRectangle(x + w, y - w / 2, w / 2, w / 2, angle, getRandomColor((int)(rand * myColorsLength)), false, false, false, this.Seed2, true);
                }
            } else if (rand >= .5) {
                if (isCircle) {
                    this.Friend = new myCircle(x - r / 2, y - r / 2, w / 4, angle, getRandomColor((int)(rand * myColorsLength)), Math.pow(((w / 2) / 2), 2) * PI, false, true);
                } else {
                    this.Friend = new myRectangle(x - w / 2, y - w / 2, w / 2, w / 2, angle, getRandomColor((int)(rand * myColorsLength)), false, false, false, this.Seed2, true);
                }
            } else if (rand >= .25) {
                if (isCircle) {
                    this.Friend = new myCircle(x - r / 2, y + h + r / 2, w / 4, angle, getRandomColor((int)(rand * myColorsLength)), Math.pow(((w / 2) / 2), 2) * PI, false, true);
                } else {
                    this.Friend = new myRectangle(x - w / 2, y + h, w / 2, w / 2, angle, getRandomColor((int)(rand * myColorsLength)), false, false, false, this.Seed2, true);
                }
            } else {
                if (isCircle) {
                    this.Friend = new myCircle(x + w + r / 2, y + h + r / 2, w / 4, angle, getRandomColor((int)(rand * myColorsLength)), Math.pow(((w / 2) / 2), 2) * PI, false, true);
                } else {
                    this.Friend = new myRectangle(x + w, y + h, w / 2, w / 2, angle, getRandomColor((int)(rand * myColorsLength)), false, false, false, this.Seed2, true);
                }
            }
        }
    }

    draw() {
        if (this.isFriend) {
            pg.push();
            pg.beginShape();
            if (this.outlineOnly) {
                pg.noFill();
                pg.strokeWeight(1);
                pg.stroke(this.color);
            } else {
                pg.noStroke();
                pg.fill(this.color)
            }
            pg.rect(this.x, this.y, this.w, this.h);
        }
        if (this.IsPerfect) {
            let numBabies = this.withBabies ? decPairs7[this.Seed] !== 0 ? 2 : 1 : 0;
            pg.push();
            pg.beginShape();
            if (this.outlineOnly) {
                pg.noFill();
                pg.strokeWeight(1);
                pg.stroke(this.color);
            } else {
                pg.noStroke();
                pg.fill(this.color)
            }
            pg.translate(myWidth / 4, 0);
            pg.rotate(this.angle);
            pg.translate(this.w - this.rotatedX - this.x, this.rotatedY - this.y)
            if (this.withShearX && !this.withBabies) {
                pg.shearX(this.shearX);
            }
            if (this.withShearY && !this.withBabies) {
                pg.shearY(this.shearY);
            }
            pg.rect(this.x, this.y, this.w, this.h);

            if (this.withBabies) {
                let babyColor = getRandomColor((int)(myColorsLength * noise(this.x, this.y)));
                pg.fill(babyColor);
                pg.rect(this.x - (this.w + 10) - decPairs[this.Seed2] * noise(this.Seed),
                    this.y + (this.h - (this.h / (Math.abs(((noise(this.x) * 2)))))) + decPairs[this.Seed] * noise(this.Seed),
                    this.w - decPairs10[this.Seed],
                    this.h / (3) + decPairs[this.Seed] * noise(this.Seed3));
                features.numShapes++;
                if (numBabies > 1) {
                    pg.rect(this.x + (this.w + 10) + decPairs[this.Seed2] * noise(this.Seed),
                        this.y + (this.h - (this.h / (Math.abs(((noise(this.x) * 2)))))) + decPairs[this.Seed] * noise(this.Seed),
                        this.w + decPairs[this.Seed] * noise(this.Seed3),
                        this.h / (3) + decPairs[this.Seed] * noise(this.Seed3));
                    features.numShapes++;
                }
            }

            if (this.Friend !== null) {
                this.Friend.draw();
            }
            pg.endShape();
            pg.pop();
        } else {
            let numBabies = this.withBabies && this.w > 20 ? this.w > 5 ? 2 : 1 : 0;
            pg.push();
            pg.beginShape();
            if (this.outlineOnly) {
                pg.noFill();
                pg.strokeWeight(1);
                pg.stroke(this.color);
            } else {
                pg.noStroke();
                pg.fill(this.color);
            }
            pg.translate(myWidth / 4, 0);
            pg.rotate(this.angle);
            pg.translate(this.w - this.rotatedX - this.x, this.rotatedY - this.y)
            if (this.withShearX) {
                pg.shearX(this.shearX);
            }
            if (this.withShearY) {
                pg.shearY(this.shearY);
            }

            if (this.Seed3 === 7) {
                pg.quad(this.x - decPairs10[0], this.y, this.x1 + decPairs30[1], this.y1, this.x3 - decPairs10[2], this.y3, this.x3 + decPairs30[3], this.y3);
            } else {
                this.x1 = this.x1 + ((decPairs2[10] === 0 ? -1 : 1) * (decPairs15[this.Seed2]));
                this.x2 = this.x2 + ((decPairs2[12] === 0 ? -1 : 1) * (decPairs15[this.Seed2]))
                this.x3 = this.x3 + ((decPairs2[13] === 0 ? -1 : 1) * (decPairs15[this.Seed2]))
                this.x4 = this.x4 + ((decPairs2[14] === 0 ? -1 : 1) * (decPairs15[this.Seed4]))
                if (Math.abs(this.x4 - this.x1) < 20) {
                    if (this.x1 > this.x4) {
                        this.x1 += 50;
                    } else {
                        this.x4 += 20;
                    }
                }
                if (Math.abs(this.x3 - this.x2) < 20) {
                    if (this.x2 > this.x3) {
                        this.x2 += 50;
                    } else {
                        this.x3 += 20;
                    }
                }
                pg.quad(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
            }

            if (numBabies > 0) {
                if (hasSmallBabies && !this.noMoreSmallBabies) {
                    let babyColor = getRandomColor(this.Seed3);
                    let babyColor2 = getRandomColor(this.Seed2);
                    if (this.outlineOnly) {
                        pg.noFill();
                        pg.strokeWeight(1);
                        pg.stroke(babyColor);
                    } else {
                        pg.noStroke();
                        pg.fill(babyColor);
                    }

                    let yChange = this.h - (this.h / (decPairs4[0] + 4));
                    let baby1Width = this.w > 60 ? this.w / 7 : this.w > 20 ? this.w / 4 : this.w + 5;
                    let baby2Width = this.w > 60 ? this.w / 7 : this.w > 20 ? this.w / 4 : this.w;
                    pg.quad(this.x1 + decPairs10[this.Seed] + baby1Width, this.y1 + yChange, this.x2 + decPairs4[this.Seed2] + baby1Width, this.y2 + decPairs4[this.Seed3] + decPairs4[8], this.x3 + 7 - decPairs10[this.Seed2] + this.w, this.y3, this.x4 - decPairs10[this.Seed] + 7 + this.w, this.y4 + yChange);
                    features.numShapes++;
                    if (numBabies > 1) {
                        if (this.outlineOnly) {
                            pg.noFill();
                            pg.strokeWeight(1);
                            pg.stroke(babyColor2);
                        } else {
                            pg.noStroke();
                            pg.fill(babyColor2);
                        }
                        features.numShapes++;
                        pg.quad(this.x1 + decPairs10[this.Seed] + baby1Width + baby2Width + 5, this.y1 + (this.h - this.h / 10), this.x2 + decPairs4[this.Seed2] + baby1Width + baby2Width + 5, this.y2 + decPairs4[this.Seed3] + 2, this.x3 + 7 + decPairs10[this.Seed2] + this.w + baby1Width + 5, this.y3, this.x4 + decPairs10[this.Seed] + 7 + this.w + baby1Width + 5, this.y4 + (this.h - this.h / 10) + 1);
                    }
                    noMoreSmallBabies = true;
                } else {

                    for (let i = 1; i <= numBabies; i++) {
                        features.numShapes++;
                        let babyColor = getRandomColor((int)(myColorsLength * noise(this.x, i)));
                        if (this.outlineOnly) {
                            pg.noFill();
                            pg.strokeWeight(1);
                            pg.stroke(babyColor);
                        } else {
                            pg.noStroke();
                            pg.fill(babyColor);
                        }
                        let yChange = decPairs4[7] === 0 ? 0 : (this.h - this.h / (2 * i));

                        pg.quad(this.x + i * (this.w + 10) + (this.w * noise(this.Seed3)),
                            this.y + yChange - decPairs30[8],
                            this.x + i * (this.w + 10) + (this.w * noise(this.Seed3)),
                            this.y + yChange + this.h / (3 * i) + decPairs10[3],
                            this.x + i * (this.w + 10) + decPairs4[2] + decPairs30[1],
                            this.y + yChange + this.h / (3 * i) + decPairs10[5] - 10,
                            this.x + i * (this.w + 10) + decPairs4[2] + decPairs30[2],
                            this.y + yChange - decPairs30[8]
                        );
                    }
                }
            }
            if (this.Friend !== null) {
                this.Friend.draw();
            }
            pg.endShape();
            pg.pop();
        }
    }
}

class myCircle extends myShape {
    constructor(x, y, d, angle, color, withBabies, isFriend) {
        let r = d / 2;
        let isTooBig = false;
        while ((PI * Math.pow(r, 2)) > (biggestObjectArea / 3) && !(r < 1)) {
            r--;
            isTooBig = true;
        }
        while ((y + r > myWidth || y + r > myHeight) && !(y < 0)) {
            y--;
        }
        while ((x + r > myHeight || x + r > myWidth) && !(r < 1)) {
            r--;
        }

        area = PI * Math.pow(r, 2);
        if (isTooBig) {
            biggestObjectArea = area;
        }
        super(area);
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = r * 2;
        this.color = color;
        this.angle = angle;
        this.withBabies = withBabies;
        this.isFriend = isFriend;
        this.rotatedY = getRotatedY(x, y, angle);
        this.rotatedX = getRotatedX(x, y, angle);
        this.outlineOnly = noise(this.x + this.y) > .7;
    }

    draw() {
        let numBabies = this.withBabies ? 3 : 0;
        if (this.isFriend) {
            if (this.outlineOnly) {
                pg.noFill();
                pg.strokeWeight(1);
                pg.stroke(this.color);
            } else {
                pg.noStroke();
                pg.fill(this.color);
            }
            pg.circle(this.x, this.y, this.d);
        } else {
            pg.push();
            pg.beginShape();
            if (this.outlineOnly) {
                pg.noFill();
                pg.strokeWeight(1);
                pg.stroke(this.color);
            } else {
                pg.strokeWeight(1);
                pg.noStroke();
                pg.fill(this.color);
            }
            pg.translate(myWidth / 4, 0);
            pg.rotate(this.angle);

            pg.circle(this.x, this.y, this.d);
            for (let i = 1; i < numBabies; i++) {
                let newColor = getRandomColor(i);
                if (this.outlineOnly) {
                    pg.noFill();
                    pg.strokeWeight(1);
                    pg.stroke(newColor);
                } else {
                    pg.strokeWeight(1);
                    pg.noStroke();
                    pg.fill(newColor);
                }
                let yChange = (this.d - this.d / (2 * i));
                let newD = this.d / (2 * i);
                if (this.w > 70) {
                    yChange = (this.d - this.d / (4 * i));
                    newD = this.d / (4 * i);
                }
                if (decPairs10[2] > 7) {
                    pg.circle(this.x + i * (this.d), decPairs[1] * this.y + yChange, newD);
                } else {
                    pg.circle(this.x + noise(i) * decPairs[0] * i + i * (this.d), decPairs[0] * this.y + yChange, newD);
                }
            }
            pg.endShape();
            pg.pop();
        }
    }
}

class myCurve extends myShape {
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, angle, color) {
        super(1); //put curves on top
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.x4 = x4;
        this.y4 = y4;
        this.color = color;
        this.angle = angle;
    }

    draw() {
        pg.push();
        pg.stroke(this.color);
        pg.noFill();
        pg.beginShape();
        pg.translate(myWidth / 4, 0);
        pg.rotate(this.angle);
        if (noise(this.x4, this.y4) < .5) {
            pg.bezier(this.x1, this.y1, this.x2, this.y2 < myHeight ? 2 * this.y2 : this.y2, this.x3, 2 * this.y3, this.x4, this.y4);
        }
        if (!features.hasLine) {
            pg.bezier(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
        }
        features.hasLine = true;
        pg.endShape();
        pg.pop();
    }
}

class myTriangle extends myShape {
    constructor(x, y, w, h, angle, color, withShearX, withShearY, isFriend, withFriend) {
        while ((y + h > myWidth || y + w > myWidth || y + w > myHeight || y + h > myHeight) && !(y < 1)) {
            y--;
        }
        while ((x + h > myHeight || x + h > myWidth) && !(h < 1)) {
            h--;
        }
        while ((x + w > myHeight || x + w > myWidth) && !(w < 1)) {
            w--;
        }
        let isTooBig = false;
        while ((h * w) / 2 > biggestObjectArea / 3) {
            h--;
            w--;
            isTooBig = true;
        }

        if (noise(h + w) > .6) {
            if (w > h) {
                h = w;
            } else {
                w = h;
            }
        }
        w = w < 15 ? decPairs[5] : w;
        h = h < 15 ? w >= 15 ? w : decPairs[10] : h;
        area = (h * w) / 2;
        if (isTooBig) {
            biggestObjectArea = area;
        }
        super(area);
        this.x = x;
        this.y = y;
        this.x2 = x + w;
        this.y2 = y;
        this.x3 = x + noise(w) * w;
        this.y3 = y + h;
        this.color = color;
        this.angle = angle;
        this.withShearX = withShearX;
        this.withShearY = withShearY;
        this.shearX = this.x * noise(x);
        this.shearY = this.y * noise(h);
        this.withFriend = withFriend;
        this.rotatedY = getRotatedY(x, y, angle);
        this.rotatedX = getRotatedX(x, y, angle);
        this.outlineOnly = noise(this.x + this.y) > .7;
        this.Friend = null;
        if (this.withFriend && !this.withShearX && !this.withShearY) {
            let rand = noise(x, y);
            let r = w / 4;
            if (rand >= .66) {
                this.Friend = new myCircle(this.x2 + r / 2, this.y2 - r / 2, w / 4, angle, getRandomColor((int)(rand * myColorsLength)), Math.pow(((w / 2) / 2), 2) * PI, false, true);
            } else if (rand >= .66) {
                this.Friend = new myCircle(this.x - r / 2, this.y - r / 2, w / 4, angle, getRandomColor((int)(rand * myColorsLength)), Math.pow(((w / 2) / 2), 2) * PI, false, true);
            } else {
                this.Friend = new myCircle(this.x3 + r / 2, this.y3 + r / 2, w / 4, angle, getRandomColor((int)(rand * myColorsLength)), Math.pow(((w / 2) / 2), 2) * PI, false, true);
            }
        }
    }

    draw() {
        pg.push();
        pg.beginShape();
        if (this.outlineOnly) {
            pg.noFill();
            pg.strokeWeight(1);
            pg.stroke(this.color);
        } else {
            pg.noStroke();
            pg.fill(this.color);
        }
        pg.translate(myWidth / 4, 0);
        pg.rotate(this.angle);
        pg.translate(this.w - this.rotatedX - this.x, this.rotatedY - this.y)
        if (this.withShearX) {
            pg.shearX(this.shearX);
        }
        if (this.withShearY) {
            pg.shearY(this.shearY);
        }
        pg.triangle(this.x, this.y, this.x2, this.y2, this.x3, this.y3);
        if (this.Friend !== null) {
            this.Friend.draw();
        }
        pg.endShape();
        pg.pop();
    }
}

class my3D extends myShape {
    constructor(x, y, w, h, angle, color, color2, color3) {
        while ((y + h > myWidth || y + w > myWidth || y + w > myHeight || y + h > myHeight) && !(y < 0)) {
            y--;
        }
        while ((x + h > myHeight || x + h > myWidth) && !(h < 0)) {
            h--;
        }
        while ((x + w > myHeight || x + w > myWidth) && !(h < 0)) {
            w--;
        }

        let isTooBig = false;
        while ((h * w * 3) > backgroundArea / 4) {
            h--;
            w--;
        }

        if (w > 2 * h) {
            w = h * (noise(x) + .25);
        }
        if (w < 30 || w > 200) {
            w = 80;
        }
        if (h < 30 || h > 200) {
            h = w;
        }

        area = 0;
        if (isTooBig) {
            biggestObjectArea = area;
        }
        super(area);
        let yChange = h / 2
        if (yChange > 200) {
            yChange = 40;
            h = 80;
        }
        this.x = x + w;
        this.y = y;
        this.w = w / 2;
        this.h = h;
        this.x2 = x + w;
        this.y2 = this.y + yChange;
        this.x3 = x;
        this.y3 = y + h;
        this.x4 = x;
        this.y4 = this.y + (this.h - yChange)
        this.color = color;
        this.color2 = color2;
        this.color3 = color3;
        this.angle = angle;
        this.rotatedY = getRotatedY(x, y, angle);
        this.rotatedX = getRotatedX(x, y, angle);
        this.outlineOnly = noise(this.x + this.y) > .7;
    }

    draw() {
        pg.push();
        pg.beginShape();
        pg.noStroke();
        pg.fill(this.color);
        pg.translate(0, 0);
        if (decPairs7[6] === 1 || decPairs7[6] === 2) {
            pg.quad(this.x, this.y, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
            pg.fill(this.color2);
            pg.quad(this.x + this.w, this.y4, this.x2 + this.w, this.y3 + decPairs7[1], this.x2, this.y2, this.x, this.y);
            pg.fill(this.color3);
            pg.quad(this.x2, this.y2, this.x2 + this.w, this.y3 + decPairs7[1], this.x2, this.y3 + (this.y3 > this.y2 ? (this.y3 - this.y2) : (this.y2 - this.y3)), this.x3, this.y3);
        } else if (decPairs2[6] === 1) {
            pg.rect(this.x4, this.y, this.w, this.w);
            pg.fill(this.color2);
            let r = decPairs[10] <= this.w ? this.w : decPairs[10];
            pg.beginShape();
            pg.vertex(this.x4 + this.w, this.y);
            pg.vertex(this.x4 + this.w, this.y + this.w);
            pg.vertex(this.x4 + this.w + r, this.y + this.w + r);
            pg.vertex(this.x4 + this.w + r, this.y + r);
            pg.endShape();
            pg.fill(this.color3);
            pg.beginShape();
            pg.vertex(this.x4, this.y + this.w);
            pg.vertex(this.x4 + this.w, this.y + this.w);
            pg.vertex(this.x4 + this.w + r, this.y + this.w + r);
            pg.vertex(this.x4 + r, this.y + this.w + r);
            pg.endShape();
        } else {
            let r = decPairs[10] <= this.w ? this.w : decPairs[10];
            this.y = this.y + r;
            pg.rect(this.x4, this.y, this.w, this.w);
            pg.fill(this.color2);
            pg.beginShape();
            pg.vertex(this.x4, this.y);
            pg.vertex(this.x4 + this.w, this.y);
            pg.vertex(this.x4 + this.w + r, this.y - r);
            pg.vertex(this.x4 + r, this.y - r);
            pg.endShape();
            pg.fill(this.color3);
            pg.beginShape();
            pg.vertex(this.x4 + this.w, this.y);
            pg.vertex(this.x4 + this.w, this.y + this.w);
            pg.vertex(this.x4 + this.w + r, this.y + this.w - r);
            pg.vertex(this.x4 + this.w + r, this.y - r);
            pg.endShape();
        }
        pg.endShape();
        pg.pop();
    }
}

//#endregion

//#region helpers

function getStandardDeviation(array, mean) {
    const n = array.length
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function getNormalizedList(array, mean, std) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push((array[i] - mean) / std);
    }
    return newArray;
}

function getRotatedX(x, y, angle) {
    return x * cos(angle) - y * sin(angle);
}

function getRotatedY(x, y, angle) {
    return y * cos(angle) + x * sin(angle);
}

function isColor(r, g, b, a, myColor) {
    return color((int)(r), (int)(g), (int)(b), (int)(a)) === myColor;

}

function getRandomColor(i) {
    let colorScheme = myColors;
    let colorIndex = features.isColorSchemeSparkle ? decPairsMyColorsSparkle :
        features.isColorSchemeBeta ? decPairsMyColors2 :
            features.isGrayScale ? decPairsMyColorsGrayScale :
                decPairsMyColors;
    while (i > colorIndex.length - 1 && i >= 0) {
        i--;
    }
    let c = colorScheme[decPairsMyColors[i]];
    if (features.isColorSchemeSparkle) {
        colorScheme = myColorsSparkle;
        c = colorScheme[decPairsMyColorsSparkle[i]];
    } else if (features.isColorSchemeBeta) {
        colorScheme = myColors2;
        c = colorScheme[decPairsMyColors2[i]];
    } else if (features.isGrayScale) {
        colorScheme = myColorsGrayScale;
        c = colorScheme[decPairsMyColorsGrayScale[i]];
    }

    if (features.isBlackOut) {
        c = black;
    }

    switch (c) {
        case black:
        case black2:
        case black3:
            features.hasBlack = true;
            break;
        case blue:
        case blue2:
            features.hasBlue = true;
            break;
        case red:
        case red2:
            features.hasRed = true;
            break;
        case yellow:
            features.hasYellow = true;
            break;
        case orange:
        case orange2:
            features.hasOrange = true;
            break;
        case deepOrange:
            features.hasDeepOrange = true;
            break;
        case lightBlue:
            features.hasLightBlue = true;
            break;
        case pink:
            features.hasPink = true;
            break;
        case washedPink:
            features.hasWashedPink = true;
            break;
        case grey:
            features.hasGrey = true;
            break;
        case deepGrey:
            features.hasDeepGrey = true;
            break;
        case lightGrey:
            features.hasLightGrey = true;
            break;
        case green:
            features.hasGreen = true;
            break;
        default:
            break;
    }

    return c;
}

//#endregion
