/**
 * 1. 1, 2번 꽃의 속도 통일
 * 2. 짧은 클릭 시 사라지는 버그 수정
 * 3. 완성 시 픽셀 느낌 제거 (blockSize 1로 수렴)
 * 4. 꽃 크기 축소 (maxFlowerSize: 60)
 */

const maxFlowerSize = 60;   // 4. 꽃 크기 축소
const lineMaxDist = 15;     // 클릭 감지 반경
const maxPressFrames = 120; // 약 2초 (60fps 기준)

let flowerX = 0;
let flowerY = 0;
let flowerType = 1;
let flowerList = [];        // {x, y, type, progress}
let mousePressState = false;
let mousePressFrame = 0;
let lineList = [];
let pg; // 배경 + 균열 저장용 버퍼

function setup() {
    createCanvas(windowWidth, windowHeight);
    pg = createGraphics(windowWidth, windowHeight);
    pg.background(180, 174, 170);
    createBreakLine(); // 균열 생성
}

function createBreakLine() {
    // 기존 코드의 위치 로직 복구
    let segments = floor(random(5, 7));
    for (let i = 0; i < segments; i++) {
        createFracture(windowWidth / 3, windowHeight / 3, random(500, 1000), random(TWO_PI));
    }
    for (let i = 0; i < segments; i++) {
        createFracture(windowWidth * 2 / 3, windowHeight * 2 / 3, random(500, 1000), random(TWO_PI));
    }
}

function draw() {
    image(pg, 0, 0); // 배경(균열 포함) 그리기

    // 저장된 꽃들 다시 그리기
    for (let f of flowerList) {
        drawFlowerMosaic(f.x, f.y, f.type, f.progress);
    }

    // 현재 실시간으로 자라나는 꽃
    if (mousePressState) {
        let progress = min(1, (frameCount - mousePressFrame) / maxPressFrames);
        drawFlowerMosaic(flowerX, flowerY, flowerType, progress);
    }
}

// 모자이크 → 매끄러운 꽃 전환 함수
function drawFlowerMosaic(fx, fy, type, progress) {
    let S = maxFlowerSize;
    // 1 & 3. progress에 따라 blockSize가 1까지 작아져서 픽셀 느낌을 제거함
    let blockSize = max(1, lerp(25, 1, progress)); 

    noStroke();
    rectMode(CORNER);

    for (let gx = fx - S; gx < fx + S; gx += blockSize) {
        for (let gy = fy - S; gy < fy + S; gy += blockSize) {
            let dx = (gx + blockSize / 2) - fx;
            let dy = (gy + blockSize / 2) - fy;

            let c = getFlowerColor(dx, dy, type);
            if (c !== null) {
                fill(c);
                // 픽셀 간 미세한 빈틈 방지를 위해 0.5px 크게 그림
                rect(gx, gy, blockSize + 0.5, blockSize + 0.5);
            }
        }
    }
}

function getFlowerColor(dx, dy, type) {
    let r = sqrt(dx * dx + dy * dy);
    let S = maxFlowerSize;

    if (type === 1) {
        // 중심부
        if (r < S * 0.25) return color(255, 109, 0);

        // 주황 꽃잎 (6장)
        let lw2 = S * 0.35;
        for (let i = 0; i < 6; i++) {
            let a = (TWO_PI / 6) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            if (rdx >= -lw2/2 && rdx <= lw2/2 && rdy >= S*0.2 && rdy <= S*0.7) {
                return color(255, 170, 0);
            }
        }

        // 노란 꽃잎 (12장)
        let lw1 = S * 0.25;
        for (let i = 0; i < 12; i++) {
            let a = (TWO_PI / 12) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            if (rdx >= -lw1/2 && rdx <= lw1/2 && rdy >= S*0.2 && rdy <= S) {
                return color(255, 212, 0);
            }
        }
        return null;
    }

    if (type === 2) {
        // 중심부
        if (r < S * 0.35) return color(255, 218, 0);

        // 흰색 꽃잎 (24장)
        for (let i = 0; i < 24; i++) {
            let a = (TWO_PI / 24) * i;
            let rdx = dx * cos(a) + dy * sin(a);
            let rdy = -dx * sin(a) + dy * cos(a);
            if (rdx >= -S*0.06 && rdx <= S*0.06 && rdy >= S*0.2 && rdy <= S) {
                return color(255, 255, 255);
            }
        }
        return null;
    }

    // 3번 꽃 (초록 심플)
    if (type === 3) {
        if (r < S * 0.5) return color(150, 200, 100);
        return null;
    }

    return null;
}

function mousePressed() {
    let onLine = false;
    for (let item of lineList) {
        let d = getDistanceToLine(mouseX, mouseY, item.sx, item.sy, item.ex, item.ey);
        if (d <= lineMaxDist) {
            onLine = true;
            break;
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
        // 2. 아주 살짝만 눌러도 최소 15% 자란 상태로 남겨서 사라짐 버그 해결
        flowerList.push({ 
            x: flowerX, 
            y: flowerY, 
            type: flowerType, 
            progress: max(0.15, progress) 
        });
    }
    mousePressState = false;
}

function keyPressed() {
    // 숫자 키 1~9로 타입 변경
    if (key >= '1' && key <= '9') {
        flowerType = int(key);
    }
}

function createFracture(x, y, len, angle) {
    let steps = 6;
    let currX = x;
    let currY = y;
    for (let i = 0; i < steps; i++) {
        let nextAngle = angle + random(-0.4, 0.4);
        let nextX = currX + cos(nextAngle) * (len / steps);
        let nextY = currY + sin(nextAngle) * (len / steps);

        pg.stroke(60, 50, 40); 
        pg.strokeWeight(2);
        pg.line(currX, currY, nextX, nextY);

        // 거리 계산을 위해 라인 리스트 저장
        lineList.push({ sx: currX, sy: currY, ex: nextX, ey: nextY });

        currX = nextX;
        currY = nextY;
    }
}

function getDistanceToLine(px, py, x1, y1, x2, y2) {
    let l2 = dist(x1, y1, x2, y2) ** 2;
    if (l2 === 0) return dist(px, py, x1, y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = constrain(t, 0, 1);
    let closestX = x1 + t * (x2 - x1);
    let closestY = y1 + t * (y2 - y1);
    return dist(px, py, closestX, closestY);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
