import React, { useEffect } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import InputForm from '../../components/InputForm/InputForm';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import imageLogo from '../../assets/image/logo-login.png';
import { Image } from 'antd';
import { useState } from 'react';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useSelector, useDispatch } from 'react-redux';

import { updateUser } from '../../redux/slides/userSlide';

import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
    setEmailError(false);
  };

  const mutation = useMutationHooks((data) => UserService.registerUser(data));

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.message === 'SUCCESS') {
      message.success('Đăng ký thành công!');
      handleNavigateLogin();
    } else if (isError) {
      message.error('Đăng ký thất bại!');
    }
  }, [isSuccess, isError]);

  const handleOnchangePassword = (value) => {
    setPassword(value);
    setPasswordError(false);
  };

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
    setConfirmPasswordError(false);
  };

  const handleNavigateLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    if (!email.trim()) {
      setEmailError(true);
    }
    if (!password.trim()) {
      setPasswordError(true);
    }
    if (!confirmPassword.trim()) {
      setConfirmPasswordError(true);
    }
    mutation.mutate({ email, password, confirmPassword });
  };

  // Handle registration when Enter key is pressed anywhere on the page
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSignUp();
      }
    };

    document.body.addEventListener('keypress', handleKeyPress);

    return () => {
      document.body.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleSignUp]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập vào tạo tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          {emailError && <span style={{ color: 'red', fontSize: '12px' }}>Vui lòng nhập email</span>}
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="password" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"}
              value={password} onChange={handleOnchangePassword} />
            {passwordError && <span style={{ color: 'red', fontSize: '12px' }}>Vui lòng nhập mật khẩu</span>}
          </div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowConfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="comfirm password" type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword} onChange={handleOnchangeConfirmPassword}
            />
            {confirmPasswordError && <span style={{ color: 'red', fontSize: '12px' }}>Vui lòng nhập lại mật khẩu</span>}
          </div>
          {/* {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>} */}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textbutton={'Đăng ký'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateLogin}> Đăng nhập</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" />
          <h4>Mua sắm tại BookStore</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default RegisterPage;
