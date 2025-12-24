import { useState } from 'react';
import { Card, Button, Form, Input, Select, InputNumber, Checkbox, message } from 'antd';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ExamGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

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

            await axiosInstance.post('/exams/generate', payload);
            
            message.success({ content: 'Generation started! Redirecting to history...', key: 'gen' });
            // Immediate redirect, background generation handled by server/details page
            navigate('/admin/exams');
        } catch (error) {
            console.error(error);
            message.error({ content: 'Failed to start generation', key: 'gen' });
        } finally {
            setLoading(false);
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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card 
                title={<span className="text-xl font-bold"><ThunderboltOutlined className="text-blue-500 mr-2" />AI Exam Generator</span>} 
                className="shadow-md"
            >
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                    <h4 className="font-bold mb-1">Background Generation</h4>
                    <p className="text-sm">Exams are generated in the background. Once you click start, you will be redirected to the Exam History where you can track progress and assign trainees.</p>
                </div>

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
                            <InputNumber min={1} max={50} className="w-full" size="large" />
                        </Form.Item>

                            <Form.Item label="Total Marks" name="totalMarks" rules={[{ required: true }]}>
                            <InputNumber min={10} max={500} step={10} className="w-full" size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Question Types Included" name="types" rules={[{ required: true, message: 'Select at least one type' }]}>
                        <Checkbox.Group options={questionTypes} className="grid grid-cols-2 gap-2" />
                    </Form.Item>

                    <div className="mt-6 flex justify-end">
                            <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<RobotOutlined />}>
                            {loading ? 'Initiating...' : 'Start Generation'}
                            </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ExamGenerator;
