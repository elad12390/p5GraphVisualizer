class Vertice {
    constructor(x, y, n, colorIn='#ffffff') {
        this.x = x;
        this.y = y;
        this.name = `v${n}`;
        this.color = color(colorIn);
    }
}
Vertice.prototype.toString = function() {
    return `${this.name}: ${this.x}, ${this.y}`;
}
