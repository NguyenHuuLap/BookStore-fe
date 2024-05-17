import { Steps } from "antd";
import styled from "styled-components";
const { Step } = Steps;

export const CustomStep = styled(Step)`
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
    background: #C92127;
  };
  .ant-steps-item-finish .ant-steps-item-icon {
    background-color: #fff;
    border-color: #C92127;
  };
  .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title:after {
    background-color: #C92127;
  };
`;