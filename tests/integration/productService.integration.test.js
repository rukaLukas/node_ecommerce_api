const ProductService = require('../../src/services/productService');
const ProductRepository = require('../../src/repositories/productRepository');
// Import your real data source (database connection, API client, etc.)
const realDataSource = require('../../src/data/dataSource');

describe('ProductService - Integration Tests', () => {
  let productService;
  let productRepository;

  beforeAll(async () => {
    // Setup real data source connection
    await realDataSource.connect();
    productRepository = new ProductRepository(realDataSource);
    productService = new ProductService(productRepository);
  });

  afterAll(async () => {
    // Cleanup
    await realDataSource.disconnect();
  });

  beforeEach(async () => {
    // Setup test data
    await realDataSource.clearTestData();
    await realDataSource.seedTestData();
  });

  test('should fetch products from real data source', async () => {
    const products = await productService.getAllProducts();
    
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verify structure
    products.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('stock');
    });
  });

  test('should handle database connection errors gracefully', async () => {
    // Simulate connection failure
    await realDataSource.disconnect();
    
    await expect(productService.getAllProducts()).rejects.toThrow('Failed to fetch products');
    
    // Reconnect for other tests
    await realDataSource.connect();
  });
});