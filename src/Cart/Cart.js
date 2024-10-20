import React, { useState, useEffect } from 'react';
import { Layout, Button, Menu, Input, Image } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Cart.css';
import bannerImage from '../assets/img1.png';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const Cart = () => {
  const [productsInCart, setProductsInCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setProductsInCart(storedCart);
    console.log("Stored Cart:", storedCart);
  }, []);

  const handleRemoveProduct = (productId) => {
    const updatedProducts = productsInCart.filter((product) => product.id !== productId);
    setProductsInCart(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));
    /*localStorage.setItem getuser */
  };

  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);
  const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);

  return (
    <Layout>
      {/* Navbar */}
      <Header className="header">
        <div className="menu-left">
          <Menu mode="horizontal" defaultSelectedKeys={['1']} className="menu-left">
            <Menu.Item key="1"><Link to="/Home">E-commerce</Link></Menu.Item>
          </Menu>
        </div>

        <div className="menu-center">
          <Menu mode="horizontal" className="menu-center">
            <Menu.Item><Link to="/Home">หน้าแรก</Link></Menu.Item>
            <Menu.Item><Link to="/Promotion">โปรโมชั่น</Link></Menu.Item>
            <Menu.Item><Link to="/Products">สินค้า</Link></Menu.Item>
            <Menu.Item><Link to="/Payment">แจ้งชำระเงิน</Link></Menu.Item>
          </Menu>
        </div>

        <div className="menu-right">
          <Search placeholder="Search products" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} />
          <UserOutlined style={{ fontSize: '24px', color: 'black' }} />
        </div>
      </Header>

      {/* Banner */}
      <div className="banner-b">
        <img src={bannerImage} alt="Banner" className="banner-b-image" />
        <div className="banner-text">
          <h1>ตระกร้า</h1>
        </div>
      </div>

      {/* Content */}
      <Content className="content">
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <h2>Cart Summary</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>รูปภาพ</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>สินค้า</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ราคา</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>จำนวน</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>รวม</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {productsInCart.length > 0 ? (
                  productsInCart.map((product) => (
                    <tr key={product.id}>
                      <td className="table-cell">
                        <Image
                          src={product.img}
                          style={{ width: '50px', height: '50px' }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'path/to/fallback/image.png'; 
                          }}
                        />
                      </td>
                      <td className="table-cell">{product.description}</td>
                      <td className="table-cell">{product.price} บาท</td>
                      <td className="table-cell">{product.quantity}</td>
                      <td className="table-cell">{(product.price * product.quantity).toFixed(2)} บาท</td>
                      <td className="table-cell">
                        <Button 
                          type="link" 
                          icon={<ShoppingCartOutlined />} 
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          ลบ
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>ไม่มีสินค้าในตะกร้า</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cart Summary */}
          <div style={{ marginLeft: '20px', width: '200px', paddingTop: '50px' }}>
            <h4>รวมทั้งหมด</h4>
            <p>จำนวนสินค้าทั้งหมด : {totalQuantity}</p>
            <p>ราคารวม : {totalPrice.toFixed(2)} บาท</p>
            <Link to={{
              pathname: '/Payment',
              state: { productsInCart } 
            }}>
              <Button type="primary" icon={<ShoppingCartOutlined />} block>
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="footer">
        {/* Footer content */}
      </Footer>
    </Layout>
  );
};

export default Cart;
