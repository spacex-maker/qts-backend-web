import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Space, message } from 'antd';
import { 
  ThunderboltOutlined,
  GlobalOutlined,
  LineChartOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const QtsFundingConfigManualCollectModal = ({ 
  isVisible, 
  onCancel, 
  onFinish, 
  form,
  initialExchange 
}) => {
  const [collectResult, setCollectResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = {
        exchange: values.exchange,
        symbol: values.symbol,
        startTime: values.timeRange ? values.timeRange[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: values.timeRange ? values.timeRange[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
      
      const result = await onFinish(formData);
      setCollectResult(result);
      message.success('采集任务已提交');
    } catch (error) {
      console.error('Failed to collect funding rate:', error);
      message.error('采集失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCollectResult(null);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <ThunderboltOutlined />
          手动采集资金费率
        </Space>
      }
      open={isVisible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      width={600}
      confirmLoading={loading}
      okText="开始采集"
      cancelText="取消"
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          exchange: initialExchange
        }}
      >
        <Form.Item
          label={<Space><GlobalOutlined />交易所</Space>}
          name="exchange"
          rules={[{ required: true, message: '请输入交易所名称' }]}
          tooltip="交易所名称，如：binance、okx"
        >
          <Input
            placeholder="请输入交易所名称"
            disabled={!!initialExchange}
          />
        </Form.Item>

        <Form.Item
          label={<Space><LineChartOutlined />交易对</Space>}
          name="symbol"
          rules={[
            { required: true, message: '请输入交易对' },
            { pattern: /^[A-Z0-9]+$/, message: '交易对格式错误，应为大写字母和数字组合' }
          ]}
          tooltip="交易对名称，如：BTCUSDT、ETHUSDT"
        >
          <Input
            placeholder="请输入交易对 (如 BTCUSDT)"
            style={{ textTransform: 'uppercase' }}
          />
        </Form.Item>

        <Form.Item
          label={<Space><CalendarOutlined />时间范围（可选）</Space>}
          name="timeRange"
          tooltip="不填则采集最新数据"
        >
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间 (UTC)', '结束时间 (UTC)']}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f0f5ff', 
          borderRadius: '4px',
          marginTop: '16px'
        }}>
          <div style={{ fontSize: '12px', color: '#1890ff' }}>
            <strong>提示：</strong>
            <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
              <li>如果不填写时间范围，将采集最新的资金费率数据</li>
              <li>填写时间范围则采集该时间段内的历史数据</li>
              <li>时间格式为 UTC 时间</li>
            </ul>
          </div>
        </div>

        {collectResult && (
          <div style={{ 
            marginTop: '16px',
            padding: '16px', 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: '4px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#52c41a' }}>
              采集成功！
            </div>
            <div style={{ fontSize: '12px', color: '#595959' }}>
              <div>交易所: {collectResult.exchange}</div>
              <div>交易对: {collectResult.symbol}</div>
              <div>采集类型: {collectResult.collectType}</div>
              {collectResult.startTime && <div>开始时间: {collectResult.startTime}</div>}
              {collectResult.endTime && <div>结束时间: {collectResult.endTime}</div>}
              <div>保存记录数: <strong>{collectResult.savedCount}</strong> 条</div>
              <div>采集时间: {collectResult.collectTime}</div>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default QtsFundingConfigManualCollectModal;

