const { SERVICES, clients } = require('.');

it('should return a list of clients', async () => {
  const keys = Object.keys(clients);
  expect(keys).toEqual(SERVICES);
});

describe('check user deletion', () => {
  let passedResponse = {};
  let unexpectedResponse = {};

  afterAll(() => {
    if (Object.keys(passedResponse).length) {
      console.log('Passed responses:', passedResponse);
    }

    if (Object.keys(unexpectedResponse).length) {
      console.log('Unexpected responses:', unexpectedResponse);
    }
  });

  it.each`
    service         | pathname                              | params
    ${'account'}    | ${'/user/settings'}                   | ${undefined}
    ${'account'}    | ${'/user/check_birthday_info'}        | ${undefined}
    ${'crm'}        | ${'//api/v1/collection/leaving_soon'} | ${undefined}
    ${'epg'}        | ${'/content/epg/programming'}         | ${undefined}
    ${'lishi'}      | ${'/api/v2/view_history'}             | ${undefined}
    ${'search'}     | ${'/api/v1/search'}                   | ${{ search: 'star trek' }}
    ${'tensor'}     | ${'/api/v2/containers/featured'}      | ${undefined}
    ${'tensor'}     | ${'/api/v3/containers/featured'}      | ${undefined}
    ${'tensor'}     | ${'/api/v4/containers/featured'}      | ${undefined}
    ${'tensor'}     | ${'/api/v2/homescreen'}               | ${undefined}
    ${'tensor'}     | ${'/api/v3/homescreen'}               | ${undefined}
    ${'tensor'}     | ${'/api/v4/homescreen'}               | ${undefined}
    ${'tensor'}     | ${'/api/v4/homescreen'}               | ${undefined}
    ${'tensor'}     | ${'/api/v1/epg'}                      | ${undefined}
    ${'tensor'}     | ${'/api/v1/live_programming'}         | ${undefined}
    ${'tensor'}     | ${'/api/v1/pmr'}                      | ${undefined}
    ${'tensor'}     | ${'/api/v1/scenes'}                   | ${undefined}
    ${'user-queue'} | ${'/api/v1/linear_reminder'}          | ${undefined}
    ${'user-queue'} | ${'/api/v2/queues'}                   | ${undefined}
  `(
    'should handle user deletion when service=$service and pathname=$pathname',
    async ({ service, pathname, params }) => {
      expect.assertions(2);

      let response;
      let hasPassed = false;

      try {
        response = await clients[service].get(pathname, { params });
      } catch (err) {
        response = err.response;
        expect(response.status).toBe(401);
        expect(response.data).toEqual(expect.objectContaining({ code: 'USER_NOT_FOUND' }));
        hasPassed = true;
      } finally {
        (hasPassed ? passedResponse : unexpectedResponse)[`${service}:${pathname}`] = {
          status: response.status,
          data: response.data,
        };
      }
    },
  );
});
