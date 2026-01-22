// Standardized API response format
class APIResponse {
    constructor(success, data = null, error = null, meta = null) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.timestamp = new Date().toISOString();
        if (meta) {
            this.meta = meta;
        }
    }
}

// Success response with pagination
exports.successResponse = (data, meta = null, message = null) => {
    const response = new APIResponse(true, data, null, meta);
    if (message) {
        response.message = message;
    }
    return response;
};

// Error response
exports.errorResponse = (error, statusCode = 500) => {
    return {
        statusCode,
        body: new APIResponse(false, null, error)
    };
};

// Paginated response
exports.paginatedResponse = (items, total, page, limit, message = null) => {
    const meta = {
        total,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        pages: Math.ceil(total / (parseInt(limit) || 10))
    };
    return exports.successResponse(items, meta, message);
};

// List response with filtering options
exports.listResponse = (items, filters = null) => {
    const meta = {
        total: items.length,
        ...(filters && { filters })
    };
    return exports.successResponse(items, meta);
};
