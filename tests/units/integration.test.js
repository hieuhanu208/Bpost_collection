import chai from 'chai';

import { getMeta } from '../../src/meta';

const expect = chai.expect;

describe('Integration', () => {
  describe('when getMeta is called', () => {
    context('with a valid integration request', () => {
      it('returns a valid integration response', async () => {
        const result = await getMeta();

        expect(result).to.be.an('object');
      });
    });
  });
});
