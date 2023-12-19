import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Underline_Transaction extends jsTPS_Transaction {
    constructor(oldUnderline, newUnderline, initStore) {
        super();
        this.store = initStore;
        this.oldUnderline = oldUnderline;
        this.newUnderline = newUnderline;
    }

    doTransaction() {
        this.store.setUnderline(this.newUnderline);
    }

    undoTransaction() {
        this.store.setUnderline(this.oldUnderline);
    }
}