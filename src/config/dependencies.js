const ProductService = require('../services/productService');
const ProductRepository = require('../repositories/productRepository');
const ProductController = require('../controllers/productController');
const dataSource = require('../data/dataSource');

// Initialize data source connection
const initializeDataSource = async () => {
  if (!dataSource.isConnected()) {
    await dataSource.connect();
  }
};

// Create instances with proper dependencies
const productRepository = new ProductRepository(dataSource);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

module.exports = {
  productService,
  productRepository,
  productController,
  dataSource,
  initializeDataSource
};