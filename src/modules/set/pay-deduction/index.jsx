/*
 * @Author: muwen.lb
 * @Date:   2016-04-27 11:08:25
 * @Last Modified by:   litongqian
 * @Last Modified time: 2016-04-27 11:08:25
 */
require('./index.less');
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Table from '@gag/table-web';
import Form from '@gag/form-web';
import Input from '@gag/input-web';
import Button from '@gag/button-web';
import Select from '@gag/select-web';
import Breadcrumb from '@gag/breadcrumb-web';
import Radio from '@gag/radio-web';
import Modal from '@gag/modal-web';
import Store from 'Store2';
import TimePicker from '@gag/time-picker-web';
import * as DeductionActions from '../../../actions/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Icon from '@gag/icon-web';
import OrganizationTree from '../../components/organizationTree';
import WrappedDynamicFieldSet from './components/DynamicFieldSet'
import toFixed2 from '../../../utils/common';
moment.locale('zh-cn');
const format = "YYYY-MM-DD";
const zhNow = moment().utcOffset(8);
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

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
        title: '业态名称',
        dataIndex: 'categoryType',
        key: 'categoryType',
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
        dataIndex: 'saleAmount',
        key: 'saleAmount',
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
        dataIndex: 'saleCount',
        key: 'saleCount',
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
        title: '日结金额',
        dataIndex: 'dailyAmount',
        key: 'dailyAmount',
        render: (value, row, index) => {

          return toFixed2.formatCurrency(value);
        },
      },
      {
        title: '退换金额',
        dataIndex: 'refundSaleAmount',
        key: 'refundSaleAmount',
        render: (value, row, index) => {

          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '支付方式抵扣类型',
        dataIndex: 'payMethodWeight',
        key: 'payMethodWeight',
        className: 'clear-padding',
        render: (value, row, index) => {
          const obj = {
            children: [],
            props: {},
          };
          if(row.payMethodWeight){
            row.payMethodWeight.weights.map(function (item, index) {
              obj.children.push(item.name)
            });
          }
          return <span className='multiple-row'>{obj.children.join(',')}</span>
        },
      },
      {
        title: '修改',
        dataIndex: 'modify',
        key: 'modify',
        className: 'clear-padding',
        render: (value, row, index) => {
          if(row.isPayMethodWeight == 1){
            return <span className='multiple-row' onClick={this.showModal.bind(this, row, index)}><Icon type="tool" style={{
              fontSize: 16,
              cursor: 'pointer'
            }}/></span>
        }else {
          return <span className='multiple-row' onClick={this.showModalNull.bind(this, row, index)}><Icon type="tool" style={{
            fontSize: 16,
            cursor: 'pointer',

          }}/></span>
        }
        }

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
      pageIndex: 1,
      pageSize: 20,
      loading: true,
      deviceNo: "",
      fromDay: moment(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      toDay: moment(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      value: 1,
      tableList: [],
      dataModal: [],
      newKey: 0,
      analyzeData :[],
      modalVisibleNull:false
    };
  }

  tableChange = (pagination, filters, sorter) => {
    let initData = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
    };
    this.props.initData(initData);
    this.setState({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize
    });
  }
  //支付方式折扣率设置
  showModal = (row, index) => {
    var newKeys = this.state.newKey + 1;
    this.setState({
      visible: true,
      dataModal: [row, index],
      shopEntityId: row.shopEntityId,
      newKey: newKeys,
      analyzeData:row.payMethodWeight?row.payMethodWeight.weights:[]
    });

  }
  //非庖丁
  showModalNull = (row, index) => {
    this.setState({
      modalVisibleNull: true,
    });
  }
  modalHideModal = () => {
    this.setState({
      modalVisibleNull: false
    });
  }
  handleOk = (e) => {
    e.preventDefault();
    const analyzeDatanName = [];
    const analyzeDataWeight = [];
    const analyzeDatanNews = [];
    for(var i=0;i<this.refs.getSwordButton.getFieldsValue().keys.length;i++){
      analyzeDatanName.push(this.refs.getSwordButton.getFieldValue('payAnalyze'+i));
      analyzeDataWeight.push(Number(this.refs.getSwordButton.getFieldValue('payDeduction'+i)))
    };
    analyzeDatanName.map ((item,index) =>{
      var analyzeDatanObj ={};
      analyzeDatanObj.name = item;
      analyzeDatanObj.weight = analyzeDataWeight[index];
      analyzeDatanNews.push(analyzeDatanObj)
    })


      this.setState({
        analyzeData:analyzeDatanNews,
        visible: false
      });

    var setData = {};
    setData['shopId'] = this.state.shopId;
    setData['shopEntityId'] = this.state.dataModal[0].shopEntityId;
    setData['payMethod'] = {
      weights: analyzeDatanNews,
    };
    this.props.setDeduction(setData);

  }
  handleCancel = () => {
    this.setState({visible: false});
  }

  defaultModal = () => {



  }
  //店铺名称、MAC查询
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields(['shopEntityName'], (err, values) => {
      if (!err) {
        this.shopEntityName = values.shopEntityName;
        this.setState({
          shopId: APP_CONFIG.shopId,
          pageIndex: 1,
          current:1,
          shopEntityName:this.shopEntityName
        })
        let initData = {
          shopId: APP_CONFIG.shopId,
          fromDay: this.state.fromDay,
          toDay: this.state.toDay,
          shopEntityName: this.shopEntityName,
          pageSize: 20,
          pageIndex: 1
        };
        this.props.initDataDeduction(initData);
      }
    });
  }
  modalHideEditor = () => {
    this.props.editorVisible(false)
  }
  initChange = () => {
    const initData = {
      shopId: this.state.shopId||"",
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
      deviceNo: "",
      reverse:"",
      pageSize: 20,
      pageIndex: 1,
      shopEntityName:"",
    };
    this.props.initData(initData);
  }
  componentWillMount() {
    this.setState({
      loading: false,
    });
    const initData = {
      shopId: this.state.shopId||"",
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
      deviceNo: "",
      reverse:"",
      pageSize: 20,
      pageIndex: 1,
      shopEntityName:"",
    };
    this.props.initData(initData);
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const { form } = this.props;
    const visibleEditor = this.props.deduction.editorVisible?this.props.deduction.editorVisible:false;
    const loading = this.props.deduction.deductionLoading;
    let total = this.props.deduction.deductionList.total || 0;
    const pagination = {
      defaultCurrent: 1,
      total: total,
      pageSize: 20,
      current: this.state.pageIndex,
      showTotal:(total, range) => `显示第${range[0]}到第${range[1]}条记录  总共${total}条记录`
    };

    return (
      <div className="pay-deduction">
        <div className="wrapper-box util-clearfix">
          <Form onSubmit={this.handleSubmit} layout="inline">
            <div>
              <OrganizationTree {...this.props.org}></OrganizationTree>
            </div>
            <FormItem
              label="店铺名称"
            >
              {getFieldDecorator('shopEntityName', {})(
                <Input placeholder="输入店铺名称查找" className="search-input"/>
              )}
            </FormItem>
            <FormItem >
              <div className="submit-button">
                <Button type="danger" icon="search" htmlType="submit" className="default-button">查询</Button>
              </div>
            </FormItem>
          </Form>
        </div>

        <div className="wrapper-box util-clearfix">
          <Table columns={this.columns} dataSource={this.props.deduction.deductionList.rows} bordered pagination={pagination}
                 onChange={this.tableChange} loading={loading} rowKey="shopEntityName"/>
        </div>
        <Modal
          key={this.state.newKey}
          visible={this.state.visible}
          title="支付方式折扣率设置"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={590}
          afterClose={this.defaultModal}
          className="deductionModal"
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              确认
            </Button>,
          ]}
        >
          <Breadcrumb separator="->" style={{marginBottom: 30}}>
            <Breadcrumb.Item>{APP_CONFIG.shopName}</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.dataModal.length > 0 ? this.state.dataModal[0].shopEntityName : null}</Breadcrumb.Item>

          </Breadcrumb>
          <div className="util-clearfix pay-deduction-content">
            <WrappedDynamicFieldSet  ref="getSwordButton" analyzeData={this.state.analyzeData}></WrappedDynamicFieldSet>
          </div>
          <div className="set-tip">
            <div>说明：</div>
            <p className="set-tip-top">1. 列表中展示该设备下小票解析出的优惠方式，在符合的优惠方式上填写正确的系数比例（默认为0不计入），全部扣除系数填1</p>
            <p>2. 填写系数比例后，会将小票金额解析出的结果按对应关键词出现的系数进行扣减，得到后的金额为该账单的实际金额。</p>
          </div>
        </Modal>
        <Modal
          width={350}
          title="提示"
          visible={this.state.modalVisibleNull}
          onOk={this.modalHideModal}
          onCancel={this.modalHideModal}
          footer={[
            <Button  type="primary" size="large"  onClick={this.modalHideModal}>
              确认
            </Button>,
          ]}

        >
          <p>该店铺没有经过庖丁设置，不能使用支付权重配置！</p>
        </Modal>
        <Modal
          width={350}
          title="提示"
          visible={visibleEditor}
          onOk={this.modalHideEditor}
          onCancel={this.modalHideEditor}
          footer={[
            <Button  type="primary" size="large"  onClick={this.initChange}>
              确认
            </Button>,
          ]}
        >
          <p className='modalText'>支付方式抵扣率设置已生效</p>
        </Modal>
      </div>
    );
  }
}

//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    deduction: state.deduction,
    org: state.org
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(DeductionActions, dispatch)
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
const PayDeduction = connect(mapStateToProps, mapDispatchToProps)(App);
export default Form.create()(PayDeduction);
