
[![Coverage Status](https://coveralls.io/repos/github/barteh/machinize/badge.svg?branch=master)](https://coveralls.io/github/barteh/machinize?branch=master)

# Machinize
## a javascript library implements finite-state machine for application developement purpose


## main features
>
>1. parametric observable state based on rxjs.
>2. befor, after Enter and exit from and to a state lockable hooks onEnter.
>3. data included access via `this` .
>4. define  auto transition by a condition.
>5. imutable state.
>6. actions that acces to `this` so data and parameters.
>7. computed fields for using in entryconditions.
>8. many usefull features will be document soon
>


![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Finite_state_machine_example_with_comments.svg/420px-Finite_state_machine_example_with_comments.svg.png)



---
### install
```
npm i @barteh/machinize
```
---
### usage
```js
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
