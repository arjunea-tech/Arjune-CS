import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.1.41:5000';

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
                return url.replace(/localhost|127\.0\.0\.1/, '192.168.1.41');
            }
        }
        return url;
    }

    // Normalize backslashes to forward slashes for Windows paths
    let cleanPath = url.replace(/\\/g, '/');

    // Handle case where absolute file path was saved (e.g. C:/Users/.../uploads/image.jpg)
    if (cleanPath.includes('/uploads/')) {
        const parts = cleanPath.split('/uploads/');
        cleanPath = '/uploads/' + parts[parts.length - 1];
    } else if (!cleanPath.startsWith('/')) {
        // If it's just a filename
        cleanPath = `/uploads/${cleanPath}`;
    }

    return `${BASE_URL}${cleanPath}`;
};
