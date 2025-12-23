import { useEffect, useState } from 'react';
import { Table, Button, Select, Modal, Form, Input, message, Tag } from 'antd';
import { usersService } from '../../services/users.service';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await usersService.getAllUsers();
            setUsers(data);
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await usersService.updateRole(userId, newRole);
            message.success('Role updated successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to update role');
        }
    };

    const handleInvite = async (values: any) => {
        try {
            await usersService.inviteUser(values.email, values.role);
            message.success('Invitation sent successfully');
            setIsModalOpen(false);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            message.error('Failed to send invitation');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string, record: any) => (
                <Select
                    defaultValue={role}
                    style={{ width: 120 }}
                    onChange={(value) => handleRoleChange(record._id, value)}
                >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="trainee">Trainee</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: () => <Tag color="green">Active</Tag>, // Placeholder
        },
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Invite User
                </Button>
            </div>

            <Table dataSource={users} columns={columns} loading={loading} rowKey="_id" />

            <Modal
                title="Invite New User"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleInvite} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        initialValue="trainee"
                    >
                        <Select>
                            <Select.Option value="trainee">Trainee</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Send Invitation
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
