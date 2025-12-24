import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Progress, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, TrophyOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';

const ExamResult = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, [assignmentId]);

    const fetchResult = async () => {
        try {
            const response = await axiosInstance.get(`/assignments/${assignmentId}`);
            const data = response.data?.data || response.data;
            
            if (data) {
                 if (data.status !== 'completed' && data.status !== 'submitted') {
                    message.warning('Exam is not yet completed. Redirecting to dashboard.');
                    navigate('/trainee/dashboard');
                    return;
                }
                setAssignment(data);
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to load result');
        } finally {
            setLoading(false);
        }
    };

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
            return <div key={index} className="whitespace-pre-wrap">{part}</div>;
        });
    };

    if (loading || !assignment) return <div className="flex h-screen items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div></div>;

    const { exam, results, score, answers } = assignment;
    const totalPoints = exam.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);
    const percentage = Math.round((score / totalPoints) * 100);
    let resultColor = '#22c55e'; // Green
    if (percentage < 50) resultColor = '#ef4444'; // Red
    else if (percentage < 80) resultColor = '#eab308'; // Yellow

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-6">
             <div className="max-w-4xl mx-auto w-full">
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate(-1)} 
                    className="mb-6 border-0 bg-transparent shadow-none px-0 hover:bg-transparent text-gray-500 hover:text-gray-800"
                >
                    Back to Dashboard
                </Button>

                {/* Score Card */}
                <Card className="mb-8 border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{exam.title}</h1>
                            <p className="text-gray-500 mb-4">Completed on {dayjs(assignment.completedAt).format('MMMM D, YYYY h:mm A')}</p>
                            <div className="flex items-center gap-2">
                                <Tag className="px-3 py-1 text-sm rounded-full m-0">{exam.difficulty?.toUpperCase()}</Tag>
                                <Tag className="px-3 py-1 text-sm rounded-full m-0" color={percentage >= 50 ? 'success' : 'error'}>
                                    {percentage >= 50 ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                                </Tag>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-xl">
                            <div className="text-center">
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Your Score</p>
                                <div className="text-3xl font-bold text-gray-800">
                                    {score} <span className="text-lg text-gray-400 font-normal">/ {totalPoints}</span>
                                </div>
                            </div>
                            <div className="h-12 w-px bg-gray-200"></div>
                            <Progress 
                                type="circle" 
                                percent={percentage} 
                                size={80} 
                                strokeWidth={8}
                                strokeColor={resultColor}
                                format={(percent) => <div style={{ color: resultColor }}><TrophyOutlined className="text-lg mb-1 block" />{percent}%</div>}
                            />
                        </div>
                    </div>
                </Card>

                {/* Questions Review */}
                <h2 className="text-xl font-bold mb-4 text-gray-800">Detailed Review</h2>
                <div className="flex flex-col gap-6">
                    {exam.questions.map((q: any, index: number) => {
                        const result = results?.find((r: any) => r.questionId === q._id);
                        const userAnswer = answers[q._id];
                        const isCorrect = result?.score > 0;
                        
                        return (
                            <Card key={q._id} className="border-0 shadow-sm rounded-xl overflow-hidden" bodyStyle={{ padding: 0 }}>
                                <div className={`p-6 border-l-4 ${isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                         <div className="flex items-center gap-2">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">Q{index + 1}</span>
                                            <span className={`text-sm font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                                {result?.score || 0} / {q.points || 1} Points
                                            </span>
                                        </div>
                                    </div>

                                    {/* Question Text */}
                                    <div className="text-base font-medium text-gray-800 mb-4 whitespace-pre-wrap">
                                        {renderContentWithCode(q.text)}
                                    </div>

                                    {/* Code Snippet */}
                                     {q.codeSnippet && (
                                        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                                            <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 overflow-x-auto text-xs font-mono m-0">
                                                <code>{q.codeSnippet}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Answers Comparison grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Your Answer</p>
                                            <div className={`text-sm ${userAnswer ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                {userAnswer || 'No answer provided'}
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                            <p className="text-xs text-emerald-600 uppercase font-bold mb-2">Correct Answer</p>
                                            <div className="text-sm text-gray-800 font-medium">
                                                {q.correctAnswer}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Feedback */}
                                    {result?.feedback && (
                                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-2">
                                             <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-indigo-600 uppercase font-bold">AI Feedback</span>
                                             </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {result.feedback}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Explanation */}
                                    {(!result?.feedback && q.explanation) && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
                                             <p className="text-xs text-blue-600 uppercase font-bold mb-1">Explanation</p>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {q.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
             </div>
        </div>
    );
};

export default ExamResult;
