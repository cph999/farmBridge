import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import LocalStorageUtil from './utils/LocalStorageUtil.js';
import PostDetail from './components/PostDetail.jsx';
import ChatBox from './components/ChatBox.jsx';
import { Toast } from 'react-vant';
import Chat from "./components/Chat.jsx";
import Order from "./components/Order.jsx";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(LocalStorageUtil.getItem("userinfo") !== undefined
        && LocalStorageUtil.getItem("userinfo") !== null);
    const websocketRef = useRef(null);  // 使用 useRef 存储 WebSocket 实例
    const [userinfo, setUserinfo] = useState({});
    const [orderItem, setOrderItem] = useState({});
    const [initialState, setInitialState] = useState(false);
    const [isHandleLoginSuccess, setIsLoginSuccess] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !isHandleLoginSuccess) {
            handleLoginSuccess();
        }
    }, [isAuthenticated]);

    const [boxMessage, setBoxMessage] = useState([{
        "id": 192,
        "fromId": 68,
        "fromNickname": "小牧",
        "fromIcon": "https://app102.acapp.acwing.com.cn/media/1729307339239.png",
        "toId": 65,
        "toNickname": "小虫",
        "type": "str",
        "toIcon": "https://yup1.oss-cn-hangzhou.aliyuncs.com/images/images/3.png",
        "message": "我对你发布的商品感兴趣，快来和我聊天吧！",
        "createdTime": "Nov 13, 2024 11:02:04 AM"
    }]);

    const handleLoginSuccess = () => {
        const u = LocalStorageUtil.getItem("userinfo");
        setIsAuthenticated(true);
        setIsLoginSuccess(true);

        if (u != null && u !== undefined && JSON.stringify(u) !== '{}') {
            const wsInstance = new WebSocket(`ws://localhost:8809/chat?userId=${u.id}`);
            // const wsInstance = new WebSocket(`wss://app102.acapp.acwing.com.cn/chat?userId=${userinfo.id}`);

            wsInstance.onopen = () => {
                console.log('WebSocket connected');
            };

            wsInstance.onerror = (error) => {
                console.log('WebSocket error:', error);
            };

            wsInstance.onclose = () => {
                console.log('WebSocket disconnected');
            };

            websocketRef.current = wsInstance;
            setInitialState(true);
            setTimeout(() => {
                setInitialState(false);
            }, 500);

            return () => {
                if (wsInstance) {
                    wsInstance.close();
                }
            };
        }
    };


    const handleLogOut = () => {
        setIsAuthenticated(false);
        if (websocketRef.current) {
            websocketRef.current.close(); // 用户登出时关闭 WebSocket 连接
            websocketRef.current = null;
        }
    };

    const sendMessage = (message) => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify(message));
        } else {
            Toast.fail('WebSocket未连接');
        }
    };

    return (
        <div className="App">
            {initialState && (
                <Chat
                    userinfo={userinfo}
                    websocket={websocketRef.current}
                    setBoxMessageApp={setBoxMessage} boxMessageApp={boxMessage}
                />
            )}

            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/home" replace />
                            ) : (
                                <Login onLoginSuccess={handleLoginSuccess} setUserinfo={setUserinfo} />
                            )
                        }
                    />
                    <Route
                        path="/home/*"
                        element={
                            isAuthenticated ? (
                                <Home handleLogOut={handleLogOut} userinfo={userinfo} websocket={websocketRef.current}
                                    setOrderItem={setOrderItem}
                                    setBoxMessage={setBoxMessage} boxMessage={boxMessage} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route path="/post-detail" element={<PostDetail />} />

                    <Route path="/myself" element={<Home handleLogOut={handleLogOut} userinfo={userinfo} websocket={websocketRef.current}
                        setOrderItem={setOrderItem}
                        setBoxMessage={setBoxMessage} boxMessage={boxMessage} />} />

                    <Route path="/order" element={<Order />} />
                    <Route path="/contact"
                        element={<ChatBox userinfo={userinfo} boxMessage={boxMessage} sendMessage={sendMessage}
                            orderItem={orderItem} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;