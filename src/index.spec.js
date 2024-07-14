const { SERVICES, clients } = require('.');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

it('should return a list of clients', async () => {
  const keys = Object.keys(clients);
  expect(keys).toEqual(SERVICES);
});

describe('check user deletion', () => {
  let unexpectedResponse = {};

  afterAll(() => {
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
    ${'uapi'}       | ${'/matrix/homescreen'}               | ${undefined}
    ${'uapi'}       | ${'/matrix/containers/featured'}      | ${undefined}
    ${'user-queue'} | ${'/api/v1/linear_reminder'}          | ${undefined}
    ${'user-queue'} | ${'/api/v2/queues'}                   | ${undefined}
  `(
    'should handle user deletion when service=$service and pathname=$pathname',
    async ({ service, pathname, params }) => {
      expect.assertions(2);
      await sleep(500);

      try {
        await clients[service].get(pathname, { params });
      } catch (err) {
        const { response } = err;
        unexpectedResponse[`${service}:${pathname}`] = {
          status: response.status,
          data: response.data,
        };
        expect(response.status).toBe(401);
        expect(response.data).toEqual(expect.objectContaining({ code: 'USER_NOT_FOUND' }));
      }
    },
  );
});
