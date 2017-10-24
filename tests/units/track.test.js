import chai from 'chai';

import trackingRequest from './fixtures/tracking-request.json';
import { getEvents } from '../../src/track';

const expect = chai.expect;

describe('Tracking', () => {
  describe('when getEvents is called', () => {
    context('with a valid tracking request', () => {
      it('returns a valid tracking response', async () => {
        const request = JSON.parse(JSON.stringify(trackingRequest));
        const result = await getEvents(request);

        expect(result).to.be.an('object');
      });
    });
  });
});
