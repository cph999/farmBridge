import React from 'react';
import { Image, Typography, ProductCard, Tag, Button, Card } from 'react-vant';
import './ChatItem.css';
import instance from '../utils/api';


function ChatItem({ message, userinfo }) {
    const isSentByUser = userinfo.id === message.fromId;

    const handleAcceptBid = () => {
        instance.post("/a",)
    }

    return (
        <div className={`message-item ${isSentByUser ? 'sent' : 'received'}`}>
            {!isSentByUser && (
                <Image
                    src={message.fromIcon}
                    alt="user avatar"
                    className="avatar"
                />
            )}
            <Typography.Text
                className="message-bubble"
                size="lg"
                style={{ backgroundColor: "#a9e97b" }}
            >
                {(message.type === "str" || message.type === "") && message.message}
                {message.type === "image" && <Image src={message.message} />}
                {message.type === "card" && (
                    <div style={{ width: "100%" }}>
                        <ProductCard
                            price="2.00"
                            desc={JSON.parse(message.message).nickname}
                            title={JSON.parse(message.message).phone}
                            thumb={JSON.parse(message.message).cover}
                        />
                    </div>
                )}
                {message.type === "order" && (
                    <div style={{ width: "100%" }}>
                        <ProductCard
                            price="2.00"
                            desc={JSON.parse(message.message).description}
                            title={JSON.parse(message.message).locationInfo}
                            thumb={JSON.parse(message.message).images}
                            tags={
                                <Tag style={{ width: "100%" }} plain>
                                    <Button type="danger" size="small" round onClick={() => { }}>
                                        接受订单
                                    </Button>
                                </Tag>
                            }
                        />
                    </div>
                )}
                {message.type === "bid" && (
                    <div style={{ width: "100%", padding: '10px 0' }}>
                        <Card round>
                            <Card.Header
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    borderBottom: '1px solid #f0f0f0',
                                    paddingBottom: '8px',
                                    marginBottom: '8px',
                                }}
                            >
                                {JSON.parse(message.message).description}
                            </Card.Header>
                            <Card.Body
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Image
                                        src={JSON.parse(message.message).images}
                                        style={{
                                            borderRadius: '8px',
                                            maxHeight: '150px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        color: '#555',
                                    }}
                                >
                                    <span>
                                        <strong>报价：</strong>
                                        <span
                                            style={{
                                                color: '#ff4d4f',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {JSON.parse(message.message).bidPrice}
                                        </span>
                                    </span>
                                    <Button
                                        type="danger"
                                        size="small"
                                        round
                                        onClick={() => { }}
                                    >
                                        接受报价
                                    </Button>
                                </div>
                                <Typography.Text style={{ fontSize: '14px', color: '#888' }}>
                                    <strong>昵称：</strong>
                                    {JSON.parse(message.message).nickname}
                                </Typography.Text>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </Typography.Text>
            {isSentByUser && (
                <Image
                    src={userinfo.cover}
                    alt="user avatar"
                    className="avatar"
                />
            )}
        </div>
    );
}

export default ChatItem;
