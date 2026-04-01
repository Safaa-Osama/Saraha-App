import { model } from "mongoose";

export const create = async ({ model, data } = {}) => {
    return await model.create(data);
}

export const findAll = async ({model, filter = {}, fields}) => {
    return await model.find(filter).select(fields);
}

export const findOneSelect = async ({ model, fields, filter = {} } = {}) => {
    return await model.findOne(filter).select(fields);
}
export const findOne = async ({ model, filter = {} } = {}) => {
    return await model.findOne(filter);
}
export const findById = async ({ model, id } = {}) => {
    return await model.findById(id);
}

export const findAndUpdate = async ({ model, filter = {}, update = {}, options = {} } = {}) => {
    const doc = await model.findOneAndUpdate(filter, update, { runValidators: true, new: true, ...options });
    return doc;
}
export const updateMany = async ({ model, filter = {}, update = {}, options = {} } = {}) => {
    const doc = await model.updateMany(filter, update, { runValidators: true, new: true, ...options });
    return doc;
}

export const deleteOne = async ({ model, filter = {} } = {}) => {
    return await model.deleteOne(filter);
}
export const deleteMany = async ({ model, filter = {} } = {}) => {
    return await model.deleteMany(filter);
}

