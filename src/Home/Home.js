import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col, Card, Input, Dropdown, Modal, Button } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import bannerImage from '../assets/img1.png';
import categoryImage1 from '../assets/img2.png';
import categoryImage2 from '../assets/img3.png';
import categoryImage3 from '../assets/img4.png';

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // ฟังก์ชันดึง role ของผู้ใช้จาก backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (role) {
      setUserRole(role);
      console.log('User Role:', role); // ตรวจสอบค่าของ role
    } else {
      // ดึง role จาก API
      axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const fetchedRole = response.data.role;
        setUserRole(fetchedRole);
        localStorage.setItem('role', fetchedRole); // เซฟ role ใน localStorage
        console.log('Fetched User Role:', fetchedRole);
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
    }
  }, []);

  const handleLogout = () => {
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

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/product')
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
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} onClick={handleCartOpen} />
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
          <Button key="checkout" type="primary">Checkout</Button>
        ]}
      >
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.description} ราคา {item.price} บาท x {item.quantity} = {(item.price * item.quantity).toFixed(2)} บาท
              <Button type="link" onClick={() => removeFromCart(index)}>Remove</Button>
            </li>
          ))}
        </ul>
        <p>รวม : {calculateTotal().toFixed(2)} บาท</p>
      </Modal>

      <div className="banner-h">
        <img src={bannerImage} alt="Banner" className="banner-image" />
      </div>

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

      <Footer className="footer">
        <div className="footer-section">
          <h2>Home</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.</p>
        </div>
        <div className="footer-section">
          <ul className="footer-menu">
            <li><Link to="/menu1">Menu 1</Link></li>
            <li><Link to="/menu2">Menu 2</Link></li>
            <li><Link to="/menu3">Menu 3</Link></li>
            <li><Link to="/menu4">Menu 4</Link></li>
            <li><Link to="/menu5">Menu 5</Link></li>
            <li><Link to="/menu6">Menu 6</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>Email: example@example.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default Home;
