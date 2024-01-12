const request = require('supertest');
const app = require('../server');

describe('User Controller', () => {
    let server;
  
    beforeAll(() => {
      server = app.listen(3001);
    });
  
    afterAll((done) => {
      server.close(done);
    });
  
    it('should register a new user', async () => {
      const response = await request(server)
        .post('/user/register')
        .send({
          name: 'TestUser',
          email: 'testuser@example.com',
          password: 'securePassword',
          profileImage: 'test-image.jpg',
        });
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Registration successful');
    });
  
     it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'testuser@example.com',
        password: 'securePassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data).toHaveProperty('token');
  });

  it('should update user profile', async () => {
    const userId = 'userId';

    const response = await request(app)
      .put(`/user/update/${userId}`)
      .set('id', userId)
      .send({
        name: 'UpdatedTestUser',
        email: 'pandeydeevyansha@gmail.com',
        password: 'newSecurePassword',
        profileImage: 'updated-test-image.jpg',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User profile updated successfully');
  });

  it('should send a password reset email', async () => {
    const response = await request(app)
      .post('/user/forgot-password')
      .send({
        email: 'pandeydeevyansha@gmail.com',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset email sent successfully');
  });

  it('should reset user password', async () => {
    const resetToken = 'validResetToken';
    const newPassword = 'newSecurePassword';
  
    const response = await request(app)
      .put('/user/reset-password')
      .send({
        resetToken,
        newPassword,
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset successfully');
    if (response.status === 400) {
      expect(response.body.error).toBe('Invalid or expired token');
    }
  });
  
  });


  
  describe('Product Controller', () => {
    let server;
  
    beforeAll(() => {
      server = app.listen(3001);
    });
  
    afterAll((done) => {
      server.close(done);
    });
  
    it('should create a new product', async () => {
      const response = await request(server)
        .post('/product/create')
        .send({
          title: 'Test Product',
          images: ['image1.jpg', 'image2.jpg'],
          price: 50,
          discountPrice: 40,
          description: 'Test description',
          stock: 100,
        });
  
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product created successfully');
      expect(response.body.product).toHaveProperty('_id');
    });
  
    it('should get all products', async () => {
      const response = await request(server).get('/product/all');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    it('should get a specific product', async () => {
        const validProductId = '65a184632d5c834c6d8f54a0';
        const response = await request(server).get(`/product/${validProductId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(validProductId);
        expect(response.body.title).toBe('Test Product');
      });
  
      it('should edit a product', async () => {
        const productId = '65a184632d5c834c6d8f54a0';
        const response = await request(server)
          .put(`/product/edit/${productId}`)
          .send({
            title: 'Updated Product',
            images: ['updated-image.jpg'],
            price: 60,
            discountPrice: 50,
            description: 'Updated description',
            stock: 90,
          });
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product updated successfully');
      });
  
      it('should purchase a product', async () => {
        const productId = '65a184632d5c834c6d8f54a0';
        const response = await request(server).post(`/product/purchase/${productId}`);

        console.log(response.body);
      
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Purchase successful');
        expect(response.body.product.stock).toBeLessThan(100);
      });
  
      it('should remove a product', async () => {
        const productId = '65a184632d5c834c6d8f54a0';
        const response = await request(server).delete(`/product/remove/${productId}`);
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product deleted successfully');
      });
    
  });
