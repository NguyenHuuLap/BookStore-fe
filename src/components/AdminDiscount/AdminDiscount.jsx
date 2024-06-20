import { Button, Form, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState, useEffect } from 'react';
import { WrapperHeader } from './style'; // Ensure this path is correct
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import * as DiscountService from '../../services/DiscountService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
import moment from 'moment';

const AdminDiscount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);

    const initialDiscountState = {
        code: '',
        percentage: '',
        startDate: '',
        endDate: '',
    };

    const [stateDiscount, setStateDiscount] = useState(initialDiscountState);
    const [stateDiscountDetails, setStateDiscountDetails] = useState(initialDiscountState);

    const [form] = Form.useForm();

    const mutationCreate = useMutationHooks((data) => {
        return DiscountService.createDiscount(data, user?.access_token);
    });

    const mutationUpdate = useMutationHooks((data) => {
        return DiscountService.updateDiscount(data.id, data, user?.access_token);
    });

    const mutationDelete = useMutationHooks((data) => {
        return DiscountService.deleteDiscount(data.id, user?.access_token);
    });

    const mutationDeleteMany = useMutationHooks((data) => {
        return DiscountService.deleteManyDiscounts(data.ids, user?.access_token);
    });

    const getAllDiscounts = async () => {
        const res = await DiscountService.getAllDiscounts();
        return res;
    };

    const fetchDiscountDetails = async (id) => {
        setIsLoadingUpdate(true);
        const res = await DiscountService.getDetailDiscount(id);
        if (res.status === 'OK') {
            setStateDiscountDetails({
                code: res.data.code,
                percentage: res.data.percentage,
                startDate: moment(res.data.startDate).format('YYYY-MM-DD'), 
                endDate: moment(res.data.endDate).format('YYYY-MM-DD'),     
            });
        }
        setIsLoadingUpdate(false);
    };

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateDiscountDetails);
        } else {
            form.setFieldsValue(initialDiscountState);
        }
    }, [form, stateDiscountDetails, isModalOpen]);

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchDiscountDetails(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsDiscount = () => {
        setIsOpenDrawer(true);
    };

    const handleDeleteManyDiscounts = (ids) => {
        mutationDeleteMany.mutate({ ids }, {
            onSettled: () => {
                queryDiscount.refetch();
            }
        });
    };

    const { data, isLoading } = mutationCreate;
    const { data: dataUpdated, isLoading: isLoadingUpdated } = mutationUpdate;
    const { data: dataDeleted, isLoading: isLoadingDeleted } = mutationDelete;
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany } = mutationDeleteMany;

    const queryDiscount = useQuery({ queryKey: ['discounts'], queryFn: getAllDiscounts });
    const { isLoading: isLoadingDiscounts, data: discounts } = queryDiscount;

    const renderAction = (record) => {
        return (
            <div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer', marginRight: '10px' }}
                    onClick={() => handleDeleteDiscount(record)}
                />
                <EditOutlined
                    style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => handleDetailsDiscount(record._id)}
                />
            </div>
        );
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('YYYY-MM-DD');
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            sorter: (a, b) => a.code.length - b.code.length,
            ...getColumnSearchProps('code')
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            sorter: (a, b) => a.percentage - b.percentage,
            ...getColumnSearchProps('percentage')
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            render: (startDate) => formatDate(startDate),
            ...getColumnSearchProps('startDate')
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
            render: (endDate) => formatDate(endDate),
            ...getColumnSearchProps('endDate')
        },
        {
            title: 'Action',
            dataIndex: '_id',
            render: (id) => renderAction({ _id: id })
        },
    ];

    const dataTable = discounts?.data?.length && discounts?.data?.map((discount) => {
        return { ...discount, key: discount._id };
    });

    useEffect(() => {
        if (data?.status === 'OK') {
            message.success('Create Discount successfully');
            setIsModalOpen(false);
            form.resetFields();
            queryDiscount.refetch();
        }
    }, [data]);

    useEffect(() => {
        if (dataDeletedMany?.status === 'OK') {
            message.success('Delete many discount successfully');
            queryDiscount.refetch();
        }
    }, [dataDeletedMany]);

    useEffect(() => {
        if (dataDeleted?.status === 'OK') {
            message.success('Delete discount successfully');
            setIsModalOpenDelete(false);
            queryDiscount.refetch();
        }
    }, [dataDeleted]);

    useEffect(() => {
        if (dataUpdated?.status === 'OK') {
            message.success('Update discount successfully');
            setIsOpenDrawer(false);
            form.resetFields();
            queryDiscount.refetch();
        }
    }, [dataUpdated]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDeleteDiscount = (record) => {
        setRowSelected(record._id);
        setIsModalOpenDelete(true);
    };

    const handleOkDelete = () => {
        mutationDelete.mutate({ id: rowSelected });
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const onFinish = (values) => {
        const params = {
            code: values.code,
            percentage: values.percentage,
            startDate: values.startDate,
            endDate: values.endDate,
        };
        mutationCreate.mutate(params);
    };

    const handleOnchange = (e) => {
        setStateDiscount({
            ...stateDiscount,
            [e.target.name]: e.target.value
        });
    };

    const handleOnchangeDetails = (e) => {
        setStateDiscountDetails({
            ...stateDiscountDetails,
            [e.target.name]: e.target.value
        });
    };

    const onUpdateDiscount = () => {
        mutationUpdate.mutate({ id: rowSelected, ...stateDiscountDetails });
    };

    return (
        <div>
            <WrapperHeader>Discount Management</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    handleDeleteMany={handleDeleteManyDiscounts}
                    columns={columns}
                    isLoading={isLoadingDiscounts}
                    data={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: () => setRowSelected(record._id)
                        };
                    }}
                />
            </div>
            <ModalComponent
                forceRender
                title="Create Discount"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Discount Code"
                            name="code"
                            rules={[{ required: true, message: 'Please enter the discount code!' }]}
                        >
                            <InputComponent onChange={handleOnchange} name="code" />
                        </Form.Item>

                        <Form.Item
                            label="Percentage"
                            name="percentage"
                            rules={[{ required: true, message: 'Please enter the discount percentage!' }]}
                        >
                            <InputComponent onChange={handleOnchange} name="percentage" />
                        </Form.Item>

                        <Form.Item
                            label="Start Date"
                            name="startDate"
                            rules={[{ required: true, message: 'Please enter the start date!' }]}
                        >
                            <InputComponent type="date" onChange={handleOnchange} name="startDate" />
                        </Form.Item>

                        <Form.Item
                            label="End Date"
                            name="endDate"
                            rules={[{ required: true, message: 'Please enter the end date!' }]}
                        >
                            <InputComponent type="date" onChange={handleOnchange} name="endDate" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent
                title="Discount Details"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="90%"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateDiscount}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[{ required: true, message: 'Please enter the discount code!' }]}
                        >
                            <InputComponent onChange={handleOnchangeDetails} name="code" />
                        </Form.Item>

                        <Form.Item
                            label="Percentage"
                            name="percentage"
                            rules={[{ required: true, message: 'Please enter the discount percentage!' }]}
                        >
                            <InputComponent onChange={handleOnchangeDetails} name="percentage" />
                        </Form.Item>

                        <Form.Item
                            label="Start Date"
                            name="startDate"
                            rules={[{ required: true, message: 'Please enter the start date!' }]}
                        >
                            <InputComponent type="date" onChange={handleOnchangeDetails} name="startDate" />
                        </Form.Item>

                        <Form.Item
                            label="End Date"
                            name="endDate"
                            rules={[{ required: true, message: 'Please enter the end date!' }]}
                        >
                            <InputComponent type="date" onChange={handleOnchangeDetails} name="endDate" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent
                title="Delete Discount"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleOkDelete}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Are you sure you want to delete this discount?</div>
                </Loading>
            </ModalComponent>
        </div>
    );
};

export default AdminDiscount;
