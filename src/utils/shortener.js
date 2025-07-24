import crypto from 'crypto';

export const generateShortId = () => {
  return crypto.randomBytes(3).toString('hex'); // e.g., a1b2c3
};

