const createUserSchema = {
  nombre: {
    required: true,
    type: 'string',
    minLength: 3
  },

  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  password: {
    required: true,
    type: 'string',
    minLength: 1
  }
};

module.exports = { createUserSchema };