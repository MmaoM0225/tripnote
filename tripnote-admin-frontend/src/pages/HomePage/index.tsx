import React, { useEffect, useState } from 'react';
import {
    Table, Tag, Button, Space, Select, Card, message, Avatar, Layout, Dropdown
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getNotesByStatus } from '../../services/note';
import { useNavigate } from 'react-router-dom';
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
import './index.css';

const { Option } = Select;
const { Header, Content } = Layout;

const statusMap = {
    pending: { text: '待审核', color: 'orange' },
    approved: { text: '已通过', color: 'green' },
    rejected: { text: '未通过', color: 'red' },
};

const Home: React.FC = () => {
    const [filter, setFilter] = useState<string>('all');
    const [data, setData] = useState<NoteAPI.NoteItem[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState<{ nickname: string; avatar: string }>({
        nickname: '',
        avatar: '',
    });
    // 读取 token 和 user，解析后只取 nickname & avatar；否则跳登录
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        try {
            const info = JSON.parse(storedUser) as {
                id: number;
                nickname: string;
                avatar: string;
                status: number;
                role: string;
            };

            // nickname 为空也视为未登录
            if (!info.nickname) {
                navigate('/login');
                return;
            }

            setUser({
                nickname: info.nickname,
                avatar: info.avatar,
            });
        } catch (err) {
            console.error('解析 localStorage.user 失败', err);
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.success('已退出登录');
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <span onClick={handleLogout}>退出登录</span>,
        },
    ];

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getNotesByStatus(filter as NoteAPI.Status);
            if (res.data.code === 0) {
                setData(res.data.data);
            } else {
                message.error(res.data.message || '获取游记失败');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            message.error('网络错误');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filter]);

    const columns: ColumnsType<NoteAPI.NoteItem> = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: (_, record) => (
                <a onClick={() => navigate(`/detail/${record.id}`)}>{record.title}</a>
            ),
        },
        {
            title: '作者',
            dataIndex: ['author', 'nickname'],
            key: 'author',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const info = statusMap[status as keyof typeof statusMap];
                return <Tag color={info.color}>{info.text}</Tag>;
            },
        },
        {
            title: '发布时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => navigate(`/detail/${record.id}`)}>查看</Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout className="audit-list-page">
            <Header className="audit-header">
                <div className="audit-logo">旅游日记管理后台</div>
                <div className="audit-user-info">
                    <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Avatar icon={<UserOutlined />} src={user.avatar || undefined} />
                            <span style={{ marginLeft: 8 }}>{user.nickname}</span>
                        </div>
                    </Dropdown>
                </div>
            </Header>
            <Content style={{ padding: '24px' }}>
                <Card
                    title="审核列表"
                    extra={
                        <Select value={filter} onChange={setFilter} style={{ width: 150 }}>
                            <Option value="all">全部</Option>
                            <Option value="pending">待审核</Option>
                            <Option value="approved">已通过</Option>
                            <Option value="rejected">未通过</Option>
                        </Select>
                    }
                >
                    <Table
                        rowKey="id"
                        dataSource={data}
                        columns={columns}
                        loading={loading}
                        pagination={{ pageSize: 7 }}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default Home;
