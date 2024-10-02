import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Table, Popconfirm, message, Modal, Form, Input as AntInput } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './ManagePromotion.css'; // CSS สำหรับการจัดรูปแบบ

const { Header, Content, Footer } = Layout;

const ManagePromotion = () => {
  const [promotions, setPromotions] = useState([
    {
      key: '1',
      no: 1,
      name: 'โปรโมชั่นลดราคา 10%',
      description: 'ลดราคา 10% สำหรับสินค้าทุกชิ้น',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'ใช้งานอยู่',
    },
    {
      key: '2',
      no: 2,
      name: 'ซื้อ 1 แถม 1',
      description: 'ซื้อ 1 แถม 1 สำหรับสินค้าเฉพาะ',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      status: 'สิ้นสุด',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const handleDelete = (key) => {
    const newPromotions = promotions.filter((promo) => promo.key !== key);
    setPromotions(newPromotions);
    message.success('ลบโปรโมชั่นเรียบร้อยแล้ว');
  };

  const showEditModal = (record) => {
    setEditingPromotion(record);
    setIsModalVisible(true);
  };

  const handleEditOk = (values) => {
    const updatedPromotions = promotions.map((promo) => {
      if (promo.key === editingPromotion.key) {
        return { ...promo, ...values };
      }
      return promo;
    });
    setPromotions(updatedPromotions);
    setIsModalVisible(false);
    message.success('แก้ไขโปรโมชั่นเรียบร้อยแล้ว');
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'ชื่อโปรโมชั่น',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'วันที่เริ่มต้น',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'วันที่สิ้นสุด',
      dataIndex: 'endDate',
      key: 'endDate',
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
          <Button type="link" onClick={() => showEditModal(record)}>แก้ไข</Button>
          <Popconfirm
            title="คุณต้องการลบโปรโมชั่นนี้หรือไม่?"
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
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['3']}>
            <Menu.Item key="1"><Link to="/ManageProducts">จัดการสินค้า</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/ManageUsers">จัดการผู้ใช้งาน</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/ManagePromotion">โปรโมชั่น</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/ManagePaymentVerification">ตรวจสอบแจ้งชำระเงิน</Link></Menu.Item>
          </Menu>
        </div>
        <div className="menu-right">
          <Input.Search placeholder="ค้นหาสินค้า" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
          <UserOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
        </div>
      </Header>

      <Content style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>จัดการโปรโมชั่น</h1>
        <div style={{ marginBottom: '20px' }}>
          <Button type="primary" onClick={() => showEditModal(null)}>เพิ่มโปรโมชั่น</Button>
        </div>
        <Table columns={columns} dataSource={promotions} pagination={false} />
      </Content>

      <Modal
        title={editingPromotion ? "แก้ไขโปรโมชั่น" : "เพิ่มโปรโมชั่น"}
        visible={isModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingPromotion}
          onFinish={handleEditOk}
        >
          <Form.Item label="ชื่อโปรโมชั่น" name="name" rules={[{ required: true, message: 'กรุณากรอกชื่อโปรโมชั่น!' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด!' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="วันที่เริ่มต้น" name="startDate" rules={[{ required: true, message: 'กรุณากรอกวันที่เริ่มต้น!' }]}>
            <AntInput type="date" />
          </Form.Item>
          <Form.Item label="วันที่สิ้นสุด" name="endDate" rules={[{ required: true, message: 'กรุณากรอกวันที่สิ้นสุด!' }]}>
            <AntInput type="date" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleEditCancel}>ยกเลิก</Button>
          </Form.Item>
        </Form>
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

export default ManagePromotion;
