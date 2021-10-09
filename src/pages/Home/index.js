import React, { useState } from 'react';
import { Button } from 'antd';

// import './style.less';

const HomePage = () => {
  const [num, setNum] = useState(0);

  return (
    <div className="page-home page-content">
      <div>
        <span>num值：{num}</span>
        <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={() => setNum(num + 1)}>
          +1
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
