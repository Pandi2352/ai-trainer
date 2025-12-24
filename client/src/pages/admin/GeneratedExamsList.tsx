import { useState, useEffect } from 'react';
import { Table, Button, Tag, Card, Space, Tooltip, Input } from 'antd';
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/common/Loader';

const GeneratedExamsList = () => {
    const [exams, setExams] = useState<any[]>([]);
    const [filteredExams, setFilteredExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const { addToast } = useToast();

    const fetchExams = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/exams');
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setExams(data);
            setFilteredExams(data);
        } catch (error) {
            console.error(error);
            addToast('Failed to load exams', 'error');
            setExams([]);
            setFilteredExams([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        if (!searchText) {
            setFilteredExams(exams);
        } else {
            const lowerSearch = searchText.toLowerCase();
            const filtered = exams.filter(exam => 
                (exam.title && exam.title.toLowerCase().includes(lowerSearch)) || 
                (exam.topic && exam.topic.toLowerCase().includes(lowerSearch))
            );
            setFilteredExams(filtered);
        }
    }, [searchText, exams]);

    const columns = [
        {
            title: 'Title / Topic',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: any) => (
                <div>
                    <div className="font-semibold text-gray-800">{text || record.topic}</div>
                    <div className="text-xs text-gray-500">{record._id}</div>
                </div>
            ),
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (difficulty: string) => {
                const colors: Record<string, string> = {
                    easy: 'green',
                    medium: 'orange',
                    hard: 'red'
                };
                return <Tag color={colors[difficulty] || 'default'}>{difficulty?.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Questions',
            dataIndex: 'questions',
            key: 'questions',
            render: (questions: any[]) => <Tag color="purple">{questions?.length || 0}</Tag>
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span className="text-gray-600">{dayjs(date).format('MMM D, YYYY HH:mm')}</span>,
            sorter: (a: any, b: any) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            defaultSortOrder: 'descend' as const,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                 const colors: Record<string, string> = {
                    completed: 'processing',
                    generating: 'warning',
                    failed: 'error',
                    draft: 'default'
                };
                return <Tag color={colors[status]}>{status?.toUpperCase()}</Tag>;
            },
            filters: [
                { text: 'Completed', value: 'completed' },
                { text: 'Generating', value: 'generating' },
                { text: 'Failed', value: 'failed' },
            ],
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button 
                            type="text" 
                            icon={<EyeOutlined className="text-blue-500" />} 
                            onClick={() => navigate(`/admin/exams/${record._id}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                     <h1 className="text-2xl font-bold text-gray-800">Generated Exams</h1>
                     <p className="text-gray-500">Manage and review all AI-generated assessments.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    size="large" 
                    className="bg-primary-600 hover:bg-primary-500 shadow-md shadow-primary-500/30"
                    onClick={() => navigate('/admin/exams/create')}
                >
                    Create New Exam
                </Button>
            </div>

            <Card className="shadow-sm border-gray-100 rounded-xl">
                 <div className="mb-4 flex gap-4">
                    <Input 
                        prefix={<SearchOutlined className="text-gray-400" />}
                        placeholder="Search by topic..." 
                        className="max-w-sm rounded-lg"
                        allowClear
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                 </div>

                <Table 
                    columns={columns} 
                    dataSource={Array.isArray(filteredExams) ? filteredExams : []} 
                    rowKey="_id" 
                    loading={{ indicator: <Loader />, spinning: loading }}
                    pagination={{ pageSize: 8 }}
                />
            </Card>
        </div>
    );
};

export default GeneratedExamsList;
