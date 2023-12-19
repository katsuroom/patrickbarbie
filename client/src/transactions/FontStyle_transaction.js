import jsTPS_Transaction from "@/app/common/jsTPS.js";

export default class FontStyle_Transaction extends jsTPS_Transaction {
    constructor(currentMapObject, oldFontStyle, newFontStyle, store) {
        super();
        this.currentMapObject = currentMapObject;
        this.oldFontStyle = oldFontStyle;
        this.newFontStyle = newFontStyle;
        this.store = store;
    }
    

    doTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("FontStyle_Transaction: Doing Transaction");
            this.store.setFontStyle(this.newFontStyle);
            this.currentMapObject.mapProps.FontStyle = this.newFontStyle;
            this.currentMapObject.mapProps = JSON.parse(JSON.stringify(this.currentMapObject.mapProps));
        }
    }

    undoTransaction() {
        if (this.currentMapObject && this.currentMapObject.mapProps) {
            console.log("FontStyle_Transaction: Undoing Transaction");
            this.store.setFontStyle(this.oldFontStyle);
            this.currentMapObject.mapProps.FontStyle = this.oldFontStyle;
        }
    }

    toString() {
        return `FontStyle_Transaction: ${this.oldFontStyle} -> ${this.newFontStyle}`;
    }
}
