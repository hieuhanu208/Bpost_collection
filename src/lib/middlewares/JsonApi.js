import { JsonApiError } from '@temando/service-library/errors';

const JsonApi = () => (mediator) => {
  mediator.on('http.response.prepare::before', (event) => {
    const { error } = event;
    if (error) {
      event.error = new JsonApiError(error); // eslint-disable-line
    }
  });

  mediator.on('http.response', () => {});
};

export { JsonApi };
