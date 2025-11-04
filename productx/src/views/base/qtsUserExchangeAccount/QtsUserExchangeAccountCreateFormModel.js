import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, Row, Col, Divider } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const QtsUserExchangeAccountCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增交易账户"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={1100}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        {/* 基本信息 */}
        <Divider orientation="left" style={{ marginTop: 0 }}>基本信息</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="用户ID"
              name="userId"
              rules={[{ required: true, message: '请输入用户ID' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入用户ID" min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="交易所名称"
              name="exchangeName"
              rules={[{ required: true, message: '请输入交易所名称' }]}
            >
              <Input placeholder="如：Binance" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="账户名称"
              name="accountName"
              rules={[{ required: true, message: '请输入账户名称' }]}
            >
              <Input placeholder="请输入账户名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="API权限"
              name="apiPermissions"
            >
              <Input placeholder="如：SPOT,FUTURES" />
            </Form.Item>
          </Col>
        </Row>

        {/* API配置 */}
        <Divider orientation="left">API配置</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="API Key"
              name="apiKey"
              rules={[{ required: true, message: '请输入API Key' }]}
            >
              <Input placeholder="请输入API Key" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="API Secret"
              name="apiSecret"
              rules={[{ required: true, message: '请输入API Secret' }]}
            >
              <Input.Password placeholder="请输入API Secret" />
            </Form.Item>
          </Col>
        </Row>

        {/* 交易配置 */}
        <Divider orientation="left">交易配置</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="交易类型"
              name="tradeType"
              rules={[{ required: true, message: '请选择交易类型' }]}
            >
              <Select placeholder="请选择交易类型">
                <Option value="SPOT">现货</Option>
                <Option value="FUTURES">合约</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="合约类型"
              name="futuresType"
            >
              <Select placeholder="请选择合约类型" allowClear>
                <Option value="USD_M">U本位</Option>
                <Option value="COIN_M">币本位</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="持仓模式"
              name="positionMode"
            >
              <Select placeholder="请选择持仓模式">
                <Option value="ONEWAY">单向持仓</Option>
                <Option value="HEDGE">双向持仓</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="杠杆倍数"
              name="leverage"
              rules={[{ required: true, message: '请输入杠杆倍数' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="1-125" min={1} max={125} />
            </Form.Item>
          </Col>
        </Row>

        {/* 风控配置 */}
        <Divider orientation="left">风控配置</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="最大交易金额"
              name="maxTradeAmount"
              rules={[{ required: true, message: '请输入最大交易金额' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="单笔最大交易金额" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="每日交易限制"
              name="dailyTradeLimit"
              rules={[{ required: true, message: '请输入每日交易限制' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="每日交易次数" min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="最大持仓金额"
              name="maxPositionAmount"
            >
              <InputNumber style={{ width: '100%' }} placeholder="最大持仓金额" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="止损百分比(%)"
              name="stopLossPercentage"
            >
              <InputNumber style={{ width: '100%' }} placeholder="0-100" min={0} max={100} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="止盈百分比(%)"
              name="takeProfitPercentage"
            >
              <InputNumber style={{ width: '100%' }} placeholder="0-100" min={0} max={100} />
            </Form.Item>
          </Col>
        </Row>

        {/* 功能开关 */}
        <Divider orientation="left">功能开关</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="自动交易"
              name="autoTradeEnabled"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="AI策略"
              name="aiStrategyEnabled"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="模拟盘"
              name="isDemo"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="账户状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
              initialValue={1}
            >
              <Select placeholder="请选择状态">
                <Option value={1}>正常</Option>
                <Option value={0}>禁用</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 备注信息 */}
        <Divider orientation="left">备注信息</Divider>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="备注"
              name="remark"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <TextArea rows={3} placeholder="请输入备注信息" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default QtsUserExchangeAccountCreateFormModal;

