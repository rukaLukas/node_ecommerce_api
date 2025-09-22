const ProductController = require('../../src/controllers/productController');

describe('ProductController - getProductById Tests', () => {
  let productController;
  let mockProductService;
  let mockReq, mockRes;

  beforeEach(() => {
    // Create mock service
    mockProductService = {
      getAllProducts: jest.fn(),
      getProductCount: jest.fn(),
      getProductById: jest.fn()
    };
    
    // Create controller with mock service
    productController = new ProductController(mockProductService);
    
    mockReq = {
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('getProductById', () => {
    test('should return product when valid ID is provided', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 99.99 };
      mockReq.params.id = '1';
      mockProductService.getProductById.mockResolvedValue(mockProduct);

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockProduct
      });
    });

    test('should return 400 for invalid ID', async () => {
      mockReq.params.id = 'invalid';

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid product ID'
      });
    });

    test('should return 404 when product not found', async () => {
      mockReq.params.id = '999';
      mockProductService.getProductById.mockResolvedValue(null);

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).toHaveBeenCalledWith(999);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found'
      });
    });

    test('should handle service errors', async () => {
      mockReq.params.id = '1';
      mockProductService.getProductById.mockRejectedValue(new Error('Database error'));

      await productController.getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });

    test('should handle zero ID', async () => {
      mockReq.params.id = '0';

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid product ID'
      });
    });

    test('should handle negative ID', async () => {
      mockReq.params.id = '-1';

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid product ID'
      });
    });

    // test('should handle decimal ID', async () => {
    //   mockReq.params.id = '1.5';

    //   await productController.getProductById(mockReq, mockRes);

    //   expect(mockProductService.getProductById).not.toHaveBeenCalled();
    //   expect(mockRes.status).toHaveBeenCalledWith(400);
    //   expect(mockRes.json).toHaveBeenCalledWith({
    //     success: false,
    //     message: 'Invalid product ID'
    //   });
    // });

    test('should handle empty ID', async () => {
      mockReq.params.id = '';

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid product ID'
      });
    });

    test('should handle undefined ID', async () => {
      mockReq.params.id = undefined;

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid product ID'
      });
    });

    test('should handle very large ID', async () => {
      mockReq.params.id = '999999999999999999999';
      mockProductService.getProductById.mockResolvedValue(null);

      await productController.getProductById(mockReq, mockRes);

      expect(mockProductService.getProductById).toHaveBeenCalledWith(999999999999999999999);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found'
      });
    });
  });
});