import User from '../../../models/user';
import { baseResolver, isAuthenticatedResolver, isAdminResolver } from '../../baseResolvers';
import {
  InvalidDataError,
  UserAlreadyExists,
  UnknownError,
} from '../../errors';
import { cleanCpf, validateCpf, createLog } from '../../../utils';

// Query type
const me = baseResolver.createResolver(async (root, _, { user }) => {
    return user;
})

const allUsers = baseResolver.createResolver(async root => {
    return User.find({});
})

const registerUser = baseResolver.createResolver(async (root, { input }) => {
    const { cpf, deviceToken, password } = input;
    if (!cpf || !deviceToken || !password) 
        return new InvalidDataError();

    const user = await new User({
        cpf: cpf, 
        password: password
    });
    user.save();    
})

export default {
    Query: {
        me,
        allUsers
    },
    Mutation: {
        registerUser
    }
}