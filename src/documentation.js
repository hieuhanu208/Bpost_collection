import meta from './integration.json';

/**
 * Return dummy documentation.
 *
 * @return {object}                 Dummy documentation.
 */
async function getDocuments() {
  // construct dummy response
  const response = {
    id: meta.methods.documentation.POST.responseSchemas[0],
    integrationId: meta.integrationId,
    createdAt: new Date().toISOString(),
    documentation: [
      {
        size: 'A4',
        type: 'packageLabels',
        mimeType: 'application/pdf',
        encoding: 'base64',
        data: 'dGVzdC5wZGYK',
      },
    ],
  };

  return response;
}

export { getDocuments };
