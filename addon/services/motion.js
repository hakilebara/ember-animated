import Ember from 'ember';
import { task } from 'ember-concurrency';
import { microwait } from '../concurrency-helpers';

export default Ember.Service.extend({
  init() {
    this._super();
    this._rendezvous = [];
  },
  // leaving(items) {
  //   console.log("saw leaving", items);
  //   this._leaving = this._leaving.concat(items);
  //   Ember.run.scheduleOnce('afterRender', this, this.sweep);
  // },
  // sweep() {
  //   console.log('swept');
  //   this._leaving = [];
  // },
  farMatch: task(function * (inserted, removed, replaced) {
    let mine = { inserted, removed, replaced };
    this._rendezvous.push(mine);
    yield microwait();
    if (this.get('farMatch.concurrency') > 1) {
      this._rendezvous.forEach(target => {
        if (target === mine) { return; }
        performMatches(mine, target);
        performMatches(target, mine);
      });
    }
    this._rendezvous.splice(this._rendezvous.indexOf(mine));
    return [inserted, removed, replaced];
  })
});

function performMatches(insertedSource, removedSource) {
  insertedSource.inserted.slice().forEach(entry => {
    let match = removedSource.removed.find(myEntry => entry.item === myEntry.item);
    if (match) {
      removedSource.removed.splice(removedSource.removed.indexOf(match), 1);
      insertedSource.inserted.splice(insertedSource.inserted.indexOf(entry), 1);
      insertedSource.replaced.push([match, entry]);
    }
  });

}
