require('./index.less');
import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import Table from '@gag/table-web';
import Form from '@gag/form-web';
import Row from '@gag/row-web';
import Col from '@gag/col-web';
import Select from '@gag/select-web';
import DatePicker from '@gag/date-picker-web';
import Input from '@gag/input-web';
import Button from '@gag/button-web';
import Modal from '@gag/modal-web';
import List from '../../components/list';
import Icon from '@gag/icon-web';
import Tabs from '@gag/tabs-web';
import Store from 'store2';
import Barchart from '../../components/barchart';
import Piechart from '../../components/piechart';
import * as payAction from '../../../actions/index';
import DateLayer from '../../components/dateLayer/index';
import OrganizationTree from '../../components/organizationTree';
const {MonthPicker, RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const selectList = [
  '全部业务',
  '餐饮',
  '零售',
  '服务',
  '休闲',
  '主力店',
];
const renderTable = (value, row, index, payMethod) => {
  let obj = '- -';
  for (let i = 0; i < row.paymentByDim.length; i++) {
    if (row.paymentByDim[i].payMethod == payMethod) {
      obj = row.paymentByDim[i].payAmount.toFixed(2);
      break;
    }
  }
  return obj;
}
const renderTableRate = (value, row, index, payMethod) => {
  let obj = '- -';
  for (let i = 0; i < row.paymentByDim.length; i++) {
    if (row.paymentByDim[i].payMethod == payMethod) {
      obj = ((row.paymentByDim[i].payAmountRate) * 100).toFixed(2) + '%';
      break;
    }
  }
  return obj;
}
const getCountDays = (date) => {
  var curDate = new Date(date);
  /* 获取当前月份 */
  var curMonth = curDate.getMonth();
  /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
  curDate.setMonth(curMonth + 1);
  /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
  curDate.setDate(0);
  /* 返回当月的天数 */
  return moment(curDate).format('YYYY-MM-DD');
}
class PayAnalyze extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        width: 50,
        dataIndex: 'serial',
        key: 'serial',
        fixed: 'left', render: (value, row, index) => {
        return index + 1 + (this.state.pageIndex - 1) * 10;
      }
      },
      {title: '店铺名称', width: 100, dataIndex: 'shopEntityName', key: 'shopEntityName', fixed: 'left'},
      {title: '业态', width: 50, dataIndex: 'categoryRoot', key: 'age', fixed: 'left'},
      {
        title: '销售额', dataIndex: 'amount', key: '1', width: 150, fixed: 'left', render: (value, row, index) => {
        return row.amount.toFixed(2);
      }
      },
      {title: '结账单', dataIndex: 'billCount', key: '2', width: 150, fixed: 'left'},
      {
        title: '银行卡', dataIndex: 'address', key: '3', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '银行卡');
        return obj;
      }
      },
      {
        title: '现金', dataIndex: 'address', key: '4', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '现金');
        return obj;
      }
      },
      {
        title: '会员卡', dataIndex: 'address', key: '5', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '会员卡');
        return obj;
      }
      },
      {
        title: '支付宝',
        dataIndex: 'address',
        key: '6',
        width: 150,
        render: (value, row, index) => {
          let obj = renderTable(value, row, index, '支付宝');
          return obj;
        }
      },
      {
        title: '微信', dataIndex: 'address', key: '7', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '微信');
        return obj;
      }
      },
      {
        title: '优惠券', dataIndex: 'address', key: '8', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '优惠券');
        return obj;
      }
      },
      {
        title: '美团', dataIndex: 'address', key: '9', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '美团');
        return obj;
      }
      },
      {
        title: '大众点评', dataIndex: 'address', key: '10', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '大众点评');
        return obj;
      }
      },
      {
        title: '百度糯米', dataIndex: 'address', key: '11', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '百度糯米');
        return obj;
      }
      },
      {
        title: '饿了么', dataIndex: 'address', key: '12', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '饿了么');
        return obj;
      }
      },
      {
        title: '其他', dataIndex: 'address', key: '13', width: 150, render: (value, row, index) => {
        let obj = renderTable(value, row, index, '其他');
        return obj;
      }
      },

      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (value, row, index) => <span onClick={this.showModal.bind(this, row)}><Icon type="eye" style={{
          fontSize: 16,
          cursor: 'pointer'
        }}/></span>,
      },
    ];
    this.columnsModal = [
      {
        title: '支付方式',
        dataIndex: 'payMethod',
        key: 'payMethod',
        render: (value, row, index) => {
        return index == 0 ? '销售额' : '销售额占比';
      }
      },
      {
        title: '银行卡', dataIndex: 'address', key: '3', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '银行卡') : renderTableRate(value, row, index, '银行卡');
      }
      },
      {
        title: '现金', dataIndex: 'address', key: '4', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '现金') : renderTableRate(value, row, index, '现金');
      }
      },
      {
        title: '会员卡', dataIndex: 'address', key: '5', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '会员卡') : renderTableRate(value, row, index, '会员卡');
      }
      },
      {
        title: '支付宝', dataIndex: 'address', key: '6', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '支付宝') : renderTableRate(value, row, index, '支付宝');
      }
      },
      {
        title: '微信', dataIndex: 'address', key: '7', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '微信') : renderTableRate(value, row, index, '微信');
      }
      },
      {
        title: '优惠券', dataIndex: 'address', key: '8', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '优惠券') : renderTableRate(value, row, index, '优惠券');
      }
      },
      {
        title: '美团', dataIndex: 'address', key: '9', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '美团') : renderTableRate(value, row, index, '美团');
      }
      },
      {
        title: '大众点评', dataIndex: 'address', key: '10', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '饿了么') : renderTableRate(value, row, index, '饿了么');
      }
      },
      {
        title: '百度糯米', dataIndex: 'address', key: '11', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '大众点评') : renderTableRate(value, row, index, '大众点评');
      }
      },
      {
        title: '饿了么', dataIndex: 'address', key: '12', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '饿了么') : renderTableRate(value, row, index, '饿了么');
      }
      },
      {
        title: '其他', dataIndex: 'address', key: '13', render: (value, row, index) => {
        return index == 0 ? renderTable(value, row, index, '其他') : renderTableRate(value, row, index, '其他');
      }
      },

    ];
    this.state = {
      pageIndex: 1,
      pageSize: 10,
      current:1,
      rangeTime: "day",
      visible: false,
      singlerow: [],
      shopId: Store.get('user_data').shopId || '',
      shopName: Store.get('user_data').shopName || '',
      fromDay: moment(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      toDay: moment(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      shopEntityType: '',
      shopEntityName: '',
      shopEntityId: '',
      sso_token: '',
      newKey: 0,
    }
  }


//业态切换
  handleShopEntityType = (value) => {
    this.setState({
      shopEntityType: `${value}`,
      pageIndex: 1,
      current:1,
    });
    var postData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityType: `${value}`,
      shopEntityName: this.state.shopEntityName,
      pageIndex: 1,
      pageSize: this.state.pageSize,
    }
    this.props.getPayDistribution(postData);
  }
