import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, Table, message, Modal, Button, Dropdown, Row, Image, Col } from 'antd';
import { Link , useNavigate} from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import './Cart.css'; // CSS สำหรับการจัดรูปแบบ
import bannerImage from '../assets/img1.png';


const { Header, Content, Footer } = Layout;

const Cart = () => {
  const navigate = useNavigate();
  const [cartVisible, setCartVisible] = useState(false);
  const [payments, setPayments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [productsInCart, setProductsInCart] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [userRole] = useState(null);
  // const [billingDetails, setBillingDetails] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/billing/bill_user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
    });
        setPayments(response.data.dataBilling);
        
      } catch (error) {
        console.error('Error fetching payments:', error);
        message.error('ไม่สามารถดึงข้อมูลการชำระเงินได้');
      }
    };
    fetchPayments();
  }, []);

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setProductsInCart(storedCart);
    console.log("Stored Cart:", storedCart);

  }, [navigate]);

  const showSlipModal = (payment) => {
    setSelectedSlip(payment.img_bill);
    setIsModalVisible(true);
    setOrderDetail(payment.orderDetail || []);
  };

  
  const handleEditCancel = () => {
    setIsModalVisible(false);
    setSelectedSlip(null);
  };

    const handleRemoveProduct = (productId) => {
    const updatedProducts = productsInCart.filter((product) => product.id !== productId);
    setProductsInCart(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));
  };

  const totalPrice = productsInCart.reduce((total, product) => total + product.price * product.quantity, 0);
  // const totalQuantity = productsInCart.reduce((total, product) => total + product.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    navigate('/login');
};

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

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    // {
    //   title: 'Promotion',
    //   dataIndex: 'promotion_id',
    //   key: 'promotion_id',
    // },
    {
      title: 'จำนวน',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'ราคารวม',
      dataIndex: 'total_price',
      key: 'total_price',
    },
    {
      title: 'สลิป',
      key: 'img_bill',
      render: (text, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showSlipModal(record)}
        />
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
    },
  ];

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
          <h1>ประวัติการซื้อ</h1>
        </div>
      </div>

      <Row justify="center">
        <Col span={20}>
          <Content style={{ padding: '20px' }}>
            <Table columns={columns} dataSource={payments} pagination={false} />
          </Content>
        </Col>
      </Row>

      <Modal
        title="ตรวจสอบการชำระเงิน"
        visible={isModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <img
          src={selectedSlip}
          alt="img_bill"
          style={{
            width: '450px', // ปรับขนาดความกว้างของรูป
            height: '600px', // ให้ความสูงปรับตามอัตราส่วนของรูป
            marginBottom: '16px',
          }}
        />

        {/* แสดงรายละเอียดใต้รูปภาพสลิป */}
        {orderDetail.length > 0 ? (
          <div>
            <h3>รายละเอียดการสั่งซื้อ</h3>
            <Table
              dataSource={orderDetail}
              columns={[
                {
                  title: 'ชื่อสินค้า',
                  dataIndex: 'product_description',
                  key: 'product_description',
                },
                {
                  title: 'รหัสสินค้า',
                  dataIndex: 'product_id',
                  key: 'product_id',
                },
                {
                  title: 'จำนวน',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'ราคา',
                  dataIndex: 'price',
                  key: 'price',
                },
              ]}
              pagination={false} // ปิดการแบ่งหน้า
              rowKey="product_id" // ใช้ `product_id` เป็น key ในแต่ละแถว
            />
          </div>
        ) : (
          <p>ไม่พบข้อมูลรายการสั่งซื้อ</p>
        )}
        <Button type="default" onClick={handleEditCancel}>ยกเลิก</Button>
      </Modal>

      
      <Footer style={{ textAlign: 'center' }}>E-commerce ©2024 Created by Aoneiei</Footer>
    </Layout>
  );
};

export default Cart;
