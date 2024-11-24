import React, { useEffect, useState } from 'react';
import './Publish.css';
import { Tabs, Input, Card, Image, Toast, Space, Flex, List, PullRefresh, Swiper, Button } from 'react-vant';
import { Search, Arrow, PhoneO, ShoppingCartO, ChartTrendingO } from '@react-vant/icons';
import { useNavigate } from 'react-router-dom';
import instance from '../utils/api';

const Publish = ({ boxMessage, setBoxMessage, sendMessage, setOrderItem, userinfo, setActiveTab }) => {
    const navigate = useNavigate();
    // const [tabsList] = useState(["全部", "牛", "羊", "猪", "鸭"]);
    // const [currentTab, setCurrentTab] = useState(0);
    const [search, setSearch] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [pageSize] = useState(10);
    const [list, setList] = useState([]);
    const [finished, setFinished] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [swpierDatas, setSwpierDatas] = useState([]);

    const onLoadRefresh = async (isRefresh) => {
        if (isOver) return;
        const nextPage = isRefresh ? 1 : pageNum;
        if (!isRefresh) setPageNum(prev => prev + 1);

        const res = await queryPost(nextPage);
        const data = res.data.datas || [];

        if (data.length === 0) {
            setIsOver(true);
            setFinished(true);
        } else {
            setList(prev => isRefresh ? data : [...prev, ...data]);
            if (data.length < pageSize) {
                setIsOver(true);
                setFinished(true);
            }
        }
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
                onClick={() => {
                    Toast.info(`你点击了卡片 ${index + 1}`);
                }}
            >
                <Image
                    src={item.images.includes(',') ? item.images.split(',')[0].trim() : item.images.trim()}
                    alt="封面图片"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
        return await instance.post("/getPostList", { search, categoryCode: 0, pageNum: page, pageSize });
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setList([]);
    //         setIsOver(false);
    //         setFinished(false);
    //         await onLoadRefresh(true);
    //     };
    //     fetchData();
    // }, [currentTab]);

    const onRefresh = async () => {
        setIsOver(false);
        setFinished(false);
        setPageNum(1);
        await onLoadRefresh(true);
    };

    const handleSearch = async () => {
        setList([]);
        setIsOver(false);
        setFinished(false);
        setPageNum(1);
        await onLoadRefresh(true);
    };

    const handleCardClick = (item) => {
        navigate('/post-detail', { state: { item } });
    };

    const handleContractClick = async (item) => {
        setOrderItem(item);
        instance.post('/messagesByDialog', {
            fromId: userinfo.id,
            toId: item.userId
        }).then(res => {
            setBoxMessage(res.data.datas[0]);
        });
        navigate('/contact', { state: { item } });
    };

    return (
        <div className='publish-container'>
            <div className='header-container'>
                <Input
                    prefix="💁"
                    value={search}
                    onChange={e => setSearch(e)}
                    suffix={<Search fontSize="2em" onClick={handleSearch} />}
                    placeholder="搜索您感兴趣的品类"
                />
            </div>

            <div className='body-container'>
                <div className="swiper-container">
                    <Swiper
                        autoplay={3000}
                        loop={true}
                        indicatorColor="white"
                        style={{
                            width: '100%',
                            height: '300px', // 轮播图高度
                        }}
                    >
                        {items}
                    </Swiper>
                </div>

                <div className="cards-container">
                    <Card className="card shop-card">
                        <Card.Header
                            icon={<ShoppingCartO />}
                            title="商城"
                        />
                        <Card.Body onClick={() => { setActiveTab("trade") }}>
                            商城 <ShoppingCartO />
                        </Card.Body>
                    </Card>
                    <Card className="card trade-card">
                        <Card.Header
                            icon={<ChartTrendingO />}
                            title="历史交易均价"
                        />
                        <Card.Body onClick={() => { setActiveTab("history") }}>
                            历史交易均价 <ChartTrendingO />
                        </Card.Body>
                    </Card>
                </div>


                <h5 className="section-title">今日精选</h5>
                <PullRefresh onRefresh={onRefresh} style={{ marginTop: '10px' }}>
                    <List finished={finished} onLoad={() => onLoadRefresh(false)}>
                        <Flex wrap="wrap" gutter={20}>
                            {list.map((item, i) => (
                                <Flex.Item key={i} span={12} className='item-box'>
                                    <Card round>
                                        <Card.Cover onClick={() => handleCardClick(item)}>
                                            <Image
                                                src={item.images.includes(',') ? item.images.split(',')[0].trim() : item.images.trim()}
                                                style={{ width: '100%', height: '15vh', objectFit: 'cover' }}
                                            />
                                        </Card.Cover>
                                        <Card.Header extra={<Arrow />}>{item.description}</Card.Header>
                                        <Card.Body>{item.locationInfo}</Card.Body>
                                        <Card.Footer>
                                            <Space>
                                                <Button
                                                    icon={<PhoneO />}
                                                    round
                                                    color='linear-gradient(to right, #ff6034, #ee0a24)'
                                                    size='small'
                                                    onClick={() => handleContractClick(item)}
                                                >
                                                    在线联系
                                                </Button>
                                            </Space>
                                        </Card.Footer>
                                    </Card>
                                </Flex.Item>
                            ))}
                        </Flex>
                    </List>
                </PullRefresh>
            </div>
        </div>
    );
};

export default Publish;
