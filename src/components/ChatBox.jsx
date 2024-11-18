import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBar, List, SubmitBar, Card, Image } from 'react-vant';
import ChatItem from './ChatItem.jsx';
import ChatInput from './ChatInput.jsx';
import './ChatBox.css';

function ChatBox({ boxMessage, setChatState, userinfo, sendMessage, orderItem }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [quoteAmount, setQuoteAmount] = useState('');

    // 从 location.state 获取传递的 item 数据
    const { item } = location.state || {};
    //1: 只能购买人报价，也就是不是发布人
    // 发布人只能接受或者拒绝报价
    // 2:对方接受/不接受 3.接受：在线/离线交易 4: 开放聊天功能 
    const [chatRestrictState, setChatRestrictState] = useState(1);

    // 本地的消息列表状态
    const [messages, setMessages] = useState(boxMessage);

    // 获取消息列表容器的引用
    const messageEndRef = useRef(null);

    // 每当 boxMessage 更新时，更新本地的消息列表
    useEffect(() => {
        console.log("boxMessage", boxMessage)
        setMessages(boxMessage);
    }, [boxMessage]);

    // 每当 messages 更新时，滚动到容器底部
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (orderItem && orderItem !== '{}') {
            if (userinfo.id !== orderItem.userId) {
                //只能报价
                setChatRestrictState(1);
            }
        }
    }, [orderItem]);

    // 处理发送消息
    const handleSend = (newMessage, type) => {
        var otherUser = {};
        if (orderItem && orderItem !== '{}') {
            otherUser = orderItem.userId;
        } else {
            otherUser = userinfo.id === boxMessage[0].fromId ? boxMessage[0].toId : boxMessage[0].fromId;
        }
        const newMessageObject = {
            message: newMessage,
            fromId: userinfo.id,
            fromIcon: userinfo.cover,
            toId: otherUser,
            createdTime: new Date(),
            type: type,
            fromNickname: userinfo.nickname,
            toNickname: undefined !== boxMessage && boxMessage.length > 0 ? userinfo.id === boxMessage[0].fromId ? boxMessage[0].toNickname : boxMessage[0].fromNickname : "",
            toIcon: undefined !== boxMessage && boxMessage.length > 0 ? userinfo.id === boxMessage[0].fromId ? boxMessage[0].toIcon : boxMessage[0].fromIcon : "",
        };

        setMessages((prevMessages) => {
            const safePrevMessages = Array.isArray(prevMessages) ? prevMessages : [];
            return [...safePrevMessages, newMessageObject];
        });


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
            {
                chatRestrictState === 1 &&
                <Card round>
                    <Card.Header>我的报价</Card.Header>
                    <Card.Body
                        style={{
                            height: '20vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image src={orderItem.images}></Image>
                        {orderItem.description}
                    </Card.Body>
                    <Card.Footer>
                        <div style={{ textAlign: 'center' }}>出价：{quoteAmount}</div>
                    </Card.Footer>
                </Card>

            }
            <div className="chat-content">
                <div className="message-block" style={{ overflowY: 'auto', flex: 1 }}>
                    {messages !== undefined && messages.length > 0 && messages.map((message, index) => (
                        <ChatItem key={index} message={message} userinfo={userinfo} />
                    ))}
                    <div ref={messageEndRef} />
                </div>
            </div>
            <ChatInput style={{ marginTop: "20px" }} onSend={handleSend} userinfo={userinfo} chatRestrictState={chatRestrictState}
                setChatRestrictState={setChatRestrictState} orderItem={orderItem} quoteAmount={quoteAmount} setQuoteAmount={setQuoteAmount} />
            {orderItem && orderItem !== '{}' && (
                <SubmitBar
                    textAlign="left"
                    label={orderItem.description + " 服务费："}
                    price="3050"
                    buttonText="发送订单"
                    onSubmit={() => { handleSend(JSON.stringify(orderItem), "order") }}
                />
            )}

        </div>
    );
}

export default ChatBox;
