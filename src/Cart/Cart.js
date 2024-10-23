import React, { useState, useEffect } from 'react';
import { Layout, Button, Menu, Image, Dropdown, Modal } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import bannerImage from '../assets/img1.png';

const { Header, Content, Footer } = Layout;

const Cart = () => {
  const [cartVisible, setCartVisible] = useState(false);
  const [productsInCart, setProductsInCart] = useState([]);
  const [billingDetails, setBillingDetails] = useState([]);
  const [userRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setProductsInCart(storedCart);
    console.log("Stored Cart:", storedCart);

    // Fetch billing details for the products in the cart
    const fetchBillingDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/billingList'); // Update with your actual API endpoint
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setBillingDetails(data);
      } catch (error) {
        console.error("Error fetching billing details:", error);
      }
    };

    fetchBillingDetails();
  }, [navigate]);

  const handleRemoveProduct = (productId) => {
    const updatedProducts = productsInCart.filter((product) => product.id !== productId);
    setProductsInCart(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));
  };

  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);
  const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      {userRole === 'admin' && (
        <Menu.Item key="3">
          <Link to="/admin/ManageProducts">Admin</Link>
        </Menu.Item>
      )}
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

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
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} onClick={handleCartOpen} />
          <Dropdown overlay={userMenu} trigger={['click']}>
            <UserOutlined style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </Header>

      <Modal
        title="Shopping Cart"
        visible={cartVisible}
        onCancel={handleCartClose}
        footer={[
          <Link to="/Cart" key="cart">
            <Button onClick={handleCartClose}>Cart</Button>
          </Link>,
          <Link to="/Payment" key="Payment">
            <Button onClick={handleCartClose} type="primary">Checkout</Button>
          </Link>
        ]}
        width={800} 
        style={{ maxHeight: '600px' }} 
      >
        <ul>
          {productsInCart.map((item, index) => (
            <li key={index}>
              <Image src={item.img} style={{ width: '50px', marginRight: '10px' }} />
              {item.description} ราคา {item.price} บาท x {item.quantity} = {(item.price * item.quantity).toFixed(2)} บาท
              <Button type="link" onClick={() => handleRemoveProduct(item.id)}>Remove</Button>
            </li>
          ))}
        </ul>
        <p>รวม : {totalPrice.toFixed(2)} บาท</p>
      </Modal>

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

      {/* New Table for billing_detail */}
      <Content className="content">
        <h2>รายละเอียดเพิ่มเติม</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Order ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>หน่วย</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ราคา</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>รวมราคา</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>จำนวน</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {billingDetails.length > 0 ? (
              billingDetails.map((detail) => (
                <tr key={detail.product_id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.order_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.product_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.unit}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.price} บาท</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.total_price} บาท</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{detail.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '8px' }}>ไม่มีรายละเอียดเพิ่มเติม</td>
              </tr>
            )}
          </tbody>
        </table>
      </Content>

      {/* Footer */}
      <Footer className="footer">
        {/* Footer content */}
      </Footer>
    </Layout>
  );
};

export default Cart;
