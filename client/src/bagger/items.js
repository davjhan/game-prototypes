import { nanoid } from 'nanoid';
export class Item {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.id = nanoid();
    }
    toPlacement(isValid = true) {
        return newPlacement({ item: this, isValid, row: this.row, col: this.col });
    }
}
export class Dot extends Item {
    constructor() {
        super(...arguments);
        this.type = 'dot';
        this.layout = [[1]];
        this.color = '#60a5fa';
    }
}
export class Zag extends Item {
    constructor() {
        super(...arguments);
        this.type = 'dot';
        this.layout = [
            [1, 0],
            [1, 1],
            [0, 1]
        ];
        this.color = '#bef264';
    }
}
export function newPlacement({ item, row, col, isValid = false }) {
    return {
        item,
        row,
        col,
        layout: item.layout,
        isValid,
    };
}
//# sourceMappingURL=items.js.map