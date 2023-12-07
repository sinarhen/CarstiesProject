'use client'

import React, { FunctionComponent } from 'react';
import {Button} from "antd";
import { signIn } from 'next-auth/react';

interface OwnProps {}

type Props = OwnProps;

const LoginButton: FunctionComponent<Props> = (props) => {

  return (
    <>
      <Button onClick={() => signIn('id-server', {callbackUrl: '/'})}>
        Login
      </Button>
    </>
  );
};

export default LoginButton;
