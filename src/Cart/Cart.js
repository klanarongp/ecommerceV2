import React, { useState } from 'react';
import { Layout, Button, InputNumber } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import './Cart.css';

const { Header, Content, Footer } = Layout;

const Cart = () => {
  const [productsInCart, setProductsInCart] = useState([
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      quantity: 2,
      image: 'https://via.placeholder.com/240?text=Product+1',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 150,
      quantity: 1,
      image: 'https://via.placeholder.com/240?text=Product+2',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 200,
      quantity: 3,
      image: 'https://via.placeholder.com/240?text=Product+3',
    },
  ]);

  const handleQuantityChange = (value, productId) => {
    // ไม่อนุญาตให้ผู้ใช้เปลี่ยนแปลงจำนวนสินค้า
  };

  const handleRemoveProduct = (productId) => {
    setProductsInCart((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <Layout>
      {/* Navbar */}
      <Header className="header">
        <h1 style={{ color: '#fff' }}>Shopping Cart</h1>
      </Header>

      {/* Banner */}
      <div className="banner">
        <h1>Your Shopping Cart</h1>
      </div>

      {/* Content */}
      <Content className="content" style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h2>Cart Summary</h2>
          
          {/* ตารางแสดงสินค้า */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>Image</th>
                <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>Product</th>
                <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>Price</th>
                <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>Quantity</th>
                <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>Total</th>
                <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {productsInCart.map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: '8px 0' }}>
                    <img alt={product.name} src={product.image} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  </td>
                  <td style={{ textAlign: 'left' }}>{product.name}</td> {/* ปรับให้ชื่อสินค้าอยู่ทางซ้าย */}
                  <td>${product.price}</td> {/* แสดงราคา */}
                  <td>
                    <InputNumber
                      min={1}
                      value={product.quantity}
                      onChange={(value) => handleQuantityChange(value, product.id)} // ไม่อนุญาตให้แก้ไข
                      disabled
                    />
                  </td>
                  <td>${product.price * product.quantity}</td> {/* คำนวณราคารวม */}
                  <td>
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleRemoveProduct(product.id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart Summary แนวตั้ง */}
        <div style={{ marginLeft: '20px', width: '200px' }}>
          <h4>รวมทั้งหมด</h4>
          <p>จำนวนสินค้าทั้งหมด: {totalQuantity}</p>
          <p>ราคารวม: ${totalPrice}</p>
          <Button type="primary" icon={<ShoppingCartOutlined />} block>
            Checkout
          </Button>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="footer">
        <p>&copy; 2024 Your Store</p>
      </Footer>
    </Layout>
  );
};

export default Cart;
