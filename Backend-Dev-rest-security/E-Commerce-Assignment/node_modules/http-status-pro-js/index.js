const StatusCodes = {
    // 1xx Informational
    CONTINUE: { code: 100, message: "Continue" },
    SWITCHING_PROTOCOLS: { code: 101, message: "Switching Protocols" },
    PROCESSING: { code: 102, message: "Processing" },

    // 2xx Success
    OK: { code: 200, message: "OK" },
    CREATED: { code: 201, message: "Created" },
    ACCEPTED: { code: 202, message: "Accepted" },
    NON_AUTHORITATIVE_INFORMATION: { code: 203, message: "Non Authoritative Information" },
    NO_CONTENT: { code: 204, message: "No Content" },

    // 3xx Redirection
    MULTIPLE_CHOICES: { code: 300, message: "Multiple Choices" },
    MOVED_PERMANENTLY: { code: 301, message: "Moved Permanently" },
    NOT_MODIFIED: { code: 304, message: "Not Modified" },

    // 4xx Client Error
    BAD_REQUEST: { code: 400, message: "Bad Request" },
    UNAUTHORIZED: { code: 401, message: "Unauthorized" },
    FORBIDDEN: { code: 403, message: "Forbidden" },
    NOT_FOUND: { code: 404, message: "Not Found" },
    METHOD_NOT_ALLOWED: { code: 405, message: "Method Not Allowed" },
    CONFLICT: { code: 409, message: "Conflict" },
    TOO_MANY_REQUESTS: { code: 429, message: "Too Many Requests" },

    // 5xx Server Error
    INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
    NOT_IMPLEMENTED: { code: 501, message: "Not Implemented" },
    BAD_GATEWAY: { code: 502, message: "Bad Gateway" },
    SERVICE_UNAVAILABLE: { code: 503, message: "Service Unavailable" },
    GATEWAY_TIMEOUT: { code: 504, message: "Gateway Timeout" }
};

// Helper function to get message by code
const getStatus = (code) => {
    const entry = Object.values(StatusCodes).find(item => item.code === parseInt(code));
    return entry ? entry.message : "Unknown Status Code";
};

// Supporting both require() and import
module.exports = { StatusCodes, getStatus };