class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts() {
    try {
      return await this.productRepository.getAllProducts();
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }

  async getProductCount() {
    try {
      const products = await this.getAllProducts();
      return products.length;
    } catch (error) {
      throw new Error('Failed to count products');
    }
  }

  async getProductById(id) {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid product ID');
    }
    
    try {
      return await this.productRepository.getProductById(id);
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  }

  validateProduct(product) {
    const errors = [];
    
    if (!product.id || typeof product.id !== 'number' || product.id <= 0) {
      errors.push('Invalid ID');
    }
    
    if (!product.name || typeof product.name !== 'string' || product.name.trim().length === 0) {
      errors.push('Invalid name');
    }
    
    if (!product.price || typeof product.price !== 'number' || product.price <= 0) {
      errors.push('Invalid price');
    }
    
    const validCategories = ['Electronics', 'Clothing', 'Home'];
    if (!product.category || !validCategories.includes(product.category)) {
      errors.push('Invalid category');
    }
    
    if (typeof product.stock !== 'number' || product.stock < 0) {
      errors.push('Invalid stock');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  areProductIdsUnique(productList) {
    if (!Array.isArray(productList)) {
      throw new Error('Product list must be an array');
    }
    
    const ids = productList.map(product => product.id);
    const uniqueIds = new Set(ids);
    return ids.length === uniqueIds.size;
  }
}

module.exports = ProductService;