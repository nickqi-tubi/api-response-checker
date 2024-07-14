const { clients } = require('.');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

it('should return a list of clients', async () => {
  const keys = Object.keys(clients);
  expect(keys).toEqual(['account', 'tensor', 'search']);
});

describe('check user deletion', () => {
  let unexpectedResponse = {};

  afterAll(() => {
    if (Object.keys(unexpectedResponse).length) {
      console.log('Unexpected responses:', unexpectedResponse);
    }
  });

  it.each`
    service      | pathname                         | params
    ${'account'} | ${'/user/settings'}              | ${undefined}
    ${'search'}  | ${'/api/v1/search'}              | ${(search = 'star trek')}
    ${'tensor'}  | ${'/api/v2/homescreen'}          | ${undefined}
    ${'tensor'}  | ${'/api/v3/homescreen'}          | ${undefined}
    ${'tensor'}  | ${'/api/v4/homescreen'}          | ${undefined}
    ${'tensor'}  | ${'/api/v2/containers/featured'} | ${undefined}
    ${'tensor'}  | ${'/api/v3/containers/featured'} | ${undefined}
    ${'tensor'}  | ${'/api/v4/containers/featured'} | ${undefined}
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
        expect(response.data).toEqual({ code: 'USER_NOT_FOUND', message: 'User not found' });
      }
    },
  );
});
