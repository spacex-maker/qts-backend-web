import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import api from 'src/axiosInstance';
import {
  GlobalOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  CompassOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

const QtsFundingConfigCreateFormModal = ({ isVisible, onCancel, onFinish, form }) => {
  const [exchanges, setExchanges] = useState([]);
  const [loadingExchanges, setLoadingExchanges] = useState(false);

  // 获取启用的交易所列表
  useEffect(() => {
    if (isVisible) {
      fetchEnabledExchanges();
    }
  }, [isVisible]);

  const fetchEnabledExchanges = async () => {
    try {
      setLoadingExchanges(true);
      const response = await api.get('/manage/qts-supported-exchanges/enabled');
      setExchanges(response || []);
    } catch (error) {
      console.error('Failed to fetch exchanges:', error);
      message.error('获取交易所列表失败');
    } finally {
      setLoadingExchanges(false);
    }
  };
  const handleSubmit = async (values) => {
    try {
      const formData = {
        ...values,
      };
      await onFinish(formData);
    } catch (error) {
      console.error('Failed to create funding config:', error);
    }
  };

  return (
    <Modal
      title={
        <div>
          <PlusOutlined style={{ marginRight: 8 }} />
          新增资金费率同步配置
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={700}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="交易所 (Exchange)"
              name="exchange"
              rules={[{ required: true, message: '请选择交易所' }]}
            >
              <Select
                placeholder="请选择交易所"
                loading={loadingExchanges}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
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
            </Form.Item>

            <Form.Item
              label="同步间隔 (Funding Interval, 小时)"
              name="fundingInterval"
              rules={[{ required: true, message: '请输入同步间隔' }]}
              initialValue={8}
              tooltip="资金费率数据同步的时间间隔"
            >
              <InputNumber
                min={1}
                max={24}
                placeholder="请输入同步间隔"
                prefix={<ClockCircleOutlined />}
                style={{ width: '100%' }}
                addonAfter="小时"
              />
            </Form.Item>

            <Form.Item
              label="时区 (Timezone)"
              name="timezone"
              rules={[{ required: true, message: '请选择时区' }]}
              initialValue="UTC"
            >
              <Select
                placeholder="请选择时区"
                prefix={<CompassOutlined />}
              >
                <Select.Option value="UTC">UTC</Select.Option>
                <Select.Option value="UTC+8">UTC+8 (北京时间)</Select.Option>
                <Select.Option value="UTC-5">UTC-5 (纽约时间)</Select.Option>
                <Select.Option value="UTC+1">UTC+1 (欧洲中部)</Select.Option>
                <Select.Option value="UTC+9">UTC+9 (东京时间)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="同步状态 (Sync Status)"
              name="isSync"
              rules={[{ required: true, message: '请选择同步状态' }]}
              initialValue={true}
              tooltip="是否启用自动同步"
            >
              <Select placeholder="请选择同步状态">
                <Select.Option value={true}>启用同步</Select.Option>
                <Select.Option value={false}>禁用同步</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item
              label="结算时间 (Settlement Times)"
              name="settlementTimes"
              rules={[
                { required: true, message: '请输入结算时间' },
                { 
                  pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](,([0-1]?[0-9]|2[0-3]):[0-5][0-9])*$/,
                  message: '请输入正确的时间格式，如：00:00,08:00,16:00'
                }
              ]}
              tooltip="多个时间用逗号分隔，格式：HH:MM，例如：00:00,08:00,16:00"
              initialValue="00:00,08:00,16:00"
            >
              <Input
                prefix={<FieldTimeOutlined />}
                placeholder="00:00,08:00,16:00"
              />
            </Form.Item>

            <Form.Item
              label="备注 (Remark)"
              name="remark"
            >
              <TextArea
                rows={4}
                placeholder="请输入备注信息"
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default QtsFundingConfigCreateFormModal;

