import React, { useState } from 'react';
import { Layout, Menu, Button, InputNumber, Row, Col, Image, Typography, Select, Input, Modal } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Details.css';

const { Header, Footer } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const Details = () => {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = () => {
    const product = {
      name: 'Product Name',
      price: 100,
      quantity,
    };
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

  return (
    <Layout>
      {/* Navbar */}
      <Header className="header">
        <div className="menu-left">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Home</Menu.Item>
          </Menu>
        </div>

        <div className="menu-center">
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="2">Menu 1</Menu.Item>
            <Menu.Item key="3">Menu 2</Menu.Item>
            <Menu.Item key="4">Menu 3</Menu.Item>
            <Menu.Item key="5">Menu 4</Menu.Item>
          </Menu>
        </div>

        <div className="menu-right">
          <Search placeholder="Search products" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff' }} onClick={handleCartOpen} />
          <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />
        </div>
      </Header>

      {/* Main Section */}
      <div className="details-container">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            {/* รูปขนาดเล็ก */}
            <Image src="https://s3-ap-southeast-1.amazonaws.com/pcms.production.mcshop/catalog/product/x/x/xxmssz23120-1_1.jpg" className="small-image" />
            <Image src="https://s3-ap-southeast-1.amazonaws.com/pcms.production.mcshop/catalog/product/x/x/xxmssz23120-1_1.jpg" className="small-image" />
          </Col>

          <Col span={10}>
            {/* รูปขนาดกลาง */}
            <Image src="https://s3-ap-southeast-1.amazonaws.com/pcms.production.mcshop/catalog/product/x/x/xxmssz23120-1_1.jpg" className="medium-image products-layout" />
          </Col>

          <Col span={8}>
            {/* ข้อมูลสินค้า */}
            <Title level={2}>Product Name</Title>
            <Text strong>Price: $100</Text>
            <p>Description of the product goes here...</p>

            <div className="size-section">
              <Text>Size:</Text>
              <Select defaultValue="M" style={{ width: 120 }}>
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
              </Select>
            </div>

            <div className="quantity-section">
              <Button onClick={handleDecrease}>-</Button>
              <InputNumber min={1} value={quantity} />
              <Button onClick={handleIncrease}>+</Button>
            </div>

            <Button type="primary" className="add-to-cart-btn" onClick={addToCart}>Add to Cart</Button>
          </Col>
        </Row>
      </div>

      {/* Modal สำหรับแสดงสินค้าในตะกร้า */}
      <Modal
        title="Shopping Cart"
        visible={cartVisible}
        onCancel={handleCartClose}
        footer={[
          <Button key="cart">Cart</Button>,
          <Button key="checkout" type="primary">Checkout</Button>
        ]}
      >
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price} x {item.quantity}
              <Button type="link" onClick={() => removeFromCart(index)}>Remove</Button>
            </li>
          ))}
        </ul>
        <p>Total: ${calculateTotal()}</p>
      </Modal>

      {/* Footer แบบหน้า Products */}
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

export default Details;
