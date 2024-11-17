import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Image, Flex, List } from 'react-vant';
import instance from "../utils/api";
const Profile = ({ userinfo }) => {
    const [searchState, setSearchState] = useState(0); // 默认显示“全部”订单
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false); // 标记是否正在加载数据

    useEffect(() => {
        fetchOrdersData();
    }, [searchState]);

    const fetchOrdersData = async () => {
        if (loading) return; // 防止重复请求
        setLoading(true); // 设置加载状态

        try {
            const res = await instance.post("/getOrders", {
                pageNum: 1,
                pageSize: 5,
                state: searchState,
            });
            setOrders(res.data.datas || []); // 设置订单数据
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false); // 重置加载状态
        }
    };

    const renderOrders = () => {
        if (loading) {
            return <div>加载中...</div>;
        }
        if (orders.length === 0) {
            return <div>暂无订单</div>;
        }
        return orders.map((order, index) => (
            <div key={index} className="order-item">
                <Image
                    className="order-image"
                    src={order.commodityImages}
                    width="80"
                    height="80"
                    fit="cover"
                    round
                />
                <div className="order-details">
                    <h4>{order.commodityName}</h4>
                    <div className="order-info">
                        <div>价格: {order.totalPrice}元</div>
                        <div>数量: {order.oamount}</div>
                        <div>地址: {order.locationInfo}</div>
                    </div>
                    <div className={`order-state state-${order.state}`}>
                        {getOrderStateText(order.state)}
                    </div>
                </div>
            </div>
        ));
    };

    const renderOrderStatusButtons = () => {
        const statuses = [
            { label: "全部", state: 0 },
            { label: "待付款", state: 1 },
            { label: "待发货", state: 2 },
            { label: "待评价", state: 3 },
        ];

        return statuses.map((status) => (
            <Flex.Item
                key={status.state}
                span={6}
                onClick={() => setSearchState(status.state)}
            >
                <div
                    className={`order-status ${searchState === status.state ? "active" : ""}`}
                >
                    {status.label}
                </div>
            </Flex.Item>
        ));
    };

    const getOrderStateText = (state) => {
        switch (state) {
            case 1: return "待付款";
            case 2: return "待发货";
            case 3: return "待评价";
            default: return "已完成";
        }
    };

    return (
        <div className="profile-container">
            {/* 个人信息展示 */}
            <div className="profile-header-container">
                <Flex wrap="wrap" gutter={20}>
                    <Flex.Item span={6}>
                        <Image src={userinfo.cover} round />
                    </Flex.Item>
                    <Flex.Item span={18}>
                        <div className="profile-info">
                            <div className="nickname">{userinfo.nickname}</div>
                            <div className="address">{userinfo.address}</div>
                            <div className="phone">{userinfo.phone}</div>
                        </div>
                    </Flex.Item>
                </Flex>
            </div>

            {/* 收货地址 */}
            <div className="section">
                <h3>收货地址</h3>
                <div>{userinfo.address}</div>
            </div>

            {/* 订单信息 */}
            <div className="section order-info">
                <h3>订单信息</h3>
                <Flex justify="start" gutter={20}>
                    {renderOrderStatusButtons()}
                </Flex>

                {/* 订单列表 */}
                <List finished={true}>{renderOrders()}</List>
            </div>
        </div>
    );
};

export default Profile;
