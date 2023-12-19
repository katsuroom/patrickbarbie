
import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Italicize_Transaction extends jsTPS_Transaction {
    constructor(currentMapObject, olditalicize, newItalicize, store) {
        super();
        this.currentMapObject = currentMapObject;
        this.olditalicize = olditalicize;
        this.newItalicize = newItalicize;
        this.store = store;
    }

    doTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("Italicize_Transaction: Doing Transaction");
            this.store.setItalicize(this.newItalicize);
            this.currentMapObject.mapProps.Italicize = this.newItalicize;
            this.currentMapObject.mapProps = JSON.parse(JSON.stringify(this.currentMapObject.mapProps));
        }
    }

    undoTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("Italicize_Transaction: Undoing Transaction");
            this.store.setItalicize(this.oldItalicize);
            this.currentMapObject.mapProps.Italicize = this.oldItalicize;
        }
    }

    toString() {
        return `Italicize_Transaction: ${this.oldItalicize} -> ${this.newItalicize}`;
    }
}
