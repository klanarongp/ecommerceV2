import React, { useState } from 'react';
import { Layout, Form, Input, Button, Modal, Upload, message, Menu } from 'antd';
import { ShoppingCartOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';
import bannerImage from '../assets/img1.png';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const Payment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const location = useLocation();
  const [productsInCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return location.state?.productsInCart || savedCart;
  });

  const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/address', values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response:', response.data);
      message.success('ข้อมูลที่อยู่จัดส่งถูกส่งเรียบร้อยแล้ว');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error sending address:', error);
      message.error('เกิดข้อผิดพลาดในการส่งข้อมูลที่อยู่');
    }
  };

  const handleOk = async () => {
    try {
        const formData = new FormData();
        const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);
        const vat = totalPrice * 0.07; 
        const promotion_id = null; 
        const total_price = totalPrice + vat;

        // Append billing information
        formData.append('amount', totalQuantity); 
        formData.append('vat', vat);
        formData.append('promotion_id', promotion_id);
        formData.append('price', totalPrice); 
        formData.append('total_price', total_price);

        // Append uploaded files
        fileList.forEach((file) => {
            formData.append('img_bill', file.originFileObj);
        });

        const response = await axios.post('http://localhost:3000/api/billing', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // เพิ่ม Authorization header
            },
        });

        console.log('Payment confirmation response:', response.data);
        message.success('ระบบได้รับการยืนยันการชำระเงินแล้ว');
        setIsModalVisible(false);
        setFileList([]);
    } catch (error) {
        console.error('Error confirming payment:', error);
        message.error('เกิดข้อผิดพลาดในการยืนยันการชำระเงิน');
    }

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
            {[ 'street_address', 'city', 'state', 'postal_code', 'country', 'phone'].map((field, index) => (
              <Form.Item
                key={index}
                name={field}
                label={
                  field === 'street_address' ? 'ที่อยู่' :
                  field === 'city' ? 'อำเภอ' :
                  field === 'state' ? 'จังหวัด' :
                  field === 'postal_code' ? 'รหัสไปรษณีย์' :
                  field === 'country' ? 'ประเทศ' :
                  field === 'phone' ? 'หมายเลขโทรศัพท์' :
                  field
                }
                rules={[ 
                  { required: true, message: `กรุณากรอก${field}` },
                  ...(field === 'phone' ? [{ pattern: /^[0-9]{10}$/, message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง' }] : []),
                ]}
              >
                <Input
                  placeholder={
                    field === 'street_address' ? 'กรุณากรอกที่อยู่' :
                    field === 'city' ? 'กรุณากรอกเมือง' :
                    field === 'state' ? 'กรุณากรอกรัฐ' :
                    field === 'postal_code' ? 'กรุณากรอกรหัสไปรษณีย์' :
                    field === 'country' ? 'กรุณากรอกประเทศ' :
                    field === 'phone' ? 'กรุณากรอกหมายเลขโทรศัพท์' :
                    'กรุณากรอก ' + field
                  }
                />
              </Form.Item>
            ))}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Address
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>สรุปรายการสินค้า</h2>
          <div>
            {productsInCart.map((product) => (
              <div key={product.id} className="cart-item">
                <strong>{product.description}</strong> x {product.quantity} = {(product.price * product.quantity).toFixed(2)} บาท
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
          <Button type="primary" icon={<ShoppingCartOutlined />} block onClick={() => setIsModalVisible(true)}>
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
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p>Email: example@example.com</p>
          <p>Phone: +123456789</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default Payment;
