import React, { useEffect } from 'react';
import { Image, Typography, ProductCard, Tag, Button, Card } from 'react-vant';
import './ChatItem.css';

function ChatItem({ message, userinfo, accptBid, refuseBid, chatRestrictState, setChatRestrictState, handleClickTrade }) {
    const isSentByUser = userinfo.id === message.fromId;

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
                                </div>
                                <Typography.Text style={{ fontSize: '14px', color: '#888' }}>
                                    <strong>昵称：</strong>
                                    {JSON.parse(message.message).nickname}
                                </Typography.Text>

                                <div>
                                    <Button
                                        type="danger"
                                        size="small"
                                        round
                                        onClick={() => { accptBid(message) }}
                                    >
                                        接受报价
                                    </Button>

                                    <Button
                                        type="danger"
                                        size="small"
                                        round
                                        onClick={() => { refuseBid(message) }}
                                    >
                                        拒绝报价
                                    </Button>
                                </div>

                            </Card.Body>
                        </Card>
                    </div>
                )}
                {message.type === "complete-bid" && (
                    <div >
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
                                交易完成
                            </Card.Header>
                            <Card.Body
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '10px',
                                    padding: '15px',
                                }}
                            >
                                <Typography.Text size="lg" style={{ fontWeight: 'bold', color: '#4caf50' }}>
                                    我已经交易且付款成功
                                </Typography.Text>
                                <div>
                                    <strong>付款价格：</strong>
                                    <span
                                        style={{
                                            color: '#ff4d4f',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {JSON.parse(message.message).bidPrice || JSON.parse(JSON.parse(message.message).message).bidPrice || "未提供价格"}
                                    </span>
                                </div>
                                <Typography.Text style={{ fontSize: '14px', color: '#888' }}>
                                    <strong>商品描述：</strong>
                                    {JSON.parse(message.message).description || JSON.parse(JSON.parse(message.message).message).description}
                                </Typography.Text>
                                <Typography.Text style={{ fontSize: '14px', color: '#888' }}>
                                    <strong>位置：</strong>
                                    {JSON.parse(message.message).locationInfo || JSON.parse(JSON.parse(message.message).message).locationInfo}
                                </Typography.Text>
                            </Card.Body>
                        </Card>
                    </div>
                )}

                {message.type === "bid-reply" && (
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
                                报价回复
                            </Card.Header>
                            <Card.Body
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '10px',
                                    padding: '15px',
                                }}
                            >
                                {(JSON.parse(message.message).chatRestrictState === 3 &&
                                    <div>
                                        <Typography.Text size="lg" style={{ fontWeight: 'bold', color: '#4caf50' }}>
                                            我已接受你的报价：{JSON.parse(message.message).bidPrice || JSON.parse(JSON.parse(message.message).message).bidPrice}
                                        </Typography.Text>
                                        <div>您可以发起交易并选择交易方式</div>
                                        <Button
                                            type="primary"
                                            size="small"
                                            round
                                            onClick={() => {
                                                handleClickTrade(message)
                                            }}
                                        >
                                            发起交易
                                        </Button>
                                    </div>
                                )}

                                {JSON.parse(message.message).chatRestrictState === 4 && (
                                    <div>
                                        <Typography.Text size="lg" style={{ fontWeight: 'bold', color: '#f44336' }}>
                                            我拒绝你的报价：{JSON.parse(message.message).bidPrice || JSON.parse(JSON.parse(message.message).message).bidPrice}
                                        </Typography.Text>
                                        <div>您可以重新报价</div>
                                        <Button
                                            type="primary"
                                            size="small"
                                            round
                                            onClick={() => { setChatRestrictState(1) }}
                                        >
                                            重新报价
                                        </Button>
                                    </div>
                                )}
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
