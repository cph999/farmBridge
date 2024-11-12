import React from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import {Toast, NavBar} from 'react-vant';


const PostDetail = () => {
    const location = useLocation();
    const navigate = useNavigate(); // 使用 useNavigate 来进行页面跳转
    const {item} = location.state || {};  // 获取传递的数据

    if (!item) {
        return <div>没有找到相关信息</div>;
    }

    // 处理返回按钮的逻辑
    const handleBack = () => {
        Toast.info('返回');
        navigate(-1);  // 返回上一页
    };

    return (
        <div>
            <NavBar
                title={item.description}
                leftText="返回"
                onClickLeft={handleBack}  // 点击左侧按钮返回上一页
                onClickRight={() => Toast.info('按钮')}  // 右侧按钮的逻辑
            />
            <h1>{item.description}</h1>
            <img src={item.images} alt="图片" style={{width: '100%', height: 'auto'}}/>
            <p>{item.locationInfo}</p>
            {/* 你可以根据需求继续展示更多的 item 信息 */}
        </div>
    );
};

export default PostDetail;
