import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class FontSize_Transaction extends jsTPS_Transaction {
    constructor(currentMapObject, fontSizeBefore, fontSize,store) {
        super();
        this.currentMapObject = currentMapObject; 
        this.fontSizeBefore = fontSizeBefore;
        this.fontSize = fontSize;
        this.store = store;
    }

    doTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("FontSize_Transaction: Doing Transaction");
            this.store.setFontSize(this.fontSize)
            this.currentMapObject.mapProps.fontSize = this.fontSize;
            this.currentMapObject.mapProps = JSON.parse(JSON.stringify(this.currentMapObject.mapProps));
            
        }
    }

    undoTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("FontSize_Transaction: Undoing Transaction");
            this.store.setFontSize(this.fontSizeBefore)
            this.currentMapObject.mapProps.fontSize = this.fontSizeBefore;
        }
    }

    toString() {
        return `FontSize_Transaction: ${this.fontSizeBefore} -> ${this.fontSize}`;
    }
}
