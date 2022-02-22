const canvasWidth = 340;
export class Size {
    constructor(canvasWidth, rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.boundsW = canvasWidth;
        this.boundsH = canvasWidth * (rows / cols);
        this.item = canvasWidth / cols;
        this.halfItem = this.item / 2;
    }
}
export class Cabinet {
    constructor(id, items, size) {
        this.id = id;
        this.items = items;
        this.size = size;
        this.grid = this.layoutItems(items);
    }
    /** Updates the grid occupancy.
     * @throws InvalidGridError if items are out of bounds. */
    layoutItems(items) {
        const grid = new Array(this.size.rows).fill(0).map(() => new Array(this.size.cols).fill(0));
        try {
            items.forEach(item => {
                /* For each item, mark the space it takes up */
                item.layout.forEach((layoutRow, r) => {
                    layoutRow.forEach((cell, c) => {
                        if (cell) {
                            const row = item.row + r;
                            const col = item.col + c;
                            if (row < 0 || row > this.size.rows - 1 || col < 0 || col > this.size.cols - 1) {
                                /* Index out of bounds. */
                                throw new InvalidGridError();
                            }
                            /* Overlap */
                            if (grid[row][col])
                                throw new InvalidGridError();
                            grid[row][col] = 1;
                        }
                    });
                });
            });
            return grid;
        }
        catch (e) {
            return undefined;
        }
    }
}
export class InvalidGridError extends Error {
    constructor() {
        super(...arguments);
        this.message = 'Invalid grid';
    }
}
//# sourceMappingURL=cabinet.js.map