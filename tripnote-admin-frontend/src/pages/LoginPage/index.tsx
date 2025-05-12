import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import './index.css';
import { login } from '../../services/user'; // 自定义接口
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: { username: string; password: string }) => {

        setLoading(true);
        try {
            const res = await login(values);

            if (res.data.code === 0) {
                const { token, user } = res.data.data;

                if (user.role === 'user') {
                    messageApi.warning('您无权访问审核系统');
                    return;
                }

                // 权限允许：保存信息 & 跳转
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                messageApi.success('登录成功');
                navigate('/home');
            } else {
                messageApi.warning(res.data.message || '登录失败');
            }
        } catch (err) {
            messageApi.error('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {contextHolder}
        <div className="login-box">
        <h2 className="title">后台管理系统</h2>
            <Form name="login" onFinish={onFinish} layout="vertical">
    <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
    <Input placeholder="请输入账号" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
    <Input.Password placeholder="请输入密码" />
    </Form.Item>
    <Form.Item>
    <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}>
    我已阅读并同意服务条例
    </Checkbox>
    </Form.Item>
    <Form.Item>
    <Button type="primary" htmlType="submit" block loading={loading} disabled={!agree}>
    登录
    </Button>
    </Form.Item>
    </Form>
    </div>
    </div>
);
};

export default Login;
