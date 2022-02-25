import rateLimit from 'express-rate-limit';

export const customizeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});
