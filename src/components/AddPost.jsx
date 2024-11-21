import React, { useState } from "react";
import './AddPost.css';
import { Toast, Uploader, Input, Selector, Button, Form } from 'react-vant';
import { AddO, Location, GuideO } from "@react-vant/icons";
import instance from "../utils/api";

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [images, setImages] = useState("");
    const [categoryCode, setCategoryCode] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [locationInfo, setLocationInfo] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmitPost = () => {
        const data = {
            title: title,
            images: images,
            categoryCode: categoryCode,
            categoryName: categoryName,
            locationInfo: locationInfo,
            description: description
        }
        instance.post("/addPost", data)
            .then(res => {
                console.log("addPost res", res)
            })
    }
    const upload = async (file) => {
        try {
            const body = new FormData();
            body.append('file', file);

            const resp = await fetch('http://localhost:8809/api/uploadFile', {
                method: 'POST',
                body,
            });
            const json = await resp.json();
            console.log('Upload successful:', json.data.url);
            setImages((imgs) => {
                if (imgs === "") return json.data.url;
                else return imgs + "," + json.data.url;
            })
            return {
                url: json.data.url,
            };
        } catch (error) {
            console.error('Upload failed:', error);

            // 返回默认图片以避免组件错误
            return {
                url: "https://app102.acapp.acwing.com.cn/media/1729242815102.png",
            };
        }
    };
    const options = [
        {
            label: '牛',
            value: 'niu',
        },
        {
            label: '猪',
            value: 'zhu',
        },
        {
            label: '羊',
            value: 'yang',
        },
        {
            label: '鸭',
            value: 'ya',
        },
    ]

    return (
        <div className="add-post-container">
            <h2 className="add-post-title">发布帖子</h2>
            <Uploader
                multiple
                uploadIcon={<AddO />}
                upload={upload}
                maxCount={9}
                maxSize={3 * 1024 * 1024}
                onOversize={() => Toast.info('文件大小不能超过3MB')}
                onOverCount={() => Toast.info('最多上传9张图片')}
                className="add-post-uploader"
            />

            <div className="add-post-inputs">
                <Input
                    placeholder="请输入标题"
                    value={title}
                    prefix={<GuideO />
                    }
                    onChange={setTitle}
                    clearable
                    maxLength={20}
                    onOverlimit={() => { Toast.fail("标题限制20字符") }}
                    className="add-post-title-input"
                />
                <Form.Item name='single' label='种类'>
                    <Selector
                        options={options}
                        defaultValue={['1']}
                        onChange={(arr, extend) => {
                            setCategoryCode(extend.items[0].value)
                            setCategoryName(extend.items[0].label)
                        }
                        }
                    />
                </Form.Item>
                <Input.TextArea
                    placeholder="请输入正文描述..."
                    autoSize={{ minHeight: 200, maxHeight: 400 }}
                    className="add-post-textarea"
                    value={description}
                    onChange={setDescription}
                />
                <Input
                    placeholder="标记地点"
                    prefix={<Location />}
                    value={title}
                    onChange={setTitle}
                    className="add-post-title-input"
                />
                <Button type='primary' plain round size='large' onClick={() => { handleSubmitPost() }}>发布</Button>

            </div>
        </div>
    );
};

export default AddPost;
