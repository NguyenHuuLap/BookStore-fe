import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile, StyledCheckbox} from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')

    const [isChangePassword, setIsChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation

    console.log(data)

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnchangeCurrentPassword = (value) => {
        setCurrentPassword(value);
    }

    const handleOnchangeNewPassword = (value) => {
        setNewPassword(value);
    };

    const handleOnchangeConfirmNewPassword = (value) => {
        setConfirmNewPassword(value);
    };

    const handleOnChangeChangePasswordCheckbox = () => {
        setIsChangePassword(!isChangePassword);
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        const dataToUpdate = {
            id: user?.id,
            email,
            name,
            phone,
            address,
            avatar,
            access_token: user?.access_token
        };

        // Nếu người dùng chọn đổi mật khẩu mới, thêm các trường mật khẩu mới vào đối tượng dữ liệu
        if (isChangePassword) {
            dataToUpdate.currentPassword = currentPassword;
            dataToUpdate.newPassword = newPassword;
            dataToUpdate.confirmNewPassword = confirmNewPassword;
        }
        mutation.mutate(dataToUpdate);

    }
    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Tên đăng nhập</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone">Số điện thoại</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="phone" value={phone} onChange={handleOnchangePhone} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar">Ảnh đại diện</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar" />
                        )}
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="address" value={address} onChange={handleOnchangeAddress} />
                    </WrapperInput>
                    <WrapperInput>
                        <StyledCheckbox
                            id="changePassword"
                            checked={isChangePassword}
                            onChange={handleOnChangeChangePasswordCheckbox}
                        />
                        <label htmlFor="changePassword">Đổi mật khẩu</label>
                    </WrapperInput>
                    {isChangePassword && (
                        <>
                            <WrapperInput>
                                <WrapperLabel htmlFor="currentPassword">Mật khẩu hiện tại</WrapperLabel>
                                <InputForm
                                    placeholder='Mật khẩu hiện tại'
                                    style={{ width: '300px' }}
                                    id="currentPassword"
                                    // type="password"
                                    value={currentPassword}
                                    onChange={handleOnchangeCurrentPassword}
                                />
                            </WrapperInput>
                            <WrapperInput>
                                <WrapperLabel htmlFor="newPassword">Mật khẩu mới</WrapperLabel>
                                <InputForm
                                    placeholder='Nhập mật khẩu mới'
                                    style={{ width: '300px' }}
                                    id="newPassword"
                                    // type="password"
                                    value={newPassword}
                                    onChange={handleOnchangeNewPassword}
                                />
                            </WrapperInput>
                            <WrapperInput>
                                <WrapperLabel htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</WrapperLabel>
                                <InputForm
                                    placeholder='Xác nhận mật khẩu'
                                    style={{ width: '300px' }}
                                    id="confirmNewPassword"
                                    // type="password"
                                    value={confirmNewPassword}
                                    onChange={handleOnchangeConfirmNewPassword}
                                />
                            </WrapperInput>
                        </>
                    )}
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '40px', // Adjust height as needed
                            width: '120px', // Adjust width as needed
                            borderRadius: '4px',
                            padding: '8px', // Adjust padding as needed
                            marginTop: '10px', // Adjust margin-top as needed to change position
                            marginLeft: '210px', // Adjust margin-left as needed to change position
                            background: '#C92127',
                            border: '2px solid transparent'
                        }}
                        textbutton={'Lưu thay đổi'}
                        styleTextButton={{ color: 'white', fontSize: '16px', fontWeight: '700' }}
                    />
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage