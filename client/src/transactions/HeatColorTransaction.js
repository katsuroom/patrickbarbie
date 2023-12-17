import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class HeatColorTransaction extends jsTPS_Transaction {
  constructor(type, oldcolor, newcolor, initStore) {
    super();
    this.type = type;
    this.store = initStore;
    this.oldcolor = oldcolor;
    this.newcolor = newcolor;
  }

  doTransaction() {
    if (this.type === "min") {
      this.store.setMinColor(this.newcolor);
    } else if (this.type === "max") {
      this.store.setMaxColor(this.newcolor);
    }
  }

  undoTransaction() {
    if (this.type === "min") {
      this.store.setMinColor(this.oldcolor);
    } else if (this.type === "max") {
      this.store.setMaxColor(this.oldcolor);
    }
  }
}
