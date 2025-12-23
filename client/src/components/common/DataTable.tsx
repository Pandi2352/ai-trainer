import { Table, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const { Option } = Select;

interface DataTableProps {
    columns: any[];
    apiEndpoint: string;
    filters?: { key: string; label: string; options: { label: string; value: string }[] }[];
    searchable?: boolean;
    initialParams?: any;
    onRowClick?: (record: any) => void;
    refreshTrigger?: number; // Increment to force refresh
}

const DataTable = ({ columns, apiEndpoint, filters = [], searchable = false, initialParams = {}, onRowClick, refreshTrigger }: DataTableProps) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');
    const [activeFilters, setActiveFilters] = useState<any>({});

    const fetchData = async (params: any = {}) => {
        setLoading(true);
        try {
            const queryParams = {
                page: params.current || pagination.current,
                limit: params.pageSize || pagination.pageSize,
                search: searchText,
                ...activeFilters,
                ...initialParams,
            };

            const response = await axiosInstance.get(apiEndpoint, { params: queryParams });
            const body = response.data;
            
            let list = [];
            let meta = { total: 0, page: 1, limit: 10 };

            // Check for paginated structure wrapped by Interceptor: { data: { data: [], meta: {} } }
            if (body.data && body.data.data && Array.isArray(body.data.data)) {
                list = body.data.data;
                meta = body.data.meta;
            } 
            // Check for simple array wrapped by Interceptor: { data: [] }
            else if (Array.isArray(body.data)) {
                list = body.data;
                meta = { total: list.length, page: 1, limit: 10 };
            }

            setData(list);
            setPagination({
                current: meta.page,
                pageSize: meta.limit,
                total: meta.total,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData({ current: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger, activeFilters, JSON.stringify(initialParams)]);

    // Simple manual debounce for search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData({ current: 1 });
        }, 500);
        return () => clearTimeout(timer);
    }, [searchText]);

    const handleTableChange = (newPagination: any) => {
        fetchData(newPagination);
    };

    const handleFilterChange = (key: string, value: any) => {
        setActiveFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                {searchable && (
                    <Input 
                        placeholder="Search..." 
                        prefix={<SearchOutlined />} 
                        className="max-w-xs"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                )}
                <div className="flex gap-2">
                    {filters.map(filter => (
                        <Select
                            key={filter.key}
                            placeholder={filter.label}
                            allowClear
                            className="min-w-[150px]"
                            onChange={(val) => handleFilterChange(filter.key, val)}
                        >
                            {filter.options.map(opt => (
                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                            ))}
                        </Select>
                    ))}
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="_id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                onRow={(record) => ({
                    onClick: () => onRowClick && onRowClick(record),
                    className: onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                })}
            />
        </div>
    );
};

export default DataTable;
