"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
const JWT_TOKEN = process.env.JWT_TOKEN ?? "fallback";
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (typeof value === 'string' && value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
            token: {
                type: String,
                required: true,
            }
        }],
}, {
    virtuals: {
        boards: {
            options: {
                ref: 'Board',
                localField: '_id',
                foreignField: 'owner'
            }
        },
        tasks: {
            options: {
                ref: 'Task',
                localField: '_id',
                foreignField: 'assignee'
            }
        }
    }
});
// /** ALIASES */
// userSchema.virtual('boards', {
//   ref: 'Board',
//   localField: '_id',
//   foreignField: 'owner'
// })
// userSchema.virtual('tasks', {
//   ref: 'Task',
//   localField: '_id',
//   foreignField: 'assignee'
// })
/** CUSTOM METHODS DEFINITION */
async function generateAuthToken() {
    const user = this;
    const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, JWT_TOKEN);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}
exports.userSchema.method('generateAuthToken', generateAuthToken);
function toJSON() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}
exports.userSchema.method('toJSON', toJSON);
/** STATIC METHODS DEFINITION */
const findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
};
exports.userSchema.static('findByCredentials', findByCredentials);
/** HOOKS */
async function hashPassword(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt_1.default.hash(user.password, 8);
    }
    next();
}
exports.userSchema.pre('save', hashPassword);
exports.userSchema.pre('deleteOne', async function (next) {
    const user = this;
    // TODO delete boards owned and unassign from task
    // const filter = user.getFilter()
    next();
});
const User = (0, mongoose_1.model)('User', exports.userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map