import React, { useEffect } from 'react';
import { Image, Typography, ProductCard } from 'react-vant';
import './ChatItem.css';

function ChatItem({ message, userinfo }) {

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
                {message.type === "image" && <Image src={message.message}></Image>}
                {message.type === "card" &&
                    <div style={{ width: "100%" }}>
                        <ProductCard
                            price="2.00"
                            desc={JSON.parse(message.message).nickname}
                            title={JSON.parse(message.message).phone}
                            thumb={JSON.parse(message.message).cover}
                        />

                    </div>
                }

                {message.type === "order" &&
                    <div style={{ width: "100%" }}>
                        <ProductCard
                            price="2.00"
                            desc={JSON.parse(message.message).description}
                            title={JSON.parse(message.message).locationInfo}
                            thumb={JSON.parse(message.message).images}
                        />

                    </div>
                }

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
