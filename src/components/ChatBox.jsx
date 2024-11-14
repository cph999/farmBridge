import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBar, List, SubmitBar } from 'react-vant';
import ChatItem from './ChatItem.jsx';
import ChatInput from './ChatInput.jsx';
import './ChatBox.css';

function ChatBox({ boxMessage, setChatState, userinfo, sendMessage, orderItem }) {
    const location = useLocation();
    const navigate = useNavigate();

    // 从 location.state 获取传递的 item 数据
    const { item } = location.state || {};

    // 本地的消息列表状态
    const [messages, setMessages] = useState(boxMessage);

    // 获取消息列表容器的引用
    const messageEndRef = useRef(null);

    // 每当 boxMessage 更新时，更新本地的消息列表
    useEffect(() => {
        setMessages(boxMessage);
    }, [boxMessage]);

    // 每当 messages 更新时，滚动到容器底部
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        console.log("orderItem changed:", orderItem);
    }, [orderItem]);

    // 处理发送消息
    const handleSend = (newMessage, type) => {
        const otherUser = userinfo.id === boxMessage[0].fromId ? boxMessage[0].toId : boxMessage[0].fromId;
        const newMessageObject = {
            message: newMessage,
            fromId: userinfo.id,
            fromIcon: userinfo.cover,
            toId: otherUser,
            createdTime: new Date(),
            type: type,
            fromNickname: userinfo.nickname,
            toNickname: userinfo.id === boxMessage[0].fromId ? boxMessage[0].toNickname : boxMessage[0].fromNickname,
            toIcon: userinfo.id === boxMessage[0].fromId ? boxMessage[0].toIcon : boxMessage[0].fromIcon,
        };

        setMessages((prevMessages) => [...prevMessages, newMessageObject]);

        sendMessage(newMessageObject);
    };

    // 处理返回按钮点击逻辑
    const handleBack = () => {
        if (setChatState === undefined) {
            navigate("/home");
        } else {
            setChatState(false);
        }
    };
    

    return (
        <div className="chat-box">
            <NavBar
                leftText="返回"
                onClickLeft={handleBack}
            />
            <div className="chat-content">
                <div className="message-block" style={{ overflowY: 'auto', flex: 1 }}>
                    <List>
                        {messages.map((message, index) => (
                            <ChatItem key={index} message={message} userinfo={userinfo} />
                        ))}
                    </List>
                    <div ref={messageEndRef} />
                </div>
                {orderItem && orderItem !== '{}' && (
                    <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
                        <SubmitBar
                            textAlign="left"
                            label={orderItem.description}
                            price="3050"
                            buttonText="发送订单"
                            onSubmit={() => { handleSend(JSON.stringify(orderItem), "order") }}
                        />
                    </div>
                )}
                <ChatInput onSend={handleSend} userinfo={userinfo} />
            </div>
        </div>
    );
}

export default ChatBox;
