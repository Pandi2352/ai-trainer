import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { usersService } from '../../services/users.service';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await usersService.getProfile();
            form.setFieldsValue(data);
        } catch (error) {
            message.error('Failed to load profile');
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await usersService.updateProfile(values);
            message.success('Profile updated successfully');
        } catch (error) {
            message.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 gap-6">
            <Card title="My Profile" className="w-full max-w-md shadow-md">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* Add more fields as needed */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Change Password" className="w-full max-w-md shadow-md mt-6">
                <Form layout="vertical" onFinish={async (values) => {
                    if (values.password !== values.confirmPassword) {
                        message.error('Passwords do not match');
                        return;
                    }
                    try {
                        await usersService.changePassword(values.password);
                        message.success('Password changed successfully');
                    } catch (error) {
                        message.error('Failed to change password');
                    }
                }}>
                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input new password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please confirm password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;
