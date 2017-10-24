import chai from 'chai';

import completionRequest from './fixtures/completion-request.json';
import { completeShipments } from '../../src/completion';

const expect = chai.expect;

describe('Completion', () => {
  describe('when completeShipments is called', () => {
    context('with a valid completion request', () => {
      it('returns a valid completion response', async () => {
        const request = JSON.parse(JSON.stringify(completionRequest));
        const result = await completeShipments(request);

        expect(result).to.be.an('object');
      });
    });
  });
});
