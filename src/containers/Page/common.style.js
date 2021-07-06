import styled from "styled-components";
import { palette, font } from "styled-theme";
import bgImage from "../../image/sign.jpg";
import WithDirection from "../../settings/withDirection";

// TODO: Move all colors to palette
const OuterStyleWrapper = styled.div`
    input {
        font-family: ${font("poppins", 0)};
        font-size: 17px;
        color: #2c2c2c;
        border: none;
        box-shadow: none;
        outline: 0;
        // height: 25px;
        // min-height: 25px;
        padding: 0;
        margin-top: -4px;
        background: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        border-radius: 2px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        
        &:hover, &:active, &:focus {
            box-shadow: none;
            outline: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.07);
            -webkit-box-shadow: none;
            box-shadow: none;
        }
    }

    .has-error .ant-input, .has-error .ant-input:focus, .has-error .ant-input:hover, .has-error .ant-input:active {
        box-shadow: none;
        outline: none;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .has-error .ant-form-explain {
        font-size: 12px;
        color: #f55753;
        display: block;
        margin: 2px 0 5px 0;
    }

    .checkbox  .ant-checkbox {
        top: -2px;
    } 

    .redirect-url {
        a {
            color: #3b4752;
            &:hover {
                color: #117a8b;
            }
        }
    }

    button {
        border-radius: 100px;
        background: #16528E;
        font-size: 14px;
        height: auto;
        text-transform: uppercase;
        font-family: 'Poppins', sans-serif;
        border-color: #16528E;
        font-weight: 500;
        padding: 7px 34px;
        width: auto;
        margin-right: 5px;
        min-width: 120px;
        color: #fff;
        margin-bottom: 0;
        border: 1px solid #f0f0f0;
        text-align: center;
        vertical-align: middle;
        text-shadow: none;
        box-shadow: none;
        line-height: 21px;
        position: relative;
        cursor: pointer;
        
        &:hover, &:active, &:focus {
            background: #154779;
            border-color: #154779;
            box-shadow: none;
            outline: none;
        }
    }
`;

export default WithDirection(OuterStyleWrapper);