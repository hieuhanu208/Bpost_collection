import chai from 'chai';

import cancelRequest from './fixtures/cancel-request.json';
import { cancelShipment } from '../../src/cancel';

const expect = chai.expect;

describe('Cancel', () => {
  describe('when cancelShipment is called', () => {
    context('with a valid cancel request', () => {
      it('returns a valid cancel response', async () => {
        const request = JSON.parse(JSON.stringify(cancelRequest));
        const result = await cancelShipment(request);

        expect(result).to.be.an('object');
      });
    });
  });
});
