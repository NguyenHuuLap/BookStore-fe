import React from 'react'

const NotFoundPage = () => {
  const style = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      color: '#333',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    text: {
      fontSize: '1.2rem',
    },
    link: {
      marginTop: '1rem',
      display: 'inline-block',
      textDecoration: 'none',
      color: '#333',
      border: '1px solid #333',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
    },
  }

  return (
    <div style={style.container}>
      <h1 style={style.heading}>Oops!</h1>
      <p style={style.text}>Rất tiếc, chúng tôi không thể tìm thấy những gì bạn đang tìm kiếm.</p>
      <p style={style.text}>Error code: 404</p>
      <a href="/" style={style.link}>Quay lại trang chủ</a>
    </div>
  )
}

export default NotFoundPage