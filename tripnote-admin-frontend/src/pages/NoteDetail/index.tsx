import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Image, Tag, Button, Modal, message, Typography } from 'antd';
import { getNoteById, approveNote, rejectNote, deleteNote } from '../../services/note';
import './index.css';

const { Paragraph } = Typography;

const statusMap = {
    pending: { text: '待审核', color: 'orange' },
    approved: { text: '已通过', color: 'green' },
    rejected: { text: '未通过', color: 'red' },
};

const NoteDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState<NoteAPI.NoteItem | null>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const loadNote = async () => {
        try {
            const res = await getNoteById(Number(id));
            if (res.data.code === 0) {
                setNote(res.data.data);
            } else {
                message.error(res.data.message || '获取详情失败');
            }
        } catch {
            message.error('加载失败');
        }
    };

    useEffect(() => {
        loadNote();
    }, [id]);

    const handleApprove = async () => {
        await approveNote(Number(id));
        message.success('审核通过');
        navigate('/');
    };

    const handleReject = async () => {
        if (!rejectReason) {
            return message.warning('请输入拒绝原因');
        }
        await rejectNote(Number(id), rejectReason);
        message.success('审核已拒绝');
        setRejectModalOpen(false);
        navigate('/');
    };

    const handleDelete = async () => {
        Modal.confirm({
            title: '确认删除此游记？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                await deleteNote(Number(id));
                message.success('已删除');
                navigate('/');
            },
        });
    };

    if (!note) return <div style={{ padding: 24 }}>加载中...</div>;

    return (
        <div className="note-detail-page">
            <Card
                className="note-detail-card"
                title={note.title}
                extra={<Tag color="blue">{statusMap[note.status].text}</Tag>}
            >
                <Paragraph className="note-paragraph">
                    <strong>作者：</strong>{note.author.nickname}
                </Paragraph>
                <Paragraph className="note-paragraph">
                    <strong>内容：</strong>{note.content}
                </Paragraph>
                <Paragraph className="note-paragraph">
                    <strong>图像：</strong>
                    <div className="note-images">
                        <Image.PreviewGroup>
                            {note.image_urls.map((url, idx) => (
                                <Image key={idx} src={url} width={120} />
                            ))}
                        </Image.PreviewGroup>
                    </div>
                </Paragraph>
                {note.video_url && (
                    <Paragraph className="note-paragraph">
                        <strong>视频：</strong>
                        <div className="note-video">
                            <video src={note.video_url} controls width={360} />
                        </div>
                    </Paragraph>
                )}
                <div className="note-actions">
                    <Button type="primary" onClick={handleApprove}>通过</Button>
                    <Button danger onClick={() => setRejectModalOpen(true)}>拒绝</Button>
                    {isAdmin && (
                        <Button danger onClick={handleDelete}>删除</Button>
                    )}
                </div>
            </Card>

            <Modal
                open={rejectModalOpen}
                title="填写拒绝原因"
                okText="提交"
                cancelText="取消"
                onCancel={() => setRejectModalOpen(false)}
                onOk={handleReject}
            >
      <textarea
          rows={4}
          style={{ width: '100%' }}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
      />
            </Modal>
        </div>
    );
};

export default NoteDetail;
