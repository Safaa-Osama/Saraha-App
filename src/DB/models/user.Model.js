import mongoose from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../common/enum/user.enum.js";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: [3, "name must be at least 3 char"],
        maxLength: [10, "name must be not more than 10 char"],
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        minLength: [3, "name must be at least 3 char"],
        maxLength: [10, "name must be not more than 10 char"],
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    confirmedEmail: {
        type:Boolean,
        default:false
    }, 
    password: {
        type: String,
        minLength: 6,
        required: function () {
            return this.provider == providerEnum.system ? true : false
        },
        trim: true
    },
    phone: {
        type: String,
        required: function () {
            return this.provider == providerEnum.system ? true : false
        },
        trim: true
    },
    age: {
        type: Number,
        min: 20,
        max: 60
    },
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        default: providerEnum.system
    },
    gender: {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.male
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },
    profilePicture: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    coverPictures: [{
        secure_url: String,
        public_id: String
    }],
    profileVisits: {
        type: Number,
        default: 0
    },
    changeCredential:Date
}, {
    timestamps: true,
    strictQuery: true,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});

userSchema.virtual("userName")
    .get(function () {
        return this.firstName + " " + this.lastName
    }).set(function (value) {
        const [firstName, lastName] = value.split(" ")
        this.set({ firstName, lastName })
    })
const userModel = mongoose.models.user || mongoose.model("user", userSchema);


export default userModel;