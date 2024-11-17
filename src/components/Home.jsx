import React, { useState, useEffect } from "react";
import { Tabbar } from 'react-vant';
import { HomeO, Search, FriendsO, SettingO } from '@react-vant/icons';
import Trade from "./Trade.jsx";
import Chat from "./Chat.jsx";
import Profile from "./Profile.jsx";
import Publish from "./Publish.jsx";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import { useLocation } from "react-router";

const Home = ({ websocket, setOrderItem, setBoxMessage, boxMessage }) => {
    const location = useLocation();
    const { item } = location.state || {}; // 获取传递的数据
    const [activeTab, setActiveTab] = useState('publish'); // 默认首页
    const [userinfo, setUserinfo] = useState(LocalStorageUtil.getItem("userinfo")); // 定义一个 state 变量存储用户名

    useEffect(() => {
        if (item) {
            setActiveTab(item); // 如果有 item 数据，设置对应的 tab
        }
    }, [item]);

    const renderContent = () => {
        switch (activeTab) {
            case 'publish':
                return <Publish setOrderItem={setOrderItem} userinfo={userinfo} setBoxMessage={setBoxMessage} />;
            case 'trade':
                return <Trade userinfo={userinfo} />;
            case 'chat':
                return <Chat userinfo={userinfo} websocket={websocket} setBoxMessageApp={setBoxMessage} boxMessageApp={boxMessage} />;
            case 'profile':
                return <Profile userinfo={userinfo} setUserinfox={setUserinfo} />;
            default:
                return <Publish setOrderItem={setOrderItem} userinfo={userinfo} setBoxMessage={setBoxMessage} />;
        }
    };

    return (
        <div>
            {renderContent()}
            <Tabbar active={activeTab} onChange={setActiveTab}>
                <Tabbar.Item icon={<HomeO />} name="publish">
                    首页
                </Tabbar.Item>
                <Tabbar.Item icon={<Search />} name="trade" badge={{ dot: true }}>
                    商城
                </Tabbar.Item>
                <Tabbar.Item icon={<FriendsO />} name="chat" badge={{ content: 5 }}>
                    聊天
                </Tabbar.Item>
                <Tabbar.Item icon={<SettingO />} name="profile">
                    我的
                </Tabbar.Item>
            </Tabbar>
        </div>
    );
};

export default Home;
