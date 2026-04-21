const maxFlowerSize = 45;
const lineMaxDist = 15;
const maxPressFrames = 300;
let flowerX = 0, flowerY = 0;
let flowerType = 1;
let mousePressState = false;
let mousePressFrame = 0;
let lineList = [];
let pg, fg;

function setup() {
    createCanvas(windowWidth, windowHeight);
    fg = createGraphics(windowWidth, windowHeight);
    pg = createGraphics(windowWidth, windowHeight);
    pg.background(133, 131, 130);
    createBreakLine();
    pg.fill(255);
    pg.noStroke();
    pg.textAlign(LEFT, TOP);
    pg.textSize(14);
    pg.text("틈 사이를 꾹 눌러보세요.", 24, 24);
}

function draw() {
    image(pg, 0, 0);
    fg.clear();
    if (mousePressState) {
        let progress = min(1, (frameCount - mousePressFrame) / maxPressFrames);
        drawConsistentFlower(flowerX, flowerY, flowerType, progress, fg);
    }
    image(fg, 0, 0);
    drawHelpUI();
}

function keyPressed() {
    if (!mousePressState && key >= '1' && key <= '9') flowerType = int(key);
}

/* function keyPressed(event) {
    if (!mousePressState && key >= '1' && key <= '9') flowerType = int(key);
    if (event.key === 'Enter') {
        save("flower", "svg");
    }
} */

function drawHelpUI() {
    let uiX = width - 40;
    let uiY = 35;
    let isHover = dist(mouseX, mouseY, uiX, uiY) < 25;
    if (!isHover) {
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(28);
        textStyle(BOLD);
        text("?", uiX, uiY);
    } else {
        let panelW = 130;
        let panelH = 430;
        let panelX = width - panelW - 20;
        let panelY = 20;
        fill(133, 131, 130);
        strokeWeight(2);
        stroke(255);
        rect(panelX, panelY, panelW, panelH);
        fill(255);
        noStroke();
        textAlign(CENTER, TOP);
        textSize(10);
        textStyle(NORMAL);
        let lines = ["숫자 키패드를 누르면", "다른 꽃을 그릴 수 있습니다."];
        for (let l = 0; l < lines.length; l++) {
            text(lines[l], panelX + panelW / 2, panelY + 17 + l * 14);
        }
        for (let i = 1; i <= 9; i++) {
            let rowY = panelY + 35 + (i * 40);
            fill(255);
            textAlign(LEFT, CENTER);
            textSize(18);
            if (flowerType === i) textStyle(BOLD), fill(255, 193, 38);
            else textStyle(NORMAL);
            text(i, panelX + 30, rowY + 2);
            push();
            translate(panelX + 80, rowY);
            scale(0.35);
            drawConsistentFlower(0, 0, i, 1.0, this);
            pop();
        }
    }
}

function drawConsistentFlower(fx, fy, type, progress, buffer) {
    let S = maxFlowerSize;
    let scaleFactor = constrain(progress, 0.1, 1);
    let blockSize = progress >= 1.0 ? 0.5 : max(1, lerp(20, 1, progress));
    buffer.noStroke();
    for (let gx = fx - S * 1.3; gx < fx + S * 1.3; gx += blockSize) {
        for (let gy = fy - S * 1.3; gy < fy + S * 1.3; gy += blockSize) {
            let dx = (gx + blockSize / 2) - fx;
            let dy = (gy + blockSize / 2) - fy;
            dx /= scaleFactor;
            dy /= scaleFactor;
            let c = getFlowerColor(dx, dy, type);
            if (c !== null) {
                buffer.fill(c);
                buffer.rect(gx, gy, blockSize + 0.2, blockSize + 0.2);
            }
        }
    }
}

