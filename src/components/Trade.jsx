import React, { useEffect, useState } from "react";
import "./Trade.css";
import instance from "../utils/api";
import { List, Cell, PullRefresh, NavBar } from 'react-vant';
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate

const Trade = ({ setActiveTab }) => {
    const [commodities, setCommodities] = useState([]);
    const [finished, setFinished] = useState(false);  // 是否加载完所有商品
    const [pageNum, setPageNum] = useState(1);  // 当前页码
    const [pageSize] = useState(10);  // 每页商品数量
    const [search, setSearch] = useState("");  // 搜索条件
    const [loading, setLoading] = useState(false); // 当前是否正在请求

    const navigator = useNavigate();

    useEffect(() => {
        fetchCommodities();
    }, [pageNum]);

    useEffect(() => {
        if (commodities.length >= 30) {
            setFinished(true);
        }
    }, [commodities]);

    const handleClickTrade = (commodity) => {
        console.log("commodity", commodity);
        navigator("/order", { state: { commodity } });
    };

    const fetchCommodities = async () => {
        if (loading) return; // 如果正在加载，则直接返回
        setLoading(true); // 设置加载状态

        try {
            const res = await instance.post("/getCommodityList", {
                pageNum,
                pageSize,
                search,
            });

            const newCommodities = res.data.datas || [];
            if (newCommodities.length === 0) {
                setFinished(true);
            }

            setCommodities(prev => [...prev, ...newCommodities]);
        } catch (error) {
            console.error("Failed to fetch commodities", error);
        } finally {
            setLoading(false); // 请求完成后重置加载状态
        }
    };

    const onLoad = async () => {
        if (!finished && !loading) {
            setPageNum(prev => prev + 1);  // 页码自增
        }
    };

    const onRefresh = async () => {
        if (loading) return; // 避免在刷新时重复触发请求

        setPageNum(1);
        setCommodities([]);
        setFinished(false);
        await fetchCommodities();
    };

    return (
        <div className="trade-container">
            <NavBar
                leftText="返回"
                onClickLeft={() => { setActiveTab("publish") }}
            />

            <PullRefresh onRefresh={onRefresh} style={{ marginTop: '10px' }}>
                <List finished={finished} onLoad={onLoad} loading={loading}>
                    <div className="commodity-list">
                        {commodities.map((commodity, i) => (
                            <Cell
                                key={i}
                                className="commodity-item"
                                clickable
                                onClick={() => handleClickTrade(commodity)}
                            >
                                <div className="commodity-content">
                                    <img
                                        src={commodity.images}
                                        alt={commodity.productName}
                                        className="commodity-image"
                                    />
                                    <div className="commodity-details">
                                        <h3>{commodity.productName}</h3>
                                        <p>{commodity.description}</p>
                                        <div className="commodity-info">
                                            <span>{commodity.unitPrice}元</span>
                                            <span>库存: {commodity.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            </Cell>
                        ))}
                    </div>
                </List>
            </PullRefresh>
        </div>
    );
};

export default Trade;