//店铺名查询
  onChangeShopName = (value) => {
    this.setState({
      shopEntityName: value,
      pageIndex:1,
      current:1,
    });
    var postData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityName: value,
      shopEntityType: this.state.shopEntityType,
      pageIndex: 1,
      pageSize:20
    }
    this.props.getPayDistribution(postData);
  }
//表格翻页
  tableChange = (pagination, filters, sorter) => {
    //console.log(pagination);
    let postData = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityType: this.state.shopEntityType,
      shopEntityName: this.state.shopEntityName,
    }
    this.props.getPayDistribution(postData);
    this.setState({
      pageIndex: pagination.current,
      current:pagination.current,
    });
  }
  //时间选择
  getDateTime = (params) => {
    let initData = {
      shopId: APP_CONFIG.shopId,
      fromDay: params.fromDayStr,
      toDay: params.toDayStr,
      pageIndex: 1,
      pageSize: this.state.pageSize,
      shopEntityName: this.state.shopEntityName,
      shopEntityType: this.state.shopEntityType,
    }
    this.props.getPayDistribution(initData);
    this.props.getPaymentSum({
      shopId: APP_CONFIG.shopId,
      fromDay: params.fromDayStr,
      toDay: params.toDayStr,
      shopEntityName: this.state.shopEntityName,
      shopEntityType: this.state.shopEntityType,
    });
    this.setState({
      fromDay: params.fromDayStr,
      toDay: params.toDayStr,
      shopId: APP_CONFIG.shopId,
      current:1,
      pageIndex: 1,
    })
  }
  onTemplate = (event) => {
    event.preventDefault();
    location.href = APP_CONFIG.api.URLFIX + '/payment/downloadDistribution?sso_token=' + this.state.sso_token + '&shopId=' + this.state.shopId + '&fromDay=' + this.state.fromDay + '&toDay=' + this.state.toDay + '&shopEntityType=' + this.state.shopEntityType + '&shopEntityId=' + this.state.shopEntityId + '&shopEntityName=' + this.state.shopEntityName || '';
  }
  //支付方式modal
  showModal = (row) => {
    var newKeys = this.state.newKey + 1;
    this.setState({
      visible: true,
      singlerow: [row, row],
      newKey: newKeys,
    });
  }
  //左侧店铺选择
  onSelectList = (row) => {
    this.setState({
      singlerow: [row, row],
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  componentWillMount() {
    this.setState({
      sso_token: APP_CONFIG.token,
    });

    var initData = {
      shopId: this.state.shopId||"",
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      pageIndex: 1,
      pageSize: 10,
    };

    this.props.getPayDistribution(initData);

    this.props.getPaymentSum({
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
    });
  }

  render() {
    const {rows, pageIndex, pageSize, total} = this.props.pay.tableList;
    const categoryTypeArr = Store.get('user_data').categoryType || [];
    const {salesChartData, closingsChartData} = this.props;
    const loading = this.props.pay.payLoading;
    const pagination = {
      defaultCurrent: 1,
      total: total,
      current:this.state.current,
      showTotal:(total, range) => `显示第${range[0]}到第${range[1]}条记录  总共${total}条记录`
    };

    return (
      <div>
        <div className="wrapper-box util-clearfix">
          <OrganizationTree {...this.props.org}></OrganizationTree>
          <DateLayer callback={this.getDateTime}></DateLayer>
        </div>
        <div className="wrapper-box util-clearfix">
          <Tabs>
            <TabPane tab="销售额" key="1">
              <Barchart chartData={salesChartData} displayType='销售额'></Barchart>
            </TabPane>
            <TabPane tab="结账单" key="2">
              <Barchart chartData={closingsChartData} displayType='结账单'></Barchart>
            </TabPane>
          </Tabs>
        </div>

        <div className="wrapper-box util-clearfix">
          <Form layout="inline" style={{borderBottom: '2px #e3e3e3 solid', paddingBottom: 10, marginBottom: 10}}>
            <FormItem
              label="业态"
            >
              <Select
                style={{width: '200px'}}
                placeholder="全部业态" onChange={this.handleShopEntityType}>
                <Option value="" key="">全部业态</Option>
                {
                  categoryTypeArr.map((item, index) => {
                    return <Option value={item} key={item}>{item} </Option>
                  })
                }
              </Select>

            </FormItem>
            <FormItem
              label="店铺名称"
            >
              <Search
                style={{width: '200px', marginRight: '20px'}}
                onSearch={this.onChangeShopName} placeholder="输入店铺名称查找"></Search>

            </FormItem>
            <FormItem style={{float: 'right'}}>
              <Button type="danger" style={{padding: '4px 15px', fontSize: 14}} onClick={this.onTemplate}>导出</Button>
            </FormItem>
          </Form>

          <Table columns={this.columns} dataSource={rows} onChange={this.tableChange} scroll={{x: 2430}}
                 loading={loading} pagination={pagination} rowKey="shopEntityName"/>
          <Modal
            key={this.state.newKey}
            title={`支付方式分析----${this.state.singlerow.length > 0 ? this.state.singlerow[0].shopEntityName : null}`}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={900}
            footer={null}
          >
            <Row>
              <Col span={4}>
                <div className="list" style={{height: 610, overflow: 'auto', borderRight: '1px solid #ddd'}}>
                  <List listData={rows} onSel={this.onSelectList.bind(this)}
                        selItem={this.state.singlerow.length > 0 ? this.state.singlerow[0] : null}></List>
                </div>
              </Col>
              <Col span={20}>
                <div>
                  <Piechart data={this.state.singlerow.length > 0 ? this.state.singlerow[0] : null}></Piechart>
                  <Table columns={this.columnsModal}
                         dataSource={this.state.singlerow.length > 0 ? this.state.singlerow : null} pagination={false}
                         bordered rowKey="address"/>
                </div>
              </Col>
            </Row>
          </Modal>
        </div>
      </div>
    );
  }
}
//将state.site绑定到props的site
const chartDataChange = (pay, getName) => {
  const {paymentSum} = pay;
  const chartData = paymentSum.shopEntityTypeStats;
  let charDataContain = [];
  for (let i = 0; i < chartData.length; i++) {
    let item = chartData[i];
    charDataContain.push({});
    charDataContain[i].shopEntityType = item.shopEntityType;
    let datas = item.paymentByDim;
    const months = ['银行卡', '现金', '会员卡', '支付宝', '微信', '优惠券', '美团', '大众点评', '百度糯米', '饿了么', '其他'];
    for (let j = 0; j < months.length; j++) {
      charDataContain[i][months[j]] = 0;
      for (let k = 0; k < datas.length; k++) {
        if (datas[k].payMethod == months[j]) {
          charDataContain[i][months[j]] = parseFloat(datas[k][getName].toFixed(2));
          break;
        }
      }
    }
  }
  return charDataContain;
}
const mapStateToProps = (state, ownProps) => ({
  pay: state.pay,
  salesChartData: chartDataChange(state.pay, 'payAmount'),
  closingsChartData: chartDataChange(state.pay, 'payCount'),
  org: state.org
})
//将dispatch的所有方法绑定到props上
const mapDispatchToProps = (dispatch, ownProps) => ({
  getPayDistribution: (data) => {
    dispatch(payAction.getPayDistribution(data))
  },
  getPaymentSum: (data) => {
    dispatch(payAction.getPaymentSum(data))
  },
})
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
const WrappedPayAnalyze = connect(mapStateToProps, mapDispatchToProps)(PayAnalyze);
export default Form.create()(WrappedPayAnalyze);
