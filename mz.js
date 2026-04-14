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
    pg.background(180, 174, 170); 
    createBreakLine(); 
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

function drawHelpUI() {
    let uiX = width - 40;
    let uiY = 35;

    let isHover = dist(mouseX, mouseY, uiX, uiY) < 25;

    if (!isHover) {
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(28);
        textStyle(BOLD);
        text("?", uiX, uiY);
    } else {
        let panelW = 100;
        let panelH = 160;
        let panelX = width - panelW - 20;
        let panelY = 20;

        fill(0, 80);
        noStroke();
        rect(panelX, panelY, panelW, panelH);

        for (let i = 1; i <= 3; i++) {
            let rowY = panelY + (i * 40) + 10;
            
            fill(255);
            textAlign(LEFT, CENTER);
            textSize(18);

            if (flowerType === i) {
                textStyle(BOLD);
            } else {
                textStyle(NORMAL);
            }

            text(i, panelX + 15, rowY);

            push();
            translate(panelX + 65, rowY);
            scale(0.35); 
            drawConsistentFlower(0, 0, i, 1.0, this); 
            pop();
        }
    }
}

// ✅ 핵심 수정 부분
function drawConsistentFlower(fx, fy, type, progress, buffer) {
    let S = maxFlowerSize;

    // 성장 비율 (최소 0.1 → 최대 1)
    let scaleFactor = constrain(progress, 0.1, 1);

    // 모자이크 블록 크기 (기존 유지)
    let blockSize = progress >= 1.0 ? 0.5 : max(1, lerp(20, 1, progress)); 

    buffer.noStroke();
    
    for (let gx = fx - S * 1.3; gx < fx + S * 1.3; gx += blockSize) {
        for (let gy = fy - S * 1.3; gy < fy + S * 1.3; gy += blockSize) {

            let dx = (gx + blockSize / 2) - fx;
            let dy = (gy + blockSize / 2) - fy;

            // ✅ 크기 성장 적용
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
        if (r < S * 0.29) return color(255, 109, 0); 
        let lw2 = S * 0.35; 
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            if (rdx >= -lw2/2 && rdx <= lw2/2 && rdy >= S*0.25 && rdy <= S*0.7) return color(255, 170, 0);
        }
        let lw1 = S * 0.35; 
        for (let i = 0; i < 12; i++) {
            let a = (TWO_PI / 12) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            if (rdx >= -lw1/2 && rdx <= lw1/2 && rdy >= S*0.25 && rdy <= S) return color(255, 212, 0);
        }
    }
    else if (type === 2) { 
        if (r < S * 0.36) return color(255, 218, 0); 
        let lwMid = S * 0.1;
        for (let i = 0; i < 24; i++) {
            let a = (TWO_PI / 24) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            if (rdx >= -lwMid/2 && rdx <= lwMid/2 && rdy >= S*0.25 && rdy <= S) return color(255);
        }
    }
    else if (type === 3) { 
        let numInner = 5, innerR = S * 0.2; 
        for (let i = 0; i < numInner; i++) {
            let a = (TWO_PI / numInner) * i;
            if (dist(dx, dy, cos(a)*S*0.25, sin(a)*S*0.25) < innerR) return color(255, 212, 40);
        }
        let numMid = 6, midR = S * 0.32;
        for (let i = 0; i < numMid; i++) {
            let a = (TWO_PI / numMid) * i;
            if (dist(dx, dy, cos(a)*S*0.42, sin(a)*S*0.42) < midR) return color(255, 140, 110);
        }
        let numOuter = 10, outerR = S * 0.35; 
        for (let i = 0; i < numOuter; i++) {
            let a = (TWO_PI / numOuter) * i;
            if (dist(dx, dy, cos(a)*S*0.75, sin(a)*S*0.75) < outerR) return color(255);
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
        flowerX = mouseX; 
        flowerY = mouseY;
        mousePressState = true; 
        mousePressFrame = frameCount;
    }
}

function mouseReleased() {
    if (mousePressState) {
        let progress = min(1, (frameCount - mousePressFrame) / maxPressFrames);
        drawConsistentFlower(flowerX, flowerY, flowerType, progress, pg);
    }
    mousePressState = false;
}

function keyPressed() {
    if (!mousePressState && key >= '1' && key <= '9') {
        flowerType = int(key);
    }
}

function createFracture(x, y, len, angle) {
    let steps = 6;
    let currX = x, currY = y;
    for (let i = 0; i < steps; i++) {
        let nextAngle = angle + random(-0.4, 0.4);
        let nextX = currX + cos(nextAngle) * (len / steps);
        let nextY = currY + sin(nextAngle) * (len / steps);
        pg.stroke(60, 50, 40); 
        pg.strokeWeight(2);
        pg.line(currX, currY, nextX, nextY);
        lineList.push({ sx: currX, sy: currY, ex: nextX, ey: nextY });
        currX = nextX; 
        currY = nextY;
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
