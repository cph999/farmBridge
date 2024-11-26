import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, SubmitBar, Card, Image, Toast, Dialog, Button, Flex } from 'react-vant';
import ChatItem from './ChatItem.jsx';
import ChatInput from './ChatInput.jsx';
import './ChatBox.css';
import instance from "../utils/api.js";
import { WechatPay, Alipay } from '@react-vant/icons';
import LocalStorageUtil from "../utils/LocalStorageUtil.js";

function ChatBox({ boxMessage, setChatState, sendMessage, orderItem }) {
    const navigate = useNavigate();
    const [quoteAmount, setQuoteAmount] = useState('');
    const [visibleTrade, setVisibleTrade] = useState(false);
    const [visiblePayment, setVisiblePayment] = useState(false); // 控制支付方式选择对话框
    const [selectedPayment, setSelectedPayment] = useState(''); // 存储选中的支付方式
    const [tradeStateMessage, setTradeStateMessage] = useState({});
    const [chatRestrictState, setChatRestrictState] = useState(1);

    const [userinfo, setUserinfo] = useState(
        LocalStorageUtil.getItem("userinfo")
    );
    // 接受报价
    const accptBid = (message) => {
        if (userinfo.id === message.fromId) {
            Toast.fail('无法处理自己的报价');
            return;
        }
        // 生成报价对象
        const parsedMessage = JSON.parse(message.message);
        parsedMessage.chatRestrictState = 3;

        const bidItem = Object.assign({}, userinfo, message, {
            bidPrice: quoteAmount,
            chatRestrictState: 3,
            message: JSON.stringify(parsedMessage)
        });

        bidItem.orderId = JSON.parse(message.message).orderId;
        handleSend(JSON.stringify(bidItem), 'bid-reply');
        setChatRestrictState(3);
    };



    // 拒绝报价
    const refuseBid = (message) => {
        if (userinfo.id === message.fromId) {
            Toast.fail('无法处理自己的报价');
            return;
        }
        // 生成报价对象
        const parsedMessage = JSON.parse(message.message);
        parsedMessage.chatRestrictState = 4;

        const bidItem = Object.assign({}, userinfo, message, {
            bidPrice: quoteAmount,
            chatRestrictState: 4,
            message: JSON.stringify(parsedMessage)
        });

        bidItem.orderId = JSON.parse(message.message).orderId;
        handleSend(JSON.stringify(bidItem), 'bid-reply');
        setChatRestrictState(4);
    };

    const handleClickTrade = (m) => {
        if (m.toId === userinfo.id) {
            const messageObj = JSON.parse(m.message);
            messageObj.chatRestrictState = 5;
            const updatedM = { ...m, message: JSON.stringify(messageObj) };
            setTradeStateMessage(updatedM);
            setVisibleTrade(true);
        } else {
            Toast.fail('无法处理自己的报价');
        }
    };


    const [messages, setMessages] = useState(boxMessage);

    // 获取消息列表容器的引用
    const messageEndRef = useRef(null);

    useEffect(() => {
        setMessages(boxMessage);
    }, [boxMessage]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (visiblePayment) {
            let timeRemaining = 30 * 60; // 30分钟倒计时（秒）
            const timer = setInterval(() => {
                if (timeRemaining <= 0) {
                    clearInterval(timer);
                    Toast.fail('支付超时，请重新发起支付');
                    setVisiblePayment(false); // 超时关闭支付框
                    return;
                }
                timeRemaining -= 1;
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                document.getElementById("countdown-timer").textContent = `${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [visiblePayment]);

    useEffect(() => {
        if (orderItem && orderItem !== '{}') {
            if (userinfo.id !== orderItem.userId) {
                setChatRestrictState(1);
            }
        }
        if (boxMessage === null || boxMessage === undefined || boxMessage.length === 0) return;
        const bidMessage = boxMessage.reverse().find(message => message.type === 'bid' && orderItem && JSON.parse(message.message).orderId === orderItem.id);
        if (bidMessage) {
            const bidItem = Object.assign({}, userinfo, bidMessage, { bidPrice: quoteAmount, chatRestrictState: 3 });
            bidItem.orderId = bidMessage.orderId; // 使用报价消息中的 orderId，获取后台的chatState
            const fetchIsBid = async () => {
                instance.post("/isBid", bidItem)
                    .then(res => {
                        if (res.data.code === 200) {
                            setChatRestrictState(res.data.data.chatRestrictState);
                        }
                    })
            }
            fetchIsBid();
        }
        setChatRestrictState(1);
    }, [orderItem]);

    // 处理发送消息
    const handleSend = (newMessage, type) => {
        let otherUser = {};
        if (orderItem && orderItem !== '{}' && orderItem.userId !== userinfo.id) {
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
            toNickname: undefined !== boxMessage && boxMessage.length > 0
                ? userinfo.id === boxMessage[0].fromId
                    ? boxMessage[0].toNickname
                    : boxMessage[0].fromNickname
                : "",
            toIcon: undefined !== boxMessage && boxMessage.length > 0
                ? userinfo.id === boxMessage[0].fromId
                    ? boxMessage[0].toIcon
                    : boxMessage[0].fromIcon
                : "",
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

    // 选择支付方式
    const handlePaymentChoice = (paymentMethod) => {
        setSelectedPayment(paymentMethod);
        Toast.success(`${paymentMethod}支付选择成功`);
        setVisiblePayment(false);
        handleSend(JSON.stringify(tradeStateMessage), "complete-bid")
        setChatRestrictState(5)
    };

    return (
        <div className="chat-box">
            <NavBar
                leftText="返回"
                onClickLeft={handleBack}
            />
            {visibleTrade && (
                <Dialog
                    visible={visibleTrade}
                    title="请选择交易方式"
                    showCancelButton
                    onConfirm={() => {
                        Toast.info('点击确认按钮');
                        setVisibleTrade(false);
                        setVisiblePayment(true); // 显示支付方式选择框
                    }}
                    onCancel={() => setVisibleTrade(false)}
                >
                    <div >
                        <Flex justify='center' align='center'>
                            <Flex.Item span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    type="danger"
                                    size="medium"
                                    style={{
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                    }}
                                    onClick={() => {
                                        Toast.success("平台交易");
                                        setVisibleTrade(false);
                                        setVisiblePayment(true); // 显示支付方式选择框
                                    }}
                                >
                                    平台交易
                                </Button>
                            </Flex.Item>
                            <Flex.Item span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    type="primary"
                                    size="medium"
                                    style={{
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                    }}
                                    onClick={() => {
                                        Toast.success("线下交易");
                                        setVisibleTrade(false);
                                        setVisiblePayment(true); // 显示支付方式选择框
                                    }}
                                >
                                    线下交易
                                </Button>
                            </Flex.Item>
                        </Flex>
                    </div>
                </Dialog>
            )}

            {visiblePayment && (
                <Dialog
                    visible={visiblePayment}
                    title="请选择支付方式"
                >
                    <div>
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                            支付金额：<span style={{ color: '#ff4d4f' }}>300元</span>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '1rem', color: '#666', marginBottom: '20px' }}>
                            倒计时：<span id="countdown-timer" style={{ color: '#ff4d4f' }}>30:00</span>
                        </div>
                        <Flex justify='center' align='center'>
                            <Flex.Item span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    type="success"
                                    size="medium"
                                    icon={<WechatPay fontSize={"2em"}></WechatPay>}
                                    onClick={() => handlePaymentChoice('微信')}
                                >
                                    微信支付
                                </Button>
                            </Flex.Item>
                            <Flex.Item span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    type="primary"
                                    size="medium"
                                    icon={<Alipay fontSize={"2em"}></Alipay>}
                                    onClick={() => handlePaymentChoice('支付宝')}
                                >
                                    支付宝支付
                                </Button>
                            </Flex.Item>
                        </Flex>
                    </div>
                </Dialog>
            )}

            {chatRestrictState === 1 && orderItem && userinfo.id !== orderItem.userId && (
                <Card
                    round
                    style={{
                        margin: '20px 0',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                >
                    <Card.Header
                        style={{
                            backgroundColor: '#f5f5f5',
                            color: '#333',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            padding: '10px',
                        }}
                    >
                        我的报价
                    </Card.Header>
                    <Card.Body
                        style={{
                            height: '20vh',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            padding: '10px',
                            gap: '10px',
                        }}
                    >
                        <Image
                            src={orderItem.images}
                            style={{
                                height: '100px',
                                width: '100px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                            }}
                        />
                        <div
                            style={{
                                fontSize: '1rem',
                                color: '#666',
                                textAlign: 'justify',
                            }}
                        >
                            {orderItem.description}
                        </div>
                    </Card.Body>
                    <Card.Footer
                        style={{
                            padding: '10px',
                            borderTop: '1px solid #eee',
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#ff4d4f',
                        }}
                    >
                        出价：{quoteAmount}
                    </Card.Footer>
                </Card>
            )}

            <div className="chat-content">
                <div className="message-block" style={{ overflowY: 'auto', flex: 1 }}>
                    {messages !== undefined && messages.length > 0 && messages.map((message, index) => (
                        <ChatItem key={index} message={message} userinfo={userinfo} accptBid={accptBid} refuseBid={refuseBid}
                            chatRestrictState={chatRestrictState} setChatRestrictState={setChatRestrictState} handleClickTrade={handleClickTrade} />
                    ))}
                    <div ref={messageEndRef} />
                </div>
            </div>
            <ChatInput
                style={{ marginTop: "20px" }}
                onSend={handleSend}
                userinfo={userinfo}
                chatRestrictState={chatRestrictState}
                setChatRestrictState={setChatRestrictState}
                orderItem={orderItem}
                quoteAmount={quoteAmount}
                setQuoteAmount={setQuoteAmount}
            />
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
