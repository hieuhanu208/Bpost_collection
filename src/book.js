import meta from './integration.json';

/**
 * Return a dummy booking.
 *
 * @param {object} request  The request body
 *
 * @return {object}         A dummy booking.
 */
async function bookShipment(request) {
  const response = {
    id: meta.methods.booking.POST.responseSchemas[0],
    integrationId: meta.integrationId,
    booking: {
      integrationServiceId: 'EXPRESS',
      serviceName: 'Express Shipping',
      carrierName: meta.brand.name,
      bookingReference: '1234567890',
      shipment: JSON.parse(JSON.stringify(request.shipment)),
      shippingTaxInclusiveCharge: {
        amount: 50,
        currency: 'USD',
      },
      bookedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };

  return response;
}

export { bookShipment };
