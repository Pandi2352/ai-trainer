import { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Select, InputNumber, Checkbox, message, Steps, Result, Tag } from 'antd';
import { RobotOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ExamGenerator = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [generatedExam, setGeneratedExam] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Polling Logic
    useEffect(() => {
        let interval: any;
        if (currentStep === 1 && generatedExam && generatedExam.status === 'generating') {
            interval = setInterval(async () => {
                try {
                    const response = await axiosInstance.get(`/exams/${generatedExam._id}`);
                    const updatedExam = response.data.data || response.data;
                    setGeneratedExam(updatedExam);
                    
                    if (updatedExam.status === 'completed' || updatedExam.status === 'failed') {
                        clearInterval(interval);
                        if (updatedExam.status === 'completed') message.success('Exam generation completed!');
                        else message.error('Exam generation failed.');
                    }
                } catch (error) {
                    console.error("Polling error", error);
                }
            }, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval);
    }, [currentStep, generatedExam?._id, generatedExam?.status]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            message.loading({ content: 'Starting exam generation...', key: 'gen' });
            
            const payload = {
                topic: values.topic,
                difficulty: values.difficulty,
                totalQuestions: values.totalQuestions,
                totalMarks: values.totalMarks,
                types: values.types,
            };

            const response = await axiosInstance.post('/exams/generate', payload);
            setGeneratedExam(response.data.data || response.data); 
            
            message.success({ content: 'Generation started! Questions will appear live.', key: 'gen' });
            setCurrentStep(1);
            setCurrentQuestionIndex(0);
        } catch (error) {
            console.error(error);
            message.error({ content: 'Failed to start generation', key: 'gen' });
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (generatedExam && currentQuestionIndex < generatedExam.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const questionTypes = [
        { label: 'Multiple Choice (MCQ)', value: 'mcq' },
        { label: 'Code Snippet', value: 'code' },
        { label: 'True/False', value: 'true_false' },
        { label: 'Fill in Blanks', value: 'fill_in_the_blank' },
        { label: 'Short Answer', value: 'short_answer' },
        { label: 'Long Answer', value: 'long_answer' },
    ];

    const stepItems = [
        { title: 'Configure Assessment', icon: <RobotOutlined /> },
        { title: 'Review & Publish', icon: <CheckCircleOutlined /> }
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Steps current={currentStep} className="mb-8" items={stepItems} />

            {currentStep === 0 && (
                <Card 
                    title={<span className="text-xl font-bold"><ThunderboltOutlined className="text-blue-500 mr-2" />AI Exam Generator</span>} 
                    className="shadow-md"
                >
                    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ 
                        difficulty: 'medium', 
                        totalQuestions: 5,
                        totalMarks: 50,
                        types: ['mcq', 'code']
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item label="Domain / Topic" name="topic" rules={[{ required: true, message: 'Please enter a topic like "React Hooks" or "Java Basics"' }]}>
                                <Input placeholder="e.g. React.js, Python Data Structures, History of Rome" size="large" />
                            </Form.Item>

                            <Form.Item label="Difficulty Level" name="difficulty" rules={[{ required: true }]}>
                                <Select size="large">
                                    <Option value="easy">Easy</Option>
                                    <Option value="medium">Medium</Option>
                                    <Option value="hard">Hard</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Total Questions" name="totalQuestions" rules={[{ required: true }]}>
                                <InputNumber min={1} max={20} className="w-full" size="large" />
                            </Form.Item>

                             <Form.Item label="Total Marks" name="totalMarks" rules={[{ required: true }]}>
                                <InputNumber min={10} max={100} step={10} className="w-full" size="large" />
                            </Form.Item>
                        </div>

                        <Form.Item label="Question Types Included" name="types" rules={[{ required: true, message: 'Select at least one type' }]}>
                            <Checkbox.Group options={questionTypes} className="grid grid-cols-2 gap-2" />
                        </Form.Item>

                        <div className="mt-6 flex justify-end">
                             <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<RobotOutlined />}>
                                {loading ? 'Generating...' : 'Start Generation'}
                             </Button>
                        </div>
                    </Form>
                </Card>
            )}

            {currentStep === 1 && generatedExam && (
                <div className="space-y-6">
                    <Result
                        status={generatedExam.status === 'completed' ? "success" : "info"}
                        title={generatedExam.status === 'completed' ? "Exam Created Successfully!" : "Generating Questions..."}
                        subTitle={generatedExam.status === 'completed' ? `"${generatedExam.title}" is ready.` : `AI is generating questions live. ${generatedExam.questions.length} / ${generatedExam.generationConfig?.totalQuestions || '?'} ready.`}
                        extra={[
                            <Button type="primary" key="dashboard" onClick={() => navigate('/admin/dashboard')}>
                                Go to Dashboard
                            </Button>,
                            <Button key="new" onClick={() => { setCurrentStep(0); form.resetFields(); setGeneratedExam(null); }}>
                                Create Another
                            </Button>,
                        ]}
                    />
                    
                    <Card title="Exam Preview" className="shadow-md">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{generatedExam.title}</h3>
                                <div className="mt-2 space-x-2">
                                    <Tag color={generatedExam.status === 'generating' ? "orange" : "blue"}>
                                        {generatedExam.status === 'generating' ? "GENERATING" : generatedExam.difficulty.toUpperCase()}
                                    </Tag>
                                    <Tag color="purple">
                                        {generatedExam.questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0)} / {generatedExam.totalMarks} Marks
                                    </Tag>
                                    <Tag color="green">{generatedExam.questions?.length} Questions</Tag>
                                </div>
                            </div>
                            <Tag color="cyan" className="text-lg py-1 px-3">
                                Question {generatedExam.questions.length > 0 ? currentQuestionIndex + 1 : 0} / {generatedExam.questions.length || 0} (Live)
                            </Tag>
                        </div>

                        <div className="min-h-[200px] border p-6 rounded-lg bg-gray-50">
                            {generatedExam.questions && generatedExam.questions.length > 0 ? (
                                (() => {
                                    const question = generatedExam.questions[currentQuestionIndex];
                                    if (!question) return <div className="text-center p-10 text-gray-500">Waiting for next question...</div>;
                                    
                                    return (
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <Tag color="geekblue">{question.type?.toUpperCase()}</Tag>
                                                <div className="flex items-center">
                                                    <span className="mr-2 font-semibold text-gray-500">Points:</span>
                                                    <InputNumber 
                                                        min={1} 
                                                        value={question.points} 
                                                        onChange={async (value) => {
                                                            if (!value) return;
                                                            try {
                                                                await axiosInstance.patch(`/questions/${question._id}`, { points: value });
                                                                
                                                                // Update local state
                                                                const updatedQuestions = [...generatedExam.questions];
                                                                updatedQuestions[currentQuestionIndex] = { ...question, points: value };
                                                                setGeneratedExam({ ...generatedExam, questions: updatedQuestions });
                                                                
                                                                message.success('Points updated');
                                                            } catch (err) {
                                                                console.error(err);
                                                                message.error('Failed to update points');
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-medium mb-4">{question.text}</h4>
                                            
                                            {question.type === 'mcq' && question.options && (
                                                <div className="space-y-2 ml-4">
                                                    {question.options.map((opt: string, i: number) => (
                                                        <div key={i} className="p-2 border rounded bg-white hover:bg-blue-50 transition-colors">
                                                            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {question.type === 'code' && question.codeSnippet && (
                                                <div className="bg-gray-800 text-white p-4 rounded font-mono text-sm mt-2">
                                                    <pre>{question.codeSnippet}</pre>
                                                </div>
                                            )}
                                            
                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                <p className="text-sm text-gray-500 font-semibold">Answer:</p>
                                                <p className="text-gray-700">{question.correctAnswer}</p>
                                                {question.explanation && (
                                                    <p className="text-xs text-gray-500 mt-1 italic">Explanation: {question.explanation}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="text-center p-10">
                                    <div className="text-2xl mb-2">🤖</div>
                                    <p className="text-gray-500 font-medium">AI is generating your first question...</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                                Previous
                            </Button>
                            <Button type="primary" onClick={handleNext} disabled={!generatedExam.questions || generatedExam.questions.length === 0 || currentQuestionIndex === generatedExam.questions.length - 1}>
                                Next
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ExamGenerator;
