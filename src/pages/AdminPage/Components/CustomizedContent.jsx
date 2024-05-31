import React from 'react';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, CommentOutlined } from '@ant-design/icons';

const CustomizedContent = ({ data, colors, setKeySelected }) => {
  return (
    <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
      {Object.keys(data).map((item) => {
        const color = colors[item] || ['#ccc', '#ddd']; // Default colors if item color is not defined

        return (
          <div
            key={item}
            style={{
              width: 300,
              background: `linear-gradient(${color[0]}, ${color[1]})`,
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
            onClick={() => setKeySelected(item)}
          >
            <span style={{ color: '#fff', fontSize: 30 }}>
              {item === 'users' && <UserOutlined />}
              {item === 'products' && <AppstoreOutlined />}
              {item === 'orders' && <ShoppingCartOutlined />}
              {item === 'comment' && <CommentOutlined />}
            </span>
            <span style={{ color: '#fff', fontSize: 30, fontWeight: 'bold', textTransform: 'uppercase' }}>{item}</span>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }}>{data[item]}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CustomizedContent;
