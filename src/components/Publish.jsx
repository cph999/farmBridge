import React, {useEffect, useState} from 'react';
import './Publish.css';
import {Tabs, Input, Card, Image, Toast, Flex, List, Divider, Cascader, Field, Swiper, Button} from 'react-vant';
import {Search, PhoneO, ShoppingCartO, ChartTrendingO, LocationO, BullhornO} from '@react-vant/icons';
import {useNavigate} from 'react-router-dom';
import instance from '../utils/api';

const Publish = ({boxMessage, setBoxMessage, sendMessage, setOrderItem, userinfo, setActiveTab}) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [pageSize] = useState(10);
    const [list, setList] = useState([]);
    const [finished, setFinished] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [swpierDatas, setSwpierDatas] = useState([]);
    const [locationInfo, setLocationInfo] = useState([]); // 初始值为空数组
    const [locationShow, setLocationShow] = useState("中国");
    const onLocationChange = (values, selectedRows) => {
        setLocationShow(selectedRows[0].text);
        setLocationInfo(values);
    };


    const options = [
        {
            text: '浙江省',
            value: '330000',
            children: [
                {
                    text: '杭州市',
                    value: '330100',
                    children: [
                        {
                            text: '上城区',
                            value: '330102',
                        },
                        {
                            text: '下城区',
                            value: '330103',
                        },
                        {
                            text: '江干区',
                            value: '330104',
                        },
                    ],
                },
                {
                    text: '宁波市',
                    value: '330200',
                    children: [
                        {
                            text: '海曙区',
                            value: '330203',
                        },
                        {
                            text: '江北区',
                            value: '330205',
                        },
                        {
                            text: '北仑区',
                            value: '330206',
                        },
                    ],
                },
                {
                    text: '温州市',
                    value: '330300',
                    children: [
                        {
                            text: '鹿城区',
                            value: '330302',
                        },
                        {
                            text: '龙湾区',
                            value: '330303',
                        },
                        {
                            text: '瓯海区',
                            value: '330304',
                        },
                    ],
                },
            ],
        },
        {
            text: '江苏省',
            value: '320000',
            children: [
                {
                    text: '南京市',
                    value: '320100',
                    children: [
                        {
                            text: '玄武区',
                            value: '320102',
                        },
                        {
                            text: '秦淮区',
                            value: '320104',
                        },
                        {
                            text: '建邺区',
                            value: '320105',
                        },
                    ],
                },
                {
                    text: '无锡市',
                    value: '320200',
                    children: [
                        {
                            text: '锡山区',
                            value: '320205',
                        },
                        {
                            text: '惠山区',
                            value: '320206',
                        },
                        {
                            text: '滨湖区',
                            value: '320211',
                        },
                    ],
                },
                {
                    text: '徐州市',
                    value: '320300',
                    children: [
                        {
                            text: '鼓楼区',
                            value: '320302',
                        },
                        {
                            text: '云龙区',
                            value: '320303',
                        },
                        {
                            text: '贾汪区',
                            value: '320305',
                        },
                    ],
                },
            ],
        },
    ];

    // const [channels, setChannels] = useState(null);

    //
    // useEffect(() => {
    //     if (typeof window.plus !== 'undefined') {
    //         const handlePlusReady = () => {
    //             window.plus.payment.getChannels((s) => {
    //                 setChannels(s);
    //             }, (e) => {
    //                 Toast.fail("获取支付通道列表失败：" + e.message);
    //             });
    //         };
    //
    //         document.addEventListener("plusready", handlePlusReady, false);
    //
    //         // 清理监听
    //         return () => {
    //             document.removeEventListener("plusready", handlePlusReady, false);
    //         };
    //     } else {
    //         console.log("Non-HBuilder environment: plus is not available.");
    //     }
    // }, []); // 只在组件挂载时运行一次
    //
    //
    // const requestPay = (c) => {
    //     // 必须从业务服务器获取支付信息
    //     const statement = "...";
    //     if (!c.serviceReady) {
    //         c.installService();
    //     }
    //
    //     window.plus.payment.request(c, statement, () => {
    //         Toast.success("支付操作成功！");
    //     }, (e) => {
    //         Toast.fail("支付失败：" + e.message);
    //     });
    // };


    const onLoadRefresh = async (isRefresh) => {
        if (isOver) return;
        const nextPage = isRefresh ? 1 : pageNum;
        if (!isRefresh) setPageNum(prev => prev + 1);

        const res = await queryPost(nextPage);
        const data = res.data.datas || [];

        setList(prev => isRefresh ? data : [...prev, ...data]);

        setIsOver(true);
        setFinished(true);
        // if (data.length === 0) {
        //     setIsOver(true);
        //     setFinished(true);
        // } else {
        //     setList(prev => isRefresh ? data : [...prev, ...data]);
        //     if (data.length < pageSize) {
        //         setIsOver(true);
        //         setFinished(true);
        //     }
        // }
    };

    const items = swpierDatas.map((item, index) => (
        <Swiper.Item key={index}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Image
                    src={item.images.includes(',') ? item.images.split(',')[0].trim() : item.images.trim()}
                    alt="封面图片"
                    style={{
                        width: '100%',
                        height: 'auto',  // 让图片的高度根据宽度自适应
                        objectFit: 'contain',  // 保证图片完整显示
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        color: '#fff',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: '5px 10px',
                        borderRadius: '5px',
                    }}
                >
                    {item.description}
                </div>
            </div>
        </Swiper.Item>
    ));

    useEffect(() => {
        const fetchSwiperData = () => {
            instance.post("/popularData")
                .then(res => {
                    if (res.data.code === 200)
                        setSwpierDatas(res.data.datas);
                });
        };
        fetchSwiperData();
    }, []);

    const queryPost = async (page) => {
        return await instance.post("/getPostList", {search, categoryCode: 0, pageNum: page, pageSize});
    };

    const handleSearch = async () => {
        setList([]);
        setIsOver(false);
        setFinished(false);
        setPageNum(1);
        await onLoadRefresh(true);
    };

    const handleCardClick = (item) => {
        navigate('/post-detail', {state: {item}});
    };

    const handleContractClick = async (item) => {
        setOrderItem(item);
        instance.post('/messagesByDialog', {
            fromId: userinfo.id,
            toId: item.userId
        }).then(res => {
            setBoxMessage(res.data.datas[0]);
        });
        navigate('/contact', {state: {item}});
    };

    return (
        <div className='publish-container'>
            <div className='header-container'>
                <Flex align="center">
                    <Flex.Item span={8}>
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <LocationO fontSize="1em"/>
                            <Cascader
                                popup={{round: true}}
                                title="请选择所在地区"
                                options={options}
                                value={locationInfo}  // 传递的是ID数组
                                onChange={onLocationChange}
                            >
                                {(_, selectedRows, actions) => (
                                    <Field
                                        isLink
                                        value={selectedRows.map(el => el.text).join(',')}  // 显示选中的地区名
                                        readOnly
                                        label={locationShow || '请选择所在地区'}  // 显示选中的中文地区名称
                                        placeholder="请选择所在地区"
                                        onClick={() => actions.open()}
                                    />
                                )}
                            </Cascader>
                        </div>
                    </Flex.Item>
                    <Flex.Item span={16}>
                        <Input
                            prefix={<Search fontSize="1em" onClick={handleSearch}/>}
                            value={search}
                            onChange={e => setSearch(e)}
                            placeholder="搜索您感兴趣的品类"
                        />
                    </Flex.Item>
                </Flex>
                <div className="swiper-container">
                    <Swiper
                        autoplay={3000}
                        loop={true}
                        indicatorColor="white"
                    >
                        {items}
                    </Swiper>
                </div>
                <div>
                    <Flex wrap="wrap" justify="around" gutter={20}>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告1</div>
                        </Flex.Item>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告2</div>
                        </Flex.Item>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告3</div>
                        </Flex.Item>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告4</div>
                        </Flex.Item>
                    </Flex>
                    <Flex wrap="wrap" justify="around" gutter={20}>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告5</div>
                        </Flex.Item>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告6</div>
                        </Flex.Item>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告7</div>
                        </Flex.Item>
                        <Flex.Item style={{flexBasis: 'calc(25% - 20px)', textAlign: 'center', marginBottom: '20px'}}>
                            <BullhornO/>
                            <div style={{marginTop: '8px'}}>公告8</div>
                        </Flex.Item>
                    </Flex>
                </div>
                <div className="cards-container">
                    <Card className="card shop-card">
                        <Card.Header
                            icon={<ShoppingCartO/>}
                            title="商城"
                        />
                        <Card.Body onClick={() => {
                            setActiveTab("trade")
                        }}>
                            商城 <ShoppingCartO/>
                        </Card.Body>
                    </Card>
                    <Card className="card trade-card">
                        <Card.Header
                            icon={<ChartTrendingO/>}
                            title="历史交易均价"
                        />
                        <Card.Body onClick={() => {
                            setActiveTab("history")
                        }}>
                            历史交易均价 <ChartTrendingO/>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className='body-container'>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span className="section-title" style={{fontSize: '18px', fontWeight: 'bold'}}>每日精选</span>
                    <span
                        style={{
                            fontSize: '14px',
                            color: '#ff6034',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                        onClick={() => {
                            console.log('跳转到更多商品');
                        }}
                    >
                    更多商品
                </span>
                </div>
                <Divider/>
                <List finished={finished} onLoad={() => onLoadRefresh(false)}
                      style={{marginTop: '10px', marginBottom: '50px'}}>
                    <Flex wrap="wrap" gutter={20}>
                        {list.map((item, i) => (
                            <Flex.Item key={i} span={12} className="item-box" style={{maxWidth: '48%'}}>
                                <Card round style={{height: '220px'}}>
                                    <Card.Cover onClick={() => handleCardClick(item)}>
                                        <Image
                                            src={item.images.includes(',') ? item.images.split(',')[0].trim() : item.images.trim()}
                                            style={{
                                                width: '100%',
                                                height: '17vh',  // 确保图片占据卡片的固定高度
                                                objectFit: 'cover',  // 图片填充卡片区域，不变形
                                            }}
                                        />
                                    </Card.Cover>
                                    <Card.Header>{item.description}</Card.Header>
                                    <Card.Body style={{flex: 1}}></Card.Body> {/* 保证内容区域高度一致 */}
                                    {/*<Card.Footer>*/}
                                    <Button
                                        style={{position: "absolute", zIndex: 1, bottom: "10px", right: "10px"}}
                                        icon={<PhoneO/>}
                                        round
                                        color="linear-gradient(to right, #ff6034, #ee0a24)"
                                        size="small"
                                        onClick={() => handleContractClick(item)}
                                    >
                                        在线联系
                                    </Button>
                                </Card>
                            </Flex.Item>

                        ))}
                    </Flex>
                </List>
            </div>
        </div>
    );
};

export default Publish;
