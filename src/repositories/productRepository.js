class ProductRepository {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async getAllProducts() {
    // This could be database, API, or any data source
    return await this.dataSource.findAll();
  }

  async getProductById(id) {
    return await this.dataSource.findById(id);
  }

  async createProduct(product) {
    return await this.dataSource.create(product);
  }
}

module.exports = ProductRepository;