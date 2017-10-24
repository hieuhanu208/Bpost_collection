import chai from 'chai';

import documentationRequest from './fixtures/documentation-request.json';
import { getDocuments } from '../../src/documentation';

const expect = chai.expect;

describe('Documentation', () => {
  describe('when getDocuments is called', () => {
    context('with a valid documentation request', () => {
      it('returns a valid documentation response', async () => {
        const request = JSON.parse(JSON.stringify(documentationRequest));
        const result = await getDocuments(request);

        expect(result).to.be.an('object');
      });
    });
  });
});
