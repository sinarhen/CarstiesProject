'use client';

import React from 'react';
import {User} from "next-auth";
import {Dropdown, MenuProps, Space} from "antd";
import Link from "next/link";
import {DownOutlined, SmileOutlined} from "@ant-design/icons";
import {HiCog, HiUser} from "react-icons/hi2";
import {AiFillCar, AiFillTrophy} from "react-icons/ai";
import {signOut} from "next-auth/react";

type Props = {
  user: Partial<User>
}
const getMenu = (user: string): MenuProps['items']=> {
  return [
    {
      key: '0',
      label: (
        <p>
          Hello {user}
        </p>
      ),
      disabled: true,
    },
    {
      type: "divider"
    },
    {
      key: '1',
      label: (
        <Link href='/'>
          MyAuctions
        </Link>
      ),
      icon: <HiUser/>,
    },
    {
      key: '2',
      label: (
        <Link href='/'>
          Auctions won
        </Link>
      ),
      icon: <AiFillTrophy/>,
    },
    {
      key: '3',
      label: (
        <Link href="/">
          Sell my car
        </ Link>
      ),
      icon: <AiFillCar/>
    },
    {
      type: "divider"
    },
    {

      key: '4',
      danger: true,
      label: (
        <button onClick={() => signOut({callbackUrl: "/session"})}>
          Sign out
        </button>
      ),
      icon: HiCog
    },
    {
      key: '5',
      label: (
        <Link href='/session' >
          Session (dev only)
        </Link>
      ),
      icon: <HiCog />
    },
  ];
}
export default function UserActions({user}: Props){
  const items: MenuProps['items'] = getMenu(user.name ?? "");
  return (

    <Dropdown trigger={['click']} arrow menu={{items}}>
      <a className="hover:text-red-500 font-medium cursor-pointer transition-colors" onClick={(e) => e.preventDefault()}>
        <Space>
          {user.name}
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  )
}