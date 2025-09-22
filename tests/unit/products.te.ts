const request = require('supertest');
const app = require('../../src/server');

// describe('Products Data Validation', () => {
//   let productsData;

//   beforeAll(async () => {
//     const response = await request(app).get('/api/products');
//     productsData = response.body.data;
//   });

//   test('all products should have valid IDs', () => {
//     productsData.forEach(product => {
//       expect(typeof product.id).toBe('number');
//       expect(product.id).toBeGreaterThan(0);
//     });
//   });

//   test('all products should have valid names', () => {
//     productsData.forEach(product => {
//       expect(typeof product.name).toBe('string');
//       expect(product.name.length).toBeGreaterThan(0);
//     });
//   });

//   test('all products should have valid prices', () => {
//     productsData.forEach(product => {
//       expect(typeof product.price).toBe('number');
//       expect(product.price).toBeGreaterThan(0);
//     });
//   });

//   test('all products should have valid categories', () => {
//     const validCategories = ['Electronics', 'Clothing', 'Home'];
//     productsData.forEach(product => {
//       expect(typeof product.category).toBe('string');
//       expect(validCategories).toContain(product.category);
//     });
//   });

//   test('all products should have valid stock quantities', () => {
//     productsData.forEach(product => {
//       expect(typeof product.stock).toBe('number');
//       expect(product.stock).toBeGreaterThanOrEqual(0);
//     });
//   });

//   test('product IDs should be unique', () => {
//     const ids = productsData.map(product => product.id);
//     const uniqueIds = [...new Set(ids)];
//     expect(ids.length).toBe(uniqueIds.length);
//   });
// });