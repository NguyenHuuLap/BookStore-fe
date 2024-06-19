import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DatePicker, Typography } from 'antd';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Loading from '../LoadingComponent/Loading';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const statusMapping = {
  complete: 'Hoàn thành',
  pending: 'Chưa xác nhận',
  confirm: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
};

const OrderStatisticsPage = () => {
  const user = useSelector((state) => state?.user);
  const [dateRange, setDateRange] = useState([null, null]);

  const { data: orders, isLoading } = useQuery(['orders'], () =>
    OrderService.getAllOrder(user?.access_token)
  );

  const processData = (orders) => {
    const orderByStatus = { complete: 0, pending: 0, confirm: 0, shipping: 0 };
    const amountByStatus = { complete: 0, pending: 0, confirm: 0, shipping: 0 };
    const ordersByMonth = {};
    let totalAmount = 0;

    orders?.data.forEach((order) => {
      const orderDate = moment(order.createdAt);
      const [start, end] = dateRange;
      if (
        (!start || !end) ||
        (orderDate.isSameOrAfter(start, 'day') && orderDate.isSameOrBefore(end, 'day'))
      ) {
        const status = order.status;
        if (['pending', 'confirm', 'shipping', 'complete'].includes(status)) {
          orderByStatus[status]++;
          amountByStatus[status] += order.totalPrice;
          totalAmount += order.totalPrice;

          const month = orderDate.format('MMM YYYY');
          if (!ordersByMonth[month]) {
            ordersByMonth[month] = { complete: 0, pending: 0, confirm: 0, shipping: 0 };
          }
          ordersByMonth[month][status]++;
        }
      }
    });

    const chartData = Object.keys(ordersByMonth).map((month) => ({
      month,
      ...ordersByMonth[month],
    }));

    return { orderByStatus, chartData, totalAmount, amountByStatus };
  };

  const { orderByStatus, chartData, totalAmount, amountByStatus } = processData(orders || { data: [] });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <Loading isLoading={isLoading}>
      <div>
        <Title level={2}>Thống Kê Đơn Hàng</Title>
        <RangePicker
          onChange={(dates) => setDateRange(dates)}
          format="YYYY-MM-DD"
          style={{ marginBottom: '20px' }}
        />
        <h3>Số lượng đơn hàng theo trạng thái</h3>
        <ul>
          {Object.keys(orderByStatus).map((status) => (
            <li key={status}>
              {statusMapping[status]}: {orderByStatus[status]}
            </li>
          ))}
        </ul>
        <h3>Tổng số tiền theo trạng thái</h3>
        <ul>
          {Object.keys(amountByStatus).map((status) => (
            <li key={status}>
              {statusMapping[status]}: {formatCurrency(amountByStatus[status])}
            </li>
          ))}
        </ul>
        <h3>Tổng số tiền: {formatCurrency(totalAmount)}</h3>
        <h3>Đơn hàng theo tháng</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="complete" name={statusMapping.complete} fill="#82ca9d" />
            <Bar dataKey="pending" name={statusMapping.pending} fill="#8884d8" />
            <Bar dataKey="confirm" name={statusMapping.confirm} fill="#ffc658" />
            <Bar dataKey="shipping" name={statusMapping.shipping} fill="#d0ed57" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Loading>
  );
};

export default OrderStatisticsPage;
