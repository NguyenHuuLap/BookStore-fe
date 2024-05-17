import { Button, Form, Space } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../utils'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as CommentService from '../../services/CommentService'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

const AdminComment = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);

  const [stateCommentDetails, setStateCommentDetails] = useState({
    nameUser: '',
    nameProduct: '',
    comment: '',
    star: '',
  })

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = CommentService.updateComment(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = CommentService.deleteManyComment(
        ids,
        token)
      return res
    },
  )

  const handleDelteManyComment = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = CommentService.deleteComment(
        id,
        token)
      return res
    },
  )

  const getAllUser = async () => {
    const res = await CommentService.getAllComment()
    return res
  }

  const fetchGetDetailsComment = async (rowSelected) => {
    const res = await CommentService.getDetailsComment(rowSelected)
    if (res?.data) {
      setStateCommentDetails({
        nameUser: res?.data?.nameUser,
        nameProduct: res?.data?.nameProduct,
        comment: res?.data?.comment,
        star: res?.data?.star,
        
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateCommentDetails)
  }, [form, stateCommentDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsComment(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsComment = () => {
    setIsOpenDrawer(true)
  }

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  // const queryClient = useQueryClient()
  // const users = queryClient.getQueryData(['users'])
  // const isFetchingUser = useIsFetching(['users'])
  const queryUser = useQuery({queryKey: ['comment'], queryFn: getAllUser})
  const { isLoading: isLoadingComment, data: comment } = queryUser
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsComment} />
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'nameUser',
      sorter: (a, b) => a.nameUser.length - b.nameUser.length,
      ...getColumnSearchProps('nameUser')
    },
    {
      title: 'Name',
      dataIndex: 'nameProduct',
      sorter: (a, b) => a.nameProduct.length - b.nameProduct.length,
      ...getColumnSearchProps('nameProduct')
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      sorter: (a, b) => a.comment.length - b.comment.length,
      ...getColumnSearchProps('comment')
    },
    {
      title: 'start',
      dataIndex: 'start',
      sorter: (a, b) => a.start - b.start,
      ...getColumnSearchProps('start')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = comment?.data?.length > 0 && comment?.data?.map((comment) => {
    return { ...comment, key: comment._id }
  })

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDelectedMany])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      nameUser: '',
      nameProduct: '',
      comment: '',
      star: '',
    })
    form.resetFields()
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteComment = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
       queryUser.refetch()
      }
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateCommentDetails({
      ...stateCommentDetails,
      [e.target.name]: e.target.value
    })
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateCommentDetails }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý đánh giá</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDelteMany={handleDelteManyComment} columns={columns} isLoading={isLoadingComment} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <DrawerComponent title='Chi tiết đánh giá' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>

          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="nameUser"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateCommentDetails['nameUser']} onChange={handleOnchangeDetails} name="nameUser" />
            </Form.Item>

            <Form.Item
              label="nameProduct"
              name="nameProduct"
              rules={[{ required: true, message: 'Please input your nameProduct!' }]}
            >
              <InputComponent value={stateCommentDetails['nameProduct']} onChange={handleOnchangeDetails} name="nameProduct" />
            </Form.Item>
            <Form.Item
              label="comment"
              name="comment"
              rules={[{ required: true, message: 'Please input your  comment!' }]}
            >
              <InputComponent value={stateCommentDetails.comment} onChange={handleOnchangeDetails} name="comment" />
            </Form.Item>

            <Form.Item
              label="star"
              name="star"
              rules={[{ required: true, message: 'Please input your  star!' }]}
            >
              <InputComponent value={stateCommentDetails.star} onChange={handleOnchangeDetails} name="star" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent title="Xóa đánh giá" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteComment}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa đánh giá này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminComment