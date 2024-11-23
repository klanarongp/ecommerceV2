// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Modal, Image, Button, Menu } from 'antd';
// import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar/Navbar';
import Banner from '../Components/Banner/Banner';
import './Home.css';
// import bannerImage from '../assets/img1.png';
import categoryImage1 from '../assets/img2.png';
import categoryImage2 from '../assets/img3.png';
import categoryImage3 from '../assets/img4.png';

const { Content, Footer } = Layout;
const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (role) {
      setUserRole(role);
    } else {
      axios.get('http://localhost:3000/users', {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const fetchedRole = response.data.role;
        setUserRole(fetchedRole);
        localStorage.setItem('role', fetchedRole);
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/Cart">ประวัติการซื้อ</Link>
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

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

  useEffect(() => {
    axios.get('http://localhost:3000/product')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const filterProductsByCategory = (category) => {
    const filtered = products.filter(product => product.type === category);
    setFilteredProducts(filtered);
  };

  return (
    <Layout>
      <Navbar handleCartOpen={handleCartOpen} userMenu={userMenu} cartCount={cartCount} />

      <Modal
        title="Shopping Cart"
        visible={cartVisible}
        onCancel={handleCartClose}
        footer={[
          <Link to="/Payment" key="Payment">
            <Button onClick={handleCartClose} type="primary">Checkout</Button>
          </Link>
        ]}
        width={800} 
        style={{ maxHeight: '600px' }} 
      >
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <Image src={item.img} style={{ width: '50px', marginRight: '10px' }} /> 
              {item.description} ราคา {item.price} บาท x {item.quantity} = {(item.price * item.quantity).toFixed(2)} บาท
              <Button type="link" onClick={() => removeFromCart(index)}>Remove</Button>
            </li>
          ))}
        </ul>
        <p>รวม : {calculateTotal().toFixed(2)} บาท</p>
      </Modal>

      <Banner />

      <Content className="content">
        <h2>หมวดหมู่สินค้า</h2>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card
              hoverable
              cover={<img alt="Category 1" src={categoryImage1} className="category-image" />}
              className="product-category-card"
              onClick={() => filterProductsByCategory('เสื้อฮาวาย')}
            >
              <Meta title="เสื้อฮาวาย" />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={<img alt="Category 2" src={categoryImage2} className="category-image" />}
              className="product-category-card"
              onClick={() => filterProductsByCategory('เสื้อยืด')}
            >
              <Meta title="เสื้อยืด" />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={<img alt="Category 3" src={categoryImage3} className="category-image" />}
              className="product-category-card"
              onClick={() => filterProductsByCategory('เสื้อเชิต')}
            >
              <Meta title="เสื้อเชิต" />
            </Card>
          </Col>
        </Row>

        <h2 style={{ marginTop: '50px' }}>สินค้า</h2>
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col span={6} key={product.id}>
              <Link to={`/details/${product.id}`}>
                <Card
                  hoverable
                  cover={<img alt={product.description} src={product.img} />}
                  className="product-card"
                >
                  <Meta title={product.description} description={`ราคา: ${product.price} บาท`} />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center' }}>E-commerce ©2024 Created by Aoneiei</Footer>
    </Layout>
  );
};

export default Home;
