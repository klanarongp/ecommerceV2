import React, { useState, useEffect } from 'react';
import { Layout, Form, Button, Modal, Upload, message, Menu, Image, Input } from 'antd';
import { ShoppingCartOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';
import bannerImage from '../assets/img1.png';
import Navbar from '../Components/Navbar/Navbar';
import slipImage from '../assets/slipImage.png';

const { Content, Footer } = Layout;

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
        
        axios.get('http://localhost:3000/users', {
          headers: {
            'authorization': `Bearer ${token}`
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
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.put('http://localhost:3000/addresses/update_address', values, {
        headers: {
          'authorization': `Bearer ${token}`
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

      const response = await axios.post('http://localhost:3000/billing', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
      });
        
        console.log('Payment confirmation response:', response.data);


        const orderId = response.data.data.order_id; 
        console.log('Fetched Order ID:', orderId); 
        
        const billingListPromises = productsInCart.map(async (product) => {
          const billingListData = {
            order_id: orderId, 
            product_id: product.id, 
            unit: product.unit || 1, 
            price: product.price,
            total_price: (product.price * product.quantity).toFixed(2),
            quantity: product.quantity,
          };
          console.log('Billing List Data:', billingListData); 
          return axios.post('http://localhost:3000/billingList', billingListData, {
            headers: {
              'authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
        });
  
        await Promise.all(billingListPromises);
        
        localStorage.removeItem('cart');
        setCart([]);
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


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Layout>

      <Navbar handleCartOpen={handleCartOpen} userMenu={userMenu} cartCount={cartCount} />

      <Modal
        title="Shopping Cart"
        visible={cartVisible}
        onCancel={handleCartClose}
        footer={[
          // <Link to="/Cart" key="cart">
          //   <Button onClick={handleCartClose}>Cart</Button>
          // </Link>,
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

          <div className="img-payment">
            <img src={slipImage} alt="Payment Slip" />
          </div>

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

      <Footer style={{ textAlign: 'center' }}>E-commerce ©2024 Created by Aoneiei</Footer>
      
    </Layout>
  );
};

export default Payment;
