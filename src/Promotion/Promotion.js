import React, { useState } from 'react';
import { Layout, Menu, Row, Col, Card, Input, Select, Pagination } from 'antd'; // เพิ่ม Pagination
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Promotion.css'; 


const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const { Option } = Select;

const Promotion = () => {
  const [sortOrder, setSortOrder] = useState('default');
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1); // สร้าง state สำหรับหน้า Pagination

  const products = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 1, // กำหนดราคาสุ่ม 1 - 100
    description: `Description of Product ${i + 1}`,
    image: `https://via.placeholder.com/240?text=Product+${i + 1}`,
    discount: Math.random() > 0.5 ? '-30%' : null // เพิ่มส่วนลดแบบสุ่ม
  }));

  // จัดเรียงสินค้า
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'lowToHigh') {
      return a.price - b.price;
    } else if (sortOrder === 'highToLow') {
      return b.price - a.price;
    } else {
      return a.id - b.id; // ค่าเริ่มต้นเรียงตาม ID
    }
  });

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handleProductsChange = (value) => {
    setProductsPerPage(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // คำนวณสินค้าที่จะแสดงต่อหน้า
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Layout>
      {/* Navbar */}
      <Header className="header">
        <div className="menu-left">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">Promotion</Menu.Item>
          </Menu>
        </div>

        <div className="menu-right">
          <Search placeholder="Search products" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff' }} />
          <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />
        </div>
      </Header>

      {/* Banner */}
      <div className="banner">
        <h1>Promotion Page</h1>
        <p>Find the best deals for you</p>
      </div>

      {/* Filter & Sorting Bar */}
      <div className="filter-sort-bar">
        <div className="filter-left">
          <h3>Filter</h3>
          <Select defaultValue={12} style={{ width: 120 }} onChange={handleProductsChange}>
            <Option value={6}>6 Products</Option>
            <Option value={12}>12 Products</Option>
            <Option value={18}>18 Products</Option>
          </Select>
        </div>
        <div className="filter-right">
          <h3>Show {productsPerPage} Products</h3>
          <Select defaultValue="default" style={{ width: 150 }} onChange={handleSortChange}>
            <Option value="default">Default</Option>
            <Option value="lowToHigh">Price: Low to High</Option>
            <Option value="highToLow">Price: High to Low</Option>
          </Select>
        </div>
      </div>

      {/* Products */}
      <Content className="content">
        <Row gutter={[16, 16]}>
          {currentProducts.map((product) => (
            <Col span={6} key={product.id}>
              <div className="product-wrapper">
                {product.discount && (
                  <div className="discount-badge">{product.discount}</div>
                )}
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image} />}
                  className="product-card"
                >
                  <Meta title={product.name} description={`Price: $${product.price}`} />
                </Card>
              </div>
            </Col>
          ))}
        </Row>
        
        {/* Pagination */}
        <Pagination
          current={currentPage}
          pageSize={productsPerPage}
          total={products.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center', marginTop: '20px' }}
        />
      </Content>

      {/* Footer */}
      <Footer className="footer">
        <div className="footer-divider"></div>
        <div className="footer-section">
          <h2>Home</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.</p>
        </div>
        <div className="footer-section">
          <ul className="footer-menu">
          <li><Link to="/menu1">Menu 1</Link></li>
            <li><Link to="/menu2">Menu 2</Link></li>
            <li><Link to="/menu3">Menu 3</Link></li>
            <li><Link to="/menu4">Menu 4</Link></li>
            <li><Link to="/menu5">Menu 5</Link></li>
            <li><Link to="/menu6">Menu 6</Link></li>
          </ul>
        </div>
        <div className="footer-section contact-info">
          <h2>Contact Us</h2>
          <p>Email: contact@ourstore.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 1234 Street Name, City, Country</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default Promotion;
