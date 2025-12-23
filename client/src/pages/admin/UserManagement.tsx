import { useState } from 'react';
import { Button, Select, Modal, Form, Input, message, Tag } from 'antd';
import { usersService } from '../../services/users.service';
import DataTable from '../../components/common/DataTable';

const UserManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await usersService.updateRole(userId, newRole);
            message.success('Role updated successfully');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            message.error('Failed to update role');
        }
    };

    const handleInvite = async (values: any) => {
        try {
            await usersService.inviteUser(values.email, values.role);
            message.success('User invited successfully');
            setIsModalOpen(false);
            form.resetFields();
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            if (error.response?.status === 409) {
                 message.error('User with this email already exists!');
            } else {
                 message.error(error.message || 'Failed to add user');
            }
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium">{text || 'Pending Invitation'}</span>
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
                    onClick={(e) => e.stopPropagation()} 
                >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="trainee">Trainee</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: any) => (
                <Tag color={record.password ? "green" : "orange"}>
                    {record.password ? "Active" : "Invited"}
                </Tag>
            ),
        },
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add User
                </Button>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
                <DataTable 
                    apiEndpoint="/users" 
                    columns={columns} 
                    refreshTrigger={refreshTrigger}
                    searchable={true}
                    filters={[
                        { 
                            key: 'role', 
                            label: 'Role', 
                            options: [
                                { label: 'Admin', value: 'admin' }, 
                                { label: 'Trainee', value: 'trainee' }
                            ] 
                        }
                    ]}
                />
            </div>

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
