import {Machinize} from "./machinize";
const machine = Machinize.init({
    name: "myMachine",
    data: {
        light: 55 // of 100
    },

    states: {
        "off": {
            description: "light is off"

        },
        "on": {
            description: "light is on",
            onEnter() { // auto off after 2s
                
                // setTimeout(() => {
                //     if (this.light < 60) 
                //         this.switchoff();
                // }, 1000);
            }
        }
      
    },
    transitions: {
        "switchon": {
            from: "off",
            to: "on"
        },
        "switchoff": {
            from: "on",
            to: "off",
            entryCondition(){
                return this.light<55;
            }
        }

    },
    actions: {
        do_on() {
            this.switchon();
        }
    }

});

const machinInstance = machine.createInstance({light: 31});

machinInstance
    .$observable()
    .subscribe(a => {
        console.log( a.message)
    })

machinInstance.do_on(); // light is on

setTimeout(() => {
    machinInstance.light=44; //light is off
}, 2000);


