import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class TravelWaypointsTransaction extends jsTPS_Transaction {
  constructor(newWaypoints, oldWaypoints, initStore) {
    super();
    // this.type = type;
    this.store = initStore;
    this.newWaypoints = JSON.parse(JSON.stringify(newWaypoints));
    this.oldWaypoints = JSON.parse(JSON.stringify(oldWaypoints));
    // this.oldWaypoints = oldWaypoints;
  }

  doTransaction() {
    this.store.setWaypoints(this.newWaypoints);
  }
  
  undoTransaction() {
    console.log("newWaypoints" + this.newWaypoints)
    console.log("oldWaypoints" + this.oldWaypoints)
    this.store.setWaypoints(this.oldWaypoints);
  }
}
