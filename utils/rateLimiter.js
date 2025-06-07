import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    status: false,
    error: "Too many login attempts. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,  
});


export default loginLimiter