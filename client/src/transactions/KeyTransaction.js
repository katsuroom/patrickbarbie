import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Key_Transaction extends jsTPS_Transaction {
    constructor(newKey, oldKey, initStore){
        super();
        this.store = initStore;
        this.oldKey = oldKey;
        this.newKey = newKey;
    }

    doTransaction(){
        this.store.setCsvKey(this.newKey);
    }

    undoTransaction(){
        this.store.setCsvKey(this.oldKey);
    }
}
