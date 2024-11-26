import React, {useState, useEffect} from "react";
import {Tabbar, Toast} from "react-vant";
import {HomeO, Search, FriendsO, SettingO, AddO} from "@react-vant/icons";
import {useSwipeable} from "react-swipeable";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Trade from "./Trade.jsx";
import Chat from "./Chat.jsx";
import Profile from "./Profile.jsx";
import Publish from "./Publish.jsx";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import {useLocation} from "react-router";
import AddPost from "./AddPost.jsx";
import HistoryStatistic from "./HistoryStatistic.jsx";

const Home = ({
                  websocket,
                  setOrderItem,
                  setBoxMessage,
                  boxMessage
              }) => {
    const location = useLocation();
    const {item} = location.state || {};
    const [activeTab, setActiveTab] = useState("publish"); // 默认首页
    const [slideDirection, setSlideDirection] = useState("right"); // 滑动方向
    const [userinfo, setUserinfo] = useState(
        LocalStorageUtil.getItem("userinfo")
    );

    const tabs = ["publish", "add", "chat", "profile"]; // Tab 顺序

    useEffect(() => {
        if (item) {
            setActiveTab(item);
        }
    }, [item]);

    // 手势处理
    // const handlers = useSwipeable({
    //     onSwipedLeft: () => {
    //         const nextIndex = (tabs.indexOf(activeTab) + 1) % tabs.length;
    //         setSlideDirection("left"); // 设置滑动方向为左
    //         setActiveTab(tabs[nextIndex]);
    //     },
    //     onSwipedRight: () => {
    //         const prevIndex = (tabs.indexOf(activeTab) - 1 + tabs.length) % tabs.length;
    //         setSlideDirection("right"); // 设置滑动方向为右
    //         setActiveTab(tabs[prevIndex]);
    //     },
    //     trackMouse: true,
    // });

    const renderContent = () => {
        switch (activeTab) {
            case "publish":
                return (
                    <Publish
                        setOrderItem={setOrderItem}
                        userinfo={userinfo}
                        setActiveTab={setActiveTab}
                        setBoxMessage={setBoxMessage}
                    />
                );
            case "trade":
                return <Trade userinfo={userinfo} setActiveTab={setActiveTab}/>;
            case "chat":
                return (
                    <Chat
                        websocket={websocket}
                        setBoxMessageApp={setBoxMessage}
                        boxMessageApp={boxMessage}
                    />
                );
            case "profile":
                return <Profile userinfo={userinfo} setUserinfox={setUserinfo}/>;
            case "add":
                return <AddPost/>;
            case "history":
                return <HistoryStatistic setActiveTab={setActiveTab}/>;
            default:
                return (
                    <Publish
                        setOrderItem={setOrderItem}
                        userinfo={userinfo}
                        setBoxMessage={setBoxMessage}
                    />
                );
        }
    };

    return (
        <div style={{touchAction: "pan-y"}}>
            {/* 动态切换动画类名 */}
            <TransitionGroup>
                <CSSTransition
                    key={activeTab}
                    classNames={`slide-${slideDirection}`} // 根据滑动方向动态切换类名
                    timeout={300}
                >
                    <div>{renderContent()}</div>
                </CSSTransition>
            </TransitionGroup>
            <Tabbar active={activeTab} onChange={(name) => setActiveTab(name)}>
                <Tabbar.Item icon={<HomeO/>} name="publish">
                    首页
                </Tabbar.Item>
                <Tabbar.Item icon={<AddO/>} name="add" badge={{dot: true}}>
                    发布
                </Tabbar.Item>
                <Tabbar.Item icon={<FriendsO/>} name="chat" badge={{content: 5}}>
                    聊天
                </Tabbar.Item>
                <Tabbar.Item icon={<SettingO/>} name="profile">
                    我的
                </Tabbar.Item>
            </Tabbar>
        </div>
    );
};

export default Home;
