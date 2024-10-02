import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Table, Popconfirm, message, Modal, Form, Input as AntInput, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './ManageProducts.css'; // CSS สำหรับการจัดรูปแบบ

const { Header, Content, Footer } = Layout;

const ManageProducts = () => {
  const [products, setProducts] = useState([
    {
      key: '1',
      image: 'https://via.placeholder.com/50',
      id: 'P001',
      name: 'สินค้า 1',
      details: 'รายละเอียดสินค้า 1',
      sizes: { S: '90 บาท', M: '100 บาท', L: '110 บาท', XL: '120 บาท' },
      stock: 10,
      sold: 5,
      status: 'พร้อมขาย',
    },
    {
      key: '2',
      image: 'https://via.placeholder.com/50',
      id: 'P002',
      name: 'สินค้า 2',
      details: 'รายละเอียดสินค้า 2',
      sizes: { S: '140 บาท', M: '150 บาท', L: '160 บาท', XL: '170 บาท' },
      stock: 3,
      sold: 10,
      status: 'ใกล้หมด',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = (key) => {
    const newProducts = products.filter((item) => item.key !== key);
    setProducts(newProducts);
    message.success('ลบสินค้าเรียบร้อยแล้ว');
  };

  const showEditModal = (record) => {
    setEditingProduct(record);
    setIsModalVisible(true);
  };

  const handleEditOk = (values) => {
    const updatedProducts = products.map((product) => {
      if (product.key === editingProduct.key) {
        return { ...product, ...values };
      }
      return product;
    });
    setProducts(updatedProducts);
    setIsModalVisible(false);
    message.success('แก้ไขสินค้าเรียบร้อยแล้ว');
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'รูปภาพ',
      dataIndex: 'image',
      render: (text) => <img src={text} alt="Product" style={{ width: '50px' }} />,
    },
    {
      title: 'รหัสสินค้า',
      dataIndex: 'id',
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'name',
    },
    {
      title: 'ขนาด',
      dataIndex: 'sizes',
      render: (sizes) => Object.keys(sizes).join(', '),
    },
    {
      title: 'ราคา',
      dataIndex: 'sizes',
      render: (sizes) => {
        if (!sizes) return null; // ตรวจสอบว่ามีค่า sizes หรือไม่
        return (
          <div>
            {Object.entries(sizes).map(([size, price]) => (
              <div key={size}>{size}: {price}</div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'จำนวนสต็อก',
      dataIndex: 'stock',
    },
    {
      title: 'ขายแล้ว',
      dataIndex: 'sold',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
    },
    {
      title: 'แก้ไข',
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => showEditModal(record)}>แก้ไข</Button>
          <Popconfirm
            title="คุณต้องการลบสินค้านี้หรือไม่?"
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
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1"><Link to="/ManageProducts">จัดการสินค้า</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/ManageUsers">จัดการผู้ใช้งาน</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/ManagePromotion">โปรโมชั่น</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/payment-verification">ตรวจสอบแจ้งชำระเงิน</Link></Menu.Item>
          </Menu>
        </div>
        <div className="menu-right">
          <Input.Search placeholder="ค้นหาสินค้า" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
          <UserOutlined style={{ fontSize: '24px', color: '#fff', marginLeft: '15px' }} />
        </div>
      </Header>

      <Content style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>จัดการสินค้า</h1>
        <div style={{ marginBottom: '20px' }}>
          <Input.Search placeholder="ค้นหาสินค้า" style={{ width: '300px', marginRight: '10px' }} />
          <Link to="/add-product">
            <Button type="primary">เพิ่มสินค้า</Button>
          </Link>
        </div>
        <Table columns={columns} dataSource={products} pagination={false} />
      </Content>

      <Modal
        title="แก้ไขสินค้า"
        visible={isModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={800} // ขนาดของ Modal
      >
        <Form
          layout="vertical"
          initialValues={{
            image: editingProduct?.image,
            id: editingProduct?.id,
            name: editingProduct?.name,
            details: editingProduct?.details,
            sizes: editingProduct?.sizes ? Object.entries(editingProduct.sizes).map(([size, price]) => `${size}: ${price}`).join(', ') : '', // ตรวจสอบค่า sizes
            stock: editingProduct?.stock,
          }}
          onFinish={handleEditOk}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="รูปภาพ" name="image">
                <AntInput placeholder="URL ของรูปภาพ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="รหัสสินค้า" name="id">
                <AntInput />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ชื่อสินค้า" name="name">
                <AntInput />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="รายละเอียด" name="details">
                <AntInput />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ขนาด" name="sizes">
                <AntInput placeholder="S, M, L, XL" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ราคา (ต่อขนาด)" name="sizes">
                <AntInput placeholder="ขนาด: ราคา เช่น S: 90 บาท, M: 100 บาท" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="จำนวนสต็อก" name="stock">
                <AntInput type="number" />
              </Form.Item>
            </Col>
          </Row>
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
          </ul>
        </div>
        <div className="footer-section">
          <h2>ติดต่อเรา</h2>
          <p>Email: contact@example.com</p>
          <p>Tel: 012-3456789</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default ManageProducts;
