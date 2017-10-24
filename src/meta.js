import fs from 'fs';

import { addValidationSchema, schemaValidator } from '@temando/carrier-gateway';
import { v1 as marco } from '@temando/marco';

import configSchema from '../resources/schemas/configuration.json';
import meta from './integration.json';

/**
 * Return a full schema from Marco or CG given a schema id
 *
 * @param {string} schemaId  The schema id
 *
 * @return {object}          The schema
 */
function dereferenceSchema(schemaId) {
  let schemaObj = marco.getSchema(schemaId);

  if (!schemaObj) {
    schemaObj = schemaValidator.ajv.getSchema(schemaId);
  }

  if (!schemaObj) {
    throw new Error(`could not find schema with id: ${schemaId}`);
  }

  return JSON.parse(JSON.stringify(schemaObj.schema));
}

/**
 * Return an array of schemas given an array of schema ids
 *
 * @param {array} schemas  An array of schema ids
 *
 * @return {array}         An array of schemas
 */
function dereferenceSchemas(schemas) {
  if (schemas.length === 0) {
    return [];
  }

  const dereferenced = [];

  schemas.forEach((schemaId) => {
    dereferenced.push(dereferenceSchema(schemaId));
  });

  return dereferenced;
}

/**
 * Return a methods schemas, dereferenced
 *
 * @param {object} methodSchemas  A methods schema ids for a single verb
 *
 * @return {object}               The same method with the schema ids dereferenced
 */
function dereferenceMethodSchemas(methodSchemas) {
  const schemaTypes = JSON.parse(JSON.stringify(methodSchemas));

  if (typeof schemaTypes.requestSchemas !== 'undefined' && schemaTypes.requestSchemas !== null) {
    schemaTypes.requestSchemas = dereferenceSchemas(schemaTypes.requestSchemas);
  }

  if (typeof schemaTypes.responseSchemas !== 'undefined' && schemaTypes.responseSchemas !== null) {
    schemaTypes.responseSchemas = dereferenceSchemas(schemaTypes.responseSchemas);
  }

  return schemaTypes;
}

/**
 * Return an array of methods with their schemas dereferenced
 *
 * @param {array} methods  An array of methods, usually from integration.json
 *
 * @return {array}         The same method array with the schemas dereferenced
 */
function dereferenceMethods(methods) {
  const dereferenced = {};

  Object.keys(methods).forEach((key) => {
    if (methods[key] === null) {
      dereferenced[key] = null;
      return;
    }

    if (typeof methods[key].path === 'undefined') {
      dereferenced[key] = dereferenceMethods(methods[key]);
      return;
    }

    const method = JSON.parse(JSON.stringify(methods[key]));

    ['GET', 'POST', 'DELETE'].forEach((verb) => {
      if (typeof method[verb] !== 'undefined') {
        method[verb] = dereferenceMethodSchemas(method[verb]);
      }
    });

    dereferenced[key] = method;
  });

  return dereferenced;
}

/**
 * Return the integrations meta data.
 *
 * @param {object} request           The request body
 * @param {object} instrumentClient  An instance of the instrumentClient
 *
 * @return {object}                  The integration meta data.
 */
async function getMeta() {
  // create base response from meta
  const response = JSON.parse(JSON.stringify(meta));

  // set schema id
  response.id = meta.methods.meta.GET.responseSchemas[0];

  // set brand logo
  response.brand.logo.data = fs.readFileSync('resources/brand/logo.svg', {
    encoding: 'base64',
  });

  // load configuration schema
  addValidationSchema(configSchema);

  // dereference method schemas
  response.methods = dereferenceMethods(response.methods);

  return response;
}

export { getMeta };
