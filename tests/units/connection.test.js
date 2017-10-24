import chai from 'chai';

import { getMarco } from '../../src/connection';

const expect = chai.expect;

describe('Connection', () => {
  describe('when getMarco is called', () => {
    context('with a valid marco request', () => {
      it('returns a valid marco response', async () => {
        const result = await getMarco();

        expect(result).to.be.an('object');
      });
    });
  });
});
