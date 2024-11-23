// // src/components/Banner.js
// import React from 'react';
// import bannerImage from '../../assets/img1.png';  // เปลี่ยนตามที่คุณใช้
// import './Banner.css';

// const Banner = () => {
//   return (
//     <div className="banner-h">
//       <img src={bannerImage} alt="Banner" className="banner-image" />
//     </div>
//   );
// };

// export default Banner;


import React from 'react';
import { Carousel } from 'antd';
import bannerImage1 from '../../assets/img1.png'; // เปลี่ยนตามที่คุณใช้
import bannerImage2 from '../../assets/banner2.png';
import bannerImage3 from '../../assets/banner3.png';
import './Banner.css';

const Banner = () => {
  return (
    <Carousel autoplay className="banner-carousel">
      <div>
        <img src={bannerImage1} alt="Banner 1" className="banner-image" />
      </div>
      <div>
        <img src={bannerImage2} alt="Banner 2" className="banner-image" />
      </div>
      <div>
        <img src={bannerImage3} alt="Banner 3" className="banner-image" />
      </div>
    </Carousel>
  );
};

export default Banner;
