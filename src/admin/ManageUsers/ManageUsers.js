import React, { useEffect, useState } from 'react';
import { Layout, Menu, Input, Button, Table, Popconfirm, message, Modal, Form, Input as AntInput } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ManageUsers.css';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users'); // Update with your API endpoint
      setUsers(response.data);
    } catch (error) {
      message.error('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  const handleDelete = async (email) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${email}`); // Update with your API endpoint
      const newUsers = users.filter((user) => user.email !== email);
      setUsers(newUsers);
      message.success('ลบผู้ใช้งานเรียบร้อยแล้ว');
    } catch (error) {
      message.error('ไม่สามารถลบผู้ใช้งานได้');
      console.error(error);
    }
  };

  const showEditModal = (record) => {
    setEditingUser(record);
    setIsModalVisible(true);
  };

  const handleEditOk = async (values) => {
    try {
      await axios.put(`http://localhost:3000/api/address/${editingUser.email}`, values);
      const updatedUser = users.map((user) => (user.email === editingUser.email ? { ...user, ...values } : user));
      setUsers(updatedUser);
      setIsModalVisible(false);
      message.success('แก้ไขที่อยู่ผู้ใช้งานเรียบร้อยแล้ว');
    } catch (error) {
      message.error('ไม่สามารถแก้ไขที่อยู่ผู้ใช้งานได้');
      console.error(error);
    }
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddUserOk = async (userData) => {
    try {
      await axios.post('http://localhost:3000/api/users', userData);
      message.success('เพิ่มผู้ใช้งานเรียบร้อยแล้ว');
      setIsAddUserModalVisible(false);
      fetchUsers(); // Refresh users list
    } catch (error) {
      message.error('ไม่สามารถเพิ่มผู้ใช้งานได้');
      console.error(error);
    }
  };

  const handleAddUserCancel = () => {
    setIsAddUserModalVisible(false);
  };

  const handleResetPasswordOk = async (values) => {
    try {
      await axios.put(`http://localhost:3000/api/users/resetPassword`, { email: editingUser.email, password: values.newPassword });
      message.success('รหัสผ่านถูกรีเซ็ตเรียบร้อยแล้ว');
      setIsResetPasswordVisible(false);
    } catch (error) {
      message.error('ไม่สามารถรีเซ็ตรหัสผ่านได้');
      console.error(error);
    }
  };

  const handleResetPasswordCancel = () => {
    setIsResetPasswordVisible(false);
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'บ้านเลขที่',
      dataIndex: 'street_address',
      key: 'street_address',
    },
    {
      title: 'อำเภอ',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'จังหวัด',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'รหัสไปรษณีย์',
      dataIndex: 'postal_code',
      key: 'postal_code',
    },
    {
      title: 'ประเทศ',
      dataIndex: 'country',
      key: 'country',
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
            onConfirm={() => handleDelete(record.email)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="link" style={{ marginLeft: '8px' }}>ลบ</Button>
          </Popconfirm>
          <Button type="link" onClick={() => { setEditingUser(record); setIsResetPasswordVisible(true); }}>รีเซ็ตรหัสผ่าน</Button>
        </div>
      ),
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
            <Menu.Item><Link to="/admin/ManageProducts">จัดการสินค้า</Link></Menu.Item>
            <Menu.Item><Link to="/admin/ManageUsers">จัดการผู้ใช้งาน</Link></Menu.Item>
            <Menu.Item><Link to="/admin/ManagePromotion">จัดการโปรโมชั่น</Link></Menu.Item>
            <Menu.Item><Link to="/admin/ManagePaymentVerification">ตรวจสอบแจ้งชำระเงิน</Link></Menu.Item>
          </Menu>
        </div>

        <div className="menu-right">
          <Search placeholder="Search products" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} />
          <UserOutlined style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} />
        </div>
      </Header>

      <Content style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>จัดการผู้ใช้งาน</h1>
        <div style={{ marginBottom: '20px' }}>
          <Input.Search placeholder="ค้นหาผู้ใช้งาน" style={{ width: '300px', marginRight: '10px' }} />
          <Button type="primary" onClick={() => setIsAddUserModalVisible(true)}>เพิ่มผู้ใช้งาน</Button>
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
          <Form.Item label="Email" name="email">
            <AntInput />
          </Form.Item>
          <Form.Item label="บ้านเลขที่" name="street_address">
            <AntInput />
          </Form.Item>
          <Form.Item label="อำเภอ" name="city">
            <AntInput />
          </Form.Item>
          <Form.Item label="จังหวัด" name="state">
            <AntInput />
          </Form.Item>
          <Form.Item label="รหัสไปรษณีย์" name="postal_code">
            <AntInput />
          </Form.Item>
          <Form.Item label="ประเทศ" name="country">
            <AntInput />
          </Form.Item>
          <Form.Item label="เบอร์โทร" name="phone">
            <AntInput />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
            <Button style={{ marginLeft: '8px' }} onClick={handleEditCancel}>ยกเลิก</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal สำหรับเพิ่มผู้ใช้งาน */}
      <Modal
        title="เพิ่มผู้ใช้งานใหม่"
        visible={isAddUserModalVisible}
        onCancel={handleAddUserCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleAddUserOk}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'กรุณากรอกอีเมล' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="บ้านเลขที่" name="street_address" rules={[{ required: true, message: 'กรุณากรอกบ้านเลขที่' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="อำเภอ" name="city" rules={[{ required: true, message: 'กรุณากรอกอำเภอ' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="จังหวัด" name="state" rules={[{ required: true, message: 'กรุณากรอกจังหวัด' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="รหัสไปรษณีย์" name="postal_code" rules={[{ required: true, message: 'กรุณากรอกรหัสไปรษณีย์' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="ประเทศ" name="country" rules={[{ required: true, message: 'กรุณากรอกประเทศ' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="เบอร์โทร" name="phone" rules={[{ required: true, message: 'กรุณากรอกเบอร์โทร' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">เพิ่ม</Button>
            <Button style={{ marginLeft: '8px' }} onClick={handleAddUserCancel}>ยกเลิก</Button>
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
          <Form.Item label="รหัสผ่านใหม่" name="newPassword" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่านใหม่' }]}>
            <AntInput.Password />
          </Form.Item>
          <Form.Item label="ยืนยันรหัสผ่าน" name="confirmPassword" rules={[{ required: true, message: 'กรุณายืนยันรหัสผ่าน' }]}>
            <AntInput.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">รีเซ็ตรหัสผ่าน</Button>
            <Button style={{ marginLeft: '8px' }} onClick={handleResetPasswordCancel}>ยกเลิก</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Footer style={{ textAlign: 'center' }}>©2024 E-commerce</Footer>
    </Layout>
  );
};

export default ManageUsers;
