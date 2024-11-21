import React, { useEffect, useState } from 'react';
import { Button, Input, ActionSheet, Toast, NumberKeyboard } from 'react-vant';
import './ChatInput.css';
import EmojiPicker from 'emoji-picker-react';
import { SmileO, AddO, Location, OrdersO, UserO, Photo } from '@react-vant/icons';

function ChatInput({ onSend, userinfo, chatRestrictState, setChatRestrictState, orderItem, quoteAmount, setQuoteAmount }) {
    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [sendState, setSendState] = useState(false);
    const [visible, setVisible] = useState(-1);

    const onCancel = () => setVisible(-1);

    // Check if message is not empty and if sending is allowed based on chatRestrictState
    useEffect(() => {
        if (message === null || message === undefined || message.trim() === '') {
            setSendState(false);
        } else {
            setSendState(true);
        }
    }, [message, chatRestrictState]);

    // Handle the send action
    const handleSend = () => {
        if (chatRestrictState !== 5) {
            Toast.fail('当前状态无法发送消息,只能发起报价');
            return;
        }

        if (message.trim()) {
            onSend(message, 'str');
            setMessage('');
            setShowEmoji(false);
        }
    };

    // Handle emoji selection
    const handleEmojiClick = (event, emojiObject) => {
        setMessage((prevMessage) => prevMessage + event.emoji);
        setShowEmoji(false);
    };

    // Handle photo selection
    const handlePhotoClick = () => {
        if (chatRestrictState !== 4) {
            Toast.fail('当前状态无法发送消息,只能发起报价');
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Limit the selection to image types
        input.onchange = async (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                await upload(selectedFile);
            }
        };
        input.click();
    };

    const onInput = (v) => {
        // Update the quote amount when a number is entered
        setQuoteAmount((prevAmount) => prevAmount + v);
    };

    const onDelete = () => {
        // Remove the last digit when the delete key is pressed
        setQuoteAmount((prevAmount) => prevAmount.slice(0, -1));
        Toast.info(quoteAmount);
    };
    const completeBid = () => {
        //等待对方回复
        if (quoteAmount === undefined || quoteAmount === null || quoteAmount === 0 || quoteAmount === "") {
            Toast.fail('请输入报价金额');
            return;
        }
        setChatRestrictState(2);
        const bidItem = Object.assign({}, userinfo, orderItem, { bidPrice: quoteAmount, chatRestrictState: 2 });
        bidItem.orderId = orderItem.id;
        onSend(JSON.stringify(bidItem), 'bid');
    }
    // Handle sending a user card
    const handleCardClick = () => {
        if (chatRestrictState !== 4) {
            Toast.fail('当前状态无法发送消息,只能发起报价');
            return;
        }
        onSend(JSON.stringify(userinfo), 'card');
    };

    // Handle file upload
    const upload = async (file) => {
        try {
            const body = new FormData();
            body.append('file', file);
            const resp = await fetch('http://localhost:8809/api/uploadFile', {
                method: 'POST',
                body,
            });
            const json = await resp.json();
            console.log('Upload successful:', json.data.url);
            onSend(json.data.url, 'image');
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className="chat-input-container">
            <Input
                value={message}
                onChange={setMessage}
                placeholder="请输入..."
                className="chat-input"
            />
            {showEmoji && (
                <div>
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        style={{
                            position: 'absolute',
                            bottom: '50px',
                            right: '10px',
                            zIndex: 10,
                        }}
                    />
                </div>
            )}
            <SmileO
                fontSize="2.5em"
                onClick={() => setShowEmoji(!showEmoji)}
                className="emoji-icon"
            />

            {!sendState && (
                <AddO
                    fontSize="2.5em"
                    className="emoji-icon"
                    onClick={() => {
                        setVisible(1);
                    }}
                />
            )}
            {sendState && (
                <Button type="primary" className="send-button" onClick={handleSend}>
                    发送
                </Button>
            )}
            {chatRestrictState === 1 && orderItem && userinfo.id !== orderItem.userId && (
                <div>
                    123123
                    <NumberKeyboard
                        title="报价"
                        extraKey="."
                        closeButtonText="完成报价"
                        onBlur={() => { completeBid() }}
                        visible={chatRestrictState === 1}
                        onInput={onInput} // Handle input of number
                        onDelete={onDelete} // Handle deletion of last digit
                    />
                </div>
            )}

            <ActionSheet visible={visible === 1} onCancel={onCancel}>
                <div className="input-add-box">
                    <div>
                        <Photo fontSize="2.5em" onClick={handlePhotoClick} />
                        <div>相册</div>
                    </div>
                    <div>
                        <UserO fontSize="2.5em" onClick={handleCardClick} />
                        <div>名片</div>
                    </div>
                    <div onClick={() => { setChatRestrictState(1); setVisible(0) }}>
                        <OrdersO fontSize="2.5em" />
                        <div>报价</div>
                    </div>
                    <div>
                        <Location fontSize="2.5em" />
                        <div>位置</div>
                    </div>
                </div>
            </ActionSheet>
        </div>
    );
}

export default ChatInput;
