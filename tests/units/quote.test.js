import chai from 'chai';

import { schemaValidator } from '@temando/carrier-gateway';
import quoteResponseSchema from '@temando/carrier-gateway/build/lib/refs/quote-response+v4.schema.json';

import quoteRequest from './fixtures/quote-request.json';
import { getQuotes } from '../../src/quote';
import { instrumentClient } from './stubs/instrumentClientStub';

const expect = chai.expect;

describe('Quote', () => {
  describe('when getQuotes is called', () => {
    context('with a valid quote request', () => {
      it('returns a valid quote response', async () => {
        const request = JSON.parse(JSON.stringify(quoteRequest));
        const result = await getQuotes(request, instrumentClient);

        const validCheck = schemaValidator.validate(quoteResponseSchema, result);


      });

      it('returns correct response for multiple weight units', async () => {
        const request = JSON.parse(JSON.stringify(quoteRequest));
        request.shipment.packages = [
          {
            id: '1234567890',
            grossWeight: {
              amount: 3,
              unit: 'kg',
            },
            dimensions: {
              length: 100,
              width: 50,
              height: 30,
              unit: 'cm',
            },
          },
          {
            id: '1234567890',
            grossWeight: {
              amount: 2000,
              unit: 'gram',
            },
            dimensions: {
              length: 100,
              width: 50,
              height: 30,
              unit: 'cm',
            },
          },
          {
            id: '1234567890',
            grossWeight: {
              amount: 22.0462,
              unit: 'lb',
            },
            dimensions: {
              length: 100,
              width: 50,
              height: 30,
              unit: 'cm',
            },
          },
          {
            id: '1234567890',
            grossWeight: {
              amount: 176.37,
              unit: 'ounce',
            },
            dimensions: {
              length: 100,
              width: 50,
              height: 30,
              unit: 'cm',
            },
          },
        ];
        const result = await getQuotes(request, instrumentClient);

        const validCheck = schemaValidator.validate(quoteResponseSchema, result);



        expect(result.success[0].shippingTaxInclusiveCharge.amount).to.equal(8.08);
      });

      // it('returns correct response for grossWeight <= 2kg', async () => {
      //   const request = JSON.parse(JSON.stringify(quoteRequest));
      //   const result = await getQuotes(request, instrumentClient);
      //
      //   expect(result.success[0].shippingTaxInclusiveCharge.amount).to.equal(5.43);
      // });

      // it('returns correct response for grossWeight <= 2kg with signature option', async () => {
      //   const request = JSON.parse(JSON.stringify(quoteRequest));
      //   request.shipment.requiredCapabilities = {
      //     signatureOnDelivery: {
      //       required: true,
      //       onlyAdultCanSign: true,
      //     },
      //   };
      //   const result = await getQuotes(request, instrumentClient);
      //
      //   expect(result.success[0].shippingTaxInclusiveCharge.amount).to.equal(5.93);
      // });
      //
      // it('returns correct response for grossWeight > 2kg and < 30kg with COD option', async () => {
      //   const request = JSON.parse(JSON.stringify(quoteRequest));
      //   request.shipment.packages[0].grossWeight.amount = 20;
      //   request.shipment.requiredCapabilities = {
      //     cashOnDelivery: {
      //       shippingInclusive: true,
      //     },
      //   };
      //   const result = await getQuotes(request, instrumentClient);
      //
      //   expect(result.success[0].shippingTaxInclusive.amount).to.equal(13.47);
      // });

      it('returns error response for grossWeight > 30kg', async () => {
        const request = JSON.parse(JSON.stringify(quoteRequest));
        request.shipment.packages[0].grossWeight.amount = 30.01;

        const result = await getQuotes(request, instrumentClient);

        expect(result.failure[0]).to.be.an('object').which.is.deep.equal({
          statusCode: 400,
          message: 'weight cannot be over 30kg',
        });
      });

      it('returns error response for dimension > 150cm', async () => {
        const request = JSON.parse(JSON.stringify(quoteRequest));
        request.shipment.packages[0].dimensions.length = 151;

        const result = await getQuotes(request, instrumentClient);

        expect(result.failure[0]).to.be.an('object').which.is.deep.equal({
          statusCode: 400,
          message: 'max dimension is 150 cm',
        });
      });

      it('returns error response for (Length + 2xWidth + 2xHeight) > 300 cm', async () => {
        const request = JSON.parse(JSON.stringify(quoteRequest));
        request.shipment.packages[0].dimensions.length = 101;
        request.shipment.packages[0].dimensions.width = 50;
        request.shipment.packages[0].dimensions.height = 50;

        const result = await getQuotes(request, instrumentClient);

        expect(result.failure[0]).to.be.an('object').which.is.deep
        .equal({
          statusCode: 400,
          message: 'maximum of (Length + 2xWidth + 2xHeight) is 300 cm',
        });
      });

      it('returns error response for 2 smallest dimension > 145 mm x 112 mm', async () => {
        const request = JSON.parse(JSON.stringify(quoteRequest));
        request.shipment.packages[0].dimensions.length = 10;
        request.shipment.packages[0].dimensions.width = 10;

        const result = await getQuotes(request, instrumentClient);

        expect(result.failure[0]).to.be.an('object').which.is.deep.equal({
          statusCode: 400,
          message: 'The minimum size is 145 mm x 112 mm (2 smallest dimensions)',
        });
      });
    });
  });
});

