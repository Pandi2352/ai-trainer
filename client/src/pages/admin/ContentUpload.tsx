import { useState, useEffect } from 'react';
import { Upload, Button, message, Card, List, Tag, Spin } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { contentService } from '../../services/content.service';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

const ContentUpload = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [contentList, setContentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await contentService.getAllContent();
      setContentList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
  };

  const handleUpload = async () => {
    const file = fileList[0];
    if (!file) return;

    setUploading(true);
    try {
      await contentService.uploadFile(file as File);
      message.success('upload successfully.');
      setFileList([]);
      fetchContent();
    } catch (error) {
      message.error('upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Content Management</h1>
      
      <Card title="Upload Study Material (PDF/DOCX)">
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
        <div className="mt-4 flex justify-end">
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
            >
                {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
        </div>
      </Card>

      <Card title="Uploaded Content">
        {loading ? (
            <div className="text-center py-4"><Spin /></div>
        ) : (
            <List
                itemLayout="horizontal"
                dataSource={contentList}
                renderItem={(item) => (
                    <List.Item
                        actions={[<Button key="view">View</Button>]}
                    >
                        <List.Item.Meta
                            avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                            title={item.originalName}
                            description={
                                <div className="space-x-2">
                                    <Tag>{item.mimeType}</Tag>
                                    <span className="text-gray-400">{(item.extractedText?.length || 0)} chars extracted</span>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        )}
      </Card>
    </div>
  );
};

export default ContentUpload;
