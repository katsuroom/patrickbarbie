import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Bold_Transaction extends jsTPS_Transaction {
    constructor(oldBold, newBold, initStore) {
        super();
        this.store = initStore;
        this.oldBold = oldBold;
        this.newBold = newBold;
    }

    doTransaction() {
        this.store.setBold(this.newBold);
    }

    undoTransaction() {
        this.store.setBold(this.oldBold);
    }
}