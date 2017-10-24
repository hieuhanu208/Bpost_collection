import { addValidationSchema } from '@temando/carrier-gateway';
import { LambdaHttp } from '@temando/service-library/handlers';
import { Http } from '@temando/service-library/middlewares/Http';
import { Instrumentation } from '@temando/service-library/middlewares/Instrumentation';
import { CarrierGateway, JsonApi } from '../src/lib/middlewares';

import tsDefinition from '../ts-definition.json';
import tsEnv from '../ts-env.json';

import configSchema from '../resources/schemas/configuration.json';

import * as app from '../src/index';

addValidationSchema(configSchema);

const functionMap = {
  meta: 'getMeta',
  registration: 'getMarco',
  quote: 'getQuotes',
  booking: {
    POST: 'bookShipment',
    DELETE: 'cancelShipment',
  },
  completion: 'completeShipments',
  documentation: 'getDocuments',
  cancellation: 'cancelShipment',
  tracking: 'getEvents',
};

const handler = LambdaHttp(async ({ context, request, instrumentation }) => {
  if (typeof context.functionName === 'undefined') {
    throw new Error('function name not found');
  }

  let functionName = context.functionName;
  const index = functionName.lastIndexOf('-');

  if (index !== -1) {
    functionName = functionName.substr(index + 1, functionName.length);
  }

  if (typeof functionMap[functionName] === 'undefined') {
    throw new Error(`${functionName} function not found`);
  }

  let functionCall = functionMap[functionName];
  if (typeof functionCall !== 'string') {
    functionCall = functionMap[functionName][request.method];
  }

  const response = await app[functionCall].call(null, request.body, instrumentation);

  return { body: response, statusCode: 200 };
})
  .use(Http())
  .use(JsonApi())
  .use(CarrierGateway())
  .use(Instrumentation({ tsDefinition, tsEnv }));

export { handler };
