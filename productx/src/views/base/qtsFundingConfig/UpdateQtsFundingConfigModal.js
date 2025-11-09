import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Space, message } from 'antd';
import api from 'src/axiosInstance';
import { 
  GlobalOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  CompassOutlined,
  EditOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

const UpdateQtsFundingConfigModal = ({
  isVisible,
  onCancel,
  form,
  handleUpdateConfig,
  selectedConfig
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [exchanges, setExchanges] = useState([]);
  const [loadingExchanges, setLoadingExchanges] = useState(false);

  useEffect(() => {
    if (isVisible && selectedConfig) {
      setLoading(true);
      Promise.all([
        fetchConfigData(selectedConfig.id),
        fetchEnabledExchanges()
      ])
        .then(() => {
          setShowModal(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setShowModal(false);
    }
  }, [isVisible, selectedConfig]);

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

  const fetchConfigData = async (configId) => {
    try {
      const configData = await api.get(`/manage/qts/exchange-funding-config/${configId}`);

      form.setFieldsValue({
        id: configData.id,
        exchange: configData.exchange,
        fundingInterval: configData.fundingInterval,
        settlementTimes: configData.settlementTimes,
        timezone: configData.timezone,
        isSync: configData.isSync,
        remark: configData.remark,
      });
    } catch (error) {
      console.error('Failed to fetch funding config data:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        id: values.id,
        exchange: values.exchange,
        fundingInterval: values.fundingInterval,
        settlementTimes: values.settlementTimes,
        timezone: values.timezone,
        isSync: values.isSync,
        remark: values.remark,
      };
      await handleUpdateConfig(formData);
    } catch (error) {
      console.error('Failed to update funding config:', error);
    }
  };

  return (
    <Modal
      title={<Space><EditOutlined />修改资金费率同步配置</Space>}
      open={showModal}
      onCancel={() => {
        setShowModal(false);
        onCancel();
      }}
      onOk={() => form.submit()}
      width={700}
    >
      {!loading && (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <Form.Item
                label={<Space><GlobalOutlined />交易所</Space>}
                name="exchange"
                rules={[{ required: true, message: '请选择交易所' }]}
              >
                <Select
                  placeholder="请选择交易所"
                  disabled
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
                label={<Space><ClockCircleOutlined />同步间隔</Space>}
                name="fundingInterval"
                rules={[{ required: true, message: '请输入同步间隔' }]}
                tooltip="资金费率数据同步的时间间隔"
              >
                <InputNumber
                  min={1}
                  max={24}
                  placeholder="请输入同步间隔"
                  style={{ width: '100%' }}
                  addonAfter="小时"
                />
              </Form.Item>

              <Form.Item
                label={<Space><CompassOutlined />时区</Space>}
                name="timezone"
                rules={[{ required: true, message: '请选择时区' }]}
              >
                <Select placeholder="请选择时区">
                  <Select.Option value="UTC">UTC</Select.Option>
                  <Select.Option value="UTC+8">UTC+8 (北京时间)</Select.Option>
                  <Select.Option value="UTC-5">UTC-5 (纽约时间)</Select.Option>
                  <Select.Option value="UTC+1">UTC+1 (欧洲中部)</Select.Option>
                  <Select.Option value="UTC+9">UTC+9 (东京时间)</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="同步状态"
                name="isSync"
                rules={[{ required: true, message: '请选择同步状态' }]}
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
                label={<Space><FieldTimeOutlined />结算时间</Space>}
                name="settlementTimes"
                rules={[
                  { required: true, message: '请输入结算时间' },
                  { 
                    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](,([0-1]?[0-9]|2[0-3]):[0-5][0-9])*$/,
                    message: '请输入正确的时间格式，如：00:00,08:00,16:00'
                  }
                ]}
                tooltip="多个时间用逗号分隔，格式：HH:MM"
              >
                <Input
                  placeholder="00:00,08:00,16:00"
                />
              </Form.Item>

              <Form.Item
                label="备注"
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
      )}
    </Modal>
  );
};

export default UpdateQtsFundingConfigModal;

