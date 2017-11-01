/*
 * @Author: muwen.lb
 * @Date:   2016-04-27 11:08:25
 * @Last Modified by:   litongqian
 * @Last Modified time: 2016-04-27 11:08:25
 */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Table from '@gag/table-web';
import Form from '@gag/form-web';
import Input from '@gag/input-web';
import Button from '@gag/button-web';
import Select from '@gag/select-web';
import Breadcrumb from '@gag/breadcrumb-web';
import DateLayerWrapper from '../../components/dateLayer/index';
import Radio from '@gag/radio-web';
import Modal from '@gag/modal-web';
import Store from 'Store2';
import TimePicker from '@gag/time-picker-web';
import * as FrameActions from '../../../actions/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Icon from '@gag/icon-web';
import OrganizationTree from '../../components/organizationTree';
import ThermodynamicChart from './components/thermodynamicChart';
import ShopTimePersent from './components/shopTimeFrameChart';
import toFixed2 from '../../../utils/common';
moment.locale('zh-cn');
const format = "YYYY-MM-DD";
const zhNow = moment().utcOffset(8);
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

// new object ref
class App extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号', width: 50, dataIndex: 'serial', key: 'serial', render: (value, row, index) => {
        return index + 1 + (this.state.pageIndex - 1) * 20;
      }
      },
      {
        title: '店铺名称',
        dataIndex: 'shopEntityName',
        key: 'shopEntityName',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '业态',
        dataIndex: 'shopEntityTypeRoot',
        key: 'shopEntityTypeRoot',
        render: (value, row, index) => {

          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render: (value, row, index) => {

          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '楼层',
        dataIndex: 'storey',
        key: 'storey',
        render: (value, row, index) => {

          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '销售额',
        dataIndex: 'amount',
        key: 'amount',
        sorter: true,
        render: (value, row, index) => {

          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '结账单',
        dataIndex: 'billCount',
        key: 'billCount',
        render: (value, row, index) => {

          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '单均消费',
        dataIndex: 'billAvgPrice',
        key: 'billAvgPrice',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '操作',
        dataIndex: 'modify',
        key: 'modify',
        className: 'clear-padding',
        render: (value, row, index) => <span onClick={this.showModal.bind(this, row)}><Icon type="eye" style={{
          fontSize: 16,
          cursor: 'pointer'
        }}/></span>,
      }
    ];
    this.state = {
      shopId: Store.get('user_data').shopId || '',
      shopName: Store.get('user_data').shopName || '',
      sso_token: window.APP_CONFIG.token,
      token: window.APP_CONFIG.token,
      shopEntityId: "",
      shopEntityType: "",
      shopEntityName: "",
      shopFloor:"",
      pageIndex: 1,
      pageSize: 20,
      fromDay: moment(new Date() - 6*24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      fromDayFrame: moment(new Date() - 6*24 * 60 * 60 * 1000),
      toDayFrame: moment(new Date()),
      toDay: moment(new Date()).format('YYYY-MM-DD'),
      billModal: [],
      newKey: 0,
      sortBy:"amount",
      reverse:1,
      distime:31,
      timeRange:'range'
    };
  };

  tableChange = (pagination, filters, sorter) => {
    if(sorter.order){
      if(sorter.order == 'ascend'){
        if(this.state.pageIndex == 1){
          this.setState({
            pageIndex: pagination.current,
            current:pagination.current,
            reverse:0,
            sortBy:sorter.field
          });
          const listData = {
            shopId: this.state.shopId,
            fromDay: this.state.fromDay,
            toDay: this.state.toDay,
            shopEntityId: "",
            pageSize: pagination.pageSize,
            pageIndex: pagination.current,
            sortBy:"amount",
            reverse:0,
            shopEntityName: this.state.shopEntityName,
          };
          this.props.listData(listData);
        }else {
          this.setState({
            pageIndex: 1,
            current:1,
            reverse:0,
            sortBy:sorter.field
          });
          const listData = {
            shopId: this.state.shopId,
            fromDay: this.state.fromDay,
            toDay: this.state.toDay,
            shopEntityId: "",
            pageSize: pagination.pageSize,
            pageIndex: 1,
            sortBy:"amount",
            reverse:0,
            shopEntityName: this.state.shopEntityName,
          };
          this.props.listData(listData);
        }

      }else if(sorter.order == 'descend'){
        if(this.state.pageIndex == 1){
          this.setState({
            pageIndex: pagination.current,
            current:pagination.current,
            reverse:1,
            sortBy:sorter.field
          });
          const listData = {
            shopId: this.state.shopId,
            fromDay: this.state.fromDay,
            toDay: this.state.toDay,
            shopEntityId: "",
            pageSize: pagination.pageSize,
            pageIndex: pagination.current,
            sortBy:"amount",
            reverse:1,
            shopEntityName: this.state.shopEntityName,
          };
          this.props.listData(listData);
        }else {
          this.setState({
            pageIndex: 1,
            current:1,
            reverse:1,
            sortBy:sorter.field
          });
          const listData = {
            shopId: this.state.shopId,
            fromDay: this.state.fromDay,
            toDay: this.state.toDay,
            shopEntityId: "",
            pageSize: pagination.pageSize,
            pageIndex: 1,
            sortBy:"amount",
            reverse:1,
            shopEntityName: this.state.shopEntityName,
          };
          this.props.listData(listData);
        }
      }
    }else {
      this.setState({
        pageIndex: pagination.current,
        current:pagination.current,
        reverse:1,
        sortBy:this.state.sortBy
      });
      const listData = {
        shopId: this.state.shopId,
        fromDay: this.state.fromDay,
        toDay: this.state.toDay,
        shopEntityId: "",
        pageSize: pagination.pageSize,
        pageIndex: pagination.current,
        sortBy:"amount",
        reverse:1,
        shopEntityName: this.state.shopEntityName,
      };
      this.props.listData(listData);
    }


  }

  //店铺购物时段分析
  showModal = (row, index) => {
    var newKeys = this.state.newKey + 1;
    this.setState({
      visible: true,
      billModal: [row, index],
      shopEntityId: row.shopEntityId,
      newKey: newKeys,
    });
    const shopChartData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId:row.shopEntityId,
      categoryRoot:"",
      shopFloor:"",
      shopEntityIds:""
    };
    this.props.shopChartData(shopChartData);
  }

  handleOk = () => {
    this.setState({visible: false});
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  defaultModal = () => {
    setTimeout(() => {
      const frameData = {
        shopId: this.state.shopId,
        fromDay: this.state.fromDay,
        toDay: this.state.toDay,
        shopEntityId:"",
        categoryRoot:this.state.shopEntityType,
        shopFloor:this.state.shopFloor,
      };
      this.props.chartData(frameData);
      const listData = {
        shopId: this.state.shopId,
        fromDay: this.state.fromDay,
        toDay: this.state.toDay,
        shopEntityId: "",
        pageSize: 20,
        pageIndex: 1,
        sortBy:"amount",
        reverse:this.state.reverse,
        shopEntityName: this.state.shopEntityName,
      };
      this.props.listData(listData);
      this.setState({
        loading: false
      });
    }, 3000);
  }
  //获取页面时间选择
  getDateTime = (params) => {
    this.setState({
      shopId: APP_CONFIG.shopId,
      fromDay: params.fromDay,
      toDay: params.toDay,
      fromDay: params.fromDayStr,
      toDay: params.toDayStr,
      current:1,
      pageIndex: 1,
      frameTimeFrom:params.fromDay
    })
    if(params.toDayStr - params.fromDayStr >31 ){
      alert('时间区间')
    }
    const frameData = {
      shopId: APP_CONFIG.shopId,
      fromDay: params.fromDayStr,
      toDay: params.toDayStr,
      shopEntityId:"",
      categoryRoot:this.state.shopEntityType,
      shopFloor:this.state.shopFloor,
    };
    this.props.chartData(frameData);
    const listData = {
      shopId: APP_CONFIG.shopId,
      fromDay: params.fromDayStr,
      toDay: params.toDayStr,
      shopEntityId: "",
      reverse:"",
      pageSize: 20,
      pageIndex: 1,
      sortBy:"amount",
      reverse:this.state.reverse,
      shopEntityName: this.state.shopEntityName,
    };
    this.props.listData(listData);
  }
  //楼层切换
  shopEntityFloorChange = (value) => {
    this.setState({
      shopFloor: value,
    });
    const frameData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId:"",
      categoryRoot:this.state.shopEntityType,
      shopFloor:value,
    };
    this.props.chartData(frameData);
  }
  onChangeUserName = (value) => {
    this.setState({
      shopEntityName: value,
      pageIndex: 1,
      current:1
    });
    const listData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
      pageSize: 20,
      pageIndex: 1,
      sortBy:"amount",
      reverse:this.state.reverse,
      shopEntityName:value
    };
    this.props.listData(listData);
  }

  //业态切换
  shopEntityTypeChange = (value) => {
    this.setState({
      shopEntityType: value,
    });
    const frameData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId:"",
      categoryRoot:value,
      shopFloor:this.state.shopFloor,
    };
    this.props.chartData(frameData);
  }


  componentWillMount() {
    this.setState({
      loading: false,
    });
    const frameData = {
      shopId: this.state.shopId||"",
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId:"",
      categoryRoot:this.state.shopEntityType,
      shopFloor:this.state.shopFloor,

    };
    this.props.chartData(frameData);
    const listData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
      pageSize: 20,
      pageIndex: 1,
      sortBy:"amount",
      reverse:this.state.reverse,
      shopEntityName: this.state.shopEntityName,
    };
    this.props.listData(listData);
  }

  render() {
    const categoryTypeArr = Store.get('user_data').categoryType? Store.get('user_data').categoryType:[];
    const floorArr = Store.get('user_data').floor&&Store.get('user_data').floor? Store.get('user_data').floor:[];
    const {getFieldDecorator} = this.props.form;
    let total = this.props.frame.frameListData.total || 0;
    const chartData = this.props.frame.frameData;
    const loading = this.props.frame.frameLoading;
    const shopChartData = this.props.frame.shopChartData;
    const pagination = {
      defaultCurrent: 1,
      total: total,
      pageSize: 20,
      current: this.state.pageIndex,
      showTotal:(total, range) => `显示第${range[0]}到第${range[1]}条记录  总共${total}条记录`
    };
    return (
      <div className="day-bill">
        <div className="wrapper-box util-clearfix">
          <OrganizationTree {...this.props.org}></OrganizationTree>
          <DateLayerWrapper callback={this.getDateTime} frameTimeFrom={this.state.fromDayFrame} distime={this.state.distime} timeRange={this.state.timeRange} toDayFrame={this.state.toDayFrame}></DateLayerWrapper>
        </div>
        <div className="wrapper-box util-clearfix">
          <Form onSubmit={this.handleSubmit} layout="inline">
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
              label="楼层"
            >
              <Select
                style={{width: '200px'}}
                placeholder="全部楼层" onChange={this.shopEntityFloorChange} key="全部楼层">
                <Option value="">全部楼层</Option>
                  {
                    floorArr.map((item, index) => {
                      return <Option value={item} key={item}>{item}</Option>
                    })
                  }
              </Select>
            </FormItem>
          </Form>
          <ThermodynamicChart chartData={chartData}></ThermodynamicChart>
        </div>
        <div className="wrapper-box util-clearfix">
          <Form layout="inline" style={{borderBottom: '2px #e3e3e3 solid', paddingBottom: 10, marginBottom: 10}}>
            <FormItem
              label="店铺名称"
            >
              <Search style={{width: '200px', marginRight: '20px'}} onSearch={this.onChangeUserName}
                      placeholder="输入店铺名称查找"></Search>
            </FormItem>
          </Form>
          <Table columns={this.columns} dataSource={this.props.frame.frameListData.rows}  pagination={pagination}
                 onChange={this.tableChange} loading={loading} rowKey="shopEntityName"/>
        </div>
        <Modal
          key={this.state.newKey}
          visible={this.state.visible}
          title={`${this.state.billModal.length > 0 ? this.state.billModal[0].shopEntityName : null}-购物时段分析`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}

          className="billModal"
          footer={[
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              确认
            </Button>,
          ]}
        >
        <div>
          <ShopTimePersent chartData={shopChartData}></ShopTimePersent>
        </div>

        </Modal>
      </div>
    );
  }
}

//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    frame: state.frame,
    org: state.org
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(FrameActions, dispatch)
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
const TimeFrame = connect(mapStateToProps, mapDispatchToProps)(App);
export default Form.create()(TimeFrame);
