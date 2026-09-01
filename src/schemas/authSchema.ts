const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

export const loginSchema = {
  description: 'Authenticate with email/username and password',
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['password'],
    properties: {
      email: { type: 'string' },
      identifier: { type: 'string' }, // allows "bambique" or email
      password: { type: 'string', minLength: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            lastName: { type: 'string', nullable: true },
            email: { type: 'string' },
            role: { type: 'string' },
            gender: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
          },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const registerSchema = {
  description: 'Register a new user',
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', minLength: 2 },
      lastName: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      gender: { type: 'string', enum: ['male', 'female', 'other'] },
      nitCi: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            lastName: { type: 'string', nullable: true },
            email: { type: 'string' },
            role: { type: 'string' },
            gender: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
          },
        },
      },
    },
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const googleAuthSchema = {
  description: 'Authenticate or register using Google ID Token',
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['idToken'],
    properties: {
      idToken: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            lastName: { type: 'string', nullable: true },
            email: { type: 'string' },
            role: { type: 'string' },
            gender: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
          },
        },
      },
    },
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const meSchema = {
  description: 'Get current authenticated user',
  tags: ['Auth'],
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            lastName: { type: 'string', nullable: true },
            email: { type: 'string' },
            role: { type: 'string' },
            gender: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
            nitCi: { type: 'string', nullable: true },
          },
        },
      },
    },
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};
