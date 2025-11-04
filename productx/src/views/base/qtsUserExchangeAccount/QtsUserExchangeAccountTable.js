import React from 'react';
import { Button } from 'antd';

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
            '用户ID', '交易所', '账户名称', '交易类型', '合约类型', 
            '最大交易金额', '杠杆倍数', '自动交易', 'AI策略', 
            '账户余额', 'API验证状态', '状态', '备注', '创建时间', '更新时间'
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
            <td>{item.userId}</td>
            <td>{item.exchangeName}</td>
            <td>{item.accountName}</td>
            <td>{item.tradeType}</td>
            <td>{item.futuresType || '-'}</td>
            <td>{item.maxTradeAmount}</td>
            <td>{item.leverage}</td>
            <td>{item.autoTradeEnabled ? '启用' : '禁用'}</td>
            <td>{item.aiStrategyEnabled ? '启用' : '禁用'}</td>
            <td>{item.accountBalance}</td>
            <td>{item.apiVerifyStatusDesc}</td>
            <td>{item.statusDesc}</td>
            <td>{item.remark || '-'}</td>
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

