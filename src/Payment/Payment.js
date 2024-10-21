import React, { useState, useEffect } from 'react';
import { Layout, Form, Button, Modal, Upload, message, Menu, Dropdown, Image, Input } from 'antd';
import { ShoppingCartOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';
import bannerImage from '../assets/img1.png';

const { Header, Content, Footer } = Layout;

const Payment = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [productsInCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return location.state?.productsInCart || savedCart;
  });

  const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (role) {
        setUserRole(role);
        console.log('User Role:', role); 
      } else {
        
        axios.get('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          const fetchedRole = response.data.role;
          setUserRole(fetchedRole);
          localStorage.setItem('role', fetchedRole); 
          console.log('Fetched User Role:', fetchedRole);
        })
        .catch(error => {
          console.error('Error fetching user role:', error);
        });
      }
      
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(storedCart);

  }, []);
  

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

        formData.append('amount', totalQuantity); 
        formData.append('vat', vat);
        formData.append('promotion_id', promotion_id);
        formData.append('price', totalPrice); 
        formData.append('total_price', total_price);

        fileList.forEach((file) => {
            formData.append('img_bill', file.originFileObj);
        });

      // เรียก API เพื่อสร้าง billing และรับ order_id กลับมา
      const response = await axios.post('http://localhost:3000/api/billing', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
      });
        
        console.log('Payment confirmation response:', response.data);


        const orderId = response.data.data.order_id; // ดึง order_id จาก response.data.data
        console.log('Fetched Order ID:', orderId); // ตรวจสอบ order_id
        
        const billingListPromises = productsInCart.map(async (product) => {
          const billingListData = {
            order_id: orderId, // ใช้ order_id ที่ได้รับจาก API
            product_id: product.id, // สมมติว่า product มี id
            unit: product.unit || 1, // กำหนดค่า default สำหรับ unit
            price: product.price,
            total_price: (product.price * product.quantity).toFixed(2),
            quantity: product.quantity,
          };
          console.log('Billing List Data:', billingListData); // เช็คข้อมูลที่ส่ง
          return axios.post('http://localhost:3000/api/billingList', billingListData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
        });
  
        await Promise.all(billingListPromises); // รอให้ข้อมูลทั้งหมดถูกส่งเรียบร้อย

        console.log('Payment confirmation response:', response.data);
        message.success('ระบบได้รับการยืนยันการชำระเงินแล้ว');
        setIsModalVisible(false);
        setFileList([]);
    } catch (error) {
        console.error('Error confirming payment:', error);
        message.error('เกิดข้อผิดพลาดในการยืนยันการชำระเงิน');
    }

};
  const handleLogout = () => {
    // ล้างข้อมูล token และ role ออกจาก localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // นำไปที่หน้า Login หลังจากล้างข้อมูล
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
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);


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

      {/*Payment Confirmation */}
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
