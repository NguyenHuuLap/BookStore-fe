import styled  from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  }
`
export const WrapperStyleHeaderDilivery = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  };
  margin-bottom: 4px;
`

export const WrapperContainer = styled.div`
  width: 100%;
  background-color: #f5f5fa;
`

export const WrapperLeft = styled.div`
  width: 910px;
`

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
`
export const WrapperFooterItem = styled.div`
  display: flex;
  flex-direction : column;
  gap: 10px;
  border-top: 1px solid rgb(235, 235, 240);
  width: 100%;
  align-items:flex-end;
  padding-top: 10px;
`

export const WrapperHeaderItem = styled.div`
  display: flex;
  align-items:flex-start;
  height: 90px;
  width: 100%;
`

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 16px;
  background: #fff;
  margin-top: 12px;
  flex-direction: column;
  width: 950px;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 12px 12px #ccc;
`

export const WrapperStatus = styled.div`
  display:flex;
  align-item:flex-start;
  width: 100%;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(235, 235, 240);
  flex-direction:column;
`

export const orderStatusColors = {
  pending: {
    background: '#rgba(36, 137, 244, 0.2)',
    color: '#2489F4',
    borderColor: '#2489F4'
  },
  confirm: {
    background: '#rgba(53, 192, 124, 0.2)',
    color: '#35C07C',
    borderColor: '#35C07C'
  },
  shipping: {
    background: '#rgba(253, 126, 20, 0.2)',
    color: '#FD7E14',
    borderColor: '#FD7E14'
  },
  complete: {
    background: '#rgba(82, 196, 26, 0.2)',
    color: '#52C41A',
    borderColor: '#52C41A'
  },
  cancel: {
    background: '#rgba(255, 66, 78, 0.2)',
    color: '#FF4250',
    borderColor: '#FF4250'
  },
  're-cancel': {
    background: '#rgba(255, 66, 78, 0.2)',
    color: '#FF4250',
    borderColor: '#FF4250'
  }
};