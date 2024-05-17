import styled from "styled-components";
import { Upload } from "antd";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 18px;
    margin: 4px 0;
`;

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 700px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    gap: 30px;
`;

export const WrapperLabel = styled.label`
    color: #000;
    font-size: 12px;
    line-height: 30px;
    font-weight: 600;
    height: 50px;  
    width: 100px;
    text-align: left;
`;

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
`;

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-info {
        display: none;
    }
`;

export const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    position: relative;
    cursor: pointer;

    &:checked {
        background-color: #F7941E;
        border-color: #F7941E;
    }

    &:checked::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px; /* Adjusted width */
        height: 8px; /* Adjusted height */
        border: solid white;
        border-width: 0 0.125em 0.125em 0;
        transform: translate(-50%, -50%) rotate(45deg);
    }
`
