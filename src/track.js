import meta from './integration.json';

/**
 * Return dummy events.
 *
 * @param {object} request          The request body
 *
* @return {object}                  Dummy events.
 */
async function getEvents(request) {
  // construct dummy event
  const event = {
    trackingReference: request.trackingReferences[0],
    status: 'awaiting pickup',
    rawStatus: 'awaiting pickup',
    occurredAt: new Date().toISOString(),
  };

  // construct dummy response
  const response = {
    id: meta.methods.tracking.POST.responseSchemas[0],
    integrationId: meta.integrationId,
    success: [
      {
        pickedUp: false,
        delivered: false,
        shipmentEvents: [
          JSON.parse(JSON.stringify(event)),
        ],
        packageEvents: [
          JSON.parse(JSON.stringify(event)),
        ],
      },
    ],
    failure: [],
    createdAt: new Date().toISOString(),
  };

  return response;
}

export { getEvents };
