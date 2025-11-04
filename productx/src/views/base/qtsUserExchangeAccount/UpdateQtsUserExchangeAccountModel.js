import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, Row, Col, Divider, Space, Avatar, Tag, Spin } from 'antd';
import debounce from 'lodash/debounce';
import api from 'src/axiosInstance';

const { Option } = Select;
const { TextArea } = Input;

const UpdateQtsUserExchangeAccountModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateAccount,
  selectedAccount,
}) => {
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isVisible && selectedAccount) {
      form.setFieldsValue(selectedAccount);
      // 获取当前用户信息用于显示
      fetchUserById(selectedAccount.userId);
    }
  }, [isVisible, selectedAccount, form]);

  // 根据ID获取用户信息
  const fetchUserById = async (userId) => {
    if (!userId) return;
    try {
      const response = await api.get('/manage/user/list-all-summary', { 
        params: { id: userId } 
      });
      // @ts-ignore - axios拦截器已经处理了响应数据
      if (response && response.length > 0) {
        // @ts-ignore
        setCurrentUser(response[0]);
        // @ts-ignore
        setUsers([response[0]]);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  // 用户搜索（支持ID和用户名）
  const fetchUsers = debounce(async (searchText) => {
    if (!searchText) {
      setUsers(currentUser ? [currentUser] : []);
      return;
    }

    setFetching(true);
    try {
      const params = {};
      if (/^\d+$/.test(searchText)) {
        params.id = parseInt(searchText);
      } else {
        params.username = searchText;
      }

      const response = await api.get('/manage/user/list-all-summary', { params });
      if (response) {
        // @ts-ignore - axios拦截器已经处理了响应数据
        setUsers(response);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setFetching(false);
    }
  }, 500);

  // 用户选项渲染
  const userOption = (user) => (
    <Select.Option
      key={user.id}
      value={user.id}
      label={
        <Space>
          <Avatar size="small" src={user.avatar} />
          <span>{user.username}</span>
        </Space>
      }
    >
      <Space align="center" style={{ width: '100%' }}>
        <Avatar size="small" src={user.avatar} />
        <span style={{ flex: 1 }}>{user.username}</span>
        <Space size={4}>
          {user.isBelongSystem && (
            <Tag color="blue">系统用户</Tag>
          )}
          <Tag color={user.status ? 'success' : 'error'}>
            {user.status ? '正常' : '禁用'}
          </Tag>
          <span style={{ color: '#999' }}>ID: {user.id}</span>
        </Space>
      </Space>
    </Select.Option>
  );

  return (
    <Modal
      title="修改交易账户"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
      width={1100}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateAccount}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 基本信息 */}
        <Divider orientation="left" style={{ marginTop: 0 }}>基本信息</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="用户"
              name="userId"
              rules={[{ required: true, message: '请选择用户' }]}
            >
              <Select
                showSearch
                disabled
                placeholder="请输入用户ID或用户名搜索"
                onSearch={fetchUsers}
                loading={fetching}
                filterOption={false}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                optionLabelProp="label"
                dropdownStyle={{
                  padding: 4,
                  minWidth: 400
                }}
              >
                {users.map(user => userOption(user))}
              </Select>
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
            >
              <Input.Password placeholder="留空则不修改" />
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
              tooltip="选择交易账户的类型"
            >
              <Select placeholder="请选择交易类型" optionLabelProp="label">
                <Option value="SPOT" label="现货交易">
                  <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>现货交易</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>买卖实际的加密货币资产</span>
                  </Space>
                </Option>
                <Option value="FUTURES" label="合约交易">
                  <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>合约交易</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>通过合约进行杠杆交易，不交割实物</span>
                  </Space>
                </Option>
                <Option value="MARGIN" label="杠杆交易">
                  <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>杠杆交易</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>借币进行放大倍数的现货交易</span>
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="合约类型"
              name="futuresType"
              tooltip="仅合约交易需要选择"
            >
              <Select placeholder="请选择合约类型" allowClear optionLabelProp="label">
                <Option value="USD_M" label="U本位合约">
                  <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>U本位合约</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>使用USDT作为保证金，适合大多数交易者</span>
                  </Space>
                </Option>
                <Option value="COIN_M" label="币本位合约">
                  <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>币本位合约</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>使用对应币种作为保证金，适合持币者套保</span>
                  </Space>
                </Option>
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
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="AI策略"
              name="aiStrategyEnabled"
              valuePropName="checked"
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
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="账户状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
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

export default UpdateQtsUserExchangeAccountModal;

