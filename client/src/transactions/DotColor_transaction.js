import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class DotColor_Transaction extends jsTPS_Transaction {
    constructor(oldcolor, newcolor, initStore){
        super();
        this.store = initStore;
        this.oldcolor = oldcolor;
        this.newcolor = newcolor;
    }

    doTransaction(){
        this.store.setDotColor(this.newcolor);

    }

    undoTransaction(){
        this.store.setDotColor(this.oldcolor);
    }
}