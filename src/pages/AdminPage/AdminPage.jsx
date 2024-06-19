import React, { useState, useMemo } from 'react';
import { Menu } from 'antd';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, CommentOutlined, BarChartOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAmin';
import AdminComment from '../../components/AdminComment/AdminComment';
import OrderStatisticsPage from '../../components/AdminOrderStatisticsPage/AdminOrderStatisticsPage';
import * as OrderService from '../../services/OrderService';
import * as ProductService from '../../services/ProductService';
import * as UserService from '../../services/UserService';
import * as CommentService from '../../services/CommentService';
import CustomizedContent from './Components/CustomizedContent';
import { useSelector } from 'react-redux';
import { useQueries } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const AdminPage = () => {
  const user = useSelector((state) => state?.user);
  const [keySelected, setKeySelected] = useState('orders');

  const items = [
    { label: 'Người dùng', key: 'users', icon: <UserOutlined /> },
    { label: 'Sản phẩm', key: 'products', icon: <AppstoreOutlined /> },
    { label: 'Đơn hàng', key: 'orders', icon: <ShoppingCartOutlined /> },
    { label: 'Đánh giá', key: 'comment', icon: <CommentOutlined /> },
    { label: 'Thống kê đơn hàng', key: 'statistics', icon: <BarChartOutlined /> },
  ];

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return { data: res?.data, key: 'orders' };
  };

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return { data: res?.data, key: 'products' };
  };

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return { data: res?.data, key: 'users' };
  };

  const getAllComment = async () => {
    const res = await CommentService.getAllComment();
    return { data: res?.data, key: 'comment' };
  };

  const queries = useQueries({
    queries: [
      { queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 * 60 },
      { queryKey: ['users'], queryFn: getAllUsers, staleTime: 1000 * 60 },
      { queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 * 60 },
      { queryKey: ['comment'], queryFn: getAllComment, staleTime: 1000 * 60 },
    ],
  });

  const memoCount = useMemo(() => {
    const result = {};
    queries.forEach((query) => {
      if (query?.data) {
        result[query.data.key] = query.data.data?.length || 0;
      }
    });
    return result;
  }, [queries]);

  const COLORS = {
    users: ['#e66465', '#9198e5'],
    products: ['#a8c0ff', '#3f2b96'],
    orders: ['#11998e', '#38ef7d'],
    comment: ['#ff5f6d', '#ffc371'],
  };

  const renderPage = (key) => {
    switch (key) {
      case 'users':
        return <AdminUser />;
      case 'products':
        return <AdminProduct />;
      case 'orders':
        return <OrderAdmin />;
      case 'comment':
        return <AdminComment />;
      case 'statistics':
        return <OrderStatisticsPage />;
      default:
        return <></>;
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  const isLoading = queries.some((query) => query.isLoading);

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex', overflowX: 'hidden' }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: '1px 1px 2px #ccc',
            height: '100vh',
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
          <Loading isLoading={isLoading}>
            {!keySelected && <CustomizedContent data={memoCount} colors={COLORS} setKeySelected={setKeySelected} />}
          </Loading>
          {keySelected && renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
