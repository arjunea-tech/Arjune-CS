// Frontend Environment Configuration
const ENV = {
    dev: {
        apiUrl: 'http://192.168.1.38:5000/api/v1',
        uploadUrl: 'http://192.168.1.38:5000/uploads',
        environment: 'development',
        logLevel: 'debug',
        timeout: 10000
    },
    prod: {
        apiUrl: 'https://api.yourdomain.com/api/v1',
        uploadUrl: 'https://api.yourdomain.com/uploads',
        environment: 'production',
        logLevel: 'error',
        timeout: 15000
    },
    staging: {
        apiUrl: 'https://staging-api.yourdomain.com/api/v1',
        uploadUrl: 'https://staging-api.yourdomain.com/uploads',
        environment: 'staging',
        logLevel: 'info',
        timeout: 12000
    }
};

const getEnvVars = () => {
    if (__DEV__) {
        return ENV.dev;
    }
    return ENV.prod;
};

export default getEnvVars;
