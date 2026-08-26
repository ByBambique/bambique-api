export const updateColumnGSchema = {
  body: {
    type: 'object',
    required: ['uuid', 'count'],
    properties: {
      uuid: { type: 'string', minLength: 1 },
      count: { type: ['number', 'string'] },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  },
};

export const fillFormSchema = {
  body: {
    type: 'object',
    required: ['name', 'phone'],
    properties: {
      name: { type: 'string', minLength: 1 },
      phone: { type: ['string', 'number'] },
      optionalInvite: { type: ['string', 'number', 'null'] },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  },
};

export const getRowSchema = {
  params: {
    type: 'object',
    required: ['uuid'],
    properties: {
      uuid: { type: 'string', minLength: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            guestName: { type: ['string', 'null'] },
            amount: { type: ['string', 'number', 'null'] },
            prob: { type: ['string', 'number', 'null'] },
            guid: { type: ['string', 'null'] },
            rel: { type: ['string', 'null'] },
            link: { type: ['string', 'null'] },
            confirmedNumber: { type: ['string', 'number', 'null'] },
            gener: { type: ['string', 'null'] },
          },
        },
      },
    },
  },
};
