import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Fontstyle_Transaction extends jsTPS_Transaction {
    constructor(oldFontstyle, newFontstyle, initStore) {
        super();
        this.store = initStore;
        this.oldFontstyle = oldFontstyle;
        this.newFontstyle = newFontstyle;
    }

    doTransaction() {
        this.store.setFontStyle(this.newFontstyle);
    }

    undoTransaction() {
        this.store.setFontStyle(this.oldFontstyle);
    }
}