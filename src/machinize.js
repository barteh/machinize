/**
 * FSM (finit machine state) javascript library for using in barteh production
 * Borna Mehr Fann co.
 * Ahad Rafat talebi
 * 2017 * version 1.0.0
 */

import * as Rx from "rxjs";

export class Machinize {
  static fsmList = {};
  static init(fsm) {
    if (!fsm) return;

    if (fsm.name === undefined || fsm.name === "") {
      console.log("barteh fsm machinize error: fsm must have a name for init");
      return;
    }

    if (fsm.imports) {
      for (let i = 0; i < fsm.imports.length; i++) {
        fsm.onStart = fsm.onStart || fsm.imports[i].onStart;

        if (fsm.imports[i].data)
          fsm.data = Object.assign({}, fsm.imports[i].data, fsm.data);

        if (fsm.imports[i].states) {
          fsm.states = fsm.states || {};
          for (let st in fsm.imports[i].states) {
            let stobj = fsm.imports[i].states[st];
            fsm.states[st] = fsm.states[st] || {};
            for (let el in stobj) {
              fsm.states[st][el] = fsm.states[st][el] || stobj[el];
            }
          }
        }

        if (fsm.imports[i].transitions) {
          fsm.transitions = fsm.transitions || {};
          for (let tr in fsm.imports[i].transitions) {
            let stobj = fsm.imports[i].transitions[tr];
            fsm.transitions[tr] = fsm.transitions[tr] || {};
            for (let el in stobj) {
              fsm.transitions[tr][el] = fsm.transitions[tr][el] || stobj[el];
            }
          }
        }

        //  fsm.transitions=Object.assign(  {}, fsm.imports[i].transitions,fsm.transitions);
        if (fsm.imports[i].actions)
          fsm.actions = Object.assign({}, fsm.imports[i].actions, fsm.actions);

        if (fsm.imports[i].computed)
          fsm.computed = Object.assign(
            {},
            fsm.imports[i].computed,
            fsm.computed
          );

        if (fsm.imports[i].parameters)
          fsm.parameters = Object.assign(
            {},
            fsm.imports[i].parameters,
            fsm.parameters
          );
      }
    }

    //if(fsm.imports)
    //    Object.assign(fsm, fsm.imports)

    if (!fsm["$machine"]) fsm["$machine"] = new Machinize(fsm);

    //if(Machinize.fsmList[fsm.name])
    //return lst[0];

    fsm["instanceList"] = [];

    fsm["removeFromInstanceList"] = o => {
      let idx = fsm.instanceList.indexOf(o);

      if (idx != -1) fsm.instanceList.splice(idx, 1);
    };

    fsm["signalAll"] = (act, ...args) => {
      let list = fsm.instanceList;

      for (let i = 0; i < list.length; i++) {
        list[i][act](...args);
      }
    };

    fsm["destroyAll"] = func => {
      let list = func ? fsm.instanceList.filter(func) : fsm.instanceList;

      for (let i = 0; i < list.length; i++) {
        if (!list[i]) continue;
        if (list[i].destroy) list[i].destroy(true);
        list[i] = null;
      }
      fsm.instanceList = fsm.instanceList.filter(a => a !== null);
    };

    fsm["stopAll"] = func => {
      let list = func ? fsm.instanceList.filter(func) : fsm.instanceList;

      for (let i = 0; i < list.length; i++) {
        list[i].stop();
      }
    };

    fsm["startAll"] = func => {
      let list = func ? fsm.instanceList.filter(func) : fsm.instanceList;
      for (let i = 0; i < fsm.instanceList.length; i++) {
        fsm.instanceList[i].start();
      }
    };

    fsm["createInstance"] = indata => {
      try {
        let inst = fsm.$machine.machinize(indata);
        fsm.instanceList.push(inst);
        return inst;
      } catch (e) {
        console.log(`barteh fsm error: cannot create instance, ${e.message}`);
      }
    };
    Object.seal(fsm);
    Machinize.fsmList[fsm.name] = fsm;
    return fsm;
  }

  destroyAll() {}

