import joi from 'joi';

export default joi.object({
    name: joi.string().required(),
})