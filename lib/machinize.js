"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Machinize = void 0;

var Rx = _interopRequireWildcard(require("rxjs"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Machinize =
/*#__PURE__*/
function () {
  _createClass(Machinize, [{
    key: "destroyAll",
    value: function destroyAll() {}
  }], [{
    key: "init",
    value: function init(fsm) {
      if (!fsm) return;

      if (fsm.name === undefined || fsm.name === "") {
        console.log("barteh fsm machinize error: fsm must have a name for init");
        return;
      }

      if (fsm.imports) {
        for (var i = 0; i < fsm.imports.length; i++) {
          fsm.onStart = fsm.onStart || fsm.imports[i].onStart;
          if (fsm.imports[i].data) fsm.data = Object.assign({}, fsm.imports[i].data, fsm.data);

          if (fsm.imports[i].states) {
            fsm.states = fsm.states || {};

            for (var st in fsm.imports[i].states) {
              var stobj = fsm.imports[i].states[st];
              fsm.states[st] = fsm.states[st] || {};

              for (var el in stobj) {
                fsm.states[st][el] = fsm.states[st][el] || stobj[el];
              }
            }
          }

          if (fsm.imports[i].transitions) {
            fsm.transitions = fsm.transitions || {};

            for (var tr in fsm.imports[i].transitions) {
              var _stobj = fsm.imports[i].transitions[tr];
              fsm.transitions[tr] = fsm.transitions[tr] || {};

              for (var _el in _stobj) {
                fsm.transitions[tr][_el] = fsm.transitions[tr][_el] || _stobj[_el];
              }
            }
          } //  fsm.transitions=Object.assign(  {}, fsm.imports[i].transitions,fsm.transitions);


          if (fsm.imports[i].actions) fsm.actions = Object.assign({}, fsm.imports[i].actions, fsm.actions);
          if (fsm.imports[i].computed) fsm.computed = Object.assign({}, fsm.imports[i].computed, fsm.computed);
          if (fsm.imports[i].parameters) fsm.parameters = Object.assign({}, fsm.imports[i].parameters, fsm.parameters);
        }
      } //if(fsm.imports)
      //    Object.assign(fsm, fsm.imports)


      if (!fsm["$machine"]) fsm["$machine"] = new Machinize(fsm); //if(Machinize.fsmList[fsm.name])
      //return lst[0];

      fsm["instanceList"] = [];

      fsm["removeFromInstanceList"] = function (o) {
        var idx = fsm.instanceList.indexOf(o);
        if (idx != -1) fsm.instanceList.splice(idx, 1);
      };

      fsm["signalAll"] = function (act) {
        var list = fsm.instanceList;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var _i = 0; _i < list.length; _i++) {
          var _list$_i;

          (_list$_i = list[_i])[act].apply(_list$_i, args);
        }
      };

      fsm["destroyAll"] = function (func) {
        var list = func ? fsm.instanceList.filter(func) : fsm.instanceList;

        for (var _i2 = 0; _i2 < list.length; _i2++) {
          if (!list[_i2]) continue;
          if (list[_i2].destroy) list[_i2].destroy(true);
          list[_i2] = null;
        }

        fsm.instanceList = fsm.instanceList.filter(function (a) {
          return a !== null;
        });
      };

      fsm["stopAll"] = function (func) {
        var list = func ? fsm.instanceList.filter(func) : fsm.instanceList;

        for (var _i3 = 0; _i3 < list.length; _i3++) {
          list[_i3].stop();
        }
      };

      fsm["startAll"] = function (func) {
        var list = func ? fsm.instanceList.filter(func) : fsm.instanceList;

        for (var _i4 = 0; _i4 < list.length; _i4++) {
          fsm.instanceList[_i4].start();
        }
      };

      fsm["createInstance"] = function (indata) {
        try {
          var inst = fsm.$machine.machinize(indata);
          fsm.instanceList.push(inst);
          return inst;
        } catch (e) {
          console.log("barteh fsm error: cannot create instance, ".concat(e.message));
        }
      };

      Object.seal(fsm);
      Machinize.fsmList[fsm.name] = fsm;
      return fsm;
    }
  }]);

  function Machinize(fsm, insData) {
    var _this = this;

    _classCallCheck(this, Machinize);

    this.$prototype = fsm;

    if (fsm.states === undefined) {
      console.log("barteh Machinize fsm error no states in machine: ".concat(fsm.name));
      return null;
    }

    if (fsm.transitions === undefined) {
      console.log("barteh Machinize fsm error no transition in machine: ".concat(fsm.name));
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
      for (var s in fsm.data) {
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

    for (var _s in this.states) {
      this.states[_s].name = _s;
      this[_s] = this.states[_s];
      if (this.states[_s].start === true) this.state = this.states[_s];
      this.states[_s].whenEnter = new Promise(function ()
      /*res, rej*/
      {});
      this.states[_s].whenExit = new Promise(function ()
      /*res, rej*/
      {});
    }

    this.computed = fsm.computed;
    this.parameters = fsm.parameters;
    this.transitions = {};
    this._tHash = {};
    this._tGroups = {};

    for (var t in fsm.transitions) {
      var trans = {};
      trans.from = fsm.transitions[t].from;
      trans.to = fsm.transitions[t].to;
      trans.name = t;
      trans.condition = fsm.transitions[t].condition;
      trans.entryCondition = fsm.transitions[t].entryCondition;
      trans.fromObject = this.states[trans.from];
      trans.toObject = this.states[trans.to];
      trans.group = fsm.transitions[t].group;
      var hash = "".concat(trans.from, "_").concat(trans.to);
      this._tHash[hash] = trans;
      trans.$hash = hash;
      this.transitions[t] = trans;

      if (trans.group) {
        this._tGroups[trans.group] = this._tGroups[trans.group] || {};
        var g = this._tGroups[trans.group];
        g[trans.from] = trans; //(target)=>this[t](target);
      }
    }

    var _loop = function _loop(_g) {
      _this._tGroups[_g].func = function (target, feedback) {
        var trans = _this._tGroups[_g][target.$state];

        if (trans) {
          _this.transit(trans, target, feedback);
        } // feedback={result:true,code:0,message:`transition ${g} not defined `,state:target.$state,target:target};
        //return false;
        //return this[this._tGroups[g][target.$state].name](target)

      };
    };

    for (var _g in this._tGroups) {
      _loop(_g);
    }

    this.actions = fsm.actions; //this.actions={};
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

    this.onStart = fsm.onStart || function () {};

    this.state = this.state || this.states[Object.keys(this.states)[0]]; // let feedback = {
    //   result: true,
    //   code: 0,
    //   message: "",
    //   state: this.state.name
    // };

    fsm["$machine"] = this; // Object.seal(this)
    // this.onStart();

    if (insData) return this.machinize(this, insData);
    Object.seal(this);
  }

  _createClass(Machinize, [{
    key: "is",
    value: function is(s) {
      return s === this.state.name;
    }
  }, {
    key: "getTransition",
    value: function getTransition(f, t) {
      return this._tHash["".concat(f, "_").concat(t)];
    }
  }, {
    key: "transit",
    value: function transit(tr, target, feedback) {
      if (target.$lock) return false;
      target.$lock = true; // let target=this;

      if (target) if (!target.$isRunning) return false;
      var sn = target ? target.$state : this.state.name;
      var targetData = target || this._data;
      if (tr.to === sn) return false; //console.log(999999999999,sn,tr.to)
      //if(sn!==tr.from)

      if (!this.can(sn, tr.to)) {
        console.log("barteh Machinize  fsm warrning: cant do transition from state ".concat(sn, " to ").concat(tr.to));
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

      if (this.onBeforeExitAll) if (this.onBeforeExitAll.call(targetData) === false) {
        return false;
      }
      if (this.onBeforeEnterAll) if (this.onBeforeEnterAll.call(targetData) === false) {
        return false;
      }
      if (tr.fromObject.onBeforeExit) if (tr.fromObject.onBeforeExit.call(targetData) === false) {
        return false;
      }
      if (tr.toObject.onBeforeEnter) if (tr.toObject.onBeforeEnter.call(targetData) === false) {
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
      target.$lock = false;
      if (tr.fromObject.onExit) tr.fromObject.onExit.call(targetData, feedback);
      if (this.onExitAll) this.onExitAll.call(targetData, feedback);
      if (tr.toObject.onEnter) tr.toObject.onEnter.call(targetData, feedback);
      if (this.onEnterAll) this.onEnterAll.call(targetData, feedback); //tr.toObject.whenEnter.resolve(feedback);
      //tr.fromObject.whenExit.resolve(feedback);

      this.refreshConditions(targetData);
      return true;
    }
  }, {
    key: "go",
    value: function go(s, target) {
      var sn = target ? target.$state : this.state.name;
      if (s === sn) return false;
      var tr = this.getTransition(sn, s);
      if (tr) return this.transit(tr(target));else return false;
    }
  }, {
    key: "can",
    value: function can(from, to) {
      return this._tHash["".concat(from, "_").concat(to)] !== undefined;
    }
  }, {
    key: "isInState",
    value: function isInState(s) {
      return this.state.name === s;
    }
  }, {
    key: "machinize",
    value: function machinize(oo) {
      var _this2 = this;

      if (oo) {
        if (oo.$fsm) return oo;
      }

      var o = {}; //Object.defineProperty( o,
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

      for (var k in oo) {
        o.$data[k] = oo[k]; // o[k] = oo[k];
      }

      var _loop2 = function _loop2(_k) {
        if (!o[_k]) {
          //o[k] = this._data[k];
          o.$data[_k] = _this2._data[_k];
          Object.defineProperty(o, _k, {
            get: function get() {
              return o.$data[_k];
            },
            set: function set(v) {
              o.$data[_k] = v;

              _this2.refreshConditions(o);
            },
            enumerable: true
          });
        }
      };

      for (var _k in this._data) {
        _loop2(_k);
      }

      o["$parameters"] = {};

      var _loop3 = function _loop3(_k2) {
        if (!o[_k2]) {
          o.$parameters[_k2] = _this2.parameters[_k2];
          Object.defineProperty(o, _k2, {
            get: function get() {
              return o.$parameters[_k2];
            },
            set: function set(v) {
              o.$parameters[_k2] = v;

              _this2.refreshConditions(o);
            },
            enumerable: true
          });
        }
      };

      for (var _k2 in this.parameters) {
        _loop3(_k2);
      }

      var pro = o; //  o.__proto__=this.__proto__;

      if (oo.__proto__) {
        var arrs = Object.getOwnPropertyNames(oo.__proto__);

        for (var i = 0; i < arrs.length; i++) {
          var ad = arrs[i];
          if (ad !== "constructor") o[ad] = oo.__proto__[ad];
        }
      }

      o["$fsm"] = this;
      o["$state"] = this.state.name;

      var _loop4 = function _loop4(a) {
        o[a] = function () {
          if (o.$isRunning) {
            try {
              var _this2$actions$a;

              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              return (_this2$actions$a = _this2.actions[a]).call.apply(_this2$actions$a, [o].concat(args));
            } catch (e) {
              console.log("barteh machinize fsm error: calling action  ".concat(a, " -> ").concat(e.message));
            }
          } else return;
        }; //o[a]=()=>{
        //    if(o.$isRunning)
        //        return this[a](pro,arguments);
        //    else return;
        //}

      };

      for (var a in this.actions) {
        _loop4(a);
      }

      var _loop5 = function _loop5(tr) {
        o[tr] = function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return _this2.transit.apply(_this2, [_this2.transitions[tr], pro].concat(args));
        }; //o[tr] = (...args) => this.transit(this.transitions[tr], o, ...args);
        //ahad

      };

      for (var tr in this.transitions) {
        _loop5(tr);
      }

      var _loop6 = function _loop6(g) {
        o[g] = function () {
          return _this2._tGroups[g].func(o);
        };
      };

      for (var g in this._tGroups) {
        _loop6(g);
      } //


      if (this.computed) {
        o["$computed"] = {};

        var _loop7 = function _loop7(cmp) {
          // o.$computed[cmp]=cmp;
          Object.defineProperty(o, cmp, {
            configurable: true,
            get: function get() {
              if (!o.$isRunning) return null;

              try {
                return o.$fsm.computed[cmp].call(o);
              } catch (e) {
                console.log("barteh machinize fsm error: computed cant resolve  ".concat(cmp, " -> ").concat(e.message));
              }

              return null;
            },
            enumerable: true
          });
        };

        for (var cmp in this.computed) {
          _loop7(cmp);
        }
      }

      o["$_observable"] = new Rx.Subject(); /// using $observable({from:'',to:''})
      ///using $observable('sSaved')

      o["$observable"] = function (st
      /*, fromst*/
      ) {
        var from = undefined;
        var to = undefined;
        if (st === undefined) return o.$_observable.filter(function (a) {
          return a;
        });else if (typeof st === "string") to = st;else if (_typeof(st) === "object") {
          from = st.from;
          to = st.to;

          if (typeof from !== "string" && typeof to === "string") {
            console.log("barteh fsm warrning: observable in machine name ".concat(o.$fsm.name, " cant call with from and to both undefined"));
            return undefined;
          }
        } else if (typeof st === "function") return o.$_observable.filter(function (a) {
          return a;
        }).filter(st);else return undefined;
        if (from) if (!_this2.states[from]) {
          console.log("barteh fsm warrning: observable in machine name ".concat(o.$fsm.name, " cant find from state: ").concat(from, " "));
          return undefined;
        }
        if (to) if (!_this2.states[to]) {
          console.log("barteh fsm warrning: observable in machine name ".concat(o.$fsm.name, " cant find to state: ").concat(to, " "));
          return undefined;
        }
        return o.$_observable.filter(function (a) {
          return a;
        }).filter(function (b) {
          return b.state === (to ? to : b.state) && b.fromState === (from ? from : b.fromState);
        });
      };

      o["$stringfy"] = function () {
        var ret = "";
        var p = {};

        for (var e in o) {
          if (!e.match(/^\$(.*)/)) p[e] = o[e];
        }

        ret = JSON.stringify(p);
        return ret;
      }; // let feedback = {
      //   result: true,
      //   code: 0,
      //   message: "",
      //   target: pro,
      //   to: this.state
      // };
      //o.$_observable.next(feedback);
      //Object.seal(o);
      //for(let imp in this.imports){


      if (this.imports) {
        o["$imports"] = {};

        var _loop8 = function _loop8(_i5) {
          var imp = _this2.imports[_i5];
          o.$imports[imp.name] = {};

          if (imp.onStart) {
            o.$imports[imp.name]["onStart"] = function () {
              imp.onStart.call(pro);
            };
          }
        };

        for (var _i5 = 0; _i5 < this.imports.length; _i5++) {
          _loop8(_i5);
        }
      }

      o["$isRunning"] = !this.$prototype.stopOnCreate;

      o["start"] = function () {
        o.$isRunning = true;
        if (_this2.states[o.$state].onEnter) _this2.states[o.$state].onEnter.call(pro);

        _this2.onStart.call(pro);
      };

      o["stop"] = function () {
        return o.$isRunning = false;
      };

      o["destroy"] = function (self) {
        //o.$fsm.$prototype.removeAll(a=>a===o);
        if (!self) o.$fsm.$prototype.removeFromInstanceList();

        for (var p in o) {
          delete o[p];
        }

        o["destroy"] = function () {};
      }; //


      if (!this.$prototype.stopOnCreate) o.start();
      return pro;
    }
  }, {
    key: "refreshConditions",
    value: function refreshConditions(o) {
      var _this3 = this;

      if (!o.$isRunning) return;
      if (o.$lock) return;
      var noTransit = false;
      var whileCount = 0;

      while (!noTransit && whileCount < 100) {
        //for all chain transitions conditions
        whileCount++;

        if (whileCount > 99) {
          console.log("machinize warnning: entrycondition loop over 100 times");
          break;
        }

        var relatedTransitions = Object.keys(this.transitions).filter(function (j) {
          return _this3.transitions[j].from === o.$state;
        });
        if (!relatedTransitions.length) break;

        for (var m = 0; m < relatedTransitions.length; m++) {
          var tr = this.transitions[relatedTransitions[m]];

          if (tr.entryCondition) {
            var fn = tr.entryCondition.bind(o);

            if (fn()) {
              this.transit(tr, o); //this[tr.name](o);
            } else {
              noTransit = true;
            }
          } else {
            noTransit = true;
          }
        }
      }
    }
  }, {
    key: "State",
    get: function get() {
      return this.state.name;
    }
  }]);

  return Machinize;
}();

exports.Machinize = Machinize;

_defineProperty(Machinize, "fsmList", {});

var _default = Machinize;
exports.default = _default;