import userModel from "../mongo/models/user.model.js";

export default class UsersDao {
    get = () => {
        return userModel.find().lean();
    }

    getBy = (params) => {
        return userModel.findOne(params).lean();
    }

    create = async (user) => {
        const result = await userModel.create(user);
        return result.toObject();
    }
    update = (id, user) => {
        return userModel.updateOne({ _id: id }, user);
    }

    delete = (id) => {
        return userModel.updateOne({ _id: id }, { $set: { activate: false } });
    }
}