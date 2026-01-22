const http = require('http');

const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const verifyApi = async () => {
    try {
        console.log('Fetching products from API...');
        const productsRes = await fetchJson('http://localhost:5000/api/v1/products');
        // Structure might be { success: true, count: N, data: [...] } or just [...]
        const products = productsRes.data || productsRes; // adjust based on API structure

        console.log('--- API Products Sample ---');
        if (Array.isArray(products)) {
            products.slice(0, 3).forEach(p => console.log(`Name: ${p.name}, Image: "${p.image}"`));
        } else {
            console.log('Product response structure:', Object.keys(productsRes));
        }

        console.log('\nFetching categories from API...');
        const categoriesRes = await fetchJson('http://localhost:5000/api/v1/categories');
        const categories = categoriesRes.data || categoriesRes;

        console.log('--- API Categories Sample ---');
        if (Array.isArray(categories)) {
            categories.slice(0, 3).forEach(c => console.log(`Name: ${c.name}, Image: "${c.image}"`));
        } else {
            console.log('Category response structure:', Object.keys(categoriesRes));
        }

    } catch (error) {
        console.error('Verification failed:', error.message);
    }
};

verifyApi();
