# Machinize
## a javascript library implements finite-state machine for application developement purpose
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



licence: MIT
2017
