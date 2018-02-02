import { getContext } from '@ember/test-helpers';
import { resolve } from 'rsvp';
import { run } from '@ember/runloop';

export function animationsSettled() {
  let idle;
  let { owner } = getContext();
  run(() => {
    idle = owner.lookup('service:-ea-motion').get('waitUntilIdle').perform();
  });
  return resolve(idle);
}