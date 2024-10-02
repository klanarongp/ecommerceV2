import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Table, Popconfirm, message, Modal, Form, Input as AntInput } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './ManageUsers.css'; // CSS สำหรับการจัดรูปแบบ

const { Header, Content, Footer } = Layout;

const ManageUsers = () => {
  const [users, setUsers] = useState([
    {
      key: '1',
      no: 1,
      username: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St, City, Country',
      phone: '012-345-6789',
    },
    {
      key: '2',
      no: 2,
      username: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Elm St, City, Country',
      phone: '987-654-3210',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false); // เพิ่ม state สำหรับ modal reset password
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = (key) => {
    const newUsers = users.filter((user) => user.key !== key);
    setUsers(newUsers);
    message.success('ลบผู้ใช้งานเรียบร้อยแล้ว');
  };

  const showEditModal = (record) => {
    setEditingUser(record);
    setIsModalVisible(true);
  };

  const handleEditOk = (values) => {
    const updatedUsers = users.map((user) => {
      if (user.key === editingUser.key) {
        return { ...user, ...values };
      }
      return user;
    });
    setUsers(updatedUsers);
    setIsModalVisible(false);
    message.success('แก้ไขผู้ใช้งานเรียบร้อยแล้ว');
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
  };

  const handleResetPasswordOk = (values) => {
    // Logic สำหรับรีเซ็ตรหัสผ่าน สามารถปรับตามความต้องการ
    message.success('รหัสผ่านถูกรีเซ็ตเรียบร้อยแล้ว');
    setIsResetPasswordVisible(false);
  };

  const handleResetPasswordCancel = () => {
    setIsResetPasswordVisible(false);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
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
      title: 'จัดการ',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => showEditModal(record)}>แก้ไข</Button>
          <Popconfirm
            title="คุณต้องการลบผู้ใช้งานนี้หรือไม่?"
            onConfirm={() => handleDelete(record.key)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="link" style={{ marginLeft: '8px' }}>ลบ</Button>
          </Popconfirm>
          <Button type="link" onClick={() => setIsResetPasswordVisible(true)}>รีเซ็ตรหัสผ่าน</Button> {/* เพิ่มปุ่มรีเซ็ตรหัสผ่าน */}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Header className="header">
        <div className="menu-left">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
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

      <Content style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>จัดการผู้ใช้งาน</h1>
        <div style={{ marginBottom: '20px' }}>
          <Input.Search placeholder="ค้นหาผู้ใช้งาน" style={{ width: '300px', marginRight: '10px' }} />
          <Button type="primary">เพิ่มผู้ใช้งาน</Button>
        </div>
        <Table columns={columns} dataSource={users} pagination={false} />
      </Content>

      {/* Modal สำหรับแก้ไขผู้ใช้งาน */}
      <Modal
        title="แก้ไขผู้ใช้งาน"
        visible={isModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingUser}
          onFinish={handleEditOk}
        >
          <Form.Item label="Username/Email" name="username">
            <AntInput />
          </Form.Item>
          <Form.Item label="ชื่อ" name="firstName">
            <AntInput />
          </Form.Item>
          <Form.Item label="นามสกุล" name="lastName">
            <AntInput />
          </Form.Item>
          <Form.Item label="ที่อยู่" name="address">
            <AntInput />
          </Form.Item>
          <Form.Item label="เบอร์โทร" name="phone">
            <AntInput />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleEditCancel}>ยกเลิก</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal สำหรับรีเซ็ตรหัสผ่าน */}
      <Modal
        title="รีเซ็ตรหัสผ่าน"
        visible={isResetPasswordVisible}
        onCancel={handleResetPasswordCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleResetPasswordOk}
        >
          <Form.Item label="รหัสผ่านใหม่" name="newPassword" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่านใหม่!' }]}>
            <AntInput.Password />
          </Form.Item>
          <Form.Item label="ยืนยันรหัสผ่าน" name="confirmPassword" rules={[{ required: true, message: 'กรุณายืนยันรหัสผ่าน!' }]}>
            <AntInput.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleResetPasswordCancel}>ยกเลิก</Button>
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

export default ManageUsers;
