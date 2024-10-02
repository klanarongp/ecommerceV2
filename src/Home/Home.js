// src/pages/Home.js

import React from 'react';
import { Layout, Menu, Row, Col, Card, Input } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Home.css';

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;

const Home = () => {
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
      <div className="banner">
        <h1>Welcome to Our Store</h1>
        <p>Find the best products for you</p>
      </div>

      {/* Content */}
      <Content className="content">
        {/* Product Categories */}
        <h2>Product Categories</h2>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div className="product-category-card">
              <h3>Category 1</h3>
              <p>Description of Category 1</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="product-category-card">
              <h3>Category 2</h3>
              <p>Description of Category 2</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="product-category-card">
              <h3>Category 3</h3>
              <p>Description of Category 3</p>
            </div>
          </Col>
        </Row>

        {/* Products */}
        <h2 style={{ marginTop: '50px' }}>Products</h2>
        <Row gutter={[16, 16]}>
          {Array.from({ length: 12 }, (_, i) => (
            <Col span={6} key={i}>
              <Card
                hoverable
                cover={<img alt={`Product ${i + 1}`} src={`https://via.placeholder.com/240?text=Product+${i + 1}`} />}
                className="product-card"
              >
                <Meta title={`Product ${i + 1}`} description={`Description of Product ${i + 1}`} />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      {/* Footer */}
      <Footer className="footer">
        {/* Left Section */}
        <div className="footer-section">
          <h2>Home</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.</p>
        </div>

        {/* Center Section */}
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

        {/* Right Section */}
        <div className="footer-section contact-info">
          <h2>Contact Us</h2>
          <p>Email: contact@ourstore.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 1234 Street Name, City, Country</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default Home;
