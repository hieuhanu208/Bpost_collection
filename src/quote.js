import Dbpromise from '@temando/dbpromise';
import packageMate from '@temando/package-mate';
import meta from './integration.json';

/**
 * getSurcharge - get charges infomation from database
 *
 * @param  {String} option column name to look up
 * @return {Float}        charge amount
 */
async function getSurcharge(option) {
  const db = new Dbpromise('./database.db');
  const rows = await db.query('select charge from surcharges where option = $option limit 1', {
    option,
  });

  return parseFloat(rows[0].charge);
}

/**
 * surcharges - calculate additional charges for options
 *
 * @param  {Object} shipment shipment details
 * @return {Float}          sum of additional charges
 */
async function surcharges(shipment) {
  let totalSurcharges = 0;

  if (shipment.requiredCapabilities) {
    totalSurcharges += shipment.requiredCapabilities.signatureOnDelivery ? await getSurcharge('signature') : 0;

    totalSurcharges += shipment.requiredCapabilities.cashOnDelivery ? await getSurcharge('cash on delivery') : 0;
  }

  return totalSurcharges;
}

/**
 * createResponse - generate response based on parameters
 *
 * @param  {integer} shippingTax   calculated price in USD
 * @param  {array} errors = null array of errors
 * @return {Object}               generated response
 */
function createResponse(shippingTax, errors = null) {
  if (errors) {
    return {
      id: meta.methods.quote.POST.responseSchemas[0],
      integrationId: meta.integrationId,
      success: [],
      failure: errors,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: meta.methods.quote.POST.responseSchemas[0],
    integrationId: meta.integrationId,
    success: [
      {
        integrationServiceId: 'EXPRESS',
        serviceName: 'Express Shipping',
        carrierName: meta.brand.name,
        shippingTaxInclusiveCharge: {
          amount: parseFloat(shippingTax),
          currency: 'USD',
        },
        pricedAt: new Date().toISOString(),
      },
    ],
    failure: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * getQuotes - return quotes that match details provided by the client
 *
 * @param  {JSON} request incoming request
 * @param  {instrument} instrument instrumentClient for loggin
 * @return {Object}         response
 */
async function getQuotes(request, instrument) {
  instrument.info('Quote.Request', request);
  instrument.timer('GetQuoteFunction');

  let response = null;
  const errors = [];

  try {
  // Convert weights and dimensions to the same metric
    const pkgs = request.shipment.packages.map(packageMate);
    let sumWeight = 0;

    pkgs.forEach((pkg) => {
      pkg.normaliseWeight('kg');
      pkg.normaliseDimensions('cm');

      sumWeight += pkg.grossWeight.amount;
    });

    if (sumWeight > 30) {
      errors.push({
        statusCode: 400,
        message: 'weight cannot be over 30kg',
      });
    }

    // Validate request against shipping requirement
    request.shipment.packages.forEach((reqPackage) => {
      if (reqPackage.dimensions.length > 150
      || reqPackage.dimensions.width > 150
      || reqPackage.dimensions.height > 150) {
        errors.push({
          statusCode: 400,
          message: 'max dimension is 150 cm',
        });
      }

      if ((reqPackage.dimensions.length)
      + (2 * reqPackage.dimensions.width)
      + (2 * reqPackage.dimensions.height) > 300) {
        errors.push({
          statusCode: 400,
          message: 'maximum of (Length + 2xWidth + 2xHeight) is 300 cm',
        });
      }

      const dimensions = [reqPackage.dimensions.length,
        reqPackage.dimensions.width,
        reqPackage.dimensions.height].sort((a, b) => a - b);

      if (dimensions[0] < 11.2 || dimensions[1] < 14.5) {
        errors.push({
          statusCode: 400,
          message: 'The minimum size is 145 mm x 112 mm (2 smallest dimensions)',
        });
      }
    });

    // Stop if there's error
    if (errors.length) {
      response = createResponse(null, errors);
      return response;
    }

    // Find matched weight in the database
    const db = new Dbpromise('./resources/rate/bpostv1');
    const rows = await db.query('select tarif from rate where weight >= $weight order by tarif asc limit 1', {
      weight: sumWeight,
    });

    if (rows.length === 0) {
      errors.push({
        statusCode: 500,
        message: 'can\'t find matching rate for the package(s)',
      });
      response = createResponse(null, errors);
    }

    // Response
    let money = parseFloat(rows[0].tarif);
    money += await surcharges(request.shipment);

    response = createResponse(+parseFloat(money).toFixed(2));

    return response;
  } catch (e) {
    errors.push({
      statusCode: 500,
      message: e.message,
    });

    response = createResponse(null, errors);

    return response;
  } finally {
    errors.forEach((err) => {
      instrument.error(err.message);
    });
    instrument.info('Quote.Response', response);
    instrument.timer('GetQuoteFunction');
  }
}

export { getQuotes };
