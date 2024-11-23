import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Layout, Menu, Table, Popconfirm, message, Modal, Select, Button, Dropdown, Row, Col } from 'antd';
import { Layout, Menu, Table, message, Modal, Select, Button, Dropdown, Row, Col } from 'antd';
import { Link , useNavigate} from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import './ManagePaymentVerification.css'; 

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const ManagePaymentVerification = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('รอการตรวจสอบ');
  const [orderDetail, setOrderDetail] = useState([]);
  const [userRole] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/billing');
        setPayments(response.data.dataBilling);
      } catch (error) {
        console.error('Error fetching payments:', error);
        message.error('ไม่สามารถดึงข้อมูลการชำระเงินได้');
      }
    };
    fetchPayments();
  }, []);

  // const handleDelete = (key) => {
  //   const newPayments = payments.filter(payment => payment.key !== key);
  //   setPayments(newPayments);
  //   message.success('ลบการแจ้งชำระเงินเรียบร้อยแล้ว');
  // };

  const showSlipModal = (payment) => {
    setSelectedSlip(payment.img_bill);
    setEditingPayment(payment);
    setIsModalVisible(true);
    setSelectedStatus(payment.status);
    setOrderDetail(payment.orderDetail || []);
  };

  const handleConfirm = async () => {
    try {
      await axios.put(`http://localhost:3000/billing/${editingPayment.order_id}`, {
        status: selectedStatus
      });
      const updatedPayments = payments.map(payment => {
        if (payment.key === editingPayment.key) {
          return { ...payment, status: selectedStatus };
        }
        return payment;
      });
      setPayments(updatedPayments);
      message.success('อัปเดตสถานะการชำระเงินเรียบร้อยแล้ว');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating payment status:', error);
      message.error('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    setSelectedSlip(null);
    setEditingPayment(null);
    setSelectedStatus('รอการตรวจสอบ');
  };

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
    // {
    //   title: 'จัดการ',
    //   key: 'action',
    //   render: (text, record) => (
    //     <div>
    //       <Popconfirm
    //         title="คุณต้องการลบการแจ้งชำระเงินนี้หรือไม่?"
    //         onConfirm={() => handleDelete(record.key)}
    //         okText="ใช่"
    //         cancelText="ไม่"
    //       >
    //         <Button type="link" style={{ marginLeft: '8px' }}>ลบ</Button>
    //       </Popconfirm>
    //     </div>
    //   ),
    // },
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
            <Menu.Item><Link to="/admin/ManageProducts">จัดการสินค้า</Link></Menu.Item>
            <Menu.Item><Link to="/admin/ManageUsers">จัดการผู้ใช้งาน</Link></Menu.Item>
            {/* <Menu.Item><Link to="/admin/ManagePromotion">จัดการโปรโมชั่น</Link></Menu.Item> */}
            <Menu.Item><Link to="/admin/ManagePaymentVerification">ตรวจสอบแจ้งชำระเงิน</Link></Menu.Item>
          </Menu>
        </div>

        <div className="menu-right">
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} />
          <Dropdown overlay={userMenu} trigger={['click']}>
            <UserOutlined style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </Header>

      <Row justify="center">
        <Col span={20}>
          <Content style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>ตรวจสอบแจ้งชำระเงิน</h1>
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
        <div className="modal-content">
          <div className="image-wrapper">
            <img src={selectedSlip} alt="img_bill" className="centered-image" />
          </div>

          {/* แสดงรายละเอียดใต้รูปภาพสลิป */}
          {orderDetail.length > 0 ? (
            <div>
              <h3>รายละเอียดการสั่งซื้อ</h3>
              {orderDetail.map((item, index) => (
                <div key={index}>
                  <p><strong>รหัสสินค้า:</strong> {item.product_id}</p>
                  <p><strong>จำนวน:</strong> {item.quantity}</p>
                  <p><strong>ราคา:</strong> {item.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>ไม่พบข้อมูลรายการสั่งซื้อ</p>
          )}

          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            <Option value="ยืนยัน">ยืนยัน</Option>
            <Option value="ไม่ถูกต้อง">ไม่ถูกต้อง</Option>
            <Option value="รอการตรวจสอบ">รอการตรวจสอบ</Option>
          </Select>
          <Button type="primary" onClick={handleConfirm} style={{ marginRight: '8px' }}>ยืนยัน</Button>
          <Button type="default" onClick={handleEditCancel}>ยกเลิก</Button>
        </div>
      </Modal>

      <Footer style={{ textAlign: 'center' }}>E-commerce ©2024 Created by Aoneiei</Footer>
    </Layout>
  );
};

export default ManagePaymentVerification;
