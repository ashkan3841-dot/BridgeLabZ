const Joi = require('joi');

const openAccountSchema = Joi.object({
  accountType: Joi.string().valid('checking', 'savings').default('checking'),
});

const amountSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

const transferSchema = Joi.object({
  fromAccount: Joi.string().required(),
  toAccount: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

module.exports = { openAccountSchema, amountSchema, transferSchema };
