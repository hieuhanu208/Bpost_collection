import meta from './integration.json';

/**
 * Return a dummy quote.
 *
 * @return {object}  A dummy quote.
 */
async function getQuotes() {
  const response = {
    id: meta.methods.quote.POST.responseSchemas[0],
    integrationId: meta.integrationId,
    success: [
      {
        integrationServiceId: 'EXPRESS',
        serviceName: 'Express Shipping',
        carrierName: meta.brand.name,
        shippingTaxInclusiveCharge: {
          amount: 50,
          currency: 'USD',
        },
        pricedAt: new Date().toISOString(),
      },
    ],
    failure: [],
    createdAt: new Date().toISOString(),
  };

  return response;
}

export { getQuotes };
