import { Platform } from 'react-native';

const SERVER_IP = '192.168.1.34'; // Match config.js
const BASE_URL = `http://${SERVER_IP}:5000`;

/**
 * Resolves an image URL from the backend.
 * Handles relative paths and replaces localhost with the server IP for mobile compatibility.
 */
export const resolveImageUrl = (url) => {
    if (!url) return null;

    // If it's already a full URL or a local file URI
    if (url.startsWith('http') || url.startsWith('file')) {
        // Replace localhost with server IP for mobile devices
        if (url.startsWith('http')) {
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                return url.replace(/localhost|127\.0\.0\.1/, SERVER_IP);
            }
        }
        return url;
    }

    // If it's a relative path (e.g., /uploads/image.jpg or uploads/image.jpg)
    const cleanPath = url.startsWith('/') ? url : `/${url}`;

    // For local uploads, they are served at /uploads
    // Check if the path already includes /uploads
    if (cleanPath.startsWith('/uploads')) {
        return `${BASE_URL}${cleanPath}`;
    }

    return `${BASE_URL}/uploads${cleanPath}`;
};
