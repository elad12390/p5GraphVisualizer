let white;
const VERTICE = 'vertice';
const EDGES = 'edges';
const MOVE = 'move';
let vertices = new Set();
let edges = new Set();

const createVertexButtonLocation = [5, 15];
const createEdgeButtonLocation = [5, 50];
const moveButtonLocation = [25, 120];
const moveButtonSize = 30
const reverseGraphButtonLocation = [50, 145];
const reverseGraphButtonSize = [90, 30];
const colorGraphLocation = [50, 180];
const colorGraphSize = [90, 30];
const clearButtonLocation = [50, 215];
const clearButtonSize = [90, 30];
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
    white = color('#ffffff');

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
    rect(createVertexButtonLocation[0], createVertexButtonLocation[1], 30, 30, 5);
    // square(5, 15, 30);
    circle(createVertexButtonLocation[0] + 15, createVertexButtonLocation[1] + 15, 20);

    // button2
    if (selectedTool === EDGES) {
        fill(selectedColor);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(createEdgeButtonLocation[0], createEdgeButtonLocation[1], 60, 30, 5);
    circle(createEdgeButtonLocation[0] + 15, createEdgeButtonLocation[1] + 15, 20);
    circle(createEdgeButtonLocation[0] + 45, createEdgeButtonLocation[1] + 15, 20);
    line(createEdgeButtonLocation[0] + 25, createEdgeButtonLocation[1] + 15, createEdgeButtonLocation[0] + 35, createEdgeButtonLocation[1] + 15);

    if (selectedTool === MOVE) {
        fill(selectedColor);
    } else {
        fill(255, 255, 255, 0);
    }
    rect(moveButtonLocation[0] - ((moveButtonSize * 1.2)/2), moveButtonLocation[1] - ((moveButtonSize * 1.2)/2) - (moveButtonSize / 2), moveButtonSize * 1.2, moveButtonSize * 1.2, 5);
    triangle(moveButtonLocation[0] - moveButtonSize/2, moveButtonLocation[1], moveButtonLocation[0], moveButtonLocation[1] - moveButtonSize, moveButtonLocation[0] + moveButtonSize/2, moveButtonLocation[1]);

    fill(255, 255, 255, 0);
    rect(reverseGraphButtonLocation[0] - (reverseGraphButtonSize[0]/2), reverseGraphButtonLocation[1] - (reverseGraphButtonSize[1]/2), reverseGraphButtonSize[0], reverseGraphButtonSize[1], 5);
    fill(0);
    text('Reverse Graph', reverseGraphButtonLocation[0] - (reverseGraphButtonSize[0]/2.1), reverseGraphButtonLocation[1]);

    fill(255, 255, 255, 0);
    rect(colorGraphLocation[0] - (colorGraphSize[0]/2), colorGraphLocation[1] - (colorGraphSize[1]/2), colorGraphSize[0], colorGraphSize[1], 5);
    fill(0);
    text('Color Graph', colorGraphLocation[0] - (colorGraphSize[0]/2.1), colorGraphLocation[1]);

    fill(255, 255, 255, 0);
    rect(clearButtonLocation[0] - (clearButtonSize[0]/2), clearButtonLocation[1] - (clearButtonSize[1]/2), clearButtonSize[0], clearButtonSize[1], 5);
    fill(0);
    text('Clear Graph', clearButtonLocation[0] - (reverseGraphButtonSize[0]/2.1), clearButtonLocation[1]);

    // Drawing board
    fill(255, 255, 255, 0);
    rect(drawingBoardLocation[0], drawingBoardLocation[1], drawingBoardSize[0], drawingBoardSize[1]);
}

const drawVertices = () => {
    Array.from(vertices).forEach((v) => {
        if (v === lockedVertex || v === firstVertice) {
            fill(movedVertexColor);
        } else {
            fill(v.color);
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

const getRandomColor = () => color(map(Math.random(), 0, 1,0,255),map(Math.random(), 0, 1,0,255),map(Math.random(), 0, 1,0,255));

const colorVertice = (v, color) => {
    v.color = color;
    edges.forEach(e => {
        if (e.v1 === v) {
            e.v1.color = color;
        }
        if (e.v2 === v) {
            e.v2.color = color;
        }
    })
}

const colorEquals = (c1, c2) => {
    return c1.toString() === c2.toString();
}

const isWhite = (v) => {
    return v.color.toString() === white.toString();
}

const isSameColor = (c,c2) => {
    return c.toString() === c2.toString();
}

const isConnectedTo = (v1, v2) => {
    return Array.from(edges).filter(a => a.v1 === v1).some(a => a.v2 === v2) ||
        Array.from(edges).filter(a => a.v2 === v1).some(a => a.v1 === v2);
}
const getConnectedVetrices = (v) => {
    return Array.from(edges).filter(a => a.v1 === v || a.v2 === v).map(a => a.getOtherVertex(v));
}
const colorGraph = () => {
    const colors = [color('#ff6565'), color('#7070ff')];
    Array.from(vertices).forEach(v => {
        colorVertice(v, white)
    });
    Array.from(vertices).forEach((v,i) => {
        const opposite = isSameColor(v.color, colors[0]) ? colors[1] : colors[0];
        getConnectedVetrices(v).forEach(otherVertex => {
                colorVertice(otherVertex, opposite)
        });
    })
    setTimeout(() => {
        alert(Array.from(edges).some(a => isSameColor(a.v1.color, a.v2.color)) ? 'The Graph is NOT Bipartite' : 'The Graph IS Bipartite');
        Array.from(vertices).forEach(v => {
            colorVertice(v, white)
        });
    }, 50);
}

const clearGraph = () => {
    edges = new Set();
    vertices = new Set();
    vn = 1;
}

const isInsideCreateVertexButton = () => (Math.abs(mouseX - (createVertexButtonLocation[0] + 10)) < 15 && Math.abs(mouseY - (createVertexButtonLocation[1] + 10)) < 15);
const isInsideCreateEdgeButton = () => (Math.abs(mouseX - (createEdgeButtonLocation[0] + 30)) < 45 && Math.abs(mouseY - (createEdgeButtonLocation[1] + 10)) < 15);
const isInsideMoveButton = () => (Math.abs(mouseX - (moveButtonLocation[0])) < moveButtonSize/2 && Math.abs(mouseY - (moveButtonLocation[1] - moveButtonSize/2)) < moveButtonSize/2);
const isInsideReverseGraphButton = () => ((Math.abs(mouseX - (reverseGraphButtonLocation[0])) < (reverseGraphButtonSize[0]/2)) && (Math.abs(mouseY - (reverseGraphButtonLocation[1])) < (reverseGraphButtonSize[1]/2)));
const isInsideColorGraph = () => (Math.abs(mouseX - (colorGraphLocation[0])) < (colorGraphSize[0]/2) && Math.abs(mouseY - (colorGraphLocation[1])) < (colorGraphSize[1]/2));
const isInsideClearButton = () => (Math.abs(mouseX - (clearButtonLocation[0])) < clearButtonSize[0]/2 && Math.abs(mouseY - (clearButtonLocation[1])) < clearButtonSize[1]/2);
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
    } else if (isInsideColorGraph()) {
        colorGraph();
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
