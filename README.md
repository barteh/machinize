
[![Build Status](https://travis-ci.org/barteh/machinize.svg?branch=master)](https://travis-ci.org/barteh/machinize) [![Coverage Status](https://coveralls.io/repos/github/barteh/machinize/badge.svg?branch=master)](https://coveralls.io/github/barteh/machinize?branch=master)

# Machinize
## a javascript library implements finite-state machine for application developement purpose


## main features

- change objects to machine automaticly.
- define machine behavior once and create many instances.
- automatic transitions with defined condition.
- supports parametric observable (source state, destinition state or both) observable state changes based on rxjs.
- supports blockable hooks contain(befor, after Enter and exit) from or to  states.
- data included access via `this` .
- define  auto transition by a condition.
- imutable state.
- actions that acces to `this` so data and parameters.
- supports computed data .
- many usefull features will be document soon



![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Finite_state_machine_example_with_comments.svg/420px-Finite_state_machine_example_with_comments.svg.png)



---
### install
```
npm i @barteh/machinize
```
---
### usage
```js
import Machinize from "@barteh/machinize"
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

```


---
### test
```
npm run test
``` 
---
### build

```
npm run build
```



License: MIT
2017
