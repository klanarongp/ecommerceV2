import React, { useState } from 'react';
import { Layout, Menu, Table, Popconfirm, message, Modal, Select, Button, Input,Row,Col } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import './ManagePaymentVerification.css'; // CSS สำหรับการจัดรูปแบบ

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const ManagePaymentVerification = () => {
  const [payments, setPayments] = useState([
    {
      key: '1',
      no: 1,
      orderId: 'ORD123456',
      username: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St, City, Country',
      phone: '012-345-6789',
      slip: 'slip1.jpg', // ตัวอย่างชื่อไฟล์สลิป
      status: 'รอการตรวจสอบ',
    },
    {
      key: '2',
      no: 2,
      orderId: 'ORD123457',
      username: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Elm St, City, Country',
      phone: '987-654-3210',
      slip: 'slip2.jpg', // ตัวอย่างชื่อไฟล์สลิป
      status: 'รอการตรวจสอบ',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('รอการตรวจสอบ');

  const handleDelete = (key) => {
    const newPayments = payments.filter((payment) => payment.key !== key);
    setPayments(newPayments);
    message.success('ลบการแจ้งชำระเงินเรียบร้อยแล้ว');
  };

  const showSlipModal = (payment) => {
    setSelectedSlip(payment.slip);
    setEditingPayment(payment);
    setIsModalVisible(true);
    setSelectedStatus(payment.status); // ตั้งค่าสถานะเริ่มต้นใน Modal
  };

  const handleConfirm = () => {
    const updatedPayments = payments.map((payment) => {
      if (payment.key === editingPayment.key) {
        return { ...payment, status: selectedStatus };
      }
      return payment;
    });
    setPayments(updatedPayments);
    message.success('อัปเดตสถานะการชำระเงินเรียบร้อยแล้ว');
    setIsModalVisible(false); // ปิด Modal
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    setSelectedSlip(null);
    setEditingPayment(null);
    setSelectedStatus('รอการตรวจสอบ'); // รีเซ็ตสถานะเมื่อปิด Modal
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Username/Email',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'ที่อยู่',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'สลิป',
      key: 'slip',
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
    {
      title: 'จัดการ',
      key: 'action',
      render: (text, record) => (
        <div>
          <Popconfirm
            title="คุณต้องการลบการแจ้งชำระเงินนี้หรือไม่?"
            onConfirm={() => handleDelete(record.key)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="link" style={{ marginLeft: '8px' }}>ลบ</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Header className="header">
        <div className="menu-left">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['4']}>
            <Menu.Item key="1"><Link to="/ManageProducts">จัดการสินค้า</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/ManageUsers">จัดการผู้ใช้งาน</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/ManagePromotion">โปรโมชั่น</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/ManagePaymentVerification">ตรวจสอบแจ้งชำระเงิน</Link></Menu.Item>
          </Menu>
        </div>
        <div className="menu-right">
          <Input.Search placeholder="ค้นหาผู้ใช้งาน" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
          <UserOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
        </div>
      </Header>
      <Row justify="center"><Col span={20}>
      <Content style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>ตรวจสอบแจ้งชำระเงิน</h1>
        <Table columns={columns} dataSource={payments} pagination={false} />
      </Content>
      </Col></Row>
      <Modal
        title="ตรวจสอบการชำระเงิน"
        visible={isModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <img src={selectedSlip} alt="Slip" style={{ width: '100%', height: 'auto', marginBottom: '16px' }} />
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
      </Modal>
      <Footer className="footer">
        <div className="footer-divider"></div>
        <div className="footer-section">
          <h2>เกี่ยวกับเรา</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="footer-section">
          <ul className="footer-menu">
            <li><Link to="/menu1">เมนู 1</Link></li>
            <li><Link to="/menu2">เมนู 2</Link></li>
            <li><Link to="/menu3">เมนู 3</Link></li>
            <li><Link to="/menu4">เมนู 4</Link></li>
            <li><Link to="/menu5">เมนู 5</Link></li>
            <li><Link to="/menu6">เมนู 6</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>ติดต่อเรา</h2>
          <p>โทร: 012-345-6789</p>
          <p>อีเมล: info@example.com</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default ManagePaymentVerification;
