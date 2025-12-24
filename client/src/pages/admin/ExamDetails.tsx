import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UserOutlined, FileTextOutlined, BarChartOutlined, EditOutlined, UserAddOutlined, PlusOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Tabs, Tag, Button, Statistic, message, Modal, Form, Input, Select, DatePicker, Table, Progress } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import DataTable from '../../components/common/DataTable';
import dayjs from 'dayjs';
import { usersService } from '../../services/users.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Option } = Select;

const ExamDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Assignment State
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<React.Key[]>([]);
    const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
    const [assigning, setAssigning] = useState(false);

    // Edit State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [saving, setSaving] = useState(false);


    // Question Edit State
    const [questionEditModalVisible, setQuestionEditModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [questionForm] = Form.useForm();
    const [updatingQuestion, setUpdatingQuestion] = useState(false);

    // Stepper State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Refresh trigger for Candidates table
    const [refreshCandidates, setRefreshCandidates] = useState(0);

    // Analytics Calculation
    const [analytics, setAnalytics] = useState<{
        totalAssigned: number;
        completed: number;
        averageScore: number;
        passRate: number;
        highestScore: number;
        lowestScore?: number;
        scoreDistribution?: any[];
        recentActivity?: any[];
    }>({
        totalAssigned: 0,
        completed: 0,
        averageScore: 0,
        passRate: 0,
        highestScore: 0,
        scoreDistribution: [],
        recentActivity: []
    });



    const fetchAnalytics = async () => {
        try {
            const response = await axiosInstance.get(`/assignments/analytics/${id}`);
            const analyticsData = response.data?.data || response.data;
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Failed to load analytics', error);
        }
    };

    useEffect(() => {
        fetchExamDetails();
    }, [id]);

    useEffect(() => {
        let interval: any;
        if (exam?.status === 'generating') {
            interval = setInterval(fetchExamDetails, 3000);
        }
        return () => clearInterval(interval);
    }, [exam?.status, id]);

    useEffect(() => {
        if (assignModalVisible) {
            fetchUsers();
        }
    }, [assignModalVisible]);

    useEffect(() => {
        if (id && exam) fetchAnalytics();
    }, [id, refreshCandidates, exam]);

  

    const fetchExamDetails = async () => {
        try {
            const response = await axiosInstance.get(`/exams/${id}`);
            // Handle nested structure from interceptor: response.data.data
            const data = response.data?.data || response.data;
            
            if (!data.questions) data.questions = [];
            setExam(data);
        } catch (error) {
            console.error(error);
            if (!exam) {
                 message.error('Failed to load exam details');
                 navigate('/admin/dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await usersService.getAllUsers();
            setUsers(data.filter((u: any) => u.role !== 'admin'));
        } catch (error) {
            message.error('Failed to load users');
        }
    };

    const handleAssign = async () => {
        if (selectedUserIds.length === 0) {
            message.error('Please select at least one trainee');
            return;
        }
        if (!deadline) {
            message.error('Please set a deadline');
            return;
        }

        setAssigning(true);
        try {
            await axiosInstance.post('/assignments', {
                examId: id,
                userIds: selectedUserIds,
                deadline: deadline.toDate(),
            });
            message.success('Exam assigned successfully!');
            setAssignModalVisible(false);
            setSelectedUserIds([]);
            setDeadline(null);
            setRefreshCandidates(prev => prev + 1); // Trigger Refresh
        } catch (error) {
            console.error(error);
            message.error('Failed to assign exam');
        } finally {
            setAssigning(false);
        }
    };

    const handleEdit = async (values: any) => {
        setSaving(true);
        try {
            await axiosInstance.patch(`/exams/${id}`, values); 
            message.success('Exam updated successfully');
            setExam({ ...exam, ...values });
            setEditModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to update exam');
        } finally {
            setSaving(false);
        }
    };

    const openQuestionEditModal = (question: any) => {
        setCurrentQuestion(question);
        questionForm.setFieldsValue({
            text: question.text,
            points: question.points,
            correctAnswer: question.correctAnswer,
            options: question.options || []
        });
        setQuestionEditModalVisible(true);
    };

    const handleQuestionUpdate = async (values: any) => {
        setUpdatingQuestion(true);
        try {
            const response = await axiosInstance.patch(`/questions/${currentQuestion._id}`, values);
            const updatedQuestion = response.data.data || response.data; // Handle potential interceptor structure

            // Update local state
            const updatedQuestions = exam.questions.map((q: any) => 
                q._id === currentQuestion._id ? { ...q, ...updatedQuestion } : q
            );
            
            // Recalculate total marks if points changed
            const newTotalMarks = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
            
            setExam({ ...exam, questions: updatedQuestions, totalMarks: newTotalMarks });
            message.success('Question updated successfully');
            setQuestionEditModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to update question');
        } finally {
            setUpdatingQuestion(false);
        }
    };

    if (loading || !exam) return <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div></div>;

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
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button 
                    type="link" 
                    disabled={record.status !== 'completed' && record.status !== 'submitted'}
                    onClick={() => navigate(`/trainee/exam/${record._id}/result`)}
                >
                    View Report
                </Button>
            )
        }
    ];

    const questionsTab = (
        <div className="space-y-6">
             {exam.status === 'generating' && (
                <div className="mb-6 p-6 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between shadow-sm animate-pulse-slow">
                     <div className="flex items-center gap-4">
                         <div className="w-6 h-6 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"/>
                         <div>
                            <p className="font-semibold text-primary-800 text-lg">AI is generating questions live...</p>
                            <p className="text-primary-600 text-sm">Questions will appear here automatically.</p>
                         </div>
                     </div>
                     <Tag color="blue" className="text-sm px-3 py-1">
                        {exam.questions.length} / {exam.generationConfig?.totalQuestions || '?'} Ready
                     </Tag>
                </div>
            )}

            {exam.questions.length > 0 && (
                <div>
                     {/* Stepper Navigation (Dots) */}
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                        {exam.questions.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentQuestionIndex 
                                        ? 'bg-primary-600 ring-2 ring-primary-200 scale-110' 
                                        : 'bg-gray-300 hover:bg-primary-300'
                                }`}
                                title={`Question ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Active Question Card */}
                    <div className="mb-6">
                         {(() => {
                            const q = exam.questions[currentQuestionIndex];
                            return (
                                <Card 
                                    key={q._id || currentQuestionIndex} 
                                    className="shadow-lg border-0 rounded-2xl overflow-hidden" 
                                    bodyStyle={{ padding: '0' }}
                                >
                                    <div className="p-0">
                                        {/* Header Section */}
                                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm font-bold tracking-wide uppercase shadow-sm">
                                                            Q{currentQuestionIndex + 1}
                                                        </span>
                                                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider border border-gray-200 px-2 py-1 rounded">
                                                            {q.type?.toUpperCase() || 'QUESTION'}
                                                        </span>
                                                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold border border-amber-200">
                                                            {q.points || 0} Marks
                                                        </span>
                                                        {q.difficulty && (
                                                            <span className={`px-2 py-1 rounded text-xs font-bold border capitalize ${
                                                                q.difficulty === 'hard' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                q.difficulty === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                                'bg-green-50 text-green-600 border-green-100'
                                                            }`}>
                                                                {q.difficulty}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {q.title && (
                                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{q.title}</h3>
                                                    )}
                                                    
                                                    {q.description && (
                                                        <div className="text-gray-500 text-sm leading-relaxed mb-4">
                                                            {(() => {
                                                                const renderContentWithCode = (text: string) => {
                                                                    if (!text) return null;
                                                                    return text.split(/(```[\s\S]*?```)/g).map((part, index) => {
                                                                        if (part.startsWith('```') && part.endsWith('```')) {
                                                                            const codeContent = part.slice(3, -3).trim();
                                                                            return (
                                                                                <pre key={index} className="bg-slate-900 text-slate-50 p-3 rounded-md my-2 overflow-x-auto text-xs font-mono shadow-inner border border-slate-700">
                                                                                    <code>{codeContent}</code>
                                                                                </pre>
                                                                            );
                                                                        }
                                                                        return <span key={index} className="whitespace-pre-wrap">{part}</span>;
                                                                    });
                                                                };
                                                                return renderContentWithCode(q.description);
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>
                                                <Button 
                                                    icon={<EditOutlined />} 
                                                    shape="circle" 
                                                    type="text"
                                                    className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 ml-2"
                                                    onClick={() => openQuestionEditModal(q)}
                                                />
                                            </div>

                                            {/* Question Text */}
                                            <div className="text-lg text-gray-800 font-medium leading-relaxed">
                                                {(() => {
                                                    const renderContentWithCode = (text: string) => {
                                                        if (!text) return 'Question text processing...';
                                                        return text.split(/(```[\s\S]*?```)/g).map((part, index) => {
                                                            if (part.startsWith('```') && part.endsWith('```')) {
                                                                const codeContent = part.slice(3, -3).trim();
                                                                return (
                                                                    <pre key={index} className="bg-slate-900 text-slate-50 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono shadow-inner border border-slate-700">
                                                                        <code>{codeContent}</code>
                                                                    </pre>
                                                                );
                                                            }
                                                            // Use whitespace-pre-wrap to preserve newlines in regular text
                                                            return (
                                                                <div key={index} className="whitespace-pre-wrap mb-2">
                                                                    {part}
                                                                </div>
                                                            );
                                                        });
                                                    };
                                                    return renderContentWithCode(q.text || '');
                                                })()}
                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-8 bg-white">
                                            {/* Code Snippet */}
                                            {q.codeSnippet && (
                                                <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-mono ml-2">Code Snippet</span>
                                                    </div>
                                                    <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-5 overflow-x-auto text-sm font-mono leading-relaxed m-0">
                                                        <code>{q.codeSnippet}</code>
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Options */}
                                            {q.options && q.options.length > 0 && (
                                                <div className="grid grid-cols-1 gap-3 mb-8">
                                                    {q.options.map((opt: string, idx: number) => {
                                                        const isCorrect = q.correctAnswer === opt;
                                                        return (
                                                            <div 
                                                                key={idx} 
                                                                className={`flex items-start p-4 rounded-xl border-2 transition-all duration-200 ${
                                                                    isCorrect 
                                                                        ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-100' 
                                                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                                                }`}
                                                            >
                                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold border-2 transition-colors ${
                                                                    isCorrect 
                                                                        ? 'bg-emerald-500 text-white border-emerald-500' 
                                                                        : 'bg-gray-50 text-gray-500 border-gray-200'
                                                                }`}>
                                                                    {String.fromCharCode(65 + idx)}
                                                                </div>
                                                                <div className="flex-grow pt-1">
                                                                    <span className={`text-base block ${isCorrect ? 'text-emerald-900 font-medium' : 'text-gray-600'}`}>
                                                                        {opt}
                                                                    </span>
                                                                </div>
                                                                {isCorrect && (
                                                                    <div className="flex-shrink-0 ml-3 text-emerald-600">
                                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Correct Answer & Explanation Section */}
                                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl overflow-hidden">
                                                <div className="px-6 py-4 border-b border-blue-100/50 bg-blue-100/30 flex items-center gap-2">
                                                     <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                     </div>
                                                     <span className="text-sm font-bold text-blue-800 uppercase tracking-wider">Solution & Explanation</span>
                                                </div>
                                                <div className="p-6">
                                                    {!q.options && (
                                                        <div className="mb-4">
                                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Correct Answer</span>
                                                            <div className="font-mono text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 inline-block">
                                                                {q.correctAnswer}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {q.explanation ? (
                                                        <div>
                                                            <p className="text-gray-700 leading-relaxed text-sm">
                                                                {q.explanation}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-400 italic text-sm">No detailed explanation provided.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                        <Button 
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            size="large"
                            className="w-32"
                        >
                            Previous
                        </Button>
                         <span className="text-gray-500 font-medium">
                            {currentQuestionIndex + 1} of {exam.questions.length}
                        </span>
                        <Button 
                            type="primary"
                            disabled={currentQuestionIndex === exam.questions.length - 1}
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            size="large"
                            className="w-32 shadow-md shadow-primary-200"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {exam.questions.length === 0 && exam.status !== 'generating' && (
                <div className="text-center py-10 text-gray-500">
                    <p>No questions generated yet.</p>
                </div>
            )}
        </div>
    );



    const analyticsTab = (
        <div className="p-6 space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-800">Exam Performance Analytics</h2>
                 <Button icon={<BarChartOutlined />} onClick={fetchAnalytics} loading={loading}>Refresh Data</Button>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
                    <Statistic 
                        title={<span className="text-gray-600 font-semibold">Total Assigned</span>}
                        value={analytics.totalAssigned} 
                        prefix={<UserOutlined className="mr-2" />} 
                        valueStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
                    <Statistic 
                        title={<span className="text-gray-600 font-semibold">Completion Rate</span>}
                        value={analytics.totalAssigned > 0 ? Math.round((analytics.completed / analytics.totalAssigned) * 100) : 0} 
                        suffix="%" 
                        prefix={<FileTextOutlined className="mr-2" />} 
                        valueStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-white hover:shadow-md transition-shadow">
                     <Statistic 
                        title={<span className="text-gray-600 font-semibold">Average Score</span>}
                        value={analytics.averageScore} 
                        suffix={<span className="text-sm text-gray-400">/ {exam?.totalMarks || 0}</span>}
                        prefix={<BarChartOutlined className="mr-2" />} 
                        valueStyle={{ color: '#eab308', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white hover:shadow-md transition-shadow">
                    <Statistic 
                        title={<span className="text-gray-600 font-semibold">Pass Rate</span>}
                        value={analytics.passRate} 
                        suffix="%" 
                        prefix={<TrophyOutlined className="mr-2" />} 
                        valueStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                    />
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Score Distribution Chart */}
                <Card title="Score Distribution" className="shadow-sm border-gray-100 rounded-xl">
                    <div className="h-64 w-full">
                         {analytics.scoreDistribution ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.scoreDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                    <Tooltip 
                                        cursor={{fill: '#f9fafb'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Trainees" />
                                </BarChart>
                            </ResponsiveContainer>
                         ) : (
                             <div className="h-full flex items-center justify-center text-gray-400">No score data available</div>
                         )}
                    </div>
                </Card>

                 {/* Pass vs Fail Pie Chart */}
                <Card title="Performance Overview" className="shadow-sm border-gray-100 rounded-xl">
                    <div className="flex justify-around items-center h-64">
                         <div className="text-center">
                            <Progress 
                                type="circle" 
                                percent={analytics.passRate} 
                                size={140} 
                                strokeColor={{ '0%': '#22c55e', '100%': '#10b981' }} 
                                strokeWidth={10}
                            />
                            <p className="mt-4 text-gray-500 font-medium">Pass Rate</p>
                            <p className="text-xs text-gray-400">Based on 50% score</p>
                        </div>
                        <div className="w-px h-32 bg-gray-100 mx-4 hidden md:block"></div>
                        <div className="text-center">
                             <div className="mb-4">
                                <p className="text-gray-500 text-sm mb-1">Highest Score</p>
                                <span className="text-3xl font-bold text-gray-800">{analytics.highestScore}</span>
                                <span className="text-gray-400 text-sm"> / {exam?.totalMarks}</span>
                             </div>
                             <div>
                                <p className="text-gray-500 text-sm mb-1">Lowest Score</p>
                                <span className="text-xl font-bold text-gray-600">{analytics.lowestScore || 0}</span>
                                <span className="text-gray-400 text-xs"> / {exam?.totalMarks}</span>
                             </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity Table */}
            <Card title="Recent Submissions" className="shadow-sm border-gray-100 rounded-xl overflow-hidden" bodyStyle={{padding: 0}}>
                <Table 
                    dataSource={analytics.recentActivity || []} 
                    rowKey="_id" 
                    pagination={false}
                    columns={[
                        { 
                            title: 'Trainee', 
                            dataIndex: ['assignedTo', 'name'], 
                            key: 'name',
                            render: (text: string) => <span className="font-medium text-gray-700">{text}</span>
                        },
                        { 
                            title: 'Submitted At', 
                            dataIndex: 'completedAt', 
                            key: 'completedAt',
                            render: (date: string) => <span className="text-gray-500">{dayjs(date).format('MMM D, h:mm A')}</span>
                        },
                        { 
                            title: 'Score', 
                            dataIndex: 'score', 
                            key: 'score',
                            render: (score: number) => {
                                const percentage = (score / (exam?.totalMarks || 1)) * 100;
                                let color = percentage >= 75 ? 'green' : percentage >= 50 ? 'orange' : 'red';
                                return <Tag color={color} className="font-bold border-0 px-2 py-1 text-sm">{score} / {exam?.totalMarks}</Tag>;
                            }
                        },
                        {
                            title: 'Action',
                            key: 'action',
                            render: (_: any, record: any) => (
                                <Button size="small" type="link" onClick={() => navigate(`/trainee/exam/${record._id}/result`)}>View Result</Button>
                            )
                        }
                    ]}
                />
                 {(!analytics.recentActivity || analytics.recentActivity.length === 0) && (
                    <div className="p-8 text-center text-gray-400">No recent activity</div>
                 )}
            </Card>
        </div>
    );

    const userColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role', render: (text: string) => <Tag>{text.toUpperCase()}</Tag> }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/dashboard')}>
                    Back to Dashboard
                </Button>
                <div className="flex gap-2">
                     <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAssignModalVisible(true)}>
                        Assign Trainee
                    </Button>
                </div>
            </div>
            
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 relative">
                <div className="absolute top-6 right-6 flex space-x-2">
                     <Button icon={<EditOutlined />} onClick={() => {
                         editForm.setFieldsValue({
                             title: exam.title,
                             description: exam.description,
                             difficulty: exam.difficulty
                         });
                         setEditModalVisible(true);
                     }}>
                        Edit Details
                    </Button>
                </div>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
                        <p className="text-gray-500 mb-4 max-w-2xl">{exam.description || 'No description provided.'}</p>
                        <div className="space-x-2">
                            <Tag color="blue">{exam.difficulty}</Tag>
                            <Tag color="purple">{exam.domain}</Tag>
                            <Tag>{exam.questions.length} Questions</Tag>
                        </div>
                    </div>
                    <div className="text-right mt-10">
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
                            <div>
                                <DataTable 
                                    key={refreshCandidates}
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
                            </div>
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

            {/* Assign Modal */}
            <Modal
                title="Assign to Trainees"
                open={assignModalVisible}
                onCancel={() => setAssignModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setAssignModalVisible(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={assigning} onClick={handleAssign}>Assign</Button>
                ]}
                width={800}
            >
                 <div className="mb-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Submission Deadline:</label>
                            <DatePicker 
                            showTime 
                            className="w-full max-w-xs" 
                            size="large"
                            onChange={(date) => setDeadline(date)} 
                        />
                    </div>
                        
                    <label className="block text-gray-700 font-bold mb-2">Select Candidates:</label>
                    <Table 
                        dataSource={users} 
                        columns={userColumns} 
                        rowKey="_id"
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys) => setSelectedUserIds(selectedRowKeys),
                            selectedRowKeys: selectedUserIds
                        }}
                        pagination={{ pageSize: 5 }}
                        scroll={{ y: 240 }}
                    />
                </div>
            </Modal>

            {/* Edit Exam Details Modal */}
            <Modal
                title="Edit Exam Details"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onOk={() => editForm.submit()}
                confirmLoading={saving}
            >
                <Form form={editForm} layout="vertical" onFinish={handleEdit}>
                    <Form.Item name="title" label="Exam Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                     <Form.Item name="difficulty" label="Difficulty">
                        <Select>
                            <Option value="easy">Easy</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="hard">Hard</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Question Modal */}
            <Modal
                title={`Edit Question`}
                open={questionEditModalVisible}
                onCancel={() => setQuestionEditModalVisible(false)}
                onOk={() => questionForm.submit()}
                confirmLoading={updatingQuestion}
                width={700}
            >
                <Form form={questionForm} layout="vertical" onFinish={handleQuestionUpdate}>
                     <div className="flex gap-4">
                        <Form.Item name="points" label="Marks" className="w-1/3" rules={[{ required: true }]}>
                             <Input type="number" min={1} />
                        </Form.Item>
                    </div>

                    <Form.Item name="text" label="Question Text" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="correctAnswer" label="Correct Answer" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    {currentQuestion?.options && currentQuestion.options.length > 0 && (
                        <Form.Item label="Options">
                            <Form.List name="options">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                required={false}
                                                key={field.key}
                                            >
                                                <div className="flex gap-2">
                                                    <Form.Item
                                                        {...field}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        noStyle
                                                    >
                                                        <Input placeholder={`Option ${index + 1}`} />
                                                    </Form.Item>
                                                    {fields.length > 2 && (
                                                        <Button danger onClick={() => remove(field.name)}>Delete</Button>
                                                    )}
                                                </div>
                                            </Form.Item>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Option
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default ExamDetails;
