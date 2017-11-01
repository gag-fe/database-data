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
import {Link} from "react-router";
import $ from "jquery";
import iScroll from "iscroll/build/iscroll-probe"; // 只有这个库支持onScroll,从而支持bounce阶段的事件捕捉
import style from './index.less';
const format = "YYYY-MM-DD";
const zhNow = moment();
const {MonthPicker, RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
class BrandNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [{
        'title': 1
      }, {
        'title': 2
      }, {
        'title': 3
      }, {
        'title': 4
      }, {
        'title': 5
      }, {
        'title': 6
      }, {
        'title': 7
      }, {
        'title': 8
      }, {
        'title': 9
      }, {
        'title': 10
      }, {
        'title': 11
      }, {
        'title': 12
      }, {
        'title': 13
      }, {
        'title': 14
      }, {
        'title': 15
      }, {
        'title': 16
      }, {
        'title': 17
      }, {
        'title': 18
      }, {
        'title': 19
      }, {
        'title': 20
      }],
      pullDownStatus: 3,
      pullUpStatus: 0,
    };

    this.page = 1;
    this.itemsChanged = false;

    this.pullDownTips = {
      // 下拉状态
      0: '下拉发起刷新',
      1: '继续下拉刷新',
      2: '松手即可刷新',
      3: '正在刷新',
      4: '刷新成功',
    };

    this.pullUpTips = {
      // 上拉状态
      0: '上拉发起加载',
      1: '松手即可加载',
      2: '正在加载',
      3: '加载成功',
    };

    this.isTouching = false;

    this.onItemClicked = this.onItemClicked.bind(this);

    this.onScroll = this.onScroll.bind(this);
    this.onScrollEnd = this.onScrollEnd.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  componentDidMount() {
    const options = {
      // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
      preventDefault: false,
      // 禁止缩放
      zoom: false,
      // 支持鼠标事件，因为我开发是PC鼠标模拟的
      mouseWheel: true,
      // 滚动事件的探测灵敏度，1-3，越高越灵敏，兼容性越好，性能越差
      probeType: 3,
      // 拖拽超过上下界后出现弹射动画效果，用于实现下拉/上拉刷新
      bounce: true,
      // 展示滚动条
      scrollbars: true,
    };
    this.iScrollInstance = new iScroll('#ListOutsite', options);
    this.iScrollInstance.on('scroll', this.onScroll);
    this.iScrollInstance.on('scrollEnd', this.onScrollEnd);

    this.fetchItems(true);
  }

  fetchItems(isRefresh) {
    if (isRefresh) {
      this.page = 1;
    }
    $.ajax({
      url: '/msg-list',
      data: {page: this.page},
      type: 'GET',
      dataType: 'json',
      success: (response) => {
        if (isRefresh) {    // 刷新操作
          if (this.state.pullDownStatus == 3) {
            this.setState({
              pullDownStatus: 4,
              items: response.data.items
            });
            this.iScrollInstance.scrollTo(0, -1 * $(this.refs.PullDown).height(), 500);
          }
        } else {    // 加载操作
          if (this.state.pullUpStatus == 2) {
            this.setState({
              pullUpStatus: 0,
              items: this.state.items.concat(response.data.items)
            });
          }
        }
        ++this.page;
        console.log(`fetchItems=effected isRefresh=${isRefresh}`);
      }
    });
  }

  /**
   * 点击跳转详情页
   */
  onItemClicked(ev) {
    // 获取对应的DOM节点, 转换成jquery对象
    let item = $(ev.target);
    // 操作router实现页面切换
    this.context.router.push(item.attr('to'));
    this.context.router.goForward();
  }

  onTouchStart(ev) {
    this.isTouching = true;
  }

  onTouchEnd(ev) {
    this.isTouching = false;
  }

  onPullDown() {
    // 手势
    if (this.isTouching) {
      if (this.iScrollInstance.y > 5) {
        this.state.pullDownStatus != 2 && this.setState({pullDownStatus: 2});
      } else {
        this.state.pullDownStatus != 1 && this.setState({pullDownStatus: 1});
      }
    }
  }

  onPullUp() {
    // 手势
    if (this.isTouching) {
      if (this.iScrollInstance.y <= this.iScrollInstance.maxScrollY - 5) {
        this.state.pullUpStatus != 1 && this.setState({pullUpStatus: 1});
      } else {
        this.state.pullUpStatus != 0 && this.setState({pullUpStatus: 0});
      }
    }
  }

  onScroll() {
    let pullDown = $(this.refs.PullDown);

    // 上拉区域
    if (this.iScrollInstance.y > -1 * pullDown.height()) {
      this.onPullDown();
    } else {
      this.state.pullDownStatus != 0 && this.setState({pullDownStatus: 0});
    }

    // 下拉区域
    if (this.iScrollInstance.y <= this.iScrollInstance.maxScrollY + 5) {
      this.onPullUp();
    }
  }

  onScrollEnd() {
    console.log("onScrollEnd" + this.state.pullDownStatus);

    let pullDown = $(this.refs.PullDown);

    // 滑动结束后，停在刷新区域
    if (this.iScrollInstance.y > -1 * pullDown.height()) {
      if (this.state.pullDownStatus <= 1) {   // 没有发起刷新,那么弹回去
        this.iScrollInstance.scrollTo(0, -1 * $(this.refs.PullDown).height(), 200);
      } else if (this.state.pullDownStatus == 2) { // 发起了刷新,那么更新状态
        this.setState({pullDownStatus: 3});
        this.fetchItems(true);
      }
    }

    // 滑动结束后，停在加载区域
    if (this.iScrollInstance.y <= this.iScrollInstance.maxScrollY) {
      if (this.state.pullUpStatus == 1) { // 发起了加载，那么更新状态
        this.setState({pullUpStatus: 2});
        this.fetchItems(false);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 列表发生了变化, 那么应该在componentDidUpdate时调用iscroll进行refresh
    this.itemsChanged = nextState.items !== this.state.items;
    return true;
  }

  componentDidUpdate() {
    // 仅当列表发生了变更，才调用iscroll的refresh重新计算滚动条信息
    if (this.itemsChanged) {
      this.iScrollInstance.refresh();
    }
    return true;
  }

  render() {
    let lis = [];
    this.state.items.map((item, index) => {
      console.log(item.title);
      lis.push(
        <li key={index}>
          {item.title} - {index}
        </li>
      );
    });
    console.log(lis);
    return (
      <div className="brand-news">
        <div className="wrapper-box util-clearfix">
          <OrganizationTree {...this.props.org}></OrganizationTree>
        </div>
        <div className="wrapper-box util-clearfix">
          <div id="ScrollContainer">
            <div id="ListOutsite" style={{height: window.innerHeight}}
                 onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
              <ul id="ListInside">
                <p ref="PullDown" id="PullDown">{this.pullDownTips[this.state.pullDownStatus]}</p>
                {lis}
                <p ref="PullUp" id="PullUp">{this.pullUpTips[this.state.pullUpStatus]}</p>
              </ul>
            </div>

          </div>
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
    layout: state.layout,
    brandNews: state.brandNews
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch, props) {
  return bindActionCreators(PriceActions, dispatch)
}
//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(BrandNews);
