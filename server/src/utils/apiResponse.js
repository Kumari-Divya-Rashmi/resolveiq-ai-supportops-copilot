export function sendSuccess(res, data = null, message = "OK", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null
  });
}

export function sendCreated(res, data = null, message = "Created") {
  return sendSuccess(res, data, message, 201);
}

export function sendError(res, error, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message: "Request failed",
    error
  });
}
