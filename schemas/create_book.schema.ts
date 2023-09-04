import joi from "joi";

export default joi.object({
  title: joi.string().required(),
  chapters: joi.number().required(),
  pages: joi.number().required(),
  authors: joi.array().items(joi.number()).required(),
});
