import React, { useState } from 'react';
import { Layout, Form, Input, Button, Modal, Upload, message, Menu } from 'antd';
import { ShoppingCartOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Payment.css';

const { Header, Content, Footer } = Layout;

const Payment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [productsInCart] = useState([
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      quantity: 2,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 150,
      quantity: 1,
    },
    {
      id: 3,
      name: 'Product 3',
      price: 200,
      quantity: 3,
    },
  ]);

  const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);

  const onFinish = (values) => {
    console.log('Payment Info:', values);
  };

  const showModal = () => {
    setIsModalVisible(true); // เปิด Modal เมื่อกดปุ่ม
  };

  const handleOk = () => {
    message.success('ระบบได้รับการยืนยันการชำระเงินแล้ว');
    setIsModalVisible(false); // ปิด Modal เมื่อยืนยัน
  };

  const handleCancel = () => {
    setIsModalVisible(false); // ปิด Modal เมื่อกดยกเลิก
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Layout>
      {/* Navbar */}
      <Header className="header">
        <div className="menu-left">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/products">Products</Link></Menu.Item>
          </Menu>
        </div>
        <div className="menu-right">
          <Input.Search placeholder="Search products" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
          <UserOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
        </div>
      </Header>

      {/* Banner */}
      <div className="banner">
        <h1>Payment</h1>
        <p>Please fill in your details to complete the purchase.</p>
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
            <Form.Item
              name="firstName"
              label="ชื่อ"
              rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
            >
              <Input placeholder="ชื่อ" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="นามสกุล"
              rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
            >
              <Input placeholder="นามสกุล" />
            </Form.Item>

            <Form.Item
              name="address"
              label="ที่อยู่"
              rules={[{ required: true, message: 'กรุณากรอกที่อยู่' }]}
            >
              <Input placeholder="ที่อยู่" />
            </Form.Item>

            <Form.Item
              name="district"
              label="เขต/อำเภอ"
              rules={[{ required: true, message: 'กรุณากรอกเขต/อำเภอ' }]}
            >
              <Input placeholder="เขต/อำเภอ" />
            </Form.Item>

            <Form.Item
              name="province"
              label="จังหวัด"
              rules={[{ required: true, message: 'กรุณากรอกจังหวัด' }]}
            >
              <Input placeholder="จังหวัด" />
            </Form.Item>

            <Form.Item
              name="country"
              label="ประเทศ"
              rules={[{ required: true, message: 'กรุณากรอกประเทศ' }]}
            >
              <Input placeholder="ประเทศ" />
            </Form.Item>

            <Form.Item
              name="postalCode"
              label="รหัสไปรษณีย์"
              rules={[{ required: true, message: 'กรุณากรอกรหัสไปรษณีย์' }]}
            >
              <Input placeholder="รหัสไปรษณีย์" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="เบอร์โทรศัพท์"
              rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
            >
              <Input placeholder="เบอร์โทรศัพท์" />
            </Form.Item>

            {/* โอนผ่านธนาคาร */}
            <Form.Item
              name="bankTransfer"
              label="โอนผ่านธนาคาร"
              rules={[{ required: true, message: 'กรุณาเลือกวิธีการชำระเงิน' }]}
            >
              <Input placeholder="โอนผ่านธนาคาร" />
            </Form.Item>
          </Form>
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>สรุปรายการสินค้า</h2>
          <div>
            {productsInCart.map((product) => (
              <div key={product.id} className="cart-item">
                <strong>{product.name}</strong> x {product.quantity} = ${product.price * product.quantity}
              </div>
            ))}
          </div>
          <hr />
          <div>
            <strong>Total Products:</strong> {totalQuantity}
          </div>
          <div>
            <strong>Subtotal:</strong> ${totalPrice}
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
          beforeUpload={() => false} // หยุดการอัปโหลดอัตโนมัติ
        >
          <Button icon={<UploadOutlined />}>อัพโหลด</Button>
        </Upload>
        <p style={{ marginTop: '10px', color: 'red' }}>
          *หลังจากกดตกลง ระบบจะทำการยืนยันการชำระเงินภายใน 1 - 2 ชั่วโมง และจะจัดส่งของตามรอบของแต่ละวัน
        </p>
        <p style={{ marginTop: '-10px', color: 'red' }}>
          *กรณีที่ยืนยันการชำระเงินไม่ผ่าน ระบบจะแจ้งหน้า ตระกร้า
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
            <li><Link to="/menu1">Menu 1</Link></li>
            <li><Link to="/menu2">Menu 2</Link></li>
            <li><Link to="/menu3">Menu 3</Link></li>
            <li><Link to="/menu4">Menu 4</Link></li>
            <li><Link to="/menu5">Menu 5</Link></li>
            <li><Link to="/menu6">Menu 6</Link></li>
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
