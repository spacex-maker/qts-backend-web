import React from 'react';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { ClockCircleOutlined, GlobalOutlined, ThunderboltOutlined } from '@ant-design/icons';

const QtsFundingConfigTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleToggleSync,
  handleEditClick,
  handleDeleteClick,
  handleDetailClick,
  handleCollectClick
}) => {
  
  // 交易所名称颜色映射
  const exchangeColors = {
    'binance': '#F3BA2F',
    'okx': '#000000',
    'bybit': '#F7A600',
    'bitget': '#00D4FF',
    'gateio': '#2354E6',
    'deribit': '#0E8AF0',
    'huobi': '#2E7BF7',
    'phemex': '#1A1E3D'
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e, data)}
              />
              <label className="custom-control-label"></label>
            </div>
          </th>
          {['交易所', '同步间隔(小时)', '结算时间', '时区', '同步状态', '备注', '创建时间'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id)}
                />
                <label className="custom-control-label"></label>
              </div>
            </td>
            <td>
              <Tag 
                color={exchangeColors[item.exchange] || 'default'}
                icon={<GlobalOutlined />}
                style={{ fontWeight: 500 }}
              >
                {item.exchange?.toUpperCase() || '—'}
              </Tag>
            </td>
            <td>
              <Tooltip title={`每${item.fundingInterval}小时同步一次资金费率数据`}>
                <span>
                  <ClockCircleOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                  {item.fundingInterval || '—'}
                </span>
              </Tooltip>
            </td>
            <td>
              <code style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '2px 6px', 
                borderRadius: '3px',
                fontSize: '12px'
              }}>
                {item.settlementTimes || '—'}
              </code>
            </td>
            <td>
              <Tag color="blue">{item.timezone || '—'}</Tag>
            </td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.isSync}
                  onChange={(e) => handleToggleSync(item.exchange, e.target.checked)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td>
              <Tooltip title={item.remark}>
                <span style={{ 
                  maxWidth: '200px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block'
                }}>
                  {item.remark || '—'}
                </span>
              </Tooltip>
            </td>
            <td>{item.createTime || '—'}</td>
            <td>
              <Button 
                type="link" 
                icon={<ThunderboltOutlined />}
                onClick={() => handleCollectClick(item)}
              >
                采集
              </Button>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                详情
              </Button>
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>
              <Popconfirm
                title="确定要删除这个配置吗？"
                onConfirm={() => handleDeleteClick(item.id)}
                okText="是"
                cancelText="否"
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsFundingConfigTable;

