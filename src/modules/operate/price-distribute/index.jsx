import React from 'react';
import Table from '@gag/table-web';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
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
import Store from 'store2';
import * as PriceActions from '../../../actions/index';
import moment from 'moment';
import DateLayerWrapper from '../../components/dateLayer/index';
import BarchartPersent from '../../components/barchartPersent/Barchart';
import OrganizationTree from '../../components/organizationTree';
import toFixed2 from '../../../utils/common';
import './index.less';
const format = "YYYY-MM-DD";
const zhNow = moment();
const {MonthPicker, RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
class App extends React.Component {
  constructor(props) {
    super(props);
    // new object ref
    this.columns = [
      {
        title: '序号',
        width: 50,
        dataIndex: 'serial',
        key: 'serial',
        render: (value, row, index) => {
          return index + 1 + (this.state.pageIndex - 1) * 20;
        }
      },
      {title: '店铺名称', width: 100, dataIndex: 'shopEntityName', key: 'shopEntityName',},
      {title: '业态', width: 100, dataIndex: 'shopEntityTypeRoot', key: 'shopEntityTypeRoot',},
      {title: '楼层', dataIndex: 'storey', width: 100, key: 'storey',sorter: true},
      {title: '销售额', dataIndex: 'amount', width: 100, key: 'amount', sorter: true},
      {title: '结账单', dataIndex: 'billCount', width: 100, key: 'billCount',sorter: true},
      {
        title: '价格区间',
        key: 'operation',
        width: 100,
        render: (value, row, index) => <span onClick={this.showModal.bind(this, row)}><Icon type="eye" style={{
          fontSize: 16,
          cursor: 'pointer'
        }}/></span>,
      },
    ];
    this.columnsPrice = [
      {title: '价格区间', key: 'term', width: 100, dataIndex: 'term',},
      {
        title: '销售额', key: 'saleAmount', width: 100, dataIndex: 'saleAmount', render: (value, row, index) => {
        return toFixed2.formatCurrency(row.saleAmount);
      }
      },
      {
        title: '销售额占比',
        key: 'saleAmountPercent',
        dataIndex: 'saleAmountPercent',
        width: 150,
        render: (value, row, index) => {
          return toFixed2.formatCurrency(row.saleAmountPercent * 100) + '%';
        }
      },
      {title: '结账单', key: 'saleCount', dataIndex: 'saleCount', width: 100,},
      {
        title: '结账单占比',
        key: 'saleCountPercent',
        dataIndex: 'saleCountPercent',
        width: 150,
        render: (value, row, index) => {
          return toFixed2.formatCurrency(row.saleCountPercent * 100) + '%';
        }
      },
    ];

    this.state = {
      current:1,
      pageIndex: 1,
      sso_token: '',
      shopId: Store.get('user_data') ? Store.get('user_data').shopId : '',
      shopName: Store.get('user_data') ? Store.get('user_data').shopName : '',
      shopEntityId: "",
      shopEntityType: "",
      shopEntityName: "",
      fromDay: moment(new Date() - 24 * 60 * 60 * 1000),
      toDay: moment(new Date() - 24 * 60 * 60 * 1000),
      visible: false,
      tableList: [],
      buteList: [],
      priceModal: [],
      postState: "",
      tableState: "none",
      newKey: 0,
      priceModalFrom: moment(new Date() - 24 * 60 * 60 * 1000),
      priceModalTo: moment(new Date() - 24 * 60 * 60 * 1000),
      sortBy:"amount",
      reverse:1,
    };
  }
   mySorter = (a, b) =>{
    if (/^\d/.test(a) ^ /^\D/.test(b)) return a>b?1:(a==b?0:-1);
    return a>b?-1:(a==b?0:1);
  }
  //店铺名查询
  onChangeUserName = (value) => {
    this.setState({
      shopEntityName: value,
      pageIndex: 1,
      current:1
    });
    var initData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay.format(format),
      toDay: this.state.toDay.format(format),
      shopEntityName: value,
      shopEntityType: this.state.shopEntityType,
      pageIndex: 1,
      pageSize:20,
      sortBy:this.state.sortBy,
      reverse:this.state.reverse,
    }
    this.props.initDataPrice(initData);
  }
  //业态切换
  shopEntityTypeChange = (value) => {
    this.setState({
      shopEntityType: value,
    });
    var initData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay.format(format),
      toDay: this.state.toDay.format(format),
      shopEntityType: value,
      sortBy:this.state.sortBy,
      reverse:this.state.reverse,
    };
    this.props.initDataPrice(initData);
  }
  //表格分页
  tableChange = (pagination, filters, sorter) => {
    if(sorter.order){
      if(sorter.order == 'ascend'){
        if(this.state.current == 1){
          this.setState({
            pageIndex: pagination.current,
            current:pagination.current,
            reverse:1,
            sortBy:sorter.field
          });
          let initData = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
            shopId: this.state.shopId,
            fromDay: this.state.fromDay.format(format),
            toDay: this.state.toDay.format(format),
            shopEntityName: this.state.shopEntityName,
            shopEntityType: this.state.shopEntityType,
            sortBy:sorter.field,
            reverse:0,
          }
          this.props.initDataPrice(initData);
        }else {
          this.setState({
            pageIndex: 1,
            current:1,
            reverse:0,
            sortBy:sorter.field
          });
          let initData = {
            pageIndex: 1,
            pageSize: pagination.pageSize,
            shopId: this.state.shopId,
            fromDay: this.state.fromDay.format(format),
            toDay: this.state.toDay.format(format),
            shopEntityName: this.state.shopEntityName,
            shopEntityType: this.state.shopEntityType,
            sortBy:sorter.field,
            reverse:0,
          }
          this.props.initDataPrice(initData);

        }

      }else if (sorter.order == 'descend') {
        if(this.state.current == 1){
          this.setState({
            pageIndex: pagination.current,
            current:pagination.current,
            reverse:1,
            sortBy:this.state.sortBy
          });
          let initData = {
            pageIndex: pagination.current,
            pageSize: pagination.pageSize,
            shopId: this.state.shopId,
            fromDay: this.state.fromDay.format(format),
            toDay: this.state.toDay.format(format),
            shopEntityName: this.state.shopEntityName,
            shopEntityType: this.state.shopEntityType,
            sortBy:sorter.field,
            reverse:1,
          }
          this.props.initDataPrice(initData);
        }else {
          this.setState({
            pageIndex: 1,
            current:1,
            reverse:1,
            sortBy:sorter.field
          });
          let initData = {
            pageIndex: 1,
            pageSize: pagination.pageSize,
            shopId: this.state.shopId,
            fromDay: this.state.fromDay.format(format),
            toDay: this.state.toDay.format(format),
            shopEntityName: this.state.shopEntityName,
            shopEntityType: this.state.shopEntityType,
            sortBy:sorter.field,
            reverse:1,
          }
          this.props.initDataPrice(initData);
        }

      }
    }else {
      this.setState({
        pageIndex: pagination.current,
        current:pagination.current,
        reverse:1,
        sortBy:sorter.field
      });
      let initData = {
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        shopId: this.state.shopId,
        fromDay: this.state.fromDay.format(format),
        toDay: this.state.toDay.format(format),
        shopEntityName: this.state.shopEntityName,
        shopEntityType: this.state.shopEntityType,
        sortBy:sorter.field,
        reverse:1,
      }
      this.props.initDataPrice(initData);
    }


  }
  //获取页面时间选择
  getDateTime = (params) => {
    this.setState({
      shopId: APP_CONFIG.shopId,
      fromDay: params.fromDay,
      toDay: params.toDay,
      priceModalFrom: params.fromDay,
      priceModalTo: params.toDay,
      current:1,
      pageIndex: 1,
    })
    let initData = {
      shopId: APP_CONFIG.shopId,
      fromDay: params.fromDayStr,
      toDay: params.toDayStr,
      shopEntityName: this.state.shopEntityName,
      shopEntityType: this.state.shopEntityType,
      pageIndex: 1,
      pageSize: 20,
      sortBy:this.state.sortBy,
      reverse:this.state.reverse,
    }
    this.props.initDataPrice(initData);

  }

  //价格区间modal
  showModal = (row) => {
    let item = this.state;
    var newKeys = this.state.newKey + 1;
    this.setState({
      visible: true,
      priceModal: [row, row],
      shopEntityId: row.shopEntityId,
      //shopEntityName: row.shopEntityName,
      loading: false,
      newKey: newKeys,
      priceModalFrom: item.fromDay,
      priceModalTo: item.toDay

    });
    var buteData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay.format(format),
      toDay: this.state.toDay.format(format),
      shopEntityId: row.shopEntityId,
    }
    this.props.buteData(buteData);
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
  //价格区间modal表格切换
  onPost = () => {
    this.setState({
      postState: "",
      tableState: "none",
    });
  }
  onTable = () => {
    this.setState({
      postState: "none",
      tableState: "",
    });
  }
  priceModalFrom = (value) => {
    this.setState({
      priceModalFrom: value
    });
  }
  priceModalTo = (value) => {
    this.setState({
      priceModalTo: value
    });
  }
  priceModalTime = () => {
    var buteData = {
      shopId: this.state.shopId,
      fromDay: this.state.priceModalFrom.format(format),
      toDay: this.state.priceModalTo.format(format),
      shopEntityId: this.state.shopEntityId,
    };
    this.props.buteData(buteData);
  }
  //价格区间modal时间查询
  priceStartDate = (fromDay) => {
    const toDay = this.state.priceModalTo;
    if (!fromDay || !toDay) {
      return false;
    }
    return fromDay.valueOf() > toDay.valueOf() || fromDay.valueOf() < moment(toDay).add(-92, 'days').valueOf();
  }
  priceEndDate = (toDay) => {
    const fromDay = this.state.priceModalFrom;
    const endDay = this.state.priceModalTo;
    if (!toDay || !fromDay) {
      return false;
    }
    return toDay.valueOf() > zhNow.valueOf() || toDay.valueOf() < fromDay.valueOf();
  }

  //价格区间分布左侧店铺选择
  onSelectList = (row) => {
    this.setState({
      priceModal: [row, row],
      shopEntityId: row.shopEntityId,
    });
    var buteData = {
      shopId: this.state.shopId,
      fromDay: this.state.priceModalFrom.format(format),
      toDay: this.state.priceModalTo.format(format),
      shopEntityId: row.shopEntityId,
      shopEntityName: row.shopEntityName
    };
    this.props.buteData(buteData);
  }
  //价格区间分布导出
  onTemplate = (event) => {
    event.preventDefault();
    location.href = APP_CONFIG.api.URLFIX + '/downloadPriceDistribution?sso_token=' + this.state.sso_token + '&shopId=' + this.state.shopId + '&shopName=' + this.state.shopName + '&fromDay=' + this.state.fromDay.format(format) + '&toDay=' + this.state.toDay.format(format) + '&shopEntityType=' + this.state.shopEntityType + '&shopEntityId=' + this.state.shopEntityId + '&shopEntityName=' + this.state.shopEntityName || '';
  }

  componentDidMount() {
    this.setState({
      loading: false,
      sso_token: APP_CONFIG.token,
    });
    var initData = {
      shopId: this.state.shopId||"",
      fromDay: this.state.fromDay.format(format),
      toDay: this.state.toDay.format(format),
      shopEntityType: this.state.shopEntityType,
      pageIndex: 1,
      pageSize: 20,
      sortBy:this.state.sortBy,
      reverse:this.state.reverse,
    };
    this.props.initDataPrice(initData);

  }

  componentWillReceiveProps(nextProps) {
    //console.log(this.props);
    //console.log(nextProps, 'price-distribute');
  }

  render() {
    const categoryTypeArr = Store.get('user_data')&&Store.get('user_data').categoryType ? Store.get('user_data').categoryType : [];
    let total = this.props.price.tableList.total || 0;
    const pagination = {
      total: total,
      pageSize: 20,
      current:this.state.current,
      showTotal:(total, range) => `显示第${range[0]}到第${range[1]}条记录  总共${total}条记录`
    };
    const chartData = [];
    const month = [];
    const loading = this.props.price.priceLoading;
    this.props.price.buteList.map(function (item, i) {
      chartData.push((item.saleAmountPercent).toFixed(4) * 100)
      month.push(item.term)
    });
    return (
      <div className="price-distribute">
        <div className="wrapper-box util-clearfix">
          <OrganizationTree {...this.props.org}></OrganizationTree>
          <DateLayerWrapper callback={this.getDateTime}></DateLayerWrapper>
        </div>
        <div className="wrapper-box util-clearfix">
          <Form layout="inline" style={{borderBottom: '2px #e3e3e3 solid', paddingBottom: 10, marginBottom: 10}}>
            <FormItem
              label="业态"
            >
              <Select
                style={{width: '200px'}}
                placeholder="全部业态" onChange={this.shopEntityTypeChange} key="全部业态">
                <Option value="">全部业态</Option>
                {
                  categoryTypeArr.map((item, index) => {
                    return <Option value={item} key={item}>{item}</Option>
                  })
                }
              </Select>
            </FormItem>
            <FormItem
              label="店铺名称"
            >
              <Search style={{width: '200px', marginRight: '20px'}} onSearch={this.onChangeUserName}
                      placeholder="输入店铺名称查找"></Search>
            </FormItem>
          </Form>
          <Table columns={this.columns} dataSource={this.props.price.tableList.rows} pagination={pagination}
                 onChange={this.tableChange} loading={loading} rowKey="shopEntityName"/>
          <Modal
            key={this.state.newKey}
            title={`价格区间分布----${this.state.priceModal.length > 0 ? this.state.priceModal[0].shopEntityName : null}`}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={800}
            footer={null}
            afterClose={this.defaultModal}
          >
            <Row>
              <Col span={6}>
                <div style={{paddingRight: 10}}>
                  <div className="list" style={{maxHeight: 500, overflow: 'auto'}}>
                    <List listData={this.props.price.tableList.rows} onSel={this.onSelectList.bind(this)}
                          selItem={this.state.priceModal.length > 0 ? this.state.priceModal[0] : null}></List>
                  </div>
                </div>
              </Col>
              <Col span={18}>
                <div style={{float: 'left', whiteSpace: 'nowrap', marginLeft: 0}}>
                  <Form layout="inline">
                    <FormItem
                      label="日期"
                    >
                      <DatePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        value={this.state.priceModalFrom}
                        onChange={this.priceModalFrom}
                        style={{width: 120}}
                        disabledDate={this.priceStartDate}
                      >
                      </DatePicker>
                    </FormItem>
                    <FormItem
                      label="至"
                    >
                      <DatePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        value={this.state.priceModalTo}
                        onChange={this.priceModalTo}
                        style={{width: 120}}
                        disabledDate={this.priceEndDate}
                      >
                      </DatePicker>
                    </FormItem>
                    <FormItem>
                      <div className="submit-button">
                        <Button type="danger" icon="search"
                                style={{padding: '4px 15px', fontSize: 12, fontWeight: 'normal'}}
                                onClick={this.priceModalTime}>查询</Button>
                      </div>
                    </FormItem>
                    <FormItem >
                      <div style={{marginLeft: 10, fontSize: 18, cursor: 'pointer', color: '#919191'}}>
                        <span onClick={this.onPost} style={{marginRight: 10}}>
                          <Icon type="bar-chart"/></span><span
                        onClick={this.onTable}><Icon type="bars"/>
                      </span>
                      </div>
                    </FormItem>
                  </Form>
                </div>
              </Col>
              <Col span={18} style={{display: this.state.postState}}>
                <div style={{textAlign: 'center', marginTop: 25}}>销售额占比</div>
                <BarchartPersent
                  chartData={chartData}
                /></Col>
              <Col span={18} style={{display: this.state.tableState}}>
                <Table columns={this.columnsPrice} dataSource={this.props.price.buteList}
                       loading={this.state.loading}></Table>
              </Col>
            </Row>
            <Row style={{textAlign: 'right'}}>
              <Col span={18} style={{float: 'right'}}>
                <Button type="primary" onClick={this.onTemplate}>当前店铺导出</Button>
              </Col>
            </Row>
          </Modal>
        </div>
      </div>
    );
  }
}
//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    price: state.price,
    org: state.org,
    layout: state.layout
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(PriceActions, dispatch)
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
const PriceAnalyze = connect(mapStateToProps, mapDispatchToProps)(App);
export default Form.create()(PriceAnalyze);
