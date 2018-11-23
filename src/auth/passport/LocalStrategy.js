import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../models/user';
import { cleanCpf } from '../../utils';

export default () => {
	return new LocalStrategy(
		{
			usernameField: 'cpf',
			passwordField: 'password',
		},
		(cpf, password, done) => {
			if (!cpf || !password) return done(null, false);
		
			const cleanCpfValue = cleanCpf(cpf);
		
			User.findOne({ where: { cpf: cleanCpfValue } })
				.then(user => {
					if (user === null) {
						return done(null, false);
					}
					user
						.validatePassword(password)
						.then(validation => {
							done(null, validation ? user : false);
						})
						.catch(error => {
							console.log(`LocalStrategy error: ${error}`);
							done(error);
						});
					console.log(user);
				})
				.catch(error => {
					console.log(`LocalStrategy error [DB]: ${error}`);
					done(error);
				});
		}
	);
}
