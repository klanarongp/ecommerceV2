import React, { useEffect, useState } from 'react';
import { Layout, Menu, Row, Col, Card, Select, Pagination, Dropdown ,Modal ,Button,Image} from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Promotion.css'; 
import bannerImage from '../assets/img1.png'; 

const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Option } = Select;

const Promotion = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [cartVisible, setCartVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchOnSaleProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/product/onsale');
        setOnSaleProducts(response.data.products); 
      } catch (error) {
        console.error('Error fetching on-sale products:', error);
      }
    };

    fetchOnSaleProducts(); 
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (role) {
      setUserRole(role);
      console.log('User Role:', role); 
    } else {
      
      axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const fetchedRole = response.data.role;
        setUserRole(fetchedRole);
        localStorage.setItem('role', fetchedRole); 
        console.log('Fetched User Role:', fetchedRole);
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);


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

  const handleLogout = () => {
    // ล้างข้อมูล token และ role ออกจาก localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // นำไปที่หน้า Login หลังจากล้างข้อมูล
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

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

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
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} onClick={handleCartOpen} />
            <Dropdown overlay={userMenu} trigger={['click']}>
              <UserOutlined style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} />
            </Dropdown>
        </div>
      </Header>

      <Modal
        title="Shopping Cart"
        visible={cartVisible}
        onCancel={handleCartClose}
        footer={[
          // <Link to="/Cart" key="cart">
          //   <Button onClick={handleCartClose}>Cart</Button>
          // </Link>,
          <Link to="/Payment" key="Payment">
            <Button onClick={handleCartClose} type="primary">Checkout</Button>
          </Link>
          
        ]}
        width={800} 
        style={{ maxHeight: '600px' }} 
      >
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <Image src={item.img} style={{ width: '50px', marginRight: '10px' }} /> 
              {item.description} ราคา {item.price} บาท x {item.quantity} = {(item.price * item.quantity).toFixed(2)} บาท
              <Button type="link" onClick={() => removeFromCart(index)}>Remove</Button>
            </li>
          ))}
        </ul>
        <p>รวม : {calculateTotal().toFixed(2)} บาท</p>
      </Modal>

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

      <Footer style={{ textAlign: 'center' }}>E-commerce ©2024 Created by Aoneiei</Footer>

    </Layout>
  );
};

export default Promotion;
