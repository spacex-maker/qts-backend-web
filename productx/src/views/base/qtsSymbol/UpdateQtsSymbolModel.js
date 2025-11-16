import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Row, Col, Divider, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const UpdateQtsSymbolModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateSymbol,
  selectedSymbol,
}) => {
  useEffect(() => {
    if (isVisible && selectedSymbol) {
      // 处理嵌套对象 fundingSyncConfig
      const formValues = {
        ...selectedSymbol,
        fundingSyncConfig: selectedSymbol.fundingSyncConfig || {
          syncEnabled: 0,
          syncFrequency: '1h',
          lastSyncTime: '',
          syncErrorMessage: '',
        },
      };
      form.setFieldsValue(formValues);
    }
  }, [isVisible, selectedSymbol, form]);

  return (
    <Modal
      title="修改交易对"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
      width={1000}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateSymbol}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 基本信息 */}
        <Title level={5}>基本信息</Title>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="交易所"
              name="exchangeName"
              rules={[{ required: true, message: '请输入交易所名称' }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="交易对"
              name="symbol"
              rules={[{ required: true, message: '请输入交易对' }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="基础币种"
              name="baseAsset"
              rules={[{ required: true, message: '请输入基础币种' }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="计价币种"
              name="quoteAsset"
              rules={[{ required: true, message: '请输入计价币种' }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value={1}>交易中</Option>
                <Option value={2}>暂停交易</Option>
                <Option value={3}>已下架</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 交易参数 */}
        <Title level={5} style={{ marginTop: 24 }}>交易参数</Title>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="最小数量"
              name="minQty"
              rules={[{ required: true, message: '请输入最小数量' }]}
            >
              <Input type="number" step="0.00000001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="最大数量"
              name="maxQty"
              rules={[{ required: true, message: '请输入最大数量' }]}
            >
              <Input type="number" step="0.00000001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="最小手数"
              name="minLotSize"
              rules={[{ required: true, message: '请输入最小手数' }]}
            >
              <Input type="number" step="0.00000001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="最大手数"
              name="maxLotSize"
              rules={[{ required: true, message: '请输入最大手数' }]}
            >
              <Input type="number" step="0.00000001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="步长"
              name="stepSize"
              rules={[{ required: true, message: '请输入步长' }]}
            >
              <Input type="number" step="0.00000001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="价格步长"
              name="tickSize"
              rules={[{ required: true, message: '请输入价格步长' }]}
            >
              <Input type="number" step="0.00000001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="数量精度"
              name="qtyPrecision"
              rules={[{ required: true, message: '请输入数量精度' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="价格精度"
              name="pricePrecision"
              rules={[{ required: true, message: '请输入价格精度' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="最小名义价值"
              name="minNotional"
              rules={[{ required: true, message: '请输入最小名义价值' }]}
            >
              <Input type="number" step="0.00000001" />
            </Form.Item>
          </Col>
        </Row>

        {/* 同步配置 */}
        <Title level={5} style={{ marginTop: 24 }}>同步配置</Title>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="同步状态"
              name="syncStatus"
            >
              <Select disabled>
                <Option value={0}>未同步</Option>
                <Option value={1}>同步中</Option>
                <Option value={2}>同步成功</Option>
                <Option value={3}>同步失败</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="最后同步时间"
              name="lastSyncTime"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="同步频率"
              name="syncFrequency"
              rules={[{ required: true, message: '请选择同步频率' }]}
            >
              <Select placeholder="请选择同步频率">
                <Option value="1m">每1分钟</Option>
                <Option value="3m">每3分钟</Option>
                <Option value="5m">每5分钟</Option>
                <Option value="15m">每15分钟</Option>
                <Option value="30m">每30分钟</Option>
                <Option value="1h">每1小时</Option>
                <Option value="2h">每2小时</Option>
                <Option value="4h">每4小时</Option>
                <Option value="6h">每6小时</Option>
                <Option value="8h">每8小时</Option>
                <Option value="12h">每12小时</Option>
                <Option value="1d">每天</Option>
                <Option value="3d">每3天</Option>
                <Option value="1w">每周</Option>
                <Option value="1M">每月</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="同步开关"
              name="syncEnabled"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="同步错误信息"
              name="syncErrorMessage"
            >
              <Input.TextArea disabled rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* 资金费率同步配置 */}
        <Title level={5} style={{ marginTop: 24 }}>资金费率同步配置</Title>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="资金费率同步频率"
              name={['fundingSyncConfig', 'syncFrequency']}
              rules={[{ required: true, message: '请选择资金费率同步频率' }]}
            >
              <Select placeholder="请选择资金费率同步频率">
                <Option value="1m">每1分钟</Option>
                <Option value="3m">每3分钟</Option>
                <Option value="5m">每5分钟</Option>
                <Option value="15m">每15分钟</Option>
                <Option value="30m">每30分钟</Option>
                <Option value="1h">每1小时</Option>
                <Option value="2h">每2小时</Option>
                <Option value="4h">每4小时</Option>
                <Option value="6h">每6小时</Option>
                <Option value="8h">每8小时</Option>
                <Option value="12h">每12小时</Option>
                <Option value="1d">每天</Option>
                <Option value="3d">每3天</Option>
                <Option value="1w">每周</Option>
                <Option value="1M">每月</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="资金费率同步开关"
              name={['fundingSyncConfig', 'syncEnabled']}
              rules={[{ required: true, message: '请选择资金费率同步开关' }]}
            >
              <Select placeholder="请选择资金费率同步开关">
                <Option value={1}>启用</Option>
                <Option value={0}>禁用</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="最后同步时间"
              name={['fundingSyncConfig', 'lastSyncTime']}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="同步错误信息"
              name={['fundingSyncConfig', 'syncErrorMessage']}
            >
              <Input.TextArea disabled rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateQtsSymbolModal; 