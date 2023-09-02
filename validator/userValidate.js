const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({

    name: Joi.string()
      .min(3)
      .max(30)
      .trim()
      .lowercase()
      .required(),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'in', 'info'] } })
      .trim()
      .lowercase()
      .required(),

    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
  });

  return schema.validateAsync(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'in', 'info'] } })
      .trim()
      .lowercase()
      .required(),

    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
  });

  return schema.validateAsync(data);
};

module.exports = { registerValidation, loginValidation };