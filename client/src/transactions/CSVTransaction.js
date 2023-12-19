import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class CSV_Transaction extends jsTPS_Transaction {
    constructor(oldCSV, newCSV, initStore){
        super();
        this.store = initStore;
        this.oldCSV = oldCSV;
        this.newCSV = newCSV;
    }

    doTransaction(){
        this.store.setParsedCsvData(this.newCSV);
    }

    undoTransaction(){
        this.store.setParsedCsvData(this.oldCSV);
    }
}
