import React, {useEffect} from "react";
import "./Order.css";
import {useLocation, useNavigate} from 'react-router-dom';
import {Toast, NavBar, Image, Button} from 'react-vant';

const Order = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const {commodity} = location.state || {}; // 获取页面传递数据

    useEffect(() => {
        console.log("商品信息:", commodity);
    }, [commodity]);

    const handlePurchase = () => {
        if (commodity.stock <= 0) {
            Toast.fail('库存不足，无法下单');
        } else {
            Toast.success('下单成功！');
        }
    };

    return (
        <div className="order-page">
            <NavBar
                title="商品详情"
                leftText="返回"
                onClickLeft={() => navigator(-1)}
            />
            <div className="order-container">
                <Image className="order-image" src={commodity.images} fit="cover" />

                <div className="order-info">
                    <h2 className="order-title">{commodity.productName}</h2>
                    <p className="order-description">{commodity.description}</p>
                    <p className="order-price">
                        价格: <span>￥{commodity.unitPrice.toFixed(2)}</span>
                    </p>
                    <p className={`order-stock ${commodity.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {commodity.stock > 0 ? `库存: ${commodity.stock}` : '库存不足'}
                    </p>
                </div>

                <Button
                    className="order-button"
                    type="primary"
                    block
                    disabled={commodity.stock <= 0}
                    onClick={handlePurchase}
                >
                    立即购买
                </Button>
            </div>
        </div>
    );
};

export default Order;
