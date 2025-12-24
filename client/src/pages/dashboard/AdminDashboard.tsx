import { useState, useEffect } from 'react';
import { Card, Statistic, Table, Tag, Button, Row, Col } from 'antd';
import { UserOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, ReloadOutlined, TrophyOutlined, TeamOutlined, LineChartOutlined } from '@ant-design/icons';
import { authService } from '../../services/auth.service';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

const AdminDashboard = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        totalTrainees: 0,
        totalAdmins: 0,
        totalExams: 0,
        totalAssignments: 0,
        stats: { completed: 0, pending: 0, completionRate: 0 },
        recentActivity: [],
        weeklyActivity: []
    });

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/assignments/dashboard/stats');
            // Handle potential interceptor nesting
            const data = response.data?.data || response.data;
            setStats(data);
        } catch (error) {
            console.error('Failed to load dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    // Data for Pie Chart
    const pieData = [
        { name: 'Completed', value: stats?.stats?.completed || 0 },
        { name: 'Pending', value: stats?.stats?.pending || 0 }
    ];
    const COLORS = ['#22c55e', '#fbbf24'];

    const columns = [
        {
            title: 'Trainee',
            dataIndex: ['assignedTo', 'name'],
            key: 'name',
            render: (text: string) => <span className="font-medium text-gray-700">{text || 'Unknown'}</span>
        },
        {
            title: 'Exam',
            dataIndex: ['exam', 'title'],
            key: 'exam',
            render: (text: string) => <span className="text-gray-600">{text}</span>
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            render: (score: number, record: any) => {
                 const total = record.exam?.totalMarks || 100;
                 const percent = (score / total) * 100;
                 return (
                     <Tag color={percent >= 70 ? 'success' : percent >= 40 ? 'warning' : 'error'}>
                         {score} / {total}
                     </Tag>
                 );
            }
        },
        {
            title: 'Submitted',
            dataIndex: 'completedAt',
            key: 'completedAt',
            render: (date: string) => <span className="text-gray-500 text-sm">{dayjs(date).fromNow()}</span>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button size="small" type="link" onClick={() => navigate(`/trainee/exam/${record._id}/result`)}>View Result</Button>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
                    <p className="text-gray-500">Welcome back, {user?.user?.name}</p>
                </div>
                <Button icon={<ReloadOutlined />} onClick={fetchDashboardStats} loading={loading}>Refresh</Button>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-sm bg-blue-50 hover:shadow-md transition-all">
                    <Statistic
                        title={<span className="text-blue-600 font-semibold">Users (Trainees / Admins)</span>}
                        value={`${stats?.totalTrainees || 0} / ${stats?.totalAdmins || 0}`}
                        prefix={<TeamOutlined />}
                        styles={{ content: { color: '#2563eb', fontWeight: 'bold' } }}
                    />
                </Card>
                <Card className="border-0 shadow-sm bg-purple-50 hover:shadow-md transition-all">
                    <Statistic
                        title={<span className="text-purple-600 font-semibold">Total Exams</span>}
                        value={stats?.totalExams || 0}
                        prefix={<FileTextOutlined />}
                        styles={{ content: { color: '#9333ea', fontWeight: 'bold' } }}
                    />
                </Card>
                <Card className="border-0 shadow-sm bg-orange-50 hover:shadow-md transition-all">
                    <Statistic
                        title={<span className="text-orange-600 font-semibold"> Assignments Sent</span>}
                        value={stats?.totalAssignments || 0}
                        prefix={<CheckCircleOutlined />}
                        styles={{ content: { color: '#ea580c', fontWeight: 'bold' } }}
                    />
                </Card>
                <Card className="border-0 shadow-sm bg-green-50 hover:shadow-md transition-all">
                    <Statistic
                        title={<span className="text-green-600 font-semibold">Overall Completion</span>}
                        value={stats?.stats?.completionRate || 0}
                        suffix="%"
                        prefix={<TrophyOutlined />}
                        styles={{ content: { color: '#16a34a', fontWeight: 'bold' } }}
                    />
                </Card>
            </div>

            {/* Charts Section */}
             <Row gutter={[24, 24]}>
                 <Col xs={24} lg={16}>
                    <Card title={<span className="flex items-center gap-2"><LineChartOutlined /> User Activity Trend (Last 7 Days)</span>} className="shadow-sm border-gray-100 h-full rounded-xl">
                         <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats?.weeklyActivity || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} name="Completed Exams" />
                                </LineChart>
                            </ResponsiveContainer>
                         </div>
                    </Card>
                 </Col>
                 <Col xs={24} lg={8}>
                     <Card title="Assignment Status" className="shadow-sm border-gray-100 h-full rounded-xl">
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <div className="text-2xl font-bold text-gray-700">{stats?.totalAssignments || 0}</div>
                                <div className="text-xs text-gray-400">Total</div>
                            </div>
                        </div>
                     </Card>
                </Col>
             </Row>

             {/* Recent Activity Table */}
             <div className="grid grid-cols-1">
                 <Card title="Recent Global Submissions" className="shadow-sm border-gray-100 rounded-xl" styles={{ body: { padding: 0 } }}>
                        <Table
                            dataSource={stats?.recentActivity || []}
                            columns={columns}
                            rowKey="_id"
                            pagination={false}
                            className="w-full"
                        />
                         {(!stats?.recentActivity || !stats.recentActivity.length) && (
                             <div className="p-8 text-center text-gray-400">No recent activity found.</div>
                         )}
                    </Card>
             </div>
        </div>
    );
};

export default AdminDashboard;
