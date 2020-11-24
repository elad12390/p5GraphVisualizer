class Edge {
    constructor(vertex1, vertex2) {
        this.v1 = vertex1;
        this.v2 = vertex2;
    }
    equals(otherEdge) {
        return (this.v1 === otherEdge.v1 && this.v2 === otherEdge.v2) || (this.v2 === otherEdge.v1 && this.v1 === otherEdge.v2);
    }
    contains(v) {
        return this.v1 === v || this.v2 === v;
    }
    getOtherVertex(v) {
        return this.v1 === v ? this.v2 : this.v1;
    }
}
Edge.prototype.toString = function() {
    return `v1: ${this.v1}, v2: ${this.v2}`;
}
