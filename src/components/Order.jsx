import React, { useEffect, useState } from "react";
import "./Order.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast, NavBar, Image, Button, Stepper, Card, Space, Loading, Overlay } from 'react-vant';
import instance from "../utils/api";
import { WechatPay, Alipay } from '@react-vant/icons';

const Order = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const { commodity } = location.state || {}; // 获取页面传递数据
    const [amountValue, setAmountValue] = useState(1);
    const [purchaseVisible, setPurchaseVisible] = useState(false);
    const [purchaseData, setPurchaseData] = useState({});
    const [overlayVisable, setOverlayVisible] = useState(false);

    useEffect(() => {
        console.log("商品信息:", commodity);
    }, [commodity]);

    const handlePayment = () => {
        instance.post("/payState", purchaseData)
            .then(res => {
                if (res.data.code === 200) {
                    Toast.success('付款成功，已通知商家为您发货');
                    navigator('/myself', { state: { item: "profile" } });  // 携带 item 数据

                } else {
                    Toast.fail(res.data.message);

                }
            })
    }
    const handlePurchase = () => {
        if (commodity.stock <= amountValue) {
            Toast.fail('库存不足，无法下单');
        } else {
            setOverlayVisible(true);
            commodity.currentAmount = amountValue;
            instance.post("/createOrder", commodity)
                .then(res => {
                    if (res.data.code === 200) {
                        setPurchaseVisible(true);
                        setPurchaseData(res.data.data);
                        Toast.success('下单成功！');
                    } else {
                        Toast.success('下单失败，稍后再试！');
                    }
                    setOverlayVisible(false);
                })
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
                <Image className="order-image-trade" src={commodity.images} fit="cover" />

                <div className="order-info">
                    <h2 className="order-title">{commodity.productName}</h2>
                    <p className="order-description">{commodity.description}</p>
                    <p className="order-price">
                        价格: <span>￥{commodity.unitPrice.toFixed(2)}</span>
                    </p>
                    <p className={`order-stock ${commodity.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {commodity.stock > 0 ? `库存: ${commodity.stock}` : '库存不足'}
                    </p>
                    <Stepper
                        value={amountValue}
                        step={1}
                        // min={1}
                        // max={10}
                        onChange={val => setAmountValue(val)}
                    />
                </div>

                <Button
                    className="order-button"
                    type="primary"
                    block
                    disabled={commodity.stock <= 0 || purchaseVisible}
                    onClick={handlePurchase}

                >
                    立即购买
                </Button>
            </div>

            {purchaseVisible &&
                <Card round style={{ width: "100%", marginTop: "10px" }}>
                    <Card.Body >
                        <div>商品信息：{purchaseData.commodityName}</div>
                        <div>数量:{purchaseData.oamount}</div>

                        <span style={{ fontSize: "20px", fontWeight: "600" }}>合计：￥{purchaseData.totalPrice}</span>
                    </Card.Body>
                    <Card.Footer>
                        <Space>
                            <Button
                                className="payment-button"
                                icon={<WechatPay fontSize={"2em"} />}
                                onClick={handlePayment}
                                round
                                size="large"
                            >
                                微信支付
                            </Button>

                            <Button
                                className="payment-button"
                                icon={<Alipay fontSize={"2em"} />}
                                round
                                onClick={handlePayment}
                                size="large"
                            >
                                支付宝支付
                            </Button>
                        </Space>
                    </Card.Footer>

                </Card>
            }

            <Overlay visible={overlayVisable} onClick={() => setOverlayVisible(false)}
                style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Loading style={{ display: 'inline-flex' }} size="24px" vertical>
                    加速下单中...
                </Loading>
            </Overlay>

        </div>
    );
};

export default Order;
