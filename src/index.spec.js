const { clients } = require('.');

it('should return a list of clients', async () => {
  const keys = Object.keys(clients);
  expect(keys).toEqual(['account', 'tensor', 'search']);
});

it.each`
  service      | pathname                | params
  ${'account'} | ${'/user/settings'}     | ${undefined}
  ${'tensor'}  | ${'/api/v3/homescreen'} | ${undefined}
  ${'tensor'}  | ${'/api/v4/homescreen'} | ${undefined}
`('should handle user deletion when service=$service and pathname=$pathname', async ({ service, pathname, params }) => {
  expect.assertions(2);
  try {
    await clients[service].get(pathname, { params });
  } catch (err) {
    const { response } = err;
    expect(response.status).toBe(401);
    expect(response.data).toEqual({ code: 'USER_NOT_FOUND', message: 'User not found' });
  }
});
