import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, Table, Popconfirm, message, Modal, Form, Input as AntInput, Pagination, Switch, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './ManageProducts.css';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/product');
        const updatedProducts = response.data.map(product => ({
          ...product,
          status: product.quantity < 5 ? "ใกล้หมด" : "พร้อมขาย",
        }));
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:3000/api/product/${key}`);
      const newProducts = products.filter((item) => item.id !== key);
      setProducts(newProducts);
      message.success('ลบสินค้าเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('ไม่สามารถลบสินค้าได้');
    }
  };

  const showEditModal = (record) => {
    setEditingProduct(record);
    setIsModalVisible(true);
  };

  const handleEditOk = async (values) => {
    console.log("Handle Edit Ok Values:", values);
    try {
      await axios.put(`http://localhost:3000/api/product/${editingProduct.id}`, values);
      const updatedProducts = products.map((product) => {
        if (product.id === editingProduct.id) {
          const updatedProduct = { ...product, ...values };
          updatedProduct.status = updatedProduct.quantity < 5 ? "ใกล้หมด" : "พร้อมขาย";
          return updatedProduct;
        }
        return product;
      });
      setProducts(updatedProducts);
      setIsModalVisible(false);
      message.success('แก้ไขสินค้าเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('ไม่สามารถแก้ไขสินค้าได้');
    }
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddOk = async (values) => {
    console.log("Handle Edit Ok Values:", values);
    const formData = new FormData();
    formData.append('img', fileList[0]); // ใช้ไฟล์จาก Upload
    formData.append('id', values.id);
    formData.append('description', values.description);
    formData.append('size', values.size);
    formData.append('price', values.price);
    formData.append('discount_price', values.discount_price);
    formData.append('quantity', values.quantity);
    formData.append('unit', values.unit);
    formData.append('type', values.type);
    formData.append('is_on_promotion', values.is_on_promotion ? 'true' : 'false');

    try {
        const response = await axios.post('http://localhost:3000/api/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const newProduct = { 
            ...response.data, 
            status: response.data.quantity < 5 ? "ใกล้หมด" : "พร้อมขาย" 
        };
        
        setProducts((prevProducts) => [...prevProducts, newProduct]); // อัปเดต state ของสินค้า

        // Reset modal และ fileList
        setIsAddModalVisible(false);
        setFileList([]);
        message.success('เพิ่มสินค้าเรียบร้อยแล้ว');
    } catch (error) {
        console.error('Error adding product:', error);
        message.error('ไม่สามารถเพิ่มสินค้าได้');
    }
};

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    setFileList([]); // Reset file list when modal is closed
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: 'รูปภาพ',
      dataIndex: 'img',
      render: (text) => <img src={text} alt="Product" style={{ width: '50px' }} />,
    },
    {
      title: 'รหัสสินค้า',
      dataIndex: 'id',
    },
    {
      title: 'คำอธิบาย',
      dataIndex: 'description',
    },
    {
      title: 'ขนาด',
      dataIndex: 'size',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
    },
    {
      title: 'ราคาลด',
      dataIndex: 'discount_price',
    },
    {
      title: 'จำนวน',
      dataIndex: 'quantity',
    },
    {
      title: 'หน่วย',
      dataIndex: 'unit',
    },
    {
      title: 'ประเภท',
      dataIndex: 'type',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
    },
    {
      title: 'โปรโมชั่น',
      dataIndex: 'is_on_promotion',
      render: (text) => (
        <span>{text ? 'เปิด' : 'ปิด'}</span>
      ),
    },
    {
      title: 'แก้ไข',
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => showEditModal(record)}>แก้ไข</Button>
          <Popconfirm
            title="คุณต้องการลบสินค้านี้หรือไม่?"
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

  const paginatedProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([file]); // Set file list when file is uploaded
      return false; // Prevent automatic upload
    },
    fileList,
  };

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
        <h1 style={{ textAlign: 'center' }}>จัดการสินค้า</h1>
        <div style={{ marginBottom: '20px' }}>
          <Input.Search placeholder="ค้นหาสินค้า" style={{ width: '300px', marginRight: '10px' }} />
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>เพิ่มสินค้า</Button>
        </div>
        <Table columns={columns} dataSource={paginatedProducts} pagination={false} />

        <Pagination
          current={currentPage}
          pageSize={productsPerPage}
          total={products.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center', marginTop: '20px' }}
        />

        <Modal
          title="แก้ไขสินค้า"
          visible={isModalVisible}
          onCancel={handleEditCancel}
          footer={null}
        >
          <Form
            initialValues={editingProduct}
            onFinish={handleEditOk}
            layout="vertical"
          >
            <Form.Item label="รหัสสินค้า" name="id" rules={[{ required: true, message: 'กรุณากรอกรหัสสินค้า!' }]}>
              <AntInput />
            </Form.Item>
            <Form.Item label="คำอธิบาย" name="description" rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย!' }]}>
              <AntInput />
            </Form.Item>
            <Form.Item label="ขนาด" name="size">
              <AntInput />
            </Form.Item>
            <Form.Item label="ราคา" name="price" rules={[{ required: true, message: 'กรุณากรอกราคา!' }]}>
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="ราคาลด" name="discount_price">
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="จำนวน" name="quantity" rules={[{ required: true, message: 'กรุณากรอกจำนวน!' }]}>
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="หน่วย" name="unit" rules={[{ required: true, message: 'กรุณากรอกหน่วย!' }]}>
              <AntInput />
            </Form.Item>
            <Form.Item label="ประเภท" name="type">
              <AntInput />
            </Form.Item>
            <Form.Item label="เปิดโปรโมชั่น" name="is_on_promotion" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">บันทึก</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="เพิ่มสินค้า"
          visible={isAddModalVisible}
          onCancel={handleAddCancel}
          footer={null}
        >
          <Form
            onFinish={handleAddOk}
            layout="vertical"
          >
            <Form.Item label="รหัสสินค้า" name="id" rules={[{ required: true, message: 'กรุณากรอกรหัสสินค้า!' }]}>
              <AntInput />
            </Form.Item>
            <Form.Item label="คำอธิบาย" name="description" rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย!' }]}>
              <AntInput />
            </Form.Item>
            <Form.Item label="ขนาด" name="size">
              <AntInput />
            </Form.Item>
            <Form.Item label="ราคา" name="price" rules={[{ required: true, message: 'กรุณากรอกราคา!' }]}>
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="ราคาลด" name="discount_price">
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="จำนวน" name="quantity" rules={[{ required: true, message: 'กรุณากรอกจำนวน!' }]}>
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="หน่วย" name="unit" rules={[{ required: true, message: 'กรุณากรอกหน่วย!' }]}>
              <AntInput />
            </Form.Item>
            <Form.Item label="ประเภท" name="type">
              <AntInput />
            </Form.Item>
            <Form.Item label="เปิดโปรโมชั่น" name="is_on_promotion" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="อัปโหลดรูปภาพ">
              <Upload {...uploadProps}>
                <Button>คลิกเพื่อลงไฟล์</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">เพิ่ม</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>

      <Footer style={{ textAlign: 'center' }}>E-commerce ©2024 Created by You</Footer>
    </Layout>
  );
};

export default ManageProducts;
