import { css } from '@emotion/react';
export const globalStyle = css`
  * {
    box-sizing: border-box;
    font-size: 16px;
  }

  html,
  body,
  div,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  form,
  label,
  table {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
  }

  body {
    line-height: 1.3;
    background-color: '#FFFFFF';
    margin-bottom: 80px;
  }

  ol,
  ul {
    list-style: none;
  }

  button {
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