  constructor(fsm, insData) {
    this.$prototype = fsm;

    if (fsm.states === undefined) {
      console.log(
        `barteh Machinize fsm error no states in machine: ${fsm.name}`
      );
      return null;
    }

    if (fsm.transitions === undefined) {
      console.log(
        `barteh Machinize fsm error no transition in machine: ${fsm.name}`
      );
      return null;
    }

    if (fsm.imports) this.imports = fsm.imports;

    this.onBeforeEnterAll = fsm.onBeforeEnterAll;
    this.onEnterAll = fsm.onEnterAll;

    this.onBeforeExitAll = fsm.onBeforeExitAll;
    this.onExitAll = fsm.onExitAll;

    fsm.data = fsm.data || {};

    this._data = {};
    if (fsm.data) {
      for (let s in fsm.data) {
        if (insData) {
          this._data[s] = insData[s] || fsm.data[s];
          this[s] = this._data[s];
        } else {
          this._data[s] = fsm.data[s];
          this[s] = this._data[s];
        }
      }
    }

    this.state = null;
    this.states = fsm.states;

    for (let s in this.states) {
      this.states[s].name = s;
      this[s] = this.states[s];

      if (this.states[s].start === true) this.state = this.states[s];

      this.states[s].whenEnter = new Promise((res, rej) => {});
      this.states[s].whenExit = new Promise((res, rej) => {});
    }

    this.computed = fsm.computed;
    this.parameters = fsm.parameters;

    this.transitions = {};

    this._tHash = {};

    this._tGroups = {};

    for (let t in fsm.transitions) {
      let trans = {};

      trans.from = fsm.transitions[t].from;
      trans.to = fsm.transitions[t].to;

      trans.name = t;
      trans.condition = fsm.transitions[t].condition;
      trans.entryCondition = fsm.transitions[t].entryCondition;
      trans.fromObject = this.states[trans.from];
      trans.toObject = this.states[trans.to];
      trans.group = fsm.transitions[t].group;
      
      let hash = `${trans.from}_${trans.to}`;
      this._tHash[hash] = trans;

      trans.$hash = hash;

      this.transitions[t] = trans;
      if (trans.group) {
        this._tGroups[trans.group] = this._tGroups[trans.group] || {};
        let g = this._tGroups[trans.group];

        g[trans.from] = trans; //(target)=>this[t](target);
      }
    }

    for (let g in this._tGroups) {
      this._tGroups[g].func = (target, feedback) => {
        let trans = this._tGroups[g][target.$state];

        if (trans) {
          this.transit(trans, target, feedback);
        }

        // feedback={result:true,code:0,message:`transition ${g} not defined `,state:target.$state,target:target};
        //return false;
        //return this[this._tGroups[g][target.$state].name](target)
      };
    }

    this.actions = fsm.actions;
    //this.actions={};

    //if(fsm.actions){

    //    for (let s in fsm.actions) {

    //        this["$"+s]=fsm.actions[s];

    //        this[s]=(target,...args)=> {
    //            if(target)
    //                if(!target.$isRunning)
    //                    return;
    //            try{
    //                return this["$"+s](target,...args);
    //            }
    //            catch(e){
    //                console.log(`barteh Machinize fsm error in calling action:${s}`,e.message);
    //            }

    //        }
    //        this.actions[s]=this[s];

    //    }
    //}

    this.onStart = fsm.onStart || function() {};

    this.state = this.state || this.states[Object.keys(this.states)[0]];

    let feedback = {
      result: true,
      code: 0,
      message: "",
      state: this.state.name
    };

    fsm["$machine"] = this;

    // Object.seal(this)
    // this.onStart();
    if (insData) return this.machinize(this, insData);

    Object.seal(this);
  }

  get State() {
    return this.state.name;
  }

  is(s) {
    return s === this.state.name;
  }

  getTransition(f, t) {
    return this._tHash[`${f}_${t}`];
  }

  transit(tr, target, feedback) {
    
    if(target.$lock)return false;
    target.$lock=true;
    // let target=this;

    if (target) if (!target.$isRunning) return false;

    let sn = target ? target.$state : this.state.name;

    let targetData = target || this._data;
    if (tr.to === sn) return false;

    //console.log(999999999999,sn,tr.to)
    //if(sn!==tr.from)

    if (!this.can(sn, tr.to)) {
      console.log(
        `barteh Machinize  fsm warrning: cant do transition from state ${sn} to ${
          tr.to
        }`
      );
      return;
    }

    feedback = feedback || {
      result: true,
      code: 0,
      message: "",
      state: this.states[sn],
      target: targetData,
      fromState: tr.from
    };
    if (tr.condition) {
      if (!tr.condition.call(targetData)) {
        return false;
      }
    }

    if (this.onBeforeExitAll)
      if (this.onBeforeExitAll.call(targetData) === false) {
        return false;
      }

    if (this.onBeforeEnterAll)
      if (this.onBeforeEnterAll.call(targetData) === false) {
        return false;
      }

    if (tr.fromObject.onBeforeExit)
      if (tr.fromObject.onBeforeExit.call(targetData) === false) {
        return false;
      }

    if (tr.toObject.onBeforeEnter)
      if (tr.toObject.onBeforeEnter.call(targetData) === false) {
        return false;
      }

    if (target) {
      
      target.$state = tr.toObject.name;

      target.$stateDescription = tr.toObject.description;

      sn = tr.toObject.name;


    } else {
      
      this.state = tr.toObject;
      sn = this.state;
    }
    
    feedback = {};

    feedback.target = target;
    feedback.state = sn;
    feedback.fromState = tr.from;
    feedback.result = true;
    feedback.message = this.states[sn].description;


    
    target.$_observable.next(feedback);
    target.$lock=false;



    if (tr.fromObject.onExit) tr.fromObject.onExit.call(targetData, feedback);
    if (this.onExitAll) this.onExitAll.call(targetData, feedback);

    if (tr.toObject.onEnter) tr.toObject.onEnter.call(targetData, feedback);

    if (this.onEnterAll) this.onEnterAll.call(targetData, feedback);

    //tr.toObject.whenEnter.resolve(feedback);
    //tr.fromObject.whenExit.resolve(feedback);

    
    this.refreshConditions(targetData);
    return true;
  }

  go(s, target) {
    let sn = target ? target.$state : this.state.name;

    if (s === sn) return false;
    let tr = this.getTransition(sn, s);

    if (tr) return this.transit(tr(target));
    else return false;
  }

  can(from, to) {
    return this._tHash[`${from}_${to}`] !== undefined;
  }

  is(s) {
    return this.state.name === s;
  }

