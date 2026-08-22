const { success, created, error } = require('../src/utils/apiResponse');

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('apiResponse helpers', () => {
  it('success() returns the standard success envelope', () => {
    const res = mockRes();
    success(res, { id: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, data: { id: 1 } });
  });

  it('success() includes meta for list responses', () => {
    const res = mockRes();
    success(res, [{ id: 1 }], { total: 1 });

    expect(res.body).toEqual({
      success: true,
      data: [{ id: 1 }],
      meta: { total: 1 },
    });
  });

  it('created() responds with 201', () => {
    const res = mockRes();
    created(res, { id: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('error() returns the standard error envelope', () => {
    const res = mockRes();
    error(res, { statusCode: 400, code: 'BAD_REQUEST', message: 'Invalid input', details: { field: 'name' } });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
        details: { field: 'name' },
      },
    });
  });
});
