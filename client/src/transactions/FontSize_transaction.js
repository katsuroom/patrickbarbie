import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class FontSize_Transaction extends jsTPS_Transaction {
    constructor(fontSizeBefore, fontSize, initStore) {
        super();
        this.store = initStore;
        this.fontSize = fontSize;
        this.fontSizeBefore = fontSizeBefore
    }

    doTransaction() {
        this.store.setFontSize(this.fontSize)
    }

    undoTransaction() {
        this.store.setFontSize(this.fontSizeBefore)
    }
}
