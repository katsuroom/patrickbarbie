import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Label_Transaction extends jsTPS_Transaction {
    constructor(newLabel, oldLabel, initStore){
        super();
        this.store = initStore;
        this.oldLabel = oldLabel;
        this.newLabel = newLabel;
    }

    doTransaction(){
        this.store.setCsvLabel(this.newLabel);
    }

    undoTransaction(){
        this.store.setCsvLabel(this.oldLabel);
    }
}
