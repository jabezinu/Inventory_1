const axios = require('axios');

async function testCreateSale() {
    try {
        const saleData = {
            productId: 1, // Fruit (from my previous check)
            quantity: 1,
            sellingPrice: 150,
            paid: true
        };
        const response = await axios.post('http://localhost:3001/api/sales', saleData);
        console.log('Sale created successfully:', response.data);
    } catch (error) {
        console.error('Error creating sale:', error.response ? error.response.data : error.message);
    }
}

testCreateSale();
