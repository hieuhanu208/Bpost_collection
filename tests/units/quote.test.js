import chai from 'chai';

import quoteRequest from './fixtures/quote-request.json';
import { getQuotes } from '../../src/quote';

const expect = chai.expect;

describe('Quote', () => {
  describe('when getQuotes is called', () => {
    context('with a valid quote request', () => {
      it('returns a valid quote response', async () => {
        const request = JSON.parse(JSON.stringify(quoteRequest));
        const result = await getQuotes(request);

        expect(result).to.be.an('object');
      });
    });
  });
});
