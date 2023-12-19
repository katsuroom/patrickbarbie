// import jsTPS_Transaction from "@/app/common/jsTPS.js";

// export default class Bold_Transaction extends jsTPS_Transaction {
//     constructor(oldBold, newBold, initStore) {
//         super();
//         this.store = initStore;
//         this.oldBold = oldBold;
//         this.newBold = newBold;
//     }

//     doTransaction() {
//         this.store.setBold(this.newBold);
//     }

//     undoTransaction() {
//         this.store.setBold(this.oldBold);
//     }
// }


import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class Bold_Transaction extends jsTPS_Transaction {
    constructor(currentMapObject, oldBold, newBold, store) {
        super();
        this.currentMapObject = currentMapObject;
        this.oldBold = oldBold;
        this.newBold = newBold;
        this.store = store;
    }
    

    doTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("Bold_Transaction: Doing Transaction");
            this.store.setBold(this.newBold);
            this.currentMapObject.mapProps.bold = this.newBold;
            this.currentMapObject.mapProps = JSON.parse(JSON.stringify(this.currentMapObject.mapProps));
        }
    }

    undoTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("Bold_Transaction: Undoing Transaction");
            this.store.setBold(this.oldBold);
            this.currentMapObject.mapProps.bold = this.oldBold;
        }
    }

    toString() {
        return `Bold_Transaction: ${this.oldBold} -> ${this.newBold}`;
    }
}