function getFlowerColor(dx, dy, type) {
    let r = sqrt(dx * dx + dy * dy);
    let S = maxFlowerSize;

    if (type === 1) {
        let whiteRotateOffset = PI / 6;
        if (r < S * 0.2) return color(255, 251, 0);
        let lw7 = S * 0.27;
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i + whiteRotateOffset;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            let cx7 = (S * 0.1 + S * 0.5) / 2;
            let ry7 = (S * 0.5 - S * 0.1) / 2;
            if (pow(rdx / (lw7 / 2), 2) + pow((rdy - cx7) / ry7, 2) < 1) return color(255, 200, 0);
        }
        let lw6 = S * 0.3;
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            let cx6 = (S * 0.1 + S * 0.7) / 2;
            let ry6 = (S * 0.7 - S * 0.1) / 2;
            if (pow(rdx / (lw6 / 2), 2) + pow((rdy - cx6) / ry6, 2) < 1) return color(255, 166, 0);
        }
        let lw2 = S * 0.35;
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i + whiteRotateOffset;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            let cx2 = (S * 0.25 + S * 0.9) / 2;
            let ry2 = (S * 0.9 - S * 0.25) / 2;
            if (pow(rdx / (lw2 / 2), 2) + pow((rdy - cx2) / ry2, 2) < 1) return color(255, 119, 0);
        }
        let lw1 = S * 0.35;
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            let cx1 = (S * 0.25 + S) / 2;
            let ry1 = (S - S * 0.25) / 2;
            if (pow(rdx / (lw1 / 2), 2) + pow((rdy - cx1) / ry1, 2) < 1) return color(255, 85, 0);
        }
    }

    else if (type === 2) {
        if (r < S * 0.33) return color(255, 196, 0);
        for (let i = 0; i < 18; i++) {
            let a = (TWO_PI / 18) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.55) / (S * 0.55), 2) + pow(rdy / (S * 0.06), 2) < 1) return color(255);
        }
    }

    else if (type === 3) {
        let whiteRotateOffset = PI / 11;
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.03) / (S * 0.3), 2) + pow(rdy / (S * 0.04), 2) < 1) return color(255);
        }
        for (let i = 0; i < 8; i++) {
            let a = (TWO_PI / 8) * i + whiteRotateOffset;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.07) / (S * 0.4), 2) + pow(rdy / (S * 0.07), 2) < 1) return color(163, 215, 255);
        }
        for (let i = 0; i < 11; i++) {
            let a = (TWO_PI / 11) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.25) / (S * 0.5), 2) + pow(rdy / (S * 0.12), 2) < 1) return color(84, 182, 255);
        }
        for (let i = 0; i < 11; i++) {
            let a = (TWO_PI / 11) * i + whiteRotateOffset;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.35) / (S * 0.6), 2) + pow(rdy / (S * 0.13), 2) < 1) return color(0, 144, 255);
        }
        for (let i = 0; i < 11; i++) {
            let a = (TWO_PI / 11) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.57) / (S * 0.57), 2) + pow(rdy / (S * 0.15), 2) < 1) return color(0, 118, 209);
        }
    }

    else if (type === 4) {
        let whiteRotateOffset = PI / 5;
        let d = sqrt(dx * dx + dy * dy);
        if (d < S * 0.12) return color(255);
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.18) / (S * 0.15), 2) + pow(rdy / (S * 0.12), 2) < 1) return color(216, 184, 255);
        }
        let midOffset = PI / 8;
        for (let i = 0; i < 8; i++) {
            let a = (TWO_PI / 8) * i + midOffset;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.32) / (S * 0.22), 2) + pow(rdy / (S * 0.14), 2) < 1) return color(174, 119, 242);
        }
        let outerOffset = PI / 10;
        for (let i = 0; i < 10; i++) {
            let a = (TWO_PI / 10) * i + outerOffset;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.5) / (S * 0.35), 2) + pow(rdy / (S * 0.15), 2) < 1) return color(111, 41, 196);
        }
        for (let i = 0; i < 10; i++) {
            let a = (TWO_PI / 10) * i + whiteRotateOffset;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.6) / (S * 0.4), 2) + pow(rdy / (S * 0.1), 2) < 1) return color(63, 10, 128);
        }
    }

    else if (type === 5) {
        let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        for (let i = 0; i < 4; i++) {
            let cx = dirs[i][0] * S * 0.175;
            let cy = dirs[i][1] * S * 0.175;
            if (pow((dx - cx) / (S * 0.15), 2) + pow((dy - cy) / (S * 0.15), 2) < 1) return color(95, 204, 55);
        }
        if (r < S * 0.125) return color(95, 204, 55);
    }

    else if (type === 6) {
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i;
            let cx = cos(a) * S * 0.08;
            let cy = sin(a) * S * 0.08;
            if (pow((dx - cx) / (S * 0.08), 2) + pow((dy - cy) / (S * 0.08), 2) < 1) return color(230, 240, 220);
        }
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i;
            let cx = cos(a) * S * 0.22;
            let cy = sin(a) * S * 0.22;
            if (pow((dx - cx) / (S * 0.24), 2) + pow((dy - cy) / (S * 0.24), 2) < 1) return color(55, 91, 166);
        }
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i + PI / 5;
            let cx = cos(a) * S * 0.34;
            let cy = sin(a) * S * 0.34;
            if (pow((dx - cx) / (S * 0.27), 2) + pow((dy - cy) / (S * 0.27), 2) < 1) return color(35, 65, 130);
        }
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i;
            let cx = cos(a) * S * 0.48;
            let cy = sin(a) * S * 0.48;
            if (pow((dx - cx) / (S * 0.32), 2) + pow((dy - cy) / (S * 0.32), 2) < 1) return color(20, 45, 105);
        }
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i + PI / 5;
            let cx = cos(a) * S * 0.62;
            let cy = sin(a) * S * 0.62;
            if (pow((dx - cx) / (S * 0.32), 2) + pow((dy - cy) / (S * 0.32), 2) < 1) return color(15, 35, 90);
        }
    }

    else if (type === 7) {
        if (r < S * 0.15) return color(255, 221, 0);
        for (let i = 0; i < 10; i++) {
            let a = (TWO_PI / 10) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.4) / (S * 0.4), 2) + pow(rdy / (S * 0.05), 2) < 1) return color(252, 78, 125);
        }
        for (let i = 0; i < 10; i++) {
            let a = (TWO_PI / 10) * i + PI / 8;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.38) / (S * 0.36), 2) + pow(rdy / (S * 0.065), 2) < 1) return color(255, 130, 160);
        }
        for (let i = 0; i < 10; i++) {
            let a = (TWO_PI / 10) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.6) / (S * 0.45), 2) + pow(rdy / (S * 0.15), 2) < 1) return color(255, 190, 210);
        }
    }

    else if (type === 8) {
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i;
            let cx = cos(a) * S * 0.07;
            let cy = sin(a) * S * 0.07;
            if (pow((dx - cx) / (S * 0.1), 2) + pow((dy - cy) / (S * 0.1), 2) < 1) return color(255);
        }
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i;
            let cx = cos(a) * S * 0.13;
            let cy = sin(a) * S * 0.13;
            if (pow((dx - cx) / (S * 0.15), 2) + pow((dy - cy) / (S * 0.15), 2) < 1) return color(255, 168, 182);
        }
        for (let i = 0; i < 5; i++) {
            let a = (TWO_PI / 5) * i;
            let cx = cos(a) * S * 0.22;
            let cy = sin(a) * S * 0.22;
            if (pow((dx - cx) / (S * 0.22), 2) + pow((dy - cy) / (S * 0.22), 2) < 1) return color(247, 99, 122);
        }
        for (let i = 0; i < 7; i++) {
            let a = (TWO_PI / 7) * i + PI / 7;
            let cx = cos(a) * S * 0.38;
            let cy = sin(a) * S * 0.38;
            if (pow((dx - cx) / (S * 0.25), 2) + pow((dy - cy) / (S * 0.25), 2) < 1) return color(220, 60, 85);
        }
        for (let i = 0; i < 9; i++) {
            let a = (TWO_PI / 9) * i;
            let cx = cos(a) * S * 0.55;
            let cy = sin(a) * S * 0.55;
            if (pow((dx - cx) / (S * 0.27), 2) + pow((dy - cy) / (S * 0.27), 2) < 1) return color(200, 40, 65);
        }
        for (let i = 0; i < 11; i++) {
            let a = (TWO_PI / 11) * i + PI / 11;
            let cx = cos(a) * S * 0.72;
            let cy = sin(a) * S * 0.72;
            if (pow((dx - cx) / (S * 0.28), 2) + pow((dy - cy) / (S * 0.28), 2) < 1) return color(170, 20, 45);
        }
    }

    else if (type === 9) {
        if (r < S * 0.28) return color(60, 35, 10);
        if (r < S * 0.33) return color(90, 55, 20);
        for (let i = 0; i < 20; i++) {
            let a = (TWO_PI / 20) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.17) / (S * 0.07), 2) + pow(rdy / (S * 0.07), 2) < 1) return color(80, 48, 15);
        }
        for (let i = 0; i < 16; i++) {
            let a = (TWO_PI / 16) * i;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.6) / (S * 0.35), 2) + pow(rdy / (S * 0.09), 2) < 1) return color(255, 218, 0);
        }
        for (let i = 0; i < 16; i++) {
            let a = (TWO_PI / 16) * i + PI / 16;
            let rdx = dx * cos(-a) - dy * sin(-a);
            let rdy = dx * sin(-a) + dy * cos(-a);
            if (pow((rdx - S * 0.57) / (S * 0.28), 2) + pow(rdy / (S * 0.095), 2) < 1) return color(255, 180, 0);
        }
    }

    return null;
}

