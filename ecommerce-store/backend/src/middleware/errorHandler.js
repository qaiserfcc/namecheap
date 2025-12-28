const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    const field = err.message.match(/for key '(.+?)'/)?.[1] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate entry. ${field} already exists.`,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference. Related record not found.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // MySQL data too long error
  if (err.code === 'ER_DATA_TOO_LONG') {
    return res.status(400).json({
      success: false,
      message: 'Data exceeds maximum length.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error.',
      errors: err.errors
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired.'
    });
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error.';
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// 404 handler
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`
  });
};

module.exports = { errorHandler, notFound };
