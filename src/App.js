import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import LocalStorageUtil from './utils/LocalStorageUtil.js';
import PostDetail from './components/PostDetail.jsx';
import ChatBox from './components/ChatBox.jsx';
import { Toast } from 'react-vant';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const websocketRef = useRef(null);  // 使用 useRef 存储 WebSocket 实例
  const [userinfo, setUserinfo] = useState({});
  const boxMessage = [{
    "id": 192,
    "fromId": 68,
    "fromNickname": "小牧",
    "fromIcon": "https://app102.acapp.acwing.com.cn/media/1729307339239.png",
    "toId": 65,
    "toNickname": "小虫",
    "toIcon": "https://yup1.oss-cn-hangzhou.aliyuncs.com/images/images/3.png",
    "message": "我对你发布的商品感兴趣，快来和我聊天吧！",
    "createdTime": "Nov 13, 2024 11:02:04 AM"
  }];
  const handleLoginSuccess = () => {
    const u = LocalStorageUtil.getItem("userinfo");
    setIsAuthenticated(true);

    if (u != null && u !== undefined && JSON.stringify(u) !== '{}') {
      // 创建 WebSocket 实例
      const wsInstance = new WebSocket(`ws://localhost:8809/chat?userId=${u.id}`);

      wsInstance.onopen = () => {
        console.log('WebSocket connected');
      };

      wsInstance.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      wsInstance.onclose = () => {
        console.log('WebSocket disconnected');
      };

      // 将 WebSocket 实例存储在 websocketRef 中
      websocketRef.current = wsInstance;

      // 确保在组件卸载时关闭 WebSocket
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

  useEffect(() => {
    const u = LocalStorageUtil.getItem("userinfo");
    setUserinfo(u);
    if (u !== null && u !== undefined && JSON.stringify(u) !== '{}') {
      const wsInstance = new WebSocket(`ws://localhost:8809/chat?userId=${u.id}`);

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

      return () => {
        if (wsInstance) {
          wsInstance.close();
        }
      };
    }
  }, []);

  return (
    <div className="App">
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
                <Home handleLogOut={handleLogOut} userinfo={userinfo} websocket={websocketRef.current} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/post-detail" element={<PostDetail />} />
          <Route path="/contact" element={<ChatBox userinfo={userinfo} boxMessage={boxMessage} sendMessage={sendMessage} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
