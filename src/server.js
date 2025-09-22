const express = require('express');
// const productController = require('./controllers/productController');
const { productController, initializeDataSource } = require('./config/dependencies');


const app = express();
const PORT = process.env.PORT || 3000;

// Initialize data source
initializeDataSource().catch(console.error);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get('/api/products', (req, res) => productController.getAllProducts(req, res));
app.get('/api/products/:id', (req, res) => productController.getProductById(req, res));


// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;