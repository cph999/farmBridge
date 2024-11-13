import React, { useEffect, useState } from 'react';
import { Button, Input, ActionSheet } from 'react-vant';
import './ChatInput.css';
import EmojiPicker from 'emoji-picker-react';
import { SmileO, AddO, Location, OrdersO, UserO, Photo } from '@react-vant/icons';

function ChatInput({ onSend }) {
    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [sendState, setSendState] = useState(false);
    const [visible, setVisible] = useState(-1)
    const [file, setFile] = useState(null); // 用来存储选择的图片文件
    const onCancel = () => setVisible(-1)

    useEffect(() => {
        if (message === null || message === undefined || message === '') {
            setSendState(false);
        } else {
            setSendState(true);
        }
    }, [message]);

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
            setShowEmoji(false);
        }
    };

    const handleEmojiClick = (event, emojiObject) => {
        setMessage((prevMessage) => prevMessage + event.emoji);
        setShowEmoji(false);
    };

    const handlePhotoClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // 限制选择图片类型
        input.onchange = async (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                await upload(selectedFile); 
            }
        };
        input.click(); 
    };

    const upload = async (file) => {
        try {
            const body = new FormData();
            body.append('source', file);
            const resp = await fetch("123", {
                method: 'POST',
                body,
            });
            const json = await resp.json();
            // 这里可以处理上传后的返回数据，比如返回图片的URL
            console.log('Upload successful:', json);
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
                <div >
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        style={{
                            position: 'absolute',
                            bottom: '50px',
                            right: '10px',
                            zIndex: 10
                        }}
                    />
                </div>
            )}
            <SmileO
                fontSize="2.5em"
                onClick={() => setShowEmoji(!showEmoji)}
                className="emoji-icon"
            />

            {
                !sendState && <AddO fontSize="2.5em"
                    className="emoji-icon"
                    onClick={() => { setVisible(1) }}
                />
            }
            {
                sendState && <Button
                    type="primary"
                    className="send-button"
                    onClick={handleSend}
                >
                    发送
                </Button>
            }

            <ActionSheet visible={visible === 1} onCancel={onCancel}>
                <div className='input-add-box'>
                    <div>
                        <Photo fontSize="2.5em" onClick={handlePhotoClick} />
                        <div>相册</div>
                    </div>
                    <div>
                        <UserO fontSize="2.5em" />
                        <div>名片</div>
                    </div>
                    <div>
                        <OrdersO fontSize="2.5em" />
                        <div>订单</div>
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
