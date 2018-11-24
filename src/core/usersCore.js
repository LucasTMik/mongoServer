'use stric'

import bcrypt from 'bcrypt-nodejs';

const generateHash = function (password, weakSalt = false) {
    return new Promise((resolve, reject) => {
        const saltRounds = process.env.NODE_ENV === 'test' || weakSalt ? 1 : 12;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return reject(err);
            bcrypt.hash(password, salt, null, function (err, hash) {
                if (err) return reject(err);
                resolve(hash);
            });
        });
    });
};

const isAdmin = function () {
    return this.accessLevel === 1;
};

module.exports = {
    generateHash,
    isAdmin
}