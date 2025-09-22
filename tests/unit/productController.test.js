const ProductController = require('../../src/controllers/productController');

describe('ProductController - Unit Tests', () => {
  let productController;
  let mockProductService;
  let mockReq, mockRes;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock console.error to suppress error logs during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create mock service
    mockProductService = {
      getAllProducts: jest.fn(),
      getProductCount: jest.fn()
    };
    
    // Create controller with mock service
    productController = new ProductController(mockProductService);
    
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should throw error when productService is not provided', () => {
      expect(() => new ProductController()).toThrow('ProductService is required');
    });

    test('should create instance when productService is provided', () => {
      const controller = new ProductController(mockProductService);
      expect(controller.productService).toBe(mockProductService);
    });
  });

  describe('getAllProducts', () => {
    test('should return products with success response', async () => {
      const mockProducts = [
        { id: 1, name: '!!!Test Product', price: 99.99, category: '!!!!Electronics', stock: 10 },
        { id: 2, name: 'Test Product', price: 29.99, category: 'Clothing', stock: 50 }
      ];

      // Use these instead of console.log
      console.info('Debug - mockProducts:', mockProducts);
      console.warn('Debug - mockProducts:', mockProducts);
      
      mockProductService.getAllProducts.mockResolvedValue(mockProducts);
      mockProductService.getProductCount.mockResolvedValue(1);

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockProductService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(mockProductService.getProductCount).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 3,
        data: mockProducts
      });
    });

    test('should handle service errors from getAllProducts', async () => {
      mockProductService.getAllProducts.mockRejectedValue(new Error('Service error'));

      await productController.getAllProducts(mockReq, mockRes);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in getAllProducts:', expect.any(Error));
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });

    test('should handle service errors from getProductCount', async () => {
      const mockProducts = [
        { id: 1, name: 'Test Product', price: 99.99, category: 'Electronics', stock: 10 }
      ];
      
      mockProductService.getAllProducts.mockResolvedValue(mockProducts);
      mockProductService.getProductCount.mockRejectedValue(new Error('Count error'));

      await productController.getAllProducts(mockReq, mockRes);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in getAllProducts:', expect.any(Error));
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });

    test('should handle empty products array', async () => {
      mockProductService.getAllProducts.mockResolvedValue([]);
      mockProductService.getProductCount.mockResolvedValue(0);

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 0,
        data: []
      });
    });

    test('should call productService methods in correct order', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ];
      
      const callOrder = [];
      
      mockProductService.getAllProducts.mockImplementation(async () => {
        callOrder.push('getAllProducts');
        return mockProducts;
      });
      
      mockProductService.getProductCount.mockImplementation(async () => {
        callOrder.push('getProductCount');
        return 2;
      });

      await productController.getAllProducts(mockReq, mockRes);

      // Verify the order of calls
      expect(callOrder).toEqual(['getAllProducts', 'getProductCount']);
      expect(mockProductService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(mockProductService.getProductCount).toHaveBeenCalledTimes(1);
    });

    test('should handle concurrent requests', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      
      mockProductService.getAllProducts.mockResolvedValue(mockProducts);
      mockProductService.getProductCount.mockResolvedValue(1);

      // Create separate mock response objects for each request
      const mockRes1 = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockRes2 = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockRes3 = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Simulate concurrent requests
      const requests = [
        productController.getAllProducts(mockReq, mockRes1),
        productController.getAllProducts(mockReq, mockRes2),
        productController.getAllProducts(mockReq, mockRes3)
      ];

      await Promise.all(requests);

      expect(mockProductService.getAllProducts).toHaveBeenCalledTimes(3);
      expect(mockProductService.getProductCount).toHaveBeenCalledTimes(3);
      
      // Verify all responses were successful
      [mockRes1, mockRes2, mockRes3].forEach(res => {
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          count: 1,
          data: mockProducts
        });
      });
    });

    test('should handle null response from getAllProducts', async () => {
      mockProductService.getAllProducts.mockResolvedValue(null);
      mockProductService.getProductCount.mockResolvedValue(0);

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 0,
        data: null
      });
    });

    test('should handle undefined response from getAllProducts', async () => {
      mockProductService.getAllProducts.mockResolvedValue(undefined);
      mockProductService.getProductCount.mockResolvedValue(0);

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 0,
        data: undefined
      });
    });

    test('should handle large number of products', async () => {
      const mockProducts = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: 99.99,
        category: 'Electronics',
        stock: 10
      }));
      
      mockProductService.getAllProducts.mockResolvedValue(mockProducts);
      mockProductService.getProductCount.mockResolvedValue(1000);

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 1000,
        data: mockProducts
      });
    });

    test('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      
      mockProductService.getAllProducts.mockRejectedValue(timeoutError);

      await productController.getAllProducts(mockReq, mockRes);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in getAllProducts:', expect.any(Error));
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });
  });
});