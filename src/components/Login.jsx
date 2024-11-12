
import React from "react";
import "./Login.css"
import { Button, Flex, Form, Input, Toast } from 'react-vant';
import { useState, useEffect } from 'react';
import { UserO } from '@react-vant/icons';
import instance from "../utils/api"
import LocalStorageUtil from "../utils/LocalStorageUtil";


const Login = ({ onLoginSuccess }) => {
    const [form] = Form.useForm();
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(60); // 倒计时初始值设为60秒
    const [userRole, setUserRole] = useState('');


    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const onFinish = (values) => {
        const { phone, verificationCode } = values;

        if (!phone || !verificationCode) {
            Toast.fail('请检查手机号与验证码');
            return;
        }

        instance.post("/login", { phone, verificationCode }).then(res => {
            console.log("userinfo", res.data.data)
            LocalStorageUtil.setItem("userinfo", res.data.data)
        });
        Toast.success('登录成功');
        onLoginSuccess();
        console.log('登录信息:', values);
    };

    // 获取验证码，并启动倒计时
    const sendVerificationCode = () => {
        instance.get("/generateVC/" + form.getFieldValue('phone')).then(
            res => {
                if (res.data.code === 200) {
                    Toast.success('验证码已发送');
                } else {
                    Toast.fail('验证码发送失败');
                }
            }
        )
        setIsCodeSent(true);
        setCountdown(60); // 重置倒计时
    };

    // 倒计时效果
    useEffect(() => {
        let timer;
        if (isCodeSent && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsCodeSent(false); // 倒计时结束后重新启用按钮
        }
        return () => clearInterval(timer); // 清除计时器
    }, [isCodeSent, countdown]);

    const handleRoleSelection = (role) => {
        setUserRole(role);
        setIsCodeSent(false); // 重置验证码状态
    };

    return (
        <div className="login-container">
            <div className="loginBox">
                <Flex gutter={16} wrap="wrap" className="button-group">
                    <Flex.Item span={12}>
                        <Button
                            color="linear-gradient(to right, #4CAF50, #8BC34A)"
                            round
                            className="role-button"
                            onClick={() => handleRoleSelection('farmer')}
                        >
                            我是养殖户
                        </Button>
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Button
                            color="linear-gradient(to right, #B71C1C, #F44336)"
                            round
                            className="role-button"
                            onClick={() => handleRoleSelection('slaughterhouse')}
                        >
                            我是屠宰场
                        </Button>
                    </Flex.Item>
                </Flex>
                <h2>{userRole === 'farmer' ? '养殖户登录' : '屠宰场登录'}</h2>

                <Form form={form} onFinish={onFinish}>
                    <Form.Item name="phone" rules={[{ message: '请填写手机号' }]}>
                        <Input placeholder="请输入手机号" type="tel" className="input-field" prefix={<UserO />} />
                    </Form.Item>

                    <Form.Item name="verificationCode" rules={[{ message: '请填写验证码' }]}>
                        <Input placeholder="请输入验证码" type="text" className="input-field" suffix={
                            <Button
                                className="code-button"
                                disabled={isCodeSent}
                                onClick={sendVerificationCode}
                            >
                                {isCodeSent ? `${countdown}秒后重试` : '获取验证码'}
                            </Button>} />
                    </Form.Item>

                    <Button round nativeType="submit" type="primary" block className="submit-button" onClick={() => { }}>
                        登录
                    </Button>
                </Form>
            </div>
        </div>


    );
}

export default Login;