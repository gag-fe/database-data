import React from 'react';
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import G2 from 'g2';
import toFixed2 from '../../../utils/common';
class Piechart extends React.Component{
  constructor(props) {
    super(props);
      // new object ref
  this.state = {
      forceFit: true,
      width: 500,
      height: 450
    };
  }
  render() {
    let {data}=this.props;
    let paymentByDim=data.paymentByDim||[];
    const months = ['银行卡','现金','会员卡','支付宝','微信','优惠券','美团','大众点评','百度糯米','饿了么','其他'];
    let dataSource=[];
    for(let j=0; j < months.length; j++){
      dataSource.push({name:months[j],value:0});
      for(let k=0;k< paymentByDim.length; k++){
        if(paymentByDim[k].payMethod==months[j]){
          dataSource[j].value = parseFloat(paymentByDim[k].payAmountRate.toFixed(2));
          break;
        }
      }
    }

    const Chart = createG2(chart => {
      var Stat = G2.Stat;
      // 重要：绘制饼图时，必须声明 theta 坐标系
      chart.coord('theta', {
        radius: 0.8 // 设置饼图的大小
      });
      chart.legend('name', {
        position: 'bottom',
        itemWrap: true,
        // formatter: (val) => {
        //   for(var i = 0, len = this.state.data.length; i < len; i++) {
        //     var obj = this.state.data[i];
        //     if (obj.name === val) {
        //       return val + ': ' + obj.value + '%';
        //     }
        //   }
        // }
      });
      chart.tooltip({
        title: null,
        map: {
          value: 'value'
        }
      });
      chart.intervalStack()
        .position(Stat.summary.percent('value'))
        .color('name')
        .label('name*..percent',function(name, percent){
          percent = (percent * 100).toFixed(2) + '%';
          return name + ' ' + percent;
        });
      chart.render();
      // 设置默认选中
      var geom = chart.getGeoms()[0]; // 获取所有的图形
      var items = geom.getData(); // 获取图形对应的数据
      geom.setSelected(items[1]); // 设置选中
    });
    return (
      <div>
        <Chart
          data={dataSource}
          width={this.state.width}
          height={this.state.height}
          forceFit={this.state.forceFit} />
  </div>
    );
  }
}
export default Piechart;
