import sha256 from 'crypto-js/sha256';

export type PasswordEncoder = (password: string) => string;

// Encoder to be used while storing passwords.
const encoder: PasswordEncoder = (password: string) => sha256(password).toString(CryptoJS.enc.Hex);

export default encoder;
