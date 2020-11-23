
const VERTICE = 'vertice';
const EDGES = 'edges';
const MOVE = 'move';
const vertices = [];
let edges = [];
const button1Location = [5, 15];
const button2Location = [5, 50];
const button3Location = [25, 120];
const button3Size = 30
const button4Location = [50, 145];
const button4Size = [90, 30];
const drawingBoardSize = [500,500];
const drawingBoardLocation = [100,10];
const verticeScale = 50;
let vn = 1;
const STATES = {
    none: 0,
    selectedFirstEdge: 1
}
let firstVertice = null;
let currentState = STATES.none;
let selectedTool = VERTICE;
let lockedVertex = null;
const drawMenu = () => {
    // button1
    if (selectedTool === VERTICE) {
        fill(125, 0, 0);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(button1Location[0], button1Location[1], 30, 30, 5);
    // square(5, 15, 30);
    circle(button1Location[0] + 15, button1Location[1] + 15, 20);

    // button2
    if (selectedTool === EDGES) {
        fill(125, 0, 0);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(button2Location[0], button2Location[1], 60, 30, 5);
    circle(button2Location[0] + 15, button2Location[1] + 15, 20);
    circle(button2Location[0] + 45, button2Location[1] + 15, 20);
    line(button2Location[0] + 25, button2Location[1] + 15, button2Location[0] + 35, button2Location[1] + 15);

    if (selectedTool === MOVE) {
        fill(125, 0, 0);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(button3Location[0] - ((button3Size * 1.2)/2), button3Location[1] - ((button3Size * 1.2)/2) - (button3Size / 2), button3Size * 1.2, button3Size * 1.2, 5);
    triangle(button3Location[0] - button3Size/2, button3Location[1], button3Location[0], button3Location[1] - button3Size, button3Location[0] + button3Size/2, button3Location[1]);

    fill(255, 255, 255, 0);
    rect(button4Location[0] - (button4Size[0]/2), button4Location[1] - (button4Size[1]/2), button4Size[0], button4Size[1], 5);
    fill(0);
    text('Reverse Graph', button4Location[0] - (button4Size[0]/2.1), button4Location[1]);


    // Drawing board
    fill(255, 255, 255, 0);
    rect(drawingBoardLocation[0], drawingBoardLocation[1], drawingBoardSize[0], drawingBoardSize[1]);
}

const dist = (x, x1) => {
    return Math.abs(x1 - x);
}

const vDist = ({x,y}, {x: x1, y: y1}) => {
    return Math.sqrt(Math.pow(Math.abs(x1 - x), 2) + Math.pow(Math.abs(y1 - y), 2));
}
const drawVertices = () => {
    vertices.forEach((v) => {
        if (v === lockedVertex || v === firstVertice) {
            fill(0, 255, 0);
        } else {
            fill(255, 255, 255, 0);
        }
        circle(v.x, v.y, verticeScale);
        fill(50);
        text(v.name, v.x, v.y);
        fill(255, 255, 255, 0);
    })
}
const drawEdges = () => {
    edges.forEach(edge => {
        const v1 = edge.v1;
        const v2 = edge.v2;
        line(v1.x, v1.y, v2.x, v2.y);
    })
}

const reverseGraph = () => {
    let kGraph = vertices.map(v => {
        return vertices.map(v2 => {
            if (v2 !== v) {
                return new Edge(v, v2);
            }
        });
    }).flat().filter(a => !!a);

    console.log('kGraph', kGraph);
    edges.forEach(e => {
        kGraph = kGraph.filter(edge => !edge.equals(e));
    });

    console.log(kGraph);
    edges = [...kGraph];
}

function setup() {
  // put setup code here
    createCanvas(700, 700)
}

function draw() {
  // put drawing code here
    background(255);
    drawMenu();
    drawVertices();
    drawEdges();
}

function mouseClicked() {
    if (Math.abs(mouseX - (button1Location[0] + 10)) < 15 && Math.abs(mouseY - (button1Location[1] + 10)) < 15) {
        selectedTool = VERTICE;
    } else if (Math.abs(mouseX - (button2Location[0] + 30)) < 45 && Math.abs(mouseY - (button2Location[1] + 10)) < 15) {
        selectedTool = EDGES;
    } else if (Math.abs(mouseX - (button3Location[0])) < button3Size/2 && Math.abs(mouseY - (button3Location[1] - button3Size/2)) < button3Size/2) {
        selectedTool = MOVE;
    } else if (Math.abs(mouseX - (button4Location[0])) < button4Size[0]/2 && Math.abs(mouseY - (button4Location[1]) < button4Size[1]/2)) {
        console.log('clicked reverse');
        reverseGraph();
    } else if (Math.abs(mouseX - (drawingBoardLocation[0] + (drawingBoardSize[0] / 2))) < (drawingBoardSize[0]/2) && Math.abs(mouseY - (drawingBoardLocation[1] + (drawingBoardSize[1] / 2))) < (drawingBoardSize[1]/2)) {
        if (selectedTool === VERTICE) {
            vertices.push(new Vertice(mouseX, mouseY, vn++));
        } else if (selectedTool === EDGES) {
            if (currentState === STATES.none) {
                vertices.forEach(v => {
                    if (vDist({x: mouseX, y: mouseY}, v) <= verticeScale) {
                        firstVertice = v;
                        currentState = STATES.selectedFirstEdge;
                    }
                })
            } else if (currentState === STATES.selectedFirstEdge) {
                vertices.forEach(v => {
                    if (vDist({x: mouseX, y: mouseY}, v) <= verticeScale) {
                        edges.push(new Edge(firstVertice, v));
                        currentState = STATES.none;
                        firstVertice = null;
                    }
                })
            }
        } else if (selectedTool === MOVE) {
            vertices.forEach(v => {
                if ((vDist({x: mouseX, y: mouseY}, v) <= verticeScale) && !lockedVertex) {
                    lockedVertex = v;
                }
            });
        }
    }
}

function mouseDragged() {
    if (selectedTool === MOVE &&
        !!lockedVertex &&
        (dist(drawingBoardLocation[0] + (drawingBoardSize[0] / 2), mouseX) < ((drawingBoardSize[0] - verticeScale) / 2)) &&
        (dist(drawingBoardLocation[1] + (drawingBoardSize[1] / 2), mouseY) < ((drawingBoardSize[1] - verticeScale) / 2))
    ) {
        lockedVertex.x = mouseX;
        lockedVertex.y = mouseY;
    }
}

function mouseReleased() {
    lockedVertex = null;
}
