import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class GeneralProperty_Transaction extends jsTPS_Transaction {
    constructor(index, selectedKey, oldValue, newValue, initStore){
        super();
        this.store = initStore;
        this.index = index;
        this.selectedKey = selectedKey;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    doTransaction(){
        this.store.setGeneralProperty(this.selectedKey, this.newValue, this.index);
    }

    undoTransaction(){
        this.store.setGeneralProperty(this.selectedKey, this.oldValue, this.index);
    }
}