  machinize(oo) {
    if (oo) {
      if (oo.$fsm) return oo;
    }

    let o = {};

    
    //Object.defineProperty( o,

    // let pro = new Proxy(o, {
    //   set: (tar, k, v) => {
    //     if (typeof tar[k] === "number") tar[k] = Number(v);
    //     else tar[k] = v;
        
    //     this.refreshConditions(o);

    //     return true;
    //   }
    // });

    oo = oo || {};

    o.$data = {};

    for (let k in oo) {
      o.$data[k] = oo[k];
     // o[k] = oo[k];
    }


    for (let k in this._data) {
      
      if (!o[k]) {

        //o[k] = this._data[k];
        o.$data[k] = this._data[k];

      Object.defineProperty(o,k,{
        get:function(){
          return o.$data[k];
        },
        set:v=>{
          
          o.$data[k]=v;
          this.refreshConditions(o);
        }
        ,enumerable:true
      });
      }
    }
o["$parameters"]={};
    for (let k in this.parameters) {
      
      if (!o[k]) {
        o.$parameters[k] = this.parameters[k];
        Object.defineProperty(o,k,{
          get:function(){
            return o.$parameters[k];
          },
          set:v=>{
            
            o.$parameters[k]=v;
            this.refreshConditions(o);
          }
          ,enumerable:true
        });

      }
    }

    let pro=o;
    //  o.__proto__=this.__proto__;

    if(oo.__proto__){
    let arrs = Object.getOwnPropertyNames(oo.__proto__);

    for (let i = 0; i < arrs.length; i++) {
      let ad = arrs[i];
      if (ad !== "constructor") o[ad] = oo.__proto__[ad];
    }
  }
    o["$fsm"] = this;

    o["$state"] = this.state.name;

    for (let a in this.actions) {
      o[a] = (...args) => {
        if (o.$isRunning) {
          try {
            return this.actions[a].call(o, ...args);
          } catch (e) {
            console.log(
              `barteh machinize fsm error: calling action  ${a} -> ${e.message}`
            );
          }
        } else return;
      };
      //o[a]=()=>{
      //    if(o.$isRunning)
      //        return this[a](pro,arguments);
      //    else return;
      //}
    }
    
    for (let tr in this.transitions) {
      o[tr] = (...args) => this.transit(this.transitions[tr], pro, ...args);
      //o[tr] = (...args) => this.transit(this.transitions[tr], o, ...args);
      //ahad
    }

    for (let g in this._tGroups) {
      o[g] = () => this._tGroups[g].func(o);
    }

    //
    if (this.computed) {
      o["$computed"] = {};

      for (let cmp in this.computed) {
        // o.$computed[cmp]=cmp;
        Object.defineProperty(o, cmp, {
          configurable: true,
          get: () => {
            if (!o.$isRunning) return;
            
            try {
              return o.$fsm.computed[cmp].call(o);
            } catch (e) {
              console.log(
                `barteh machinize fsm error: computed cant resolve  ${cmp} -> ${
                  e.message
                }`
              );
            }
          },
          enumerable: true
        });
      }
    }
    
    o["$_observable"] = new Rx.Subject();

    /// using $observable({from:'',to:''})
    ///using $observable('sSaved')
    o["$observable"] = (st, fromst) => {
      let from = undefined;
      let to = undefined;

      if (st === undefined) return o.$_observable.filter(a => a);
      else if (typeof st === "string") to = st;
      else if (typeof st === "object") {
        from = st.from;
        to = st.to;
        if (typeof from !== "string" && typeof to === "string") {
          console.log(
            `barteh fsm warrning: observable in machine name ${
              o.$fsm.name
            } cant call with from and to both undefined`
          );
          return undefined;
        }
      } else if (typeof st === "function")
        return o.$_observable.filter(a => a).filter(st);
      else return undefined;

      if (from)
        if (!this.states[from]) {
          console.log(
            `barteh fsm warrning: observable in machine name ${
              o.$fsm.name
            } cant find from state: ${from} `
          );
          return undefined;
        }

      if (to)
        if (!this.states[to]) {
          console.log(
            `barteh fsm warrning: observable in machine name ${
              o.$fsm.name
            } cant find to state: ${to} `
          );
          return undefined;
        }

      return o.$_observable
        .filter(a => a)
        .filter(
          b =>
            b.state === (to ? to : b.state) &&
            b.fromState === (from ? from : b.fromState)
        );
    };
    
    o["$stringfy"] = () => {
      let ret = "";

      let p = {};

      for (let e in o) {
        if (!e.match(/^\$(.*)/)) p[e] = o[e];
      }

      ret = JSON.stringify(p);

      return ret;
    };

    let feedback = {
      result: true,
      code: 0,
      message: "",
      target: pro,
      to: this.state
    };
    //o.$_observable.next(feedback);

    //Object.seal(o);
    
    //for(let imp in this.imports){
    if (this.imports) {
      o["$imports"] = {};
      for (let i = 0; i < this.imports.length; i++) {
        let imp = this.imports[i];

        o.$imports[imp.name] = {};
        if (imp.onStart) {
          o.$imports[imp.name]["onStart"] = () => {
            imp.onStart.call(pro);
          };
        }
      }
    }

    o["$isRunning"] = !this.$prototype.stopOnCreate;
    o["start"] = () => {
      

      o.$isRunning = true;

      if (this.states[o.$state].onEnter)
        this.states[o.$state].onEnter.call(pro);
      this.onStart.call(pro);
    };
    o["stop"] = () => (o.$isRunning = false);

    o["destroy"] = self => {
      //o.$fsm.$prototype.removeAll(a=>a===o);
      if (!self) o.$fsm.$prototype.removeFromInstanceList();
      for (let p in o) {
        delete o[p];
      }

      o["destroy"] = () => {};
    };
    
    //
    if (!this.$prototype.stopOnCreate) o.start();
    
    return pro;
  }

  refreshConditions(o) {
    

    if (!o.$isRunning) return;
    if(o.$lock)return;
    
    let noTransit = false;

    let whileCount = 0;

    while (!noTransit && whileCount < 100) {
      //for all chain transitions conditions

      whileCount++;

      if (whileCount > 99) {
        console.log(`machinize warnning: entrycondition loop over 100 times`);
        break;
      }

      let relatedTransitions = Object.keys(this.transitions).filter(
        j => this.transitions[j].from === o.$state
      );

      if (!relatedTransitions.length) break;

      for (let m = 0; m < relatedTransitions.length; m++) {
        let tr = this.transitions[relatedTransitions[m]];
       
        if (tr.entryCondition) {
          let fn=tr.entryCondition.bind(o);
          
          if (fn()) {
            
            this.transit(tr, o);
            //this[tr.name](o);
          } else {
            noTransit = true;
          }
        } else {
          noTransit = true;
        }
      }
    }
  }
}

