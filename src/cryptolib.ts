// source: https://lollyrock.com/posts/nodejs-encryption/

import crypto from 'crypto';

export function encrypt(text: string, algorithm: string, salt: string): string {
    const cipher = crypto.createCipher(algorithm, salt);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

export function decrypt(text: string, algorithm: string, salt: string): string {
    const decipher = crypto.createDecipher(algorithm, salt);
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
}
