import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@gag/button-web';
import DatePicker from '@gag/date-picker-web';
import Modal from '@gag/modal-web';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as DateLayerActions from '../../../actions/index.js';
moment.locale('zh-cn');
const format = "YYYY-MM-DD";
//const zhNow = moment().utcOffset(8);
const zhNow = moment().add(-1,'days');
import './index.less';

const DateLayer = React.createClass({
  getInitialState(){
    return {
      timeRange: this.props.timeRange?this.props.timeRange:'day',//date=1~23小时,week=周一~周日,range<=92天
      fromDay: this.props.frameTimeFrom || zhNow,
      fromDayStr: this.props.frameTimeFrom?this.props.frameTimeFrom.format(format):zhNow.format(format),
      toDay: this.props.toDayFrame?this.props.toDayFrame:zhNow,
      toDayStr: this.props.toDayFrame?this.props.toDayFrame.format(format):zhNow.format(format),
      timeType: 'day',
      text:'请重新选择日期！',
      visible: false
    };
  },

  propTypes:{
    callback: PropTypes.func.isRequired,
    timeRange: PropTypes.string,
    timeType: PropTypes.string,
    fromDay: PropTypes.any,
    toDay: PropTypes.any
  },
  _eachViewState(kw){
    const viewMode = {
      day: ' current',
      today: '',
      week: '',
      month: '',
      fromDay: '',
      toDay: ''
    };

    for(var key in viewMode){
      if(kw == key){
        viewMode[key] = ' current';
      }else {
        viewMode[key] = '';
      }
    }

    return viewMode;
  },

  _getTaday(key){
    const item = this.state;
    item['fromDay'] = this.props.toDayFrame?this.props.toDayFrame:zhNow;
    item['toDay'] = this.props.toDayFrame?this.props.toDayFrame:zhNow;
    item['fromDayStr'] = this.props.toDayFrame?this.props.toDayFrame.format(format):zhNow.format(format);
    item['toDayStr'] = this.props.toDayFrame?this.props.toDayFrame.format(format):zhNow.format(format);
    item['timeRange'] = 'day';
    item['timeType'] = 'day';
    this.setState(Object.assign({},this.state,item));
  },

  _getWeek(key){
    const item = this.state;
    item['fromDay'] = this.props.toDayFrame?moment().startOf('week'):moment().add(-1,'days').startOf('week');
    item['fromDayStr'] = this.props.toDayFrame?moment().startOf('week').format(format):moment().add(-1,'days').startOf('week').format(format);
    item['toDay'] = this.props.toDayFrame?this.props.toDayFrame:zhNow;
    item['toDayStr'] = this.props.toDayFrame?this.props.toDayFrame.format(format):zhNow.format(format);
    item['timeRange'] = 'week';
    item['timeType'] = 'week';
    this.setState(Object.assign({},this.state,item));
  },

  _getMonth(key){
    const item = this.state;
    item['fromDay'] = this.props.toDayFrame?moment().startOf('month'):moment().add(-1,'days').startOf('month');
    item['fromDayStr'] = this.props.toDayFrame?moment().startOf('month').format(format):moment().add(-1,'days').startOf('month').format(format);
    item['toDay'] = this.props.toDayFrame?this.props.toDayFrame:zhNow;
    item['toDayStr'] = this.props.toDayFrame?this.props.toDayFrame.format(format):zhNow.format(format);
    item['timeRange'] = 'month';
    item['timeType'] = 'month';
    this.setState(Object.assign({},this.state,item));
  },

  _getFromDay(key, value){
    const item = this.state;
    let range = 'range';

    if(item.toDay.valueOf() == value.valueOf()){
      range = 'day';
    }

    if(item.toDay.valueOf() < value.valueOf()){
      this.setState({
        visible: true
      });

      return false;
    }

    item['fromDay'] = value;
    item['fromDayStr'] = value.format(format);
    item['timeRange'] = range;
    item['timeType'] = 'fromDay';
    this.setState(Object.assign({},this.state,item));
  },

  _getToDay(key, value){
    const item = this.state;
    let range = 'range';

    if(item.fromDay.valueOf() == value.valueOf()){
      range = 'day';
    }

    if(item.fromDay.valueOf() > value.valueOf()){
      this.setState({
        visible: true
      });

      return false;
    }
    item['toDay'] = value;
    item['toDayStr'] = value.format(format);
    item['timeRange'] = range;
    item['timeType'] = 'toDay';
    this.setState(Object.assign({},this.state,item));
  },

  _onClose(){
    this.setState({
      visible: false
    });
  },

  _getDate(){
    const params = {
      timeRange: this.state.timeRange,
      fromDay: this.state.fromDay,
      fromDayStr: this.state.fromDayStr,
      toDay: this.state.toDay,
      toDayStr: this.state.toDayStr,
      timeType: this.state.timeType,
    };

    if(!window.APP_CONFIG){
      window.APP_CONFIG = {};
    }

    window.APP_CONFIG = Object.assign(window.APP_CONFIG, {date:params});
    this.props.callback(params);
    this.props.updataData(params);
  },

  _disabledStartDate(fromDay){
    const toDay = this.state.toDay;
    const distime = this.props.distime?this.props.distime:92;
    if (!fromDay || !toDay) {
      return false;
    }
    return fromDay.valueOf() > toDay.valueOf()||fromDay.valueOf() < moment(toDay).add(-distime,'days').valueOf();
  },
  _disabledEndDate(toDay){
    const disabledTime = this.props.toDayFrame?this.props.toDayFrame:zhNow
    const fromDay = this.state.fromDay;
    const endDay = this.state.toDay;
    if (!toDay || !fromDay) {
      return false;
    }
    return toDay.valueOf() > disabledTime.valueOf() || toDay.valueOf() < fromDay.valueOf();
  },
  _handleStartOpenChange(open){
    if (!open) {
      this.setState({ endOpen: true });
    }
  },
  _handleEndOpenChange(open){
    this.setState({ endOpen: open });
  },

  componentWillReceiveProps(nextProps){
    var params = {};
    if(this.props.timeRange != nextProps.timeRange){
      if(nextProps.fromDay && Object.prototype.toString.call(nextProps.fromDay) == '[object Object]'){

      }else{
        params['fromDay'] = moment(nextProps.fromDay).locale('zh-cn').utcOffset(8);
        params['toDay'] = moment(nextProps.toDay).locale('zh-cn').utcOffset(8);
      }

      this.setState({
        timeRange: nextProps.timeRange,
        timeType: nextProps.timeType,
        fromDay: params.fromDay,
        toDay: params.toDay
      });
    }
  },
  componentDidMount() {
    if(this.props.frameTimeFrom){
      this._getFromDay('fromDay',this.props.frameTimeFrom)
    }

  },
  render(){
    const viewMode = this._eachViewState(this.state.timeType);
    const{frameTimeFrom,distime} =this.props;
    return (<div>
      <div>
      <Modal
        title="日期选择错误"
        transparent
        maskClosable={false}
        visible={this.state.visible}
        onClose={this._onClose}
        footer={null}
      >
      <p>{this.state.text}</p>
      </Modal>
      </div>

      <div className="date-layer">
        <div className="label-name" style={{marginRight:20}}>日期：</div>
        <div className={"label today " + viewMode.day} onClick={this._getTaday.bind(this,'today')}>日</div>
        <div className={"label week " + viewMode.week} onClick={this._getWeek.bind(this,'week')}>周</div>
        <div className={"label month " + viewMode.month} onClick={this._getMonth.bind(this,'month')}>月</div>
        <div className={"from-day " }>
          <DatePicker
            allowClear={false}
            format="YYYY-MM-DD"
            disabledDate={this._disabledStartDate}
            onChange={this._getFromDay.bind(this,'fromDay')}
            placeholder="Start"
            value={this.state.fromDay}
          >
          </DatePicker>
        </div>
        <div className="space"> 至 </div>
        <div className={"to-day" }>
          <DatePicker
            allowClear={false}
            format="YYYY-MM-DD"
            disabledDate={this._disabledEndDate}
            onChange={this._getToDay.bind(this,'toDay')}
            placeholder="End"
            value={this.state.toDay}
          >
          </DatePicker>
        </div>
        <div className="submit-button">
          <Button type="danger" icon="search" onClick={this._getDate}>查询</Button>
        </div>
      </div>
    </div>
    );
  }
});

//将state.site绑定到props的site
function mapStateToProps(state, props) {
  return {
    dateLayer: state.dateLayer
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(DateLayerActions, dispatch)
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(DateLayer)
