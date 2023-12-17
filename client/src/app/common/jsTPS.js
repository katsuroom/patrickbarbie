export class jsTPS_Transaction {
    /**
     * This method is called by jTPS when a transaction is executed.
     */
    doTransaction() {
      console.log("doTransaction - MISSING IMPLEMENTATION");
    }
  
    /**
     * This method is called by jTPS when a transaction is undone.
     */
    undoTransaction() {
      console.log("undoTransaction - MISSING IMPLEMENTATION");
    }
  }
  
  /**
   * jsTPS
   *
   * This class serves as the Transaction Processing System. Note that it manages
   * a stack of jsTPS_Transaction objects, each of which know how to do or undo
   * state changes for the given application. Note that this TPS is not platform
   * specific as it is programmed in raw JavaScript.
   */
  export default class jsTPS {
    constructor() {
      // THE TRANSACTION STACK
      this.redoTransactions = [];
      this.undoTransactions = [];
    }
   
    /**
     * getRedoSize
     *
     * Method for getting the total number of transactions on the stack
     * that can possibly be redone.
     */
    getRedoSize() {
      return this.redoTransactions.length;
    }

    /**
     * getUndoSize
     *
     * Method for getting the total number of transactions on the stack
     * that can possible be undone.
     */
    getUndoSize() {
      return this.undoTransactions.length;
    }


    /**
     * hasTransactionToRedo
     *
     * Method for getting a boolean representing whether or not
     * there are transactions on the stack that can be redone.
     */
    hasTransactionToRedo() {
      return this.redoTransactions.length > 0;
    }

    /**
     * hasTransactionToUndo
     *
     * Method for getting a boolean representing whehter or not
     * there are transactions on the stack that can be undone.
     */
    hasTransactionToUndo() {
      return this.undoTransactions.length > 0;
    }

    /**
     * addTransaction
     *
     * Method for adding a transaction to the TPS stack, note it
     * also then does the transaction.
     *
     * @param {jsTPS_Transaction} transaction Transaction to add to the stack and do.
     */
    addTransaction(transaction) {
      transaction.doTransaction();
      this.undoTransactions.push(transaction);
      this.redoTransactions = [];

    }

    /**
     * doTransaction
     *
     * Does the current transaction on the stack and advances the transaction
     * counter. Note this function may be invoked as a result of either adding
     * a transaction (which also does it), or redoing a transaction.
     */
    redoTransaction() {
      if(this.hasTransactionToRedo()){
        const transaction = this.redoTransactions.pop();
        this.undoTransactions.push(transaction);
        transaction.doTransaction();
      }
    }

    /**
     * This function gets the most recently executed transaction on the
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
    undoTransaction() {
      if(this.hasTransactionToUndo()){
        const transaction = this.undoTransactions.pop();
        this.redoTransactions.push(transaction);
        transaction.undoTransaction();
      }
    }

    /**
     * clearAllTransactions
     *
     * Removes all the transactions from the TPS, leaving it with none.
     */
    clearAllTransactions() {
      this.redoTransactions = [];
      this.undoTransactions = [];
    }

    /**
     * toString
     *
     * Builds and returns a textual represention of the full TPS and its stack.
     */
    toString() {
      let text =
        "--Number of Redo Transactions: " + this.undoTransactions.length + "\n";
      text +=
        "--Number of Undo Transactions: " + this.redoTransactions.length + "\n";

      text += "--Undo Stack:\n";
      for (let i = 0; i <= this.undoTransactions.length; i++) {
        let jT = this.undoTransactions[i];
        text += "----" + jT.toString() + "\n";
      }

      text += "--Redo Stack:\n";
      for (let i = 0; i <= this.redoTransactions.length; i++) {
        let jT = this.redoTransactions[i];
        text += "----" + jT.toString() + "\n";
      }
      return text;
    }
  }