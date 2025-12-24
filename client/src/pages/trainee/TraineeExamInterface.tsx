import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Input, message, Modal, Progress, Tag } from 'antd';
import { ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { confirm } = Modal;

const TraineeExamInterface = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        fetchAssignmentDetails();
    }, [assignmentId]);

    useEffect(() => {
        if (!assignment || !assignment.deadline) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const deadline = new Date(assignment.deadline).getTime();
            const distance = deadline - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft(0);
                // Auto-submit if deadline passed? 
                // handleAutoSubmit();
            } else {
                setTimeLeft(distance);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [assignment]);

    const fetchAssignmentDetails = async () => {
        try {
            const response = await axiosInstance.get(`/assignments/${assignmentId}`);
            const data = response.data?.data || response.data;
            
            if (data) {
                if (data.status === 'completed' || data.status === 'submitted') {
                    message.info('You have already completed this exam.');
                    navigate('/trainee/dashboard');
                    return;
                }
                setAssignment(data);
            } else {
                message.error('Assignment not found');
                navigate('/trainee/dashboard');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to load exam');
            navigate('/trainee/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const confirmSubmit = () => {
        const unansweredCount = assignment.exam.questions.length - Object.keys(answers).length;
        confirm({
            title: 'Submit Exam?',
            icon: <ExclamationCircleOutlined />,
            content: unansweredCount > 0 
                ? `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?` 
                : 'Are you sure you want to finish the test?',
            onOk: handleSubmit,
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await axiosInstance.post(`/assignments/${assignmentId}/submit`, { answers });
            message.success('Exam submitted successfully!');
            navigate(`/trainee/exam/${assignmentId}/result`);
        } catch (error) {
            console.error(error);
            message.error('Failed to submit exam');
        } finally {
            setSubmitting(false);
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
            return <div key={index} className="whitespace-pre-wrap mb-2">{part}</div>;
        });
    };

    if (loading || !assignment) return <div className="flex h-screen items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div></div>;

    const q = assignment.exam.questions[currentQuestionIndex];
    const totalQuestions = assignment.exam.questions.length;
    const progress = ((Object.keys(answers).length) / totalQuestions) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{assignment.exam.title}</h1>
                    <div className="text-gray-500 text-sm flex gap-4 mt-1">
                        <span><ClockCircleOutlined /> Due: {dayjs(assignment.deadline).format('MMM D, HH:mm')}</span>
                        <span className={timeLeft && timeLeft < 300000 ? 'text-red-500 font-bold' : ''}>
                            {timeLeft !== null ? (
                                `Time Left: ${Math.floor(timeLeft / (1000 * 60 * 60))}h ${Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}m`
                            ) : ''}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-48">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{Object.keys(answers).length}/{totalQuestions}</span>
                        </div>
                        <Progress percent={Math.round(progress)} size="small" showInfo={false} strokeColor="#4f46e5" />
                    </div>
                    <Button type="primary" danger onClick={confirmSubmit}>
                        Finish Test
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl w-full mx-auto p-6">
                {/* Navigation Dots */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {assignment.exam.questions.map((_: any, index: number) => {
                        const isAnswered = answers[assignment.exam.questions[index]._id];
                        const isActive = index === currentQuestionIndex;
                        return (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                                    isActive ? 'bg-indigo-600 scale-125 ring-2 ring-indigo-200' :
                                    isAnswered ? 'bg-emerald-400' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                title={`Question ${index + 1}`}
                            />
                        );
                    })}
                </div>

                {/* Question Card */}
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
                    <div className="p-6 bg-gray-50 border-b border-gray-100 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                                    Q{currentQuestionIndex + 1}
                                </span>
                                <Tag>{q.type?.toUpperCase()}</Tag>
                                <Tag color="gold">{q.points || 1} Marks</Tag>
                            </div>
                        </div>
                        
                        {q.description && (
                            <div className="text-gray-500 text-sm mb-4 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                                {renderContentWithCode(q.description)}
                            </div>
                        )}

                        <div className="text-lg text-gray-800 font-medium leading-relaxed">
                            {renderContentWithCode(q.text)}
                        </div>
                    </div>

                    <div className="p-8 pt-0">
                         {/* Code Snippet (Dedicated) */}
                         {q.codeSnippet && (
                            <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                                     <span className="text-xs text-gray-500 font-mono">Code Reference</span>
                                </div>
                                <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-5 overflow-x-auto text-sm font-mono leading-relaxed m-0">
                                    <code>{q.codeSnippet}</code>
                                </pre>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="mt-6">
                            {(q.type === 'mcq' || (q.options && q.options.length > 0)) ? (
                                <Radio.Group 
                                    className="w-full flex flex-col gap-3" 
                                    value={answers[q._id]} 
                                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                >
                                    {q.options.map((opt: string, idx: number) => (
                                        <Radio 
                                            key={idx} 
                                            value={opt}
                                            className={`p-4 rounded-xl border-2 transition-all w-full flex items-center ${
                                                answers[q._id] === opt 
                                                    ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-200' 
                                                    : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            <span className="text-base ml-2">{opt}</span>
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            ) : (
                                <TextArea 
                                    rows={6} 
                                    className="rounded-xl border-gray-300 text-base"
                                    placeholder="Type your answer here..."
                                    value={answers[q._id] || ''}
                                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8">
                    <Button 
                        size="large"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    >
                        Previous
                    </Button>
                    <Button 
                        type="primary"
                        size="large"
                        className="w-32"
                        disabled={currentQuestionIndex === totalQuestions - 1} // Disable Next on last question
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        style={{ display: currentQuestionIndex === totalQuestions - 1 ? 'none' : 'inline-block' }}
                    >
                        Next
                    </Button>
                     {currentQuestionIndex === totalQuestions - 1 && (
                        <Button 
                            type="primary" 
                            danger 
                            size="large" 
                            className="w-32"
                            onClick={confirmSubmit}
                            loading={submitting}
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TraineeExamInterface;
