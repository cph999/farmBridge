import React, { useEffect, useState } from 'react';
import "./Publish.css";
import { Tabs, Input, Button, Card, Image, Toast, Space, Flex, List, PullRefresh, Swiper } from 'react-vant';
import { Search, Arrow, PhoneO } from '@react-vant/icons';
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate
import defaultImage from "../assets/icon.png";
import instance from '../utils/api';

const Publish = ({ boxMessage, setBoxMessage, sendMessage }) => {
    const navigate = useNavigate();  // 初始化 useNavigate
    const [tabsList] = useState(["全部", "牛", "羊", "猪", "鸭"]);
    const [currentTab, setCurrentTab] = useState(0);
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
                    src={item.images}
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
        return await instance.post("/getPostList", { search, categoryCode: currentTab, pageNum: page, pageSize });
    };

    useEffect(() => {
        const fetchData = async () => {
            setList([]);
            setIsOver(false);
            setFinished(false);
            await onLoadRefresh(true);
        };
        fetchData();
    }, [currentTab]);

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

    // 点击卡片跳转
    const handleCardClick = (item) => {
        navigate('/post-detail', { state: { item } });  // 携带 item 数据
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
                <Tabs onChange={(e) => {
                    setCurrentTab(e);
                    setPageNum(1);
                }}>
                    {tabsList.map((item, index) => (
                        <Tabs.TabPane key={index} title={item} />
                    ))}
                </Tabs>
            </div>

            <div className='body-container'>
                <div className="swiper-container">
                    <Swiper autoplay={5000} loop={true}>{items}</Swiper>
                </div>
                <PullRefresh onRefresh={onRefresh} style={{ marginTop: '10px' }}>
                    <List finished={finished} onLoad={() => onLoadRefresh(false)}>
                        <Flex wrap="wrap" gutter={20}>
                            {list.map((item, i) => (
                                <Flex.Item key={i} span={12} className='item-box'>
                                    <Card round>
                                        <Card.Cover onClick={() => handleCardClick(item)}>
                                            <Image src={item.images}
                                                style={{ width: '100%', height: '15vh', objectFit: 'cover' }} />
                                        </Card.Cover>
                                        <Card.Header
                                            extra={<Arrow />}
                                        >
                                            {item.description}
                                        </Card.Header>
                                        <Card.Body>
                                            {item.locationInfo}
                                        </Card.Body>
                                        <Card.Footer>
                                            <Space>
                                                <Button
                                                    icon={<PhoneO />}
                                                    round
                                                    color='linear-gradient(to right, #ff6034, #ee0a24)'
                                                    size='small'
                                                    onClick={() => {
                                                        navigate('/contact', { state: { item } });  // 携带 item 数据
                                                    }}
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
