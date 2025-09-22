const ProductService = require('../../src/services/productService');

describe('ProductService - Unit Tests', () => {
  let productService;
  let mockProductRepository;

  beforeEach(() => {
    // Create a mock repository
    mockProductRepository = {
      getAllProducts: jest.fn(),
      getProductById: jest.fn(),
      createProduct: jest.fn()
    };
    
    // Inject the mock into the service
    productService = new ProductService(mockProductRepository);
  });

  describe('getAllProducts', () => {
    test('should return products from repository', async () => {
      const mockProducts = [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 10 },
        { id: 2, name: 'T-Shirt', price: 29.99, category: 'Clothing', stock: 50 }
      ];
      
      mockProductRepository.getAllProducts.mockResolvedValue(mockProducts);

      const result = await productService.getAllProducts();

      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });

    test('should throw error when repository fails', async () => {
      mockProductRepository.getAllProducts.mockRejectedValue(new Error('Database error'));

      await expect(productService.getAllProducts()).rejects.toThrow('Failed to fetch products');
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductCount', () => {
    test('should return correct count of products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' }
      ];
      
      mockProductRepository.getAllProducts.mockResolvedValue(mockProducts);

      const count = await productService.getProductCount();

      expect(count).toBe(3);
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });

    test('should throw error when unable to fetch products', async () => {
      mockProductRepository.getAllProducts.mockRejectedValue(new Error('Database error'));

      await expect(productService.getProductCount()).rejects.toThrow('Failed to count products');
    });
  });

  describe('getProductById', () => {
    test('should return product when valid ID is provided', async () => {
      const mockProduct = { id: 1, name: 'Laptop', price: 999.99 };
      mockProductRepository.getProductById.mockResolvedValue(mockProduct);

      const result = await productService.getProductById(1);

      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    test('should throw error for invalid ID', async () => {
      await expect(productService.getProductById(-1)).rejects.toThrow('Invalid product ID');
      await expect(productService.getProductById('invalid')).rejects.toThrow('Invalid product ID');
      await expect(productService.getProductById(null)).rejects.toThrow('Invalid product ID');
      
      expect(mockProductRepository.getProductById).not.toHaveBeenCalled();
    });

    test('should throw error when repository fails', async () => {
      mockProductRepository.getProductById.mockRejectedValue(new Error('Database error'));

      await expect(productService.getProductById(1)).rejects.toThrow('Failed to fetch product');
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1);
    });
  });

  describe('validateProduct', () => {
    test('should validate a correct product', () => {
      const validProduct = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        category: 'Electronics',
        stock: 10
      };
      
      const result = productService.validateProduct(validProduct);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should invalidate product with multiple errors', () => {
      const invalidProduct = {
        id: -1,
        name: '',
        price: -10,
        category: 'InvalidCategory',
        stock: -5
      };
      
      const result = productService.validateProduct(invalidProduct);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid ID');
      expect(result.errors).toContain('Invalid name');
      expect(result.errors).toContain('Invalid price');
      expect(result.errors).toContain('Invalid category');
      expect(result.errors).toContain('Invalid stock');
    });

    // This test doesn't need mocking because it's pure business logic
    test('should validate each field independently', () => {
      const testCases = [
        {
          product: { id: 0, name: 'Valid', price: 10, category: 'Electronics', stock: 5 },
          expectedError: 'Invalid ID'
        },
        {
          product: { id: 1, name: '', price: 10, category: 'Electronics', stock: 5 },
          expectedError: 'Invalid name'
        },
        {
          product: { id: 1, name: 'Valid', price: 0, category: 'Electronics', stock: 5 },
          expectedError: 'Invalid price'
        }
      ];

      testCases.forEach(({ product, expectedError }) => {
        const result = productService.validateProduct(product);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(expectedError);
      });
    });
  });

  describe('areProductIdsUnique', () => {
    test('should return true for unique IDs', () => {
      const productsWithUniqueIds = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' }
      ];
      
      const result = productService.areProductIdsUnique(productsWithUniqueIds);
      
      expect(result).toBe(true);
    });

    test('should return false for duplicate IDs', () => {
      const productsWithDuplicateIds = [
        { id: 1, name: 'Product 1' },
        { id: 1, name: 'Product 2' },
        { id: 3, name: 'Product 3' }
      ];
      
      const result = productService.areProductIdsUnique(productsWithDuplicateIds);
      
      expect(result).toBe(false);
    });

    test('should throw error for invalid input', () => {
      expect(() => productService.areProductIdsUnique('not an array')).toThrow('Product list must be an array');
      expect(() => productService.areProductIdsUnique(null)).toThrow('Product list must be an array');
    });
  });
});