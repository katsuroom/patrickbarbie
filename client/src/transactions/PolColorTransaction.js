import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class PolColorTransaction extends jsTPS_Transaction {
  constructor(oldMapping, newMapping, initStore){
    super();
    this.store = initStore;
    this.oldMapping = oldMapping;
    this.newMapping = newMapping;
  }

  doTransaction(){
    this.store.setPolMapping(this.newMapping);
  }

  undoTransaction(){
    this.store.setPolMapping(this.oldMapping);
  }
}