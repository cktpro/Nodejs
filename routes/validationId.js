const yup = require('yup')
module.exports =yup.object({
    params: yup.object({
      id: yup.number(),
    }),
  });