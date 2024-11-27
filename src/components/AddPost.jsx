import React, {useEffect, useState} from "react";
import { Button, Input, Form, Uploader, Toast, DatetimePicker } from 'react-vant';
import { Photograph, Location, VolumeO } from "@react-vant/icons";
import instance from "../utils/api";
import { NoticeBar } from 'react-vant';
import moment from 'moment'; // 引入 moment.js

const AddPost = ({ setActiveTab }) => {
    const [form] = Form.useForm(); // 使用 Form 组件管理表单
    const [images, setImages] = useState("");
    const [showDatetimePicker, setShowDatetimePicker] = useState(false); // 控制日期选择器的显示
    const [deliveryDate, setDeliveryDate] = useState(null); // 存储选择的日期
    useEffect(() => {
        if(deliveryDate !== undefined && deliveryDate !== null)
            Toast.success(moment(deliveryDate).format('YYYY-MM-DD'))

    }, [deliveryDate]);
    const handleSubmitPost = (values) => {
        const data = {
            title: values.title,
            images: images,
            categoryCode: values.categoryCode,
            categoryName: values.categoryName,
            locationInfo: values.locationInfo,
            locationCoordinate: values.locationCoordinate,
            description: values.description,
            cowBreed: values.cowBreed,
            cowSex: values.cowSex,
            cowAge: values.cowAge,
            purchaseLocation: values.purchaseLocation,
            purchaseQuantity: values.purchaseQuantity,
            purchaseUnitPrice: values.purchaseUnitPrice,
            averageWeight: values.averageWeight,
            deliveryDate: deliveryDate ? moment(deliveryDate).format('YYYY-MM-DD') : '', // 确保格式化
            purchaseCycle: values.purchaseCycle,
            contactPhone: values.contactPhone,
        };

        instance.post("/addPost", data)
            .then(res => {
                if (res.data.code === 200) {
                    setActiveTab("publish");
                }
            });
    };

    const upload = async (file) => {
        try {
            const body = new FormData();
            body.append('file', file);

            const resp = await fetch('https://app102.acapp.acwing.com.cn/api/uploadFile', {
                method: 'POST', body,
            });
            const json = await resp.json();
            setImages((imgs) => imgs === "" ? json.data.url : imgs + "," + json.data.url);

            return {
                url: json.data.url,
            };
        } catch (error) {
            console.error('Upload failed:', error);
            return {
                url: "https://app102.acapp.acwing.com.cn/media/1729242815102.png",
            };
        }
    };

    return (
        <div>
            <NoticeBar
                leftIcon={<VolumeO />}
                text='提交商品信息后,平台工作人员会第一时间与您取得联系确认交易细节,请注意接听来电!'
            />
            <Form form={form} onFinish={handleSubmitPost} layout="vertical">
                <h2 className="add-post-title">发布商品</h2>
                {/* 牛源信息 */}
                <Form.Item
                    name="cowBreed"
                    label="牛源品种"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入牛源品种' }]}
                >
                    <Input placeholder="请输入牛源品种" />
                </Form.Item>

                <Form.Item
                    name="cowSex"
                    label="牛源性别"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入牛源性别' }]}
                >
                    <Input placeholder="请输入牛源性别" />
                </Form.Item>

                <Form.Item
                    name="cowAge"
                    label="牛源月龄"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入牛源月龄' }]}
                >
                    <Input placeholder="请输入牛源月龄" />
                </Form.Item>

                <Form.Item
                    name="averageWeight"
                    label="牛只均重"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入牛只均重' }]}
                >
                    <Input placeholder="请输入牛只均重" />
                </Form.Item>

                <Form.Item
                    name="purchaseQuantity"
                    label="牛只数量"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入采购数量' }]}
                >
                    <Input placeholder="请输入采购数量" />
                </Form.Item>

                <Form.Item
                    name="purchaseUnitPrice"
                    label="单价"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入采购单价' }]}
                >
                    <Input placeholder="请输入采购单价" />
                </Form.Item>

                {/* 交货期 - 弹出选择框 */}
                <Form.Item
                    name="deliveryDate"
                    label="交货期"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    // rules={[{ required: true, message: '请选择交货期' }]}
                >
                    <Input
                        value={deliveryDate} // 格式化日期并显示在输入框中
                        placeholder="请选择交货期"
                        readOnly
                        onClick={() => setShowDatetimePicker(true)} // 点击时弹出日期选择器
                    />
                </Form.Item>

                {/* 交货日期选择弹出框 */}
                {showDatetimePicker && (
                    <DatetimePicker
                        visible={showDatetimePicker}
                        value={deliveryDate}
                        type='date'
                        onConfirm={(date) => {
                            setDeliveryDate(date); // 更新日期
                            setShowDatetimePicker(false); // 关闭弹框
                        }}
                        onCancel={() => setShowDatetimePicker(false)} // 取消时关闭弹框
                    />
                )}

                <Form.Item
                    name="locationInfo"
                    label="交货地点"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入交货地点' }]}
                >
                    <Input placeholder="请输入交货地点" prefix={<Location />} />
                </Form.Item>

                <Form.Item
                    name="contactPhone"
                    label="联系电话"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入联系电话' }]}
                >
                    <Input placeholder="请输入联系电话" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="描述"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请输入描述' }]}
                >
                    <Input.TextArea placeholder="请输入正文描述..." autoSize={{ minHeight: 200, maxHeight: 400 }} />
                </Form.Item>

                <Form.Item
                    name="images"
                    label="上传照片"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    rules={[{ required: true, message: '请上传照片' }]}
                >
                    <Uploader
                        multiple
                        uploadIcon={<Photograph />}
                        upload={upload}
                        maxCount={9}
                        maxSize={3 * 1024 * 1024}
                        onOversize={() => Toast.info('文件大小不能超过3MB')}
                        onOverCount={() => Toast.info('最多上传9张图片')}
                    />
                </Form.Item>

                {/* 提交按钮 */}
                <Form.Item>
                    <Button round nativeType="submit" type="primary" block style={{ marginBottom: "50px" }}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddPost;
