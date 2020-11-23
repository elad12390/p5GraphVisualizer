class Edge {
    constructor(vertex1, vertex2) {
        this.v1 = vertex1;
        this.v2 = vertex2;
    }
    equals(otherEdge) {
        return (this.v1 === otherEdge.v1 && this.v2 === otherEdge.v2) || (this.v2 === otherEdge.v1 && this.v1 === otherEdge.v2);
    }
}
