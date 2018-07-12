
[![Coverage Status](https://coveralls.io/repos/github/barteh/machinize/badge.svg?branch=master)](https://coveralls.io/github/barteh/machinize?branch=master)

# Machinize
## a javascript library implements finite-state machine for application developement purpose



![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Finite_state_machine_example_with_comments.svg/420px-Finite_state_machine_example_with_comments.svg.png)

---
### install
```
npm i @barteh/machinize
```
---
### usage
```
import {Machinize} from "@barteh/machinize"
let machine=Machinize.init({
    name:"myMachine",
    data:{
        light:55 // of 100
    },

    states:{
        "on":{
            description:"light is on",
            onEnter(){ // auto off after 2s
                setTimeout(
                ()=>{
                    if(this.light<50)
                        this.swithch(off)}
                ,2000);
            }
        },
        "off":{
            description:"light is off"

        }
    },
    transitions:{
        "switchon":{
            from:"off",
            to:"on"
        },
        "switchoff":{
            from:"on",
            to:"off"
        }
        ,
        actions:{
            do_on(){
                this.switchon();
            }
        }
    }


});


const machinInstance= macmachine.createInstance({light:31});

machinInstance
.$Observable
.subscribe(a=>{console.log("",a.message)})


machineInstance.do_on(); // light is on
machineInstance.light=66; 

machineInstance.do_on(); // nothing

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
