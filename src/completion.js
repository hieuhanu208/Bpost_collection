import meta from './integration.json';

/**
 * Return a dummy completion.
 *
 * @return {object}                 A dummy completion.
 */
async function completeShipments() {
  // construct dummy response
  const response = {
    id: meta.methods.completion.POST.responseSchemas[0],
    integrationId: meta.integrationId,
    references: [
      {
        bookingReference: '1234567890',
      },
    ],
    success: [
      {
        bookingReference: '1234567890',
      },
    ],
    failure: [],
    createdAt: new Date().toISOString(),
  };

  return response;
}

export { completeShipments };
