
const VERTICE = 'vertice';
const EDGES = 'edges';
const MOVE = 'move';
let vertices = new Set();
let edges = new Set();

const button1Location = [5, 15];
const button2Location = [5, 50];
const button3Location = [25, 120];
const button3Size = 30
const button4Location = [50, 145];
const button4Size = [90, 30];
const button5Location = [50, 180];
const button5Size = [90, 30];
const drawingBoardSize = [500,500];
const drawingBoardLocation = [100,10];


const hintBoxSize = [8, 30];

const hintBoxBackground = '#f3ffbe';
const selectedColor = '#23abe2'
const movedVertexColor = '#92ff7b'
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
let hintText = null;


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
    drawHint();
}


const drawMenu = () => {
    // button1
    if (selectedTool === VERTICE) {
        fill(selectedColor);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(button1Location[0], button1Location[1], 30, 30, 5);
    // square(5, 15, 30);
    circle(button1Location[0] + 15, button1Location[1] + 15, 20);

    // button2
    if (selectedTool === EDGES) {
        fill(selectedColor);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(button2Location[0], button2Location[1], 60, 30, 5);
    circle(button2Location[0] + 15, button2Location[1] + 15, 20);
    circle(button2Location[0] + 45, button2Location[1] + 15, 20);
    line(button2Location[0] + 25, button2Location[1] + 15, button2Location[0] + 35, button2Location[1] + 15);

    if (selectedTool === MOVE) {
        fill(selectedColor);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(button3Location[0] - ((button3Size * 1.2)/2), button3Location[1] - ((button3Size * 1.2)/2) - (button3Size / 2), button3Size * 1.2, button3Size * 1.2, 5);
    triangle(button3Location[0] - button3Size/2, button3Location[1], button3Location[0], button3Location[1] - button3Size, button3Location[0] + button3Size/2, button3Location[1]);

    fill(255, 255, 255, 0);
    rect(button4Location[0] - (button4Size[0]/2), button4Location[1] - (button4Size[1]/2), button4Size[0], button4Size[1], 5);
    fill(0);
    text('Reverse Graph', button4Location[0] - (button4Size[0]/2.1), button4Location[1]);

    fill(255, 255, 255, 0);
    rect(button5Location[0] - (button5Size[0]/2), button5Location[1] - (button5Size[1]/2), button5Size[0], button5Size[1], 5);
    fill(0);
    text('Clear Graph', button5Location[0] - (button4Size[0]/2.1), button5Location[1]);

    // Drawing board
    fill(255, 255, 255, 0);
    rect(drawingBoardLocation[0], drawingBoardLocation[1], drawingBoardSize[0], drawingBoardSize[1]);
}

const drawVertices = () => {
    Array.from(vertices).forEach((v) => {
        if (v === lockedVertex || v === firstVertice) {
            fill(movedVertexColor);
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
    Array.from(edges).forEach(edge => {
        const v1 = edge.v1;
        const v2 = edge.v2;
        line(v1.x, v1.y, v2.x, v2.y);
    })
}

const drawHint = () => {
    if (hintText) {
        fill(hintBoxBackground);
        rect(mouseX, mouseY - (hintBoxSize[1]), hintText.length * hintBoxSize[0], hintBoxSize[1], 12);
        fill(0);
        text(hintText, mouseX + 1 + (hintText.length * hintBoxSize[0])/8, mouseY - (hintBoxSize[1]/2) + 4);
    }
}

const dist = (x, x1) => {
    return Math.abs(x1 - x);
}

const vDist = ({x,y}, {x: x1, y: y1}) => {
    return Math.sqrt(Math.pow(Math.abs(x1 - x), 2) + Math.pow(Math.abs(y1 - y), 2));
}

const reverseGraph = () => {
    let edgesArr = [];
    let kGraph = Array.from(vertices).map(v => {
        return Array.from(vertices).map(v2 => {
            const newEdge = new Edge(v, v2);
            if (v2 !== v && !edgesArr.find(edge => edge.equals(newEdge))) {
                edgesArr.push(newEdge);
                return newEdge;
            }
        });
    }).flat().filter(a => !!a);


    Array.from(edges).forEach(e => {
        kGraph = kGraph.filter(edge => !edge.equals(e));
    });

    edges = new Set([...kGraph]);
}

const clearGraph = () => {
    edges = new Set();
    vertices = new Set();
    vn = 1;
}
const isInsideCreateVertexButton = () => (Math.abs(mouseX - (button1Location[0] + 10)) < 15 && Math.abs(mouseY - (button1Location[1] + 10)) < 15);
const isInsideCreateEdgeButton = () => (Math.abs(mouseX - (button2Location[0] + 30)) < 45 && Math.abs(mouseY - (button2Location[1] + 10)) < 15);
const isInsideMoveButton = () => (Math.abs(mouseX - (button3Location[0])) < button3Size/2 && Math.abs(mouseY - (button3Location[1] - button3Size/2)) < button3Size/2);
const isInsideReverseGraphButton = () => (Math.abs(mouseX - (button4Location[0])) < button4Size[0]/2 && Math.abs(mouseY - (button4Location[1]) < button4Size[1]/2));
const isInsideClearButton = () => (Math.abs(mouseX - (button5Location[0])) < button5Size[0]/2 && Math.abs(mouseY - (button5Location[1]) < button5Size[1]/2));
const isInsideBoard = () => (
    (dist(drawingBoardLocation[0] + (drawingBoardSize[0] / 2), mouseX) < ((drawingBoardSize[0] - verticeScale) / 2)) &&
    (dist(drawingBoardLocation[1] + (drawingBoardSize[1] / 2), mouseY) < ((drawingBoardSize[1] - verticeScale) / 2))
);

function mousePressed() {
    if (isInsideCreateVertexButton()) {
        selectedTool = VERTICE;
    } else if (isInsideCreateEdgeButton()) {
        selectedTool = EDGES;
    } else if (isInsideMoveButton()) {
        selectedTool = MOVE;
    } else if (isInsideReverseGraphButton()) {
        reverseGraph();
    } else if (isInsideClearButton()) {
        clearGraph();
    } else if (isInsideBoard()) {
        if (selectedTool === VERTICE) {
            vertices.add(new Vertice(mouseX, mouseY, vn++));
        } else if (selectedTool === EDGES) {
            if (currentState === STATES.none) {
                Array.from(vertices).forEach(v => {
                    if (vDist({x: mouseX, y: mouseY}, v) <= verticeScale) {
                        firstVertice = v;
                        currentState = STATES.selectedFirstEdge;
                    }
                })
            } else if (currentState === STATES.selectedFirstEdge) {
                let added = false;
                Array.from(vertices).forEach(v => {
                    if (!added && vDist({x: mouseX, y: mouseY}, v) <= verticeScale) {
                        const newEdge = new Edge(firstVertice, v);
                        if (!Array.from(edges).find(a => a.equals(newEdge))) {
                            edges.add(newEdge);
                        }
                        currentState = STATES.none;
                        firstVertice = null;
                        added = true;
                    }
                })
            }
        } else if (selectedTool === MOVE) {
            Array.from(vertices).forEach(v => {
                if ((vDist({x: mouseX, y: mouseY}, v) <= verticeScale) && !lockedVertex) {
                    lockedVertex = v;
                }
            });
        }
    }
}

function mouseMoved() {
    if(isInsideCreateVertexButton()) {
        hintText = "Create Vertex";
    } else if (isInsideCreateEdgeButton()) {
        hintText = "Create Edge";
    } else if (isInsideMoveButton()) {
        hintText = "Move Vertex";
    } else {
        hintText = null;
    }
}

function mouseDragged() {
    if (selectedTool === MOVE &&
        !!lockedVertex &&
        isInsideBoard()
    ) {
        lockedVertex.x = mouseX;
        lockedVertex.y = mouseY;
    }
}

function mouseReleased() {
    lockedVertex = null;
}
