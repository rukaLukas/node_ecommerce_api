class ProductController {
  constructor(productService) {
    if (!productService) {
      throw new Error('ProductService is required');
    }
    this.productService = productService;
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productService.getAllProducts();
      const count = await this.productService.getProductCount();
      
      res.status(200).json({
        success: true,
        count,
        data: products
      });
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID parameter
      if (!id || id.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      const productId = parseInt(id, 10);
      
      // Check if parsing resulted in a valid positive integer
      if (isNaN(productId) || productId <= 0 || !Number.isInteger(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      const product = await this.productService.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }
}

module.exports = ProductController;