const maxFlowerSize = 150;
const lineMaxDist = 10; // 꽃이 자라날 위치와 틈과의 최대 거리
const growDelay = 10; // 커지는속도

let flowerX = 0; // 꽃 x위치
let flowerY = 0; // 꽃 y위치
let flowerType = 1; // 자라날 꽃종류 1~9
let flowerList = []; // 자라난 꽃목록
let mousePressState = false; // false : 마우스안눌림, true : 마우스눌림
let mousePressFrame = 0; // 마우스 왼쪽 누를때의 frameCount
let lineList = []; // 틈 선 목록

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(180, 174, 170);

    createBreakLine();
    console.log(lineList);
} 

function createBreakLine() {
    let segments = floor(random(5, 7)); // 균열 가닥 수(5개에서 8개 사이)
    stroke(0);
    
    for (let i = 0; i < segments; i++) {
        createFracture(windowWidth / 3, windowHeight / 3, random(500, 1000), random(TWO_PI));
    }

    for (let i = 0; i < segments; i++) {
      createFracture(windowWidth * 2 / 3, windowHeight * 2 / 3, random(500, 1000), random(TWO_PI));
    }
}

//꽃그리기
function draw() {
    let flowerSize = 0;

    if ( mousePressState === false ) return;
    
    flowerSize = (frameCount - mousePressFrame) / growDelay;

    if ( flowerSize > maxFlowerSize ) {
        flowerSize = maxFlowerSize;
    }

    // 1번꽃. 노란꽃잎 + 주황꽃잎
    if ( flowerType === 1 ) {

        push();
        translate(flowerX, flowerY); 
        noStroke();  
        
    // 노란꽃잎 
        fill(255, 212, 0);
        let leaf1 = 13; // 꽃잎개수
        let leafWidth = flowerSize * 0.3; // 꽃잎너비
        for (let i = 0; i < leaf1; i++) {
            push(); 
            rotate((TWO_PI / leaf1) * i); 
            
            rectMode(CORNER); 
            noStroke(); 
            
            // x 좌표를 너비의 절반만큼 마이너스(-leafWidth / 2) 해줌
            rect(-leafWidth / 2, flowerSize * 0.2, leafWidth, flowerSize * 0.8);
            pop();
        }

        // 주황꽃잎
        fill(255, 170, 0);
        let leaf2 = 6;
        let leafWidth2 = flowerSize * 0.34; 
        for (let i = 0; i < leaf2; i++) {
            push(); 
            rotate((TWO_PI / leaf2) * i); 
            
            rectMode(CORNER); 
            noStroke(); 
            
            rect(-leafWidth2 / 2, flowerSize * 0.2, leafWidth2, flowerSize * 0.5);
            pop();
        }

        // 심 
        fill(255, 109, 0); 
        noStroke();
        ellipseMode(CENTER);
        circle(0, 0, flowerSize * 0.5); // 심 크기
        pop();
    }


   // 2번꽃. 흰꽃 
  if ( flowerType === 2 ) {
        push();
        translate(flowerX, flowerY); 
        noStroke();  
        
        // 꽃잎 
        fill(255);
        let leaf3 = 36; 
        for (let i = 0; i < leaf3; i++) {
            push(); 
            // 한 바퀴(360도)를 꽃잎 개수로 나눠서 회전
            // rotate는 angleMode가 RADIANS(기본)인지 DEGREES인지 확인해야 함
            rotate((TWO_PI / leaf3) * i); 
            
            rectMode(CORNER); // 회전축을 기준으로.
            noStroke(); 
            rect(-flowerSize * 0.05, flowerSize * 0.2, flowerSize * 0.06, flowerSize * 0.8);
            pop();
        }

        // 심 
        fill(255, 218, 0);
        noStroke();
        ellipseMode(CENTER);
        circle(0, 0, flowerSize * 0.7); // 심 크기
        pop();
    }
    
    if ( flowerType === 3 ) {
        circle(flowerX, flowerY, flowerSize);
    }
} 

function mousePressed() {
    // 현재 flowerX,flowerY가 틈 위치와 일치하는지 비교 : 불일치하면 return
    let mouseLeft = mouseX - lineMaxDist;
    let mouseRight = mouseX + lineMaxDist;
    let mouseTop = mouseY - lineMaxDist;
    let mouseBottom = mouseY + lineMaxDist;
    let dist = lineMaxDist * 2;

    for ( let i = 0 ; i < lineList.length ; i++ ) {
        let item = lineList[i];

        if ( (item.sx < mouseLeft && item.ex < mouseLeft) ||
            (item.sx > mouseRight && item.ex > mouseRight) ||
            (item.sy < mouseTop && item.ey < mouseTop) ||
            (item.sy > mouseBottom && item.ey > mouseBottom) ) {
            
            continue;
        }

        dist = getDistanceToLine(mouseX, mouseY, item.sx, item.sy, item.ex, item.ey);
        if ( dist <= lineMaxDist ) break;
    } 

    if ( dist > lineMaxDist ) {
        return;
    }

    flowerX = mouseX;
    flowerY = mouseY;
    mousePressState = true;
    mousePressFrame = frameCount;
} 

function mouseReleased() {
    mousePressState = false;
} 

function keyPressed() {
    console.log("keyCode = " + keyCode + ",key = " + key);
    if ( 49 <= keyCode && keyCode <= 57 ) {
        flowerType = keyCode - 48;
    }
} 


// 틈그리기
function createFracture(x, y, len, angle) {
  let steps = 5;
  let currX = x;
  let currY = y;

  for (let i = 0; i < steps; i++) {
    // 진행 방향에서 살짝씩만 꺾이게 설정
    let nextAngle = angle + random(-0.5, 0.5);
    let nextX = currX + cos(nextAngle) * (len / steps);
    let nextY = currY + sin(nextAngle) * (len / steps);

    strokeWeight(map(i, 0, steps, 2, 2)); // 끝으로 갈수록 얇아짐
    line( floor(currX), floor(currY), floor(nextX), floor(nextY) );

    lineList.push( {sx:floor(currX), sy:floor(currY), ex:floor(nextX), ey:floor(nextY)} );

    currX = nextX;
    currY = nextY;
  }
} 

// 마우스클릭점과 틈사이 최단거리 구하는 함수
function getDistanceToLine(px, py, x1, y1, x2, y2) {
  let l2 = dist(x1, y1, x2, y2) ** 2; 
  if (l2 === 0) return dist(px, py, x1, y1); 

  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = constrain(t, 0, 1);

  let closestX = x1 + t * (x2 - x1);
  let closestY = y1 + t * (y2 - y1);

  return dist(px, py, closestX, closestY);
} 

/*
1. 바닥에 틈을 생성하는 기능
1-1. 꽃이 자라날 틈의 위치를 기억하는 기능

2. 마우스로 미리 그린 틈에서 꽃을 자라게 하는 기능
2-1. 꽃 위치 중복 허용
2-2. 마우스 왼쪽 버튼을 누르는 동안 꽃 자라나기
2-3. 마우스 버튼을 떼면 꽃 자라기 종료

3. 사용법 가이드 안내 기능
3-1. 초기 화면에서 3초 정도 가이드 표시
3-2. 화면 구석에 있는 가이드 아이콘에 마우스 over 하면 안내 표시

4. 키보드에서 자라는 꽃 종류를 선택 기능
4-1. 키보드 상단 숫자에 꽃 종류 할당
4-2. 최초 시작시에는 1번 꽃으로
*/ 