#!/usr/bin/env node

/**
 * CrackerShop API Test Suite
 * Run with: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000/api/v1';

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

async function apiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runTests() {
    log(colors.blue, '\n=== CrackerShop API Test Suite ===\n');

    let testsPassed = 0;
    let testsFailed = 0;

    // Test 1: Register user
    log(colors.yellow, 'Test 1: Register new user');
    try {
        const response = await apiRequest('POST', '/auth/register', {
            name: 'Test User ' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            password: 'TestPass123'
        });

        if (response.status === 201 && response.data.success) {
            log(colors.green, '✓ PASSED: User registered successfully');
            global.token = response.data.token;
            global.userId = response.data.user._id;
            testsPassed++;
        } else {
            log(colors.red, `✗ FAILED: Status ${response.status}, ${JSON.stringify(response.data)}`);
            testsFailed++;
        }
    } catch (error) {
        log(colors.red, `✗ FAILED: ${error.message}`);
        testsFailed++;
    }

    // Test 2: Login user
    log(colors.yellow, '\nTest 2: Login with registered user');
    try {
        const response = await apiRequest('POST', '/auth/login', {
            email: 'test@crackershop.com',
            password: 'Test123'
        });

        if (response.status === 200 && response.data.success) {
            log(colors.green, '✓ PASSED: User logged in successfully');
            testsPassed++;
        } else if (response.status === 401) {
            log(colors.yellow, '⊘ SKIPPED: Test user not found (create one first)');
        } else {
            log(colors.red, `✗ FAILED: ${JSON.stringify(response.data)}`);
            testsFailed++;
        }
    } catch (error) {
        log(colors.red, `✗ FAILED: ${error.message}`);
        testsFailed++;
    }

    // Test 3: Get products
    log(colors.yellow, '\nTest 3: Fetch products');
    try {
        const response = await apiRequest('GET', '/products');

        if (response.status === 200 && response.data.success) {
            log(colors.green, `✓ PASSED: Fetched ${response.data.data?.length || 0} products`);
            testsPassed++;
        } else {
            log(colors.red, `✗ FAILED: ${JSON.stringify(response.data)}`);
            testsFailed++;
        }
    } catch (error) {
        log(colors.red, `✗ FAILED: ${error.message}`);
        testsFailed++;
    }

    // Test 4: Get categories
    log(colors.yellow, '\nTest 4: Fetch categories');
    try {
        const response = await apiRequest('GET', '/categories');

        if (response.status === 200 && response.data.success) {
            log(colors.green, `✓ PASSED: Fetched ${response.data.data?.length || 0} categories`);
            testsPassed++;
        } else {
            log(colors.red, `✗ FAILED: ${JSON.stringify(response.data)}`);
            testsFailed++;
        }
    } catch (error) {
        log(colors.red, `✗ FAILED: ${error.message}`);
        testsFailed++;
    }

    // Summary
    log(colors.blue, `\n=== Test Summary ===`);
    log(colors.green, `Passed: ${testsPassed}`);
    log(colors.red, `Failed: ${testsFailed}`);
    log(colors.blue, `Total: ${testsPassed + testsFailed}\n`);

    process.exit(testsFailed > 0 ? 1 : 0);
}

// Check if server is running
http.get('http://localhost:5000/health', (res) => {
    if (res.statusCode === 200 || res.statusCode === 401) {
        runTests();
    }
}).on('error', () => {
    log(colors.red, 'ERROR: Cannot connect to server on http://localhost:5000');
    log(colors.yellow, 'Make sure backend is running: cd backend && node server.js');
    process.exit(1);
});
