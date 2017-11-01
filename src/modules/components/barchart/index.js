import React from 'react';
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import G2 from 'g2';
//import { Stat } from 'g2';
//var G2 = require('g2');
class Barchart extends React.Component{
  constructor(props) {
    super(props);
      // new object ref
  }
  render() {
    const{chartData,displayType}=this.props;
    //console.log(chartData);
    let Frame = G2.Frame;
    let frame = new Frame(chartData);

    frame = Frame.combinColumns(frame, ['银行卡','现金','会员卡','支付宝','微信','优惠券','美团','大众点评','百度糯米','饿了么','其他'],displayType,'支付方式','shopEntityType');
    this.state = {
      data: frame,
      forceFit: true,
      width: 1000,
      height: 350,
      plotCfg: {
        margin: [20,90,60,80]
      },
    };
    const Chart = createG2(chart => {
      //const Stat = G2.Stat;
      chart.col('shopEntityType',{alias: '业态'});
      chart.intervalDodge().position('支付方式*'+displayType).color('支付方式*'+displayType,['red']).color('shopEntityType');
      chart.axis('支付方式', {
       title: null // 不展示 xDim 对应坐标轴的标题
     });
     chart.axis('支付方式', {
       title: null // 不展示 xDim 对应坐标轴的标题
     });
     chart.animate(false);
     chart.axis(displayType, {
        title: {
          fontSize: '14', // 文本大小
          textAlign: '', // 文本对齐方式
          fill: '#999', // 文本颜色
          // ...
        }
      });
      chart.render();
    });
    return (
      <div>
        <Chart
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
          plotCfg={this.state.plotCfg}
          forceFit={this.state.forceFit} />
  </div>
    );
  }
}
export default Barchart;
