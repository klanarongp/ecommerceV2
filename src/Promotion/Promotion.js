import React, { useEffect, useState } from 'react';
import { Layout, Menu, Row, Col, Card, Input, Select, Pagination } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios'; // เรียกใช้ axios
import './Promotion.css'; 
import bannerImage from '../assets/img1.png'; 

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const { Option } = Select;

const Promotion = () => {
  const [sortOrder, setSortOrder] = useState('default');
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [onSaleProducts, setOnSaleProducts] = useState([]);

  useEffect(() => {
    const fetchOnSaleProducts = async () => {
      try {
        // ใช้ axios ดึงข้อมูลจาก API
        const response = await axios.get('http://localhost:3000/api/product/onsale');
        setOnSaleProducts(response.data.products); // เข้าถึงข้อมูลที่ต้องการ
      } catch (error) {
        console.error('Error fetching on-sale products:', error);
      }
    };

    fetchOnSaleProducts(); // เรียกใช้ฟังก์ชันดึงข้อมูล
  }, []);

  const sortedProducts = [...onSaleProducts].sort((a, b) => {
    if (sortOrder === 'lowToHigh') {
      return a.price - b.price;
    } else if (sortOrder === 'highToLow') {
      return b.price - a.price;
    } else {
      return a.id - b.id;
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Layout>
      <Header className="header">
        <div className="menu-left">
          <Menu mode="horizontal" defaultSelectedKeys={['2']} className="menu-left">
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
          <Search placeholder="Search products" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} />
          <UserOutlined style={{ fontSize: '24px', color: 'black' }} />
        </div>
      </Header>

      <div className="banner-b">
        <img src={bannerImage} alt="Banner" className="banner-b-image" />
        <div className="banner-text">
          <h1>โปรโมชั่น</h1>
        </div>
      </div>

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

      <Content className="content">
        <Row gutter={[16, 16]}>
          {currentProducts.map((product) => (
            <Col span={6} key={product.id}>
              <div className="product-wrapper">
                {product.discount && (
                  <div className="discount-badge">-{((product.price - product.discount_price) / product.price * 100).toFixed(0)}%</div>
                )}
                <Link to={`/PromotionDetails/${product.id}?discount=${product.discount_price}`}>
                  <Card
                    hoverable
                    cover={<img alt={product.description} src={product.img} />}
                    className="product-card"
                  >
                    <Meta title={product.description} description={`ราคา: $${product.price} (ตอนนี้: $${product.discount_price})`} />
                  </Card>
                </Link>

              </div>
            </Col>
          ))}
        </Row>
        
        <Pagination
          current={currentPage}
          pageSize={productsPerPage}
          total={sortedProducts.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center', marginTop: '20px' }}
        />
      </Content>

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
          <h2>Contact Us</h2>DetailsPromotion
          <p>Email: contact@ourstore.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 1234 Street Name, City, Country</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default Promotion;
