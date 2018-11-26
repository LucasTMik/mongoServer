import User from '../../../models/user';
import { baseResolver, isAuthenticatedResolver, isAdminResolver } from '../../baseResolvers';
import {
  InvalidDataError,
  UserAlreadyExists,
  UnknownError,
} from '../../errors';
import { cleanCpf, validateCpf, createLog } from '../../../utils';

// Query type
const me = isAuthenticatedResolver.createResolver(async (root, _, { user }) => {
    return user;
})

const allUsers = isAuthenticatedResolver.createResolver(async root => {
    return User.find({});
})

const userById = isAuthenticatedResolver.createResolver(async (root, { userId }) => {
    return User.findOne({ id: userId });
});

const userByCpf = isAuthenticatedResolver.createResolver(async (root, { userCpf }) => {
    if(!validateCpf(userCpf))
        return new InvalidDataError();
    
    let cleanCpfValue = cleanCpf(userCpf);
    return User.findOne({ cpf: cleanCpfValue });
});

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
        allUsers,
        userById,
        userByCpf
    },
    Mutation: {
        registerUser
    }
}