import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {NavBar, List, Button, Space, Toast, Card} from 'react-vant';
import ChatItem from './ChatItem.jsx';
import ChatInput from './ChatInput.jsx';
import './ChatBox.css';
import {PhoneO} from '@react-vant/icons';


function ChatBox({boxMessage, setChatState, userinfo, sendMessage}) {
    const location = useLocation();
    const navigate = useNavigate();

    // 从 location.state 获取传递的 item 数据
    const {item} = location.state || {};

    // 本地的消息列表状态
    const [messages, setMessages] = useState(boxMessage);

    // 每当 boxMessage 更新时，更新本地的消息列表
    useEffect(() => {
        setMessages(boxMessage);
    }, [boxMessage]);

    // 处理发送消息
    const handleSend = (newMessage) => {
        const otherUser = userinfo.id === boxMessage[0].fromId ? boxMessage[0].toId : boxMessage[0].fromId;
        const newMessageObject = {
            message: newMessage,
            fromId: userinfo.id,
            fromIcon: userinfo.cover,
            toId: otherUser,
            createdTime: new Date(),
            fromNickname: userinfo.nickname,
            toNickname: userinfo.id === boxMessage[0].fromId ? boxMessage[0].toNickname : boxMessage[0].fromNickname,
            toIcon: userinfo.id === boxMessage[0].fromId ? boxMessage[0].toIcon : boxMessage[0].fromIcon,
        };

        // 立即将新消息添加到本地消息列表中
        setMessages((prevMessages) => [...prevMessages, newMessageObject]);

        // 同时发送新消息给服务器（或WebSocket）
        sendMessage(newMessageObject);
    };

    // 处理返回按钮点击逻辑
    const handleBack = () => {
        setChatState(false);
        navigate(-1);  // 返回上一页
    };

    // 如果没有传递 item 数据，展示一个提示信息
    // if (!item) {
    //     return <div>没有找到相关信息</div>;
    // }

    return (
        <div className='chat-box'>
            <NavBar
                // title={userinfo.id === boxMessage[0].fromId ? boxMessage[0].toNickname : boxMessage[0].fromNickname}
                leftText="返回"
                onClickLeft={handleBack}
            />
            <div className='message-block'>
                <List>
                    {messages.map((message, index) => (
                        <ChatItem key={index} message={message} userinfo={userinfo}/>
                    ))}
                </List>
            </div>
            <ChatInput onSend={handleSend}/>
        </div>
    );
}

export default ChatBox;
