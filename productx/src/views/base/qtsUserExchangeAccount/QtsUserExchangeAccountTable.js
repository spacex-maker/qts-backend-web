import React from 'react';
import { Button, Tag, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// 交易类型配置
const TRADE_TYPE_CONFIG = {
  SPOT: { text: '现货交易', color: 'blue' },
  FUTURES: { text: '合约交易', color: 'orange' },
  MARGIN: { text: '杠杆交易', color: 'purple' }
};

// 合约类型配置
const FUTURES_TYPE_CONFIG = {
  USD_M: { text: 'U本位合约', color: 'cyan' },
  COIN_M: { text: '币本位合约', color: 'geekblue' }
};

// 格式化交易类型显示
const formatTradeType = (tradeType) => {
  const config = TRADE_TYPE_CONFIG[tradeType];
  if (!config) return tradeType;
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 格式化合约类型显示
const formatFuturesType = (futuresType) => {
  if (!futuresType) return '-';
  const config = FUTURES_TYPE_CONFIG[futuresType];
  if (!config) return futuresType;
  return <Tag color={config.color}>{config.text}</Tag>;
};

// 格式化开关状态显示
const formatSwitchStatus = (enabled) => {
  return enabled ? 
    <Tag color="success">启用</Tag> : 
    <Tag color="default">禁用</Tag>;
};

// 格式化用户信息显示
const formatUserInfo = (userId, username, avatar) => {
  return (
    <Space size={8}>
      <Avatar size={40} src={avatar} icon={!avatar && <UserOutlined />} />
      <Space direction="vertical" size={0}>
        <span style={{ fontWeight: 500 }}>{username || '-'}</span>
        <span style={{ fontSize: '12px', color: '#999' }}>ID: {userId}</span>
      </Space>
    </Space>
  );
};

// 格式化账户名称和状态
const formatAccountNameWithStatus = (id, accountName, status, statusDesc) => {
  const statusColor = status === 1 ? 'success' : 'error';
  return (
    <Space direction="vertical" size={0}>
      <Space size={4}>
        <span style={{ fontWeight: 500 }}>{accountName}</span>
        <Tag color={statusColor}>{statusDesc}</Tag>
      </Space>
      <span style={{ fontSize: '12px', color: '#999' }}>账户ID: {id}</span>
    </Space>
  );
};

const QtsUserExchangeAccountTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
}) => {
  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          {[
            '用户信息', '交易所', '账户名称', '交易类型', '合约类型', 
            '最大交易金额', '杠杆倍数', '自动交易', 'AI策略', 
            '账户余额', 'API验证状态', '创建时间', '更新时间'
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column">操作</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`td_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td>{formatUserInfo(item.userId, item.username, item.avatar)}</td>
            <td>{item.exchangeName}</td>
            <td>{formatAccountNameWithStatus(item.id, item.accountName, item.status, item.statusDesc)}</td>
            <td>{formatTradeType(item.tradeType)}</td>
            <td>{formatFuturesType(item.futuresType)}</td>
            <td>{item.maxTradeAmount}</td>
            <td>{item.leverage}</td>
            <td>{formatSwitchStatus(item.autoTradeEnabled)}</td>
            <td>{formatSwitchStatus(item.aiStrategyEnabled)}</td>
            <td>{item.accountBalance}</td>
            <td>{item.apiVerifyStatusDesc}</td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsUserExchangeAccountTable;

