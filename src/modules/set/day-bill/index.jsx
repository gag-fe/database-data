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
import * as BillActions from '../../../actions/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Icon from '@gag/icon-web';
import OrganizationTree from '../../components/organizationTree';
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
        title: '日结单数（昨日）',
        dataIndex: 'dailyCount',
        key: 'dailyCount',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          return obj;
        },
      },
      {
        title: '日结单金额（昨日）',
        dataIndex: 'dailyAmount',
        key: 'dailyAmount',
        render: (value, row, index) => {
          return toFixed2.formatCurrency(row.dailyAmount);
        },
      },
      {
        title: '设备ID',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
        className: 'clear-padding',
        render: (value, row, index) => {
          const obj = {
            children: [],
            props: {},
          };
          row.deviceList.map(function (item, index) {
            obj.children.push(<div className='multiple-row' key={index}>{item.deviceNo}</div>)
          });
          return obj;
        },
      },

      {
        title: '班次',
        dataIndex: 'shiftCount',
        key: 'shiftCount',
        className: 'clear-padding',
        render: (value, row, index) => {
          const obj = {
            children: [],
            props: {},
          };
          row.deviceList.map(function (item, index) {
            obj.children.push(<div className='multiple-row'
                                   key={index}>{item.shiftCount ? item.shiftCount : '--'}</div>)
          });
          return obj;
        },
      },
      {
        title: '分班时间',
        dataIndex: 'address',
        key: 'address',
        className: 'clear-padding',
        render: (value, row, index) => {
          const obj = {
            children: [],
            props: {},
          };
          row.deviceList.map(function (item, index) {
            if (1 == item.shiftCount) {
              obj.children.push(<div className='multiple-row' key={index}>--</div>)
            } else if (!item.shiftCount) {
              obj.children.push(<div className='multiple-row' key={index}>--</div>)
            } else if (2 == item.shiftCount) {
              obj.children.push(<div className='multiple-row' key={index}>{item.shiftTimes[0].end}</div>)
            } else if (3 == item.shiftCount) {
              obj.children.push(<div className='multiple-row'
                                     key={index}>{item.shiftTimes[0].end + '/' + item.shiftTimes[1].end}</div>)
            } else {
              obj.children.push(<div className='multiple-row'
                                     key={index}>{item.shiftTimes[0].end + '/' + item.shiftTimes[1].end + '/' + item.shiftTimes[2].end}</div>)
            }
          });
          return obj;
        },
      },
      {
        title: '修改',
        dataIndex: 'modify',
        key: 'modify',
        className: 'clear-padding',
        render: (value, row, index) => {
          let t = this;
          const obj = {
            children: [],
            props: {},
          };
          row.deviceList.map(function (item, index) {
            obj.children.push(<div className='multiple-row ' onClick={t.showModal.bind(this, row, index)} key={index}>
              <span><Icon type="tool" style={{fontSize: 16, cursor: 'pointer'}}/></span></div>)
          });
          return obj;
        },
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
      deviceNo: "",
      fromDay: moment(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      toDay: moment(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      visible: false,
      visibleImg: false,
      imgSrc: '',
      value: 1,
      tableList: [],
      picList: [],
      workTime1: "none",
      workTime2: "none",
      workTime3: "none",
      timeEnd1: "24:00",
      timeEnd2: "00:00",
      timeEnd3: "00:00",
      timeEnd: "24:00",
      shiftCount: 1,
      calcuRule: "",
      shiftTimes: [],
      billModal: [],
      disabled1: true,
      disabled2: true,
      disabled3: true,
      disabled4: true,
      newKey: 0,
      open1: false,
      open2: false,
      open3: false,
      maxDailyCount:'',
      minDailyCount:'',
    };
  }

  tableChange = (pagination, filters, sorter) => {
    let billData = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
      maxDailyCount:this.state.maxDailyCount,
      minDailyCount:this.state.minDailyCount,
      shopEntityName: this.state.shopEntityName,
      deviceNo: this.state.deviceNoSearch,
    };

    this.props.initData(billData);

    this.setState({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize
    });
  }
  //日结单设置
  showModal = (row, index) => {
    var newKeys = this.state.newKey + 1;
    this.setState({
      visible: true,
      billModal: [row,index],
      shopEntityId: row.shopEntityId,
      deviceNoEditor: row.deviceList[index].deviceNo,
      newKey: newKeys,
      workTime1: "none",
      workTime2: "none",
      workTime3: "none",
      timeEnd1: row.deviceList[index].shiftTimes.length > 1 ? row.deviceList[index].shiftTimes[0].end : '',
      timeEnd2: row.deviceList[index].shiftTimes.length > 2 ? row.deviceList[index].shiftTimes[1].end : '',
      timeEnd3: row.deviceList[index].shiftTimes.length > 3 ? row.deviceList[index].shiftTimes[2].end : '',
      shiftCount: row.deviceList[index].shiftCount,
      calcuRule: row.deviceList[index].calcuRule,
      openTime: row.openTime,
      timeStar1: row.openTime,
      timeEnd: row.openTime
    });

    var value = row.deviceList[index].shiftCount;

    this.onChangeWork(value);

    var billData = {
      shopId: this.state.shopId,
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      deviceNo: row.deviceList[index].deviceNo,
      shopEntityId: row.shopEntityId,
    };

    this.props.picData(billData);

  }

  handleOk = () => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false, visible: false});
    }, 3000);
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  handleOkImg = () => {
    this.setState({visibleImg: false});
  }

  handleCancelImg = () => {
    this.setState({visibleImg: false});
  }

  //日结单累加规则
  onChangIf = (e) => {
    var value = e.target.value;
    this.setState({
      calcuRule: value
    })
  }
  //选择班次
  onChangeWork = (value) => {
    if (value == 2) {
      this.setState({
        workTime1: "",
        workTime2: "none",
        workTime3: "none",
        shiftCount: 2,
        disabled1: false,
        disabled2: true,
        disabled3: true,
        //timeEnd2: "24:00"
      })
    } else if (value == 3) {
      this.setState({
        workTime2: "",
        workTime3: "none",
        workTime1: "",
        shiftCount: 3,
        disabled2: false,
        disabled1: false,
        disabled3: true,
        //timeEnd3: "24:00"
      })
    } else if (value == 0) {

      this.setState({
        workTime2: "none",
        workTime3: "none",
        workTime1: "none",
        shiftCount: 0,
        disabled1: true,
      })

    } else if (value == 1) {
      this.setState({
        workTime1: "none",
        workTime2: "none",
        workTime3: "none",
        shiftCount: 1,
        disabled1: true,
        //timeEnd1: "24:00"
      })
    } else {
      this.setState({
        workTime2: "",
        workTime3: "",
        workTime1: "",
        shiftCount: 4,
        disabled1: false,
        disabled2: false,
        disabled3: false,
      })
    }
  }

  onSelectWork = (e) => {
    var value = e.target.value;
    this.onChangeWork(value);
  }
  //分班时间选择
  handleOpenChange1 = (open1) => {
    this.setState({open1});
  }
  handleOpenChange2 = (open2) => {
    this.setState({open2});
  }
  handleOpenChange3 = (open3) => {
    this.setState({open3});
  }

  handleClose1 = (open) => this.setState({open1: false})
  handleClose2 = (open) => this.setState({open2: false})
  handleClose3 = (open) => this.setState({open3: false})

  onChangeTimeEnd1 = (time, timeString) => {
    if(timeString == this.state.openTime){
      alert("第一班结束时间不能等于营业结束时间！");
      this.setState({
        timeEnd1: '',
      });
      return false;
    }
    if(timeString > this.state.timeEnd2&&this.state.timeEnd2>this.state.openTime){
      alert("第一班结束时间不能大于第二班结束时间！");
      this.setState({
        timeEnd1: '',
      });
      return false;
    }
    this.setState({
      timeEnd1: timeString,
    });
  }

  onChangeTimeEnd2 = (time, timeString) => {
    if(timeString > this.state.timeEnd3&&this.state.timeEnd3>this.state.openTime){
      alert("第二班结束时间不能大于第三班结束时间！");
      this.setState({
        timeEnd2: '',
      });
      return false;
    }
    if(this.state.timeEnd1 > this.state.openTime){
      if(timeString > this.state.timeEnd1){
        this.setState({
          timeEnd2: timeString,
        });
      }
      if(timeString < this.state.timeEnd1&& timeString > this.state.openTime){
        alert("第二班结束时间不能大于营业结束时间！");
        this.setState({
          timeEnd2: '',
        });
        return false;
      }
    }
    if(this.state.timeEnd1 < this.state.openTime){
      if(timeString > this.state.openTime){
        alert("第二班结束时间不能大于营业结束时间！");
        this.setState({
          timeEnd2: '',
        });
        return false;
      }else {
        this.setState({
          timeEnd2: timeString,
        });
      }
    }
    if(timeString == this.state.openTime ||timeString == this.state.timeEnd1){
      alert("第二班结束时间不能等于营业结束时间或第一班结束时间！");
      return false;
    }

  }
  onChangeTimeEnd3 = (time, timeString) => {

    if(this.state.timeEnd2 > this.state.openTime){
      if(timeString > this.state.timeEnd2){
        this.setState({
          timeEnd3: timeString,
        });
      }
      if(timeString < this.state.timeEnd2&& timeString > this.state.openTime){
        alert("第二班结束时间不能大于营业结束时间！");
        this.setState({
          timeEnd3: '',
        });
        return false;
      }
    }
    if(this.state.timeEnd2 < this.state.openTime){
      if(timeString > this.state.openTime){
        alert("第二班结束时间不能大于营业结束时间！");
        this.setState({
          timeEnd3: '',
        });
        return false;
      }else {
        this.setState({
          timeEnd3: timeString,
        });
      }
    }
    if(timeString == this.state.openTime || timeString == this.state.timeEnd2){
      alert("第三班结束时间不能等于营业结束时间或第二班结束时间！");
      return false;
    }
  }

  //修改日结单规则
  onBillEditor = (billData) => {
    var billData = {};
    billData['shopId'] = this.state.shopId;
    billData['shopEntityId'] = this.state.shopEntityId;
    billData['deviceNo'] = this.state.deviceNoEditor;
    billData['shiftCount'] = this.state.shiftCount;
    billData['calcuRule'] = this.state.calcuRule;
    if (this.state.shiftCount == 1) {
      billData['shiftTimes'] = [
        {
          "start": this.state.openTime,
          "end": this.state.openTime,
        }
      ]
    } else if (this.state.shiftCount == 0) {
      billData['shiftTimes'] = [
        {
          "start": this.state.openTime,
          "end": this.state.openTime,
        }
      ];
      //billData['shiftCount'] = 1;
    } else if (this.state.shiftCount == 2) {
      if(this.state.timeEnd1==''){
        alert('第一班结束时间不能为空')
        return false
      }
      billData['shiftTimes'] = [
        {
          "start": this.state.openTime,
          "end": this.state.timeEnd1,
        },
        {
          "start": this.state.timeEnd1,
          "end": this.state.openTime,
        }
      ]
    } else if (this.state.shiftCount == 3) {
      if(this.state.timeEnd1==''){
        alert('第一班结束时间不能为空')
        return false
      }
      if(this.state.timeEnd2==''){
        alert('第二班结束时间不能为空')
        return false
      }
      billData['shiftTimes'] = [
        {
          "start": this.state.openTime,
          "end": this.state.timeEnd1,
        },
        {
          "start": this.state.timeEnd1,
          "end": this.state.timeEnd2,
        },
        {
          "start": this.state.timeEnd2,
          "end": this.state.openTime,
        }
      ]
    } else if (this.state.shiftCount == 4) {
      if(this.state.timeEnd1==''){
        alert('第一班结束时间不能为空')
        return false
      }
      if(this.state.timeEnd2==''){
        alert('第二班结束时间不能为空')
        return false
      }
      if(this.state.timeEnd3==''){
        alert('第三班结束时间不能为空')
        return false
      }
      billData['shiftTimes'] = [
        {
          "start": this.state.openTime,
          "end": this.state.timeEnd1,
        },
        {
          "start": this.state.timeEnd1,
          "end": this.state.timeEnd2,
        },
        {
          "start": this.state.timeEnd2,
          "end": this.state.timeEnd3,
        },
        {
          "start": this.state.timeEnd3,
          "end": this.state.openTime,
        },
      ]
    }
    this.props.editorData(billData);
      this.setState({
        visible: false,
      });
  }
  defaultModal = () => {



  }
  //店铺名称、MAC查询
  handleChange = (value) => {
    if(value == 1){
      this.setState({
        maxDailyCount:1,
        minDailyCount:0,
      })
    }else if (value == 2) {
      this.setState({
        maxDailyCount:10,
        minDailyCount:2,
      })
    }else if (value == 3) {
      this.setState({
        maxDailyCount:'',
        minDailyCount:11,
      })
    }else {
      this.setState({
        maxDailyCount:'',
        minDailyCount:'',
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      shopId: APP_CONFIG.shopId,
      pageIndex: 1,
      current:1
    })
    this.props.form.validateFields(['shopEntityName', 'deviceNo'], (err, values) => {
      if (!err) {
        this.shopEntityName = values.shopEntityName;
        this.deviceNo = values.deviceNo;
        this.dailyCount = values.dailyCount;
        let billData = {
          shopId: APP_CONFIG.shopId,
          fromDay: this.state.fromDay,
          toDay: this.state.toDay,
          pageSize: 20,
          pageIndex: 1,
          maxDailyCount:this.state.maxDailyCount,
          minDailyCount:this.state.minDailyCount,
          shopEntityName: this.shopEntityName,
          deviceNo: this.deviceNo,
        };
        this.props.initData(billData);
        this.setState({
          deviceNoSearch:this.deviceNo,
          shopEntityName: this.shopEntityName,
        })
      }
    });
  }

  onBigImg = (e) => {
    this.setState({
      visibleImg: true,
      imgSrc: e.target.src,
    })
  }
  modalHideModal = () => {
    this.props.editorVisible(false)
  }
  initChange = () => {
    const billData = {
      shopId: this.state.shopId||"",
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
      deviceNo: "",
      pageSize: 20,
      pageIndex: 1,
    };

    this.props.initData(billData);
  }
  componentWillMount() {
    this.setState({
      loading: false,
    });
    const billData = {
      shopId: this.state.shopId||"",
      fromDay: this.state.fromDay,
      toDay: this.state.toDay,
      shopEntityId: "",
      deviceNo: "",
      pageSize: 20,
      pageIndex: 1,
    };

    this.props.initData(billData);
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    //console.log(this.props)
    const {getFieldDecorator} = this.props.form;
    const visibleEditor = this.props.bill.billVisible?this.props.bill.billVisible:false;
    let total = this.props.bill.tableList.total || 0;
    const loading = this.props.bill.billLoading;
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
            <FormItem
              label="MAC"
            >
              {getFieldDecorator('deviceNo', {})(
                <Input placeholder="输入MAC查找" className="search-input"/>
              )}
            </FormItem>
            <FormItem
              label="日结单张数"
            >
              {getFieldDecorator('dailyCount', {})(
                <Select placeholder="全部" className="search-input" onChange={this.handleChange}>
                  <Option value="">全部</Option>
                  <Option value="1">0-1张</Option>
                  <Option value="2">2-10张</Option>
                  <Option value="3">大于10张</Option>
                </Select>
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
          <Table columns={this.columns} dataSource={this.props.bill.tableList.rows} bordered pagination={pagination}
                 onChange={this.tableChange} loading={loading} rowKey="shopEntityName"/>
        </div>
        <Modal
          key={this.state.newKey}
          visible={this.state.visible}
          title="日结单规则配置"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={590}
          afterClose={this.defaultModal}
          className="billModal"
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.onBillEditor}>
              确认
            </Button>,
          ]}
        >
          <Breadcrumb separator="->" style={{marginBottom: 30}}>
            <Breadcrumb.Item>{APP_CONFIG.shopName}</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.billModal.length > 0 ? this.state.billModal[0].shopEntityName : null}</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.billModal.length > 0 ? this.state.billModal[0].deviceList[this.state.billModal[1]].deviceNo : null}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{marginTop: 16, marginLeft: 28,}}>
            打印日结单班次：
            <RadioGroup onChange={this.onSelectWork}
                        defaultValue={this.state.billModal.length > 0 ? this.state.billModal[0].deviceList[this.state.billModal[1]].shiftCount > 0 ? this.state.billModal[0].deviceList[this.state.billModal[1]].shiftCount : 1 : 1}>
              <Radio value={1}>一班（全天）</Radio>
              <Radio value={2}>两班</Radio>
              <Radio value={3}>三班</Radio>
              <Radio value={4}>四班</Radio>
            </RadioGroup>
          </div>
          <div style={{marginTop: 16, marginLeft: 42}}>
            分班开始时间：
            <TimePicker format="HH:mm" placeholder={this.state.timeStar1} disabled/>
            <TimePicker format="HH:mm" style={{display: this.state.workTime1}} disabled
                        placeholder={this.state.timeEnd1}/>
            <TimePicker format="HH:mm" style={{display: this.state.workTime2}} disabled
                        placeholder={this.state.timeEnd2}/>
            <TimePicker format="HH:mm" style={{display: this.state.workTime3}} disabled
                        placeholder={this.state.timeEnd3}/>
          </div>
          <div style={{marginTop: 16, marginLeft: 42}}>
            分班结束时间：
            <TimePicker format="HH:mm" onChange={this.onChangeTimeEnd1} placeholder={this.state.disabled1?this.state.openTime:this.state.timeEnd1}
                        disabled={this.state.disabled1} open={this.state.open1} onOpenChange={this.handleOpenChange1}
                        addon={() => (
                          <Button size="small" type="primary" onClick={this.handleClose1} className="time-button">
                            Ok
                          </Button>
                        )}/>
            <TimePicker format="HH:mm" onChange={this.onChangeTimeEnd2} style={{display: this.state.workTime1}}
                        disabled={this.state.disabled2} placeholder={this.state.disabled2?this.state.openTime:this.state.timeEnd2} open={this.state.open2}
                        onOpenChange={this.handleOpenChange2} addon={() => (
              <Button size="small" type="primary" onClick={this.handleClose2} className="time-button">
                Ok
              </Button>
            )}/>
            <TimePicker format="HH:mm" onChange={this.onChangeTimeEnd3} style={{display: this.state.workTime2}}
                        disabled={this.state.disabled3} placeholder={this.state.disabled3?this.state.openTime:this.state.timeEnd3} open={this.state.open3}
                        onOpenChange={this.handleOpenChange3} addon={() => (
              <Button size="small" type="primary" onClick={this.handleClose3} className="time-button">
                Ok
              </Button>
            )}/>
            <TimePicker format="HH:mm" style={{display: this.state.workTime3}} disabled={this.state.disabled4}
                        placeholder={this.state.timeEnd}/>
          </div>
          <div className="util-clearfix" style={{marginLeft: 150, }}>
            <div className="bill-works">一班</div>
            <div className="bill-works" style={{display: this.state.workTime1}}>二班</div>
            <div className="bill-works" style={{display: this.state.workTime2}}>三班</div>
            <div className="bill-works" style={{display: this.state.workTime3, marginRight: 0}}>四班</div>
          </div>
          <div style={{marginTop: 5,marginLeft:50,color:'red',fontSize:13}}>
            首末分班开始结束时间为该店铺营业时间开始到第二天的该时间结束
          </div>
          <div style={{marginTop: 16,marginLeft:28}}>
            多设备是否累加：
            <RadioGroup onChange={this.onChangIf}
                        defaultValue={this.state.billModal.length > 0 &&this.state.billModal[0].deviceList[this.state.billModal[1]].calcuRule? this.state.billModal[0].deviceList[this.state.billModal[1]].calcuRule: 0}>
              <Radio value={1}>是(多设备日结做累加)</Radio>
              <Radio value={0}>否(取多设备中的日结金额最大值)</Radio>
            </RadioGroup>
          </div>

          <div className="util-clearfix bill-img-box">
            <div style={{display: this.props.bill.picList.length > 0 ? 'none' : ''}} className="default-img">暂无日结单图片
            </div>
            {
              this.props.bill.picList.map((item, index) => {
                return <div style={{width: 50, height: 100, display: 'inline'}} key={ index }><img className="bill-img"
                                                                                                   onClick={this.onBigImg}
                                                                                                   src={item}></img>
                </div>
              })
            }
            <Modal
              key={this.state.newKey}
              visible={this.state.visibleImg}
              title="日结单图片"
              onOk={this.handleOkImg}
              onCancel={this.handleCancelImg}
              width={700}
            >
              <div className="big-bill-img"><img src={this.state.imgSrc}></img></div>
            </Modal>

          </div>
        </Modal>
        <Modal
          width={350}
          title="提示"
          visible={visibleEditor}
          onOk={this.modalHideModal}
          onCancel={this.modalHideModal}
          footer={[
            <Button  type="primary" size="large"  onClick={this.initChange}>
              确认
            </Button>,
          ]}
        >
          <p className='modalText'>日结单设置已生效</p>
        </Modal>
      </div>
    );
  }
}

//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    bill: state.bill,
    org: state.org
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(BillActions, dispatch)
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
const BillAnalyze = connect(mapStateToProps, mapDispatchToProps)(App);
export default Form.create()(BillAnalyze);
