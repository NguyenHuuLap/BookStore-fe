import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import InputForm from '../../components/InputForm/InputForm';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import imageLogo from '../../assets/image/logo-login.png';
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import * as message from '../../components/Message/Message';
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slides/userSlide';

const LoginPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.message === 'SUCCESS') {
      message.success('Đăng nhập thành công!');
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate('/');
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token));
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token));
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    } else if (isSuccess && data?.message === 'The password or user is incorrect') {
      message.error('Mật khẩu sai!');
    }
    else if (isSuccess && data?.message === 'The user is not defined') {
      message.error('Tài khoản không tồn tại!');
    } else if (isSuccess && data?.message === 'The account has been deleted') {
      message.error('Tài khoản đã bị khóa!');
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storage);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleNavigateRegister = () => {
    navigate('/register');
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
    setEmailError(false); // Reset email error when input changes
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
    setPasswordError(false); // Reset password error when input changes
  };

  const handleSignIn = () => {
    // Check if email or password is empty
    if (!email.trim()) {
      setEmailError(true);
    }
    if (!password.trim()) {
      setPasswordError(true);
    }

    // Proceed with sign-in if no errors
    if (!emailError && !passwordError) {
      mutation.mutate({
        email,
        password
      });
    }
  };

  // Handle sign-in when Enter key is pressed anywhere on the page
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSignIn();
      }
    };

    document.body.addEventListener('keypress', handleKeyPress);

    return () => {
      document.body.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleSignIn]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập vào tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />
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
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          {passwordError && <span style={{ color: 'red', fontSize: '12px' }}>Vui lòng nhập mật khẩu</span>}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textbutton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            />
          </Loading>
          <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
          <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateRegister}> Tạo tài khoản</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" />
          <h4>Mua sắm tại BookStore</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default LoginPage;