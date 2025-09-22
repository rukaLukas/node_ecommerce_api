// Simple in-memory data source for development/testing
const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 10 },
  { id: 2, name: 'T-Shirt', price: 29.99, category: 'Clothing', stock: 50 },
  { id: 3, name: 'Coffee Mug', price: 12.99, category: 'Home', stock: 25 }
];

class InMemoryDataSource {
  constructor() {
    this.products = [...products]; // Copy of original data
    this.connected = false;
  }

  async connect() {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 100));
    this.connected = true;
    console.log('Connected to in-memory data source');
  }

  async disconnect() {
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 50));
    this.connected = false;
    console.log('Disconnected from in-memory data source');
  }

  async findAll() {
    if (!this.connected) {
      throw new Error('Data source not connected');
    }
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    return [...this.products];
  }

  async findById(id) {
    if (!this.connected) {
      throw new Error('Data source not connected');
    }
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    return this.products.find(product => product.id === id);
  }

  async create(product) {
    if (!this.connected) {
      throw new Error('Data source not connected');
    }
    const newProduct = { 
      ...product, 
      id: Math.max(...this.products.map(p => p.id)) + 1 
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async clearTestData() {
    if (!this.connected) {
      throw new Error('Data source not connected');
    }
    this.products = [];
  }

  async seedTestData() {
    if (!this.connected) {
      throw new Error('Data source not connected');
    }
    this.products = [...products]; // Reset to original data
  }

  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
module.exports = new InMemoryDataSource();