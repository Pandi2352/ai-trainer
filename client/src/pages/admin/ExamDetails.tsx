import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Tag, Button, Statistic, Row, Col, Progress, message } from 'antd';
import { ArrowLeftOutlined, UserOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import DataTable from '../../components/common/DataTable';
import dayjs from 'dayjs';

const ExamDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExamDetails();
    }, [id]);

    const fetchExamDetails = async () => {
        try {
            const response = await axiosInstance.get(`/exams/${id}`);
            setExam(response.data);
        } catch (error) {
            message.error('Failed to load exam details');
            navigate('/admin/dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !exam) return <div>Loading...</div>;

    const candidateColumns = [
        { title: 'Trainee', dataIndex: ['assignedTo', 'name'], key: 'name' },
        { title: 'Email', dataIndex: ['assignedTo', 'email'], key: 'email' },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: string) => {
                const colors: any = { pending: 'blue', 'in-progress': 'orange', submitted: 'green', overdue: 'red' };
                return <Tag color={colors[status] || 'default'}>{status.toUpperCase()}</Tag>;
            }
        },
        { 
            title: 'Assigned Date', 
            dataIndex: 'createdAt', 
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('MMM D, YYYY')
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            render: (score: number) => score !== undefined ? `${score} / ${exam.totalMarks}` : '-'
        }
    ];

    const questionsTab = (
        <div className="space-y-4">
            {exam.questions.map((q: any, i: number) => (
                <Card key={q._id} size="small" title={`Q${i + 1}: ${q.type.toUpperCase()} (${q.points} Marks)`}>
                    <p className="text-lg mb-2">{q.text}</p>
                    {q.options && (
                        <ul className="list-disc pl-5 text-gray-600">
                            {q.options.map((opt: string, idx: number) => <li key={idx}>{opt}</li>)}
                        </ul>
                    )}
                    <div className="mt-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                        <strong>Correct:</strong> {q.correctAnswer}
                    </div>
                </Card>
            ))}
        </div>
    );

    const analyticsTab = (
        <div className="text-center py-10">
            <BarChartOutlined style={{ fontSize: 64, color: '#1890ff' }} />
            <h3 className="mt-4 text-xl">Analytics Coming Soon</h3>
            <p className="text-gray-500">Visualization of candidate performance will appear here.</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/dashboard')} className="mb-4">
                Back to Dashboard
            </Button>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
                        <div className="space-x-2">
                            <Tag color="blue">{exam.difficulty}</Tag>
                            <Tag color="purple">{exam.domain}</Tag>
                            <Tag>{exam.questions.length} Questions</Tag>
                        </div>
                    </div>
                    <div className="text-right">
                        <Statistic title="Total Marks" value={exam.totalMarks} />
                    </div>
                </div>
            </div>

            <Tabs
                items={[
                    {
                        key: '1',
                        label: <span><UserOutlined />Candidates</span>,
                        children: (
                            <DataTable 
                                apiEndpoint={`/assignments/exam/${id}`} 
                                columns={candidateColumns} 
                                searchable={false}
                                filters={[
                                    { key: 'status', label: 'Status', options: [
                                        { label: 'Pending', value: 'pending' },
                                        { label: 'Completed', value: 'completed' }
                                    ]}
                                ]}
                            />
                        )
                    },
                    {
                        key: '2',
                        label: <span><FileTextOutlined />Questions</span>,
                        children: questionsTab
                    },
                    {
                        key: '3',
                        label: <span><BarChartOutlined />Analytics</span>,
                        children: analyticsTab
                    }
                ]}
            />
        </div>
    );
};

export default ExamDetails;
