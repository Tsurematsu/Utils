import Inherit from "./Inherit.js";
main();
function main() {
    class objetoA {
        estado1 = false;
        estado2 = false;
        constructor() {}
    }

    class objetoB {
        constructor(parent) {
            Inherit(this, parent);
            this.estado1 = true;
        }
        change(){
            this.estado2 = true;
        }
    }

    const obA = new objetoA();
    console.log("estado 1 (original):", obA.estado1, "->", obA.estado1?"error":"ok");
    console.log("estado 2 (original):", obA.estado2, "->",  obA.estado2?"error":"ok");
    
    const obB = new objetoB(obA);
    console.log("estado 1 (modificado):", obA.estado1, "->", obA.estado1?"ok":"error");
    console.log("estado 2 (constructor):", obA.estado2, "->", obA.estado2?"error":"ok");

    obB.change(obA);
    console.log("estado 2 (modificado):", obA.estado2, "->", obA.estado2?"ok":"error");
    
}