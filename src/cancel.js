import meta from './integration.json';

/**
 * Return a dummy cancelation.
 *
 * @return {object}                 A dummy cancellation.
 */
async function cancelShipment() {
  // construct dummy response
  const response = {
    id: meta.methods.booking.DELETE.responseSchemas[0],
    integrationId: meta.integrationId,
    transactionId: '1234567890',
    cancelledAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  return response;
}

export { cancelShipment };
