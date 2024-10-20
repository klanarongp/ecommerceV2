import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, Table, Popconfirm, message, Modal, Form, Input as AntInput, Select } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ManagePromotion.css';

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { Search } = Input;

const ManagePromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/promotions');
      setPromotions(response.data);
      console.log(response)
    } catch (error) {
      message.error('Error fetching promotions');
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAdd = async (values) => {
    console.log(values)
    try {
      await axios.post('http://localhost:3000/api/promotions', values);
      message.success('เพิ่มโปรโมชั่นเรียบร้อยแล้ว');
      fetchPromotions();
      setIsAddModalVisible(false);
    } catch (error) {
      message.error('Error adding promotion');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/promotions/${id}`);
      setPromotions(promotions.filter((promo) => promo.id !== id));
      message.success('ลบโปรโมชั่นเรียบร้อยแล้ว');
    } catch (error) {
      message.error('Error deleting promotion');
    }
  };

  const showEditModal = (record) => {
    setEditingPromotion(record);
    setIsEditModalVisible(true);
  };

  const handleEdit = async (values) => {
    try {
      await axios.put('http://localhost:3000/api/promotions', { ...values, id: editingPromotion.id });
      message.success('แก้ไขโปรโมชั่นเรียบร้อยแล้ว');
      // fetchPromotions();
      // setIsEditModalVisible(false);
      fetchPromotions();
      setIsEditModalVisible(false);
      setEditingPromotion(null); 
    } catch (error) {
      message.error('Error editing promotion');
    }
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setEditingPromotion(null);
  };

  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const columns = [
    { title: 'รายละเอียด', dataIndex: 'description', key: 'description' },
    { title: 'ส่วนลด', dataIndex: 'discount', key: 'discount' },
    { title: 'วันที่เริ่มต้น', dataIndex: 'start_duedate', key: 'start_duedate', render: (text) => formatDate(text) },
    { title: 'วันที่สิ้นสุด', dataIndex: 'end_duedate', key: 'end_duedate', render: (text) => formatDate(text) },
    { title: 'สถานะ', dataIndex: 'status', key: 'status' },
    {
      title: 'จัดการ',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => showEditModal(record)}>แก้ไข</Button>
          <Popconfirm
            title="คุณต้องการลบโปรโมชั่นนี้หรือไม่?"
            onConfirm={() => handleDelete(record.id)}
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
        <h1 style={{ textAlign: 'center' }}>จัดการโปรโมชั่น</h1>
        <div style={{ marginBottom: '20px' }}>
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>เพิ่มโปรโมชั่น</Button>
        </div>
        <Table columns={columns} dataSource={promotions} pagination={false} />
      </Content>

      {/* Add Modal */}
      <Modal
        title="เพิ่มโปรโมชั่น"
        visible={isAddModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item label="id" name="id" rules={[{ required: true, message: 'กรุณากรอก ID' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด!' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label=" ส่วนลด" name="discount" rules={[{ required: true, message: 'กรุณากรอกส่วนลด' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="วันที่เริ่มต้น" name="start_duedate" rules={[{ required: true, message: 'กรุณากรอกวันที่เริ่มต้น!' }]}>
            <AntInput type="date" />
          </Form.Item>
          <Form.Item label="วันที่สิ้นสุด" name="end_duedate" rules={[{ required: true, message: 'กรุณากรอกวันที่สิ้นสุด!' }]}>
            <AntInput type="date" />
          </Form.Item>
          <Form.Item label="สถานะ" name="status" rules={[{ required: true, message: 'กรุณาเลือกสถานะ!' }]}>
            <Select placeholder="เลือกสถานะ">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>ยกเลิก</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="แก้ไขโปรโมชั่น"
        visible={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingPromotion || {}}
          onFinish={handleEdit}
        >
          <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด!' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label=" ส่วนลด" name="discount" rules={[{ required: true, message: 'กรุณากรอกส่วนลด' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item label="วันที่เริ่มต้น" name="start_duedate" rules={[{ required: true, message: 'กรุณากรอกวันที่เริ่มต้น!' }]}>
            <AntInput type="date" />
          </Form.Item>
          <Form.Item label="วันที่สิ้นสุด" name="end_duedate" rules={[{ required: true, message: 'กรุณากรอกวันที่สิ้นสุด!' }]}>
            <AntInput type="date" />
          </Form.Item>
          <Form.Item label="สถานะ" name="status" rules={[{ required: true, message: 'กรุณาเลือกสถานะ!' }]}>
            <Select placeholder="เลือกสถานะ">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>ยกเลิก</Button>
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
          <h2>ลิงก์ที่เป็นประโยชน์</h2>
          <Menu theme="light" mode="vertical">
            <Menu.Item>ข้อตกลงการใช้งาน</Menu.Item>
            <Menu.Item>นโยบายความเป็นส่วนตัว</Menu.Item>
            <Menu.Item>การคืนเงิน</Menu.Item>
          </Menu>
        </div>
        <div className="footer-section">
          <h2>ติดต่อเรา</h2>
          <p>Email: contact@example.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default ManagePromotion;
