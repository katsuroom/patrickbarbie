import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class TravelWaypointsTransaction extends jsTPS_Transaction {
  constructor(newWaypoints, oldWaypoints, initStore) {
    super();
    // this.type = type;
    this.store = initStore;
    this.newWaypoints = newWaypoints;
    this.oldWaypoints = oldWaypoints;
  }

  doTransaction() {
    this.store.setWaypoints(this.oldWaypoints);
  }

  undoTransaction() {
    this.store.setWaypoints(this.newWaypoints);
  }
}