function mousePressed() {
    let onLine = false;
    for (let item of lineList) {
        if (getDistanceToLine(mouseX, mouseY, item.sx, item.sy, item.ex, item.ey) <= lineMaxDist) {
            onLine = true; break;
        }
    }
    if (onLine) {
        flowerX = mouseX; flowerY = mouseY;
        mousePressState = true; mousePressFrame = frameCount;
    }
}

function mouseReleased() {
    if (mousePressState) {
        let progress = min(1, (frameCount - mousePressFrame) / maxPressFrames);
        drawConsistentFlower(flowerX, flowerY, flowerType, progress, pg);
    }
    mousePressState = false;
}

function createFracture(x, y, len, angle) {
    let steps = 6;
    let currX = x, currY = y;
    for (let i = 0; i < steps; i++) {
        let nextAngle = angle + random(-0.4, 0.4);
        let nextX = currX + cos(nextAngle) * (len / steps);
        let nextY = currY + sin(nextAngle) * (len / steps);
        pg.stroke(0);
        pg.strokeWeight(2);
        pg.line(currX, currY, nextX, nextY);
        lineList.push({ sx: currX, sy: currY, ex: nextX, ey: nextY });
        currX = nextX; currY = nextY;
    }
}

function createBreakLine() {
    let segments = floor(random(5, 7));
    for (let i = 0; i < segments; i++) {
        createFracture(width / 3, height / 3, random(500, 1000), random(TWO_PI));
        createFracture(width * 2 / 3, height * 2 / 3, random(500, 1000), random(TWO_PI));
    }
}

function getDistanceToLine(px, py, x1, y1, x2, y2) {
    let l2 = dist(x1, y1, x2, y2) ** 2;
    if (l2 === 0) return dist(px, py, x1, y1);
    let t = constrain(((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2, 0, 1);
    return dist(px, py, x1 + t * (x2 - x1), y1 + t * (y2 - y1));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
