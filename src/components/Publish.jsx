import React, { useEffect, useState } from 'react';
import "./Publish.css";
import { Tabs, Input, Button, Card, Image, Toast, Space, Flex, List, PullRefresh } from 'react-vant';
import { Search, Arrow, PhoneO } from '@react-vant/icons';

import instance from '../utils/api';

const Publish = () => {
    const [tabsList] = useState(["全部", "牛", "羊", "猪", "鸭"]);
    const [currentTab, setCurrentTab] = useState(0);
    const [search, setSearch] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [pageSize] = useState(10);
    const [list, setList] = useState([]);
    const [finished, setFinished] = useState(false);
    const [isOver, setIsOver] = useState(false);

    const onLoadRefresh = async (isRefresh) => {
        if (isOver) return; // 如果已经没有更多数据，直接返回
        const nextPage = isRefresh ? 1 : pageNum;
        if (!isRefresh) setPageNum(prev => prev + 1);

        const res = await queryPost(nextPage);
        const data = res.data.datas || [];

        if (data.length === 0) {
            setIsOver(true); // 如果没有数据返回，说明没有更多数据
            setFinished(true);
        } else {
            setList(prev => isRefresh ? data : [...prev, ...data]);
            if (data.length < pageSize) {
                setIsOver(true); // 如果数据量小于页大小，表示没有更多数据
                setFinished(true);
            }
        }
    };

    const queryPost = async (page) => {
        return await instance.post("/getPostList", { search, categoryCode: currentTab, pageNum: page, pageSize });
    };

    useEffect(() => {
        const fetchData = async () => {
            setList([]); // 切换 Tab 时清空列表
            setIsOver(false); // 重置 isOver 状态
            setFinished(false); // 重置 finished 状态
            await onLoadRefresh(true); // 重新加载数据
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
        setList([]); // 清空列表
        setIsOver(false); // 重置 isOver
        setFinished(false); // 重置 finished
        setPageNum(1); // 重置页码
        await onLoadRefresh(true); // 重新加载数据
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
                <Tabs onChange={(e) => { setCurrentTab(e); setPageNum(1) }}>
                    {tabsList.map((item, index) => (
                        <Tabs.TabPane key={index} title={item} />
                    ))}
                </Tabs>
            </div>

            <div className='body-container'>
                <PullRefresh onRefresh={onRefresh}>
                    <List finished={finished} onLoad={() => onLoadRefresh(false)}>
                        <Flex wrap="wrap" gutter={20}>
                            {list.map((item, i) => (
                                <Flex.Item key={i} span={12} className='item-box'>
                                    <Card round>
                                        <Card.Cover onClick={() => Toast.info('点击了Cover区域')}>
                                            <Image src={item.images} style={{ width: '100%', height: '15vh', objectFit: 'cover' }} />
                                        </Card.Cover>
                                        <Card.Header
                                            extra={<Arrow />}
                                            onClick={() => Toast.info('点击了Header区域')}
                                        >
                                            {item.description}
                                        </Card.Header>
                                        <Card.Body onClick={() => Toast.info('点击了Body区域')}>
                                            {item.locationInfo}
                                        </Card.Body>
                                        <Card.Footer>
                                            <Space>
                                                <Button
                                                    icon={<PhoneO />}
                                                    round
                                                    color='linear-gradient(to right, #ff6034, #ee0a24)'
                                                    size='small'
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
