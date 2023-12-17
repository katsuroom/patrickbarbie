import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Procolor_transaction extends jsTPS_Transaction {
  constructor(oldcolor, newcolor, initStore){
    super();
    this.store = initStore;
    this.oldcolor = oldcolor;
    this.newcolor = newcolor;
  }

  doTransaction(){
    this.store.setProColor(this.newcolor);
  }

  undoTransaction(){
    this.store.setProColor(this.oldcolor);
  }
}