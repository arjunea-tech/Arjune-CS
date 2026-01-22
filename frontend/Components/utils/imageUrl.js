import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.1.35:5000';

/**
 * Resolves an image URL from the backend.
 * Handles relative paths and replaces localhost with the server IP for mobile compatibility.
 */
export const resolveImageUrl = (url) => {
    if (!url) return null;

    // Normalize backslashes to forward slashes for Windows paths
    let cleanPath = url.replace(/\\/g, '/');

    // If it's a full URL or contains /uploads/, extract the relative part
    // and use our current BASE_URL
    if (cleanPath.includes('/uploads/')) {
        const parts = cleanPath.split('/uploads/');
        const path = parts[parts.length - 1]; // Get just the filename/subpath
        return `${BASE_URL}/uploads/${path}`;
    }

    // Handle just filename case
    if (!cleanPath.startsWith('http') && !cleanPath.startsWith('file')) {
        if (!cleanPath.startsWith('/')) {
            cleanPath = `/uploads/${cleanPath}`;
        }
        return `${BASE_URL}${cleanPath}`;
    }

    // For external URLs (not CrackerShop uploads)
    return cleanPath;
};
