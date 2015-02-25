import { setDefaults } from "./animate";
import { Rule, Constraint, Action } from "./rules";

export default class DSL {

  constructor(map) {
    this.map = map;
  }

  setDefault(props) {
    setDefaults(props);
  }

  transition() {
    var rule = new Rule();
    var parts = Array.prototype.slice.apply(arguments).reduce(function(a,b){
      return a.concat(b);
    }, []);

    for (var i = 0; i < parts.length; i++) {
      rule.add(parts[i]);
    }

    rule.validate();
    this.map.addRule(rule);
  }

  fromRoute(...routeNames) {
    return [
      new Constraint('oldValue', routeNames),
      new Constraint('helperName', 'outlet')
    ];
  }

  toRoute(...routeNames) {
    return [
      new Constraint('newValue', routeNames),
      new Constraint('helperName', 'outlet')
    ];
  }

  fromModel(matcher) {
    return [
      new Constraint('oldValue', matcher)
    ];
  }

  toModel(matcher) {
    return [
      new Constraint('newValue', matcher)
    ];
  }

  betweenModels(matcher) {
    return this.fromModel(matcher).concat(this.toModel(matcher));
  }

  hasClass(name) {
    return new Constraint('elementClass', name);
  }

  matchSelector(selector) {
    return new Constraint('element', function(elt) {
      return elt.is(selector);
    });
  }

  childOf(selector) {
    console.warn("childOf is deprecated in favor of matchSelector");
    return this.matchSelector(selector + ' > *');
  }

  use(nameOrHandler) {
    return new Action(nameOrHandler);
  }

  reverse(nameOrHandler) {
    return new Action(nameOrHandler, { reversed: true });
  }

  debug() {
    return 'debug';
  }
}
