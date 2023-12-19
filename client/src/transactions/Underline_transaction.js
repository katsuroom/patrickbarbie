import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Underline_Transaction extends jsTPS_Transaction {
    constructor(currentMapObject, oldUnderline, newUnderline, store) {
        super();
        this.currentMapObject = currentMapObject;
        this.oldUnderline = oldUnderline;
        this.newUnderline = newUnderline;
        this.store = store;
    }
    

    doTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("Underline_Transaction: Doing Transaction");
            this.store.setUnderline(this.newUnderline);
            this.currentMapObject.mapProps.Underline = this.newUnderline;
            this.currentMapObject.mapProps = JSON.parse(JSON.stringify(this.currentMapObject.mapProps));
        }
    }

    undoTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("Underline_Transaction: Undoing Transaction");
            this.store.setUnderline(this.oldUnderline);
            this.currentMapObject.mapProps.Underline = this.oldUnderline;
        }
    }

    toString() {
        return `Underline_Transaction: ${this.oldUnderline} -> ${this.newUnderline}`;
    }
}
