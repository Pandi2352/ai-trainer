import { useState, useEffect } from 'react';
import { Table, Button, Tag, Card, Space, Tooltip, Input } from 'antd';
import { EyeOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
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
            const rawData = response.data;
            // Handle nested structure: response.data.data.data because of NestJS interceptor + pagination
            const examsList = rawData?.data?.data || (Array.isArray(rawData?.data) ? rawData.data : (Array.isArray(rawData) ? rawData : []));
            setExams(examsList);
            setFilteredExams(examsList);
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
            title: 'Generated On',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span className="text-gray-600">{dayjs(date).format('DD MMM YYYY, HH:mm')}</span>,
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
                        <Link to={`/admin/exams/${record._id}`}>
                            <Button 
                                type="text" 
                                icon={<EyeOutlined className="text-blue-500" />} 
                            />
                        </Link>
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
                <div className="flex gap-2">
                    <Button 
                         icon={<ReloadOutlined spin={loading} />} 
                         onClick={() => fetchExams()}
                    >
                        Refresh
                    </Button>
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
