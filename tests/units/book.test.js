import chai from 'chai';

import bookRequest from './fixtures/book-request.json';
import { bookShipment } from '../../src/book';

const expect = chai.expect;

describe('Book', () => {
  describe('when bookShipment is called', () => {
    context('with a valid book request', () => {
      it('returns a valid book response', async () => {
        const request = JSON.parse(JSON.stringify(bookRequest));
        const result = await bookShipment(request);

        expect(result).to.be.an('object');
      });
    });
  });
});
