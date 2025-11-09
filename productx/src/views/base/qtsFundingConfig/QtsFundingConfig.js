import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import QtsFundingConfigTable from "./QtsFundingConfigTable";
import UpdateQtsFundingConfigModal from "./UpdateQtsFundingConfigModal";
import QtsFundingConfigCreateFormModal from "./QtsFundingConfigCreateFormModal";
import QtsFundingConfigDetailModal from './QtsFundingConfigDetailModal';
import QtsFundingConfigManualCollectModal from './QtsFundingConfigManualCollectModal';

const createFundingConfig = async (configData) => {
  await api.post('/manage/qts/exchange-funding-config/create', configData);
}

const updateFundingConfig = async (updateData) => {
  await api.post(`/manage/qts/exchange-funding-config/update`, updateData);
}

const QtsFundingConfig = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    exchange: undefined,
    timezone: undefined,
    isSync: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [isCollectModalVisible, setIsCollectModalVisible] = useState(false);
  const [collectForm] = Form.useForm();
  const [selectedExchangeForCollect, setSelectedExchangeForCollect] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    fetchEnabledExchanges();
  }, []);

  const fetchEnabledExchanges = async () => {
    try {
      const response = await api.get('/manage/qts-supported-exchanges/enabled');
      if (Array.isArray(response)) {
        setExchanges(response);
      }
    } catch (error) {
      console.error('Failed to fetch exchanges:', error);
    }
  };

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection
  } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );
      const response = await api.get('/manage/qts/exchange-funding-config/page', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      // axiosInstance 拦截器已处理 response.data，直接使用返回的数据
      if (response) {
        setData(response.data);
        // @ts-ignore
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateConfig = async (values) => {
    try {
      await createFundingConfig(values);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('Failed to create funding config:', error);
      message.error('创建失败');
    }
  };

  const handleUpdateConfig = async (values) => {
    try {
      await api.post('/manage/qts/exchange-funding-config/update', values);
      message.success('修改成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      fetchData();
    } catch (error) {
      console.error('Failed to update funding config:', error);
      message.error('修改失败');
    }
  };

  const handleToggleSync = async (exchange, isSync) => {
    try {
      await api.post('/manage/qts/exchange-funding-config/toggle-sync', {
        exchange,
        isSync
      });
      const status = isSync ? '启用' : '禁用';
      message.success(`交易所 ${exchange} 同步已${status}`);
      await fetchData();
    } catch (error) {
      console.error('Failed to toggle sync:', error);
      message.error('切换同步状态失败');
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.post('/manage/qts/exchange-funding-config/remove', { id });
      message.success('删除成功');
      await fetchData();
    } catch (error) {
      console.error('Failed to delete funding config:', error);
      message.error('删除失败');
    }
  };

  const handleEditClick = (record) => {
    setSelectedConfig(record);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (record) => {
    setSelectedConfigId(record.id);
    setIsDetailModalVisible(true);
  };

  const handleCollectClick = (record) => {
    setSelectedExchangeForCollect(record.exchange);
    collectForm.setFieldsValue({
      exchange: record.exchange
    });
    setIsCollectModalVisible(true);
  };

  const handleManualCollect = async (values) => {
    try {
      const response = await api.post('/manage/qts/funding-rate/collect', values);
      return response; // 返回结果给模态框显示
    } catch (error) {
      console.error('Failed to collect funding rate:', error);
      throw error;
    }
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <Row gutter={16}>
          <Col>
            <Select
              value={searchParams.exchange}
              onChange={(value) => handleSearchChange({ target: { name: 'exchange', value }})}
              allowClear
              placeholder="选择交易所"
              style={{ width: 200 }}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {exchanges.map((exchange) => (
                <Select.Option 
                  key={exchange.id} 
                  value={exchange.exchangeName.toLowerCase()}
                >
                  {exchange.exchangeName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.timezone}
              onChange={(value) => handleSearchChange({ target: { name: 'timezone', value }})}
              allowClear
              placeholder="选择时区"
              style={{ width: 150 }}
            >
              <Select.Option value="UTC">UTC</Select.Option>
              <Select.Option value="UTC+8">UTC+8</Select.Option>
              <Select.Option value="UTC-5">UTC-5</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.isSync}
              onChange={(value) => handleSearchChange({ target: { name: 'isSync', value }})}
              allowClear
              placeholder="同步状态"
              style={{ width: 120 }}
            >
              <Select.Option value={true}>同步</Select.Option>
              <Select.Option value={false}>不同步</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={fetchData}
              disabled={isLoading}
            >
              {isLoading ? <Spin /> : '查询'}
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => setIsCreateModalVisible(true)}>
              新增同步配置
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => HandleBatchDelete({
                url: '/manage/qts/exchange-funding-config/delete-batch',
                selectedRows,
                resetSelection,
                fetchData,
              })}
              disabled={selectedRows.length === 0}
            >
              批量删除
            </Button>
          </Col>
        </Row>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <QtsFundingConfigTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleToggleSync={handleToggleSync}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleDetailClick={handleDetailClick}
            handleCollectClick={handleCollectClick}
          />
        </Spin>
      </div>
      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <QtsFundingConfigCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateConfig}
        form={createForm}
      />
      <UpdateQtsFundingConfigModal
        isVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setSelectedConfig(null);
          updateForm.resetFields();
        }}
        form={updateForm}
        handleUpdateConfig={handleUpdateConfig}
        selectedConfig={selectedConfig}
      />
      <QtsFundingConfigDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedConfigId(null);
        }}
        configId={selectedConfigId}
      />
      <QtsFundingConfigManualCollectModal
        isVisible={isCollectModalVisible}
        onCancel={() => {
          setIsCollectModalVisible(false);
          setSelectedExchangeForCollect(null);
          collectForm.resetFields();
        }}
        onFinish={handleManualCollect}
        form={collectForm}
        initialExchange={selectedExchangeForCollect}
      />
    </div>
  );
};

export default QtsFundingConfig;

