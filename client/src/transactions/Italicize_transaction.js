import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Italicize_Transaction extends jsTPS_Transaction {
    constructor(oldItalicize, newItalicize, initStore) {
        super();
        this.store = initStore;
        this.oldItalicize = oldItalicize;
        this.newItalicize = newItalicize;
    }

    doTransaction() {
        this.store.setItalicize(this.newItalicize);
    }

    undoTransaction() {
        this.store.setItalicize(this.oldItalicize);
    }
}