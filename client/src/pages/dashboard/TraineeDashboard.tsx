import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Empty, message } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';

const TraineeDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await axiosInstance.get('/assignments/my');
            setAssignments(response.data.data || response.data);
        } catch (error) {
            console.error(error);
            message.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Assessment',
            dataIndex: ['exam', 'title'],
            key: 'exam',
            render: (text: string, record: any) => (
                <div>
                    <div className="font-medium text-base">{text || 'Untitled Exam'}</div>
                    <div className="text-xs text-gray-500">{record.exam?.difficulty?.toUpperCase()} • {record.exam?.questions?.length || 0} Questions</div>
                </div>
            )
        },
        {
            title: 'Assigned By',
            dataIndex: ['assignedBy', 'name'],
            key: 'assignedBy',
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (date: string) => (
                <span>
                    <CalendarOutlined className="mr-2 text-gray-400" />
                    {dayjs(date).format('MMM D, YYYY h:mm A')}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'pending') color = 'blue';
                if (status === 'in-progress') color = 'orange';
                if (status === 'submitted') color = 'green';
                if (status === 'overdue') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button 
                    type="primary" 
                    icon={record.status === 'completed' ? <CheckCircleOutlined /> : <PlayCircleOutlined />}
                    disabled={record.status === 'completed' || record.status === 'overdue'}
                    onClick={() => message.info('Exam attempt flow coming in Sprint 4!')}
                >
                    {record.status === 'completed' ? 'View Result' : 'Start Exam'}
                </Button>
            )
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Assignments</h1>
            
            <Card className="shadow-sm">
                <Table 
                    columns={columns} 
                    dataSource={assignments} 
                    rowKey="_id" 
                    loading={loading}
                    locale={{ emptyText: <Empty description="No exams assigned to you yet" /> }}
                />
            </Card>
        </div>
    );
};

export default TraineeDashboard;
