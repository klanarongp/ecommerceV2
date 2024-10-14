import React, { useState } from 'react';
import { Layout, Form, Input, Button, Modal, Upload, message, Menu } from 'antd';
import { ShoppingCartOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Payment.css';
import bannerImage from '../assets/img1.png'; 

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const Payment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const location = useLocation();
  
  // Get products from location or localStorage
  const [productsInCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return location.state?.productsInCart || savedCart;
  });

  // Calculate total quantity and price
  const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);

  const onFinish = (values) => {
    console.log('Payment Info:', values);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    message.success('ระบบได้รับการยืนยันการชำระเงินแล้ว');
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Layout>
      {/* Navbar */}
      <Header className="header">
        <div className="menu-left">
          <Menu mode="horizontal" defaultSelectedKeys={['4']} className="menu-left">
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
          <h1>ชำระเงิน</h1>
        </div>
      </div>

      {/* Content */}
      <Content className="content" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px' }}>
        {/* Payment Form */}
        <div className="payment-form">
          <h2>ชื่อ / ที่อยู่จัดส่งสินค้า</h2>
          <Form
            name="payment_form"
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: '400px' }}
          >
            {['firstName', 'lastName', 'address', 'district', 'province', 'country', 'postalCode', 'phone', 'bankTransfer'].map((field, index) => (
              <Form.Item
                key={index}
                name={field}
                label={field === 'firstName' ? 'ชื่อ' : field === 'lastName' ? 'นามสกุล' : field}
                rules={[{ required: true, message: `กรุณากรอก${field}` }]}
              >
                <Input placeholder={field} />
              </Form.Item>
            ))}
          </Form>
        </div>

        {/* Cart Summary total */}        
        <div className="cart-summary"> 
          <h2>สรุปรายการสินค้า</h2>
          <div>
            {productsInCart.map((product) => (
              <div key={product.id} className="cart-item">
                <strong>{product.description}</strong> x {product.quantity} = { (product.price * product.quantity).toFixed(2) } บาท
              </div>
            ))}
          </div>
          <hr />
          <div>
            <strong>Total Products:</strong> {totalQuantity}
          </div>
          <div>
            <strong>Subtotal:</strong> {totalPrice.toFixed(2)} บาท
          </div>
          <Button type="primary" icon={<ShoppingCartOutlined />} block onClick={showModal}>
            Confirm Payment
          </Button>
        </div>
      </Content>

      {/* Modal for Payment Confirmation */}
      <Modal
        title="ยืนยันการชำระเงิน"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>อัพโหลดรูปสลิปการชำระเงิน</p>
        <Upload
          fileList={fileList}
          onChange={handleUpload}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>อัพโหลด</Button>
        </Upload>
        <p style={{ marginTop: '10px', color: 'red' }}>
          *หลังจากกดตกลง ระบบจะทำการยืนยันการชำระเงินภายใน 1 - 2 ชั่วโมง และจะจัดส่งของตามรอบของแต่ละวัน
        </p>
      </Modal>

      {/* Footer */}
      <Footer className="footer">
        <div className="footer-divider"></div>
        <div className="footer-section">
          <h2>Home</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="footer-section">
          <ul className="footer-menu">
            {[...Array(6).keys()].map((i) => (
              <li key={i}><Link to={`/menu${i + 1}`}>Menu {i + 1}</Link></li>
            ))}
          </ul>
        </div>
        <div className="footer-section contact-info">
          <h2>Contact Us</h2>
          <p>Email: contact@ourstore.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default Payment;
