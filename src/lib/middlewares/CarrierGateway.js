import { schemaValidator } from '@temando/carrier-gateway';
import { InternalError, ValidationError } from '@temando/service-library';

import meta from '../../integration.json';

const CarrierGateway = () => (mediator) => {
  const getFunctionName = (event) => {
    let functionName = null;

    if (typeof event.context !== 'undefined'
      && typeof event.context.functionName !== 'undefined'
    ) {
      functionName = event.context.functionName;
      const index = functionName.lastIndexOf('-');

      if (index !== -1) {
        functionName = functionName.substr(index + 1, functionName.length);
      }
    }

    return functionName;
  };

  const validateDocumentAgainstSchemas = (doc, schemas) => {
    if (!schemas) {
      return doc;
    }

    const validationErrors = schemas.reduce((data, schema) => {
      const result = schemaValidator.validate(schema, doc);

      if (result.valid) {
        return data;
      }

      return [...data, ...result.errors];
    }, []);

    if (validationErrors.length > 0) {
      throw new ValidationError({
        detail: validationErrors,
      });
    }

    return doc;
  };

  const processEvent = (event, type) => {
    const method = typeof event.request.method !== 'undefined' ? event.request.method : 'GET';
    const doc = type === 'request' ? event.request : event.response;

    if ((method === 'GET' && type === 'request') || typeof doc.body === 'undefined') {
      return;
    }

    const func = getFunctionName(event);
    let schemas = null;
    if (typeof meta.methods[func][method] === 'undefined') {
      const functionKeys = Object.keys(meta.methods[func]);
      const path = event.event.path;
      const index = path.lastIndexOf('/');
      const requestedFunction = path.substr(index + 1, path.length);

      if (functionKeys.includes(requestedFunction)) {
        schemas = meta.methods[func][requestedFunction][method];
      }
    } else {
      schemas = meta.methods[func][method];
    }

    if (typeof schemas[`${type}Schemas`] === 'undefined') {
      return;
    }

    try {
      validateDocumentAgainstSchemas(doc.body, schemas[`${type}Schemas`]);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      throw new InternalError({
        detail: error.message,
      });
    }
  };

  mediator.on('http.request', (event) => {
    processEvent(event, 'request');
  });

  mediator.on('http.response.prepare::before', (event) => {
    try {
      processEvent(event, 'response');
    } catch (error) {
      event.error = error; // eslint-disable-line no-param-reassign
    }
  });
};

export { CarrierGateway };
