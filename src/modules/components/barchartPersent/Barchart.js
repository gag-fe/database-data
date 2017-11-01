import React from 'react';
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import G2 from 'g2';
import toFixed2 from '../../../utils/common';
//import { Stat } from 'g2';
//var G2 = require('g2');
class BarchartPersent extends React.Component{
  constructor(props) {
    super(props);
      // new object ref

  }
  render() {
    const{chartData}=this.props;
    console.log(chartData)
    const data = [
      {data: chartData},
    ];
  for(var i=0; i < data.length; i++) {
    var item = data[i];
    var datas = item.data;
    var months = ['50以下','50-100','100-300','300-500','500-800','800-1000','1000-2000','2000-3000','3000-5000','5000-8000','8000-10000','10000-20000','20000以上'];
    for(var j=0; j < datas.length; j++) {
      item[months[j]] = datas[j];
    }
    data[i] = item;
  }
  var Frame = G2.Frame;
  var frame = new Frame(data);
  //console.log(frame);
  frame = Frame.combinColumns(frame, ['50以下','50-100','100-300','300-500','500-800','800-1000','1000-2000','2000-3000','3000-5000','5000-8000','8000-10000','10000-20000','20000以上'],'销售额占比','区间');
  this.state = {
    data: frame,
    forceFit: true,
    width: 1000,
    height: 400,
    plotCfg: {
      margin: [20,90,60,80]
    },
  };
    const Chart = createG2(chart => {
      //const Stat = G2.Stat;
      //chart.col('name',{alias: '业态'});
      chart.interval().position('区间*销售额占比').color('red');
      chart.axis('区间', {
       title: null // 不展示 xDim 对应坐标轴的标题
     });
     chart.axis('销售额占比', {
       labelOffset: 20,
        title: null,
        labels: {
          label: {
            textAlign: 'center', // 文本对齐方向，可取值为： start middle end
            fill: '#666', // 文本的颜色
            fontSize: '12', // 文本大小
            fontWeight: 'bold', // 文本粗细
            rotate: 0 * Math.PI / 180, // 文本旋转 30 度，需要将 30 度转化为弧度，2.3.0 及以上版本只支持弧度设置
            textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
          }, // 设置坐标轴文本的显示样式，如果值为 null，则不显示坐标轴文本
          autoRotate: true // 是否需要自动旋转
        },
        formatter: function(val) {
            return val + '%';
        }
      });
      chart.animate(false);
      chart.axis('区间', {
        labelOffset: 10,
         title: null,
         labels: {
           label: {
             textAlign: 'center', // 文本对齐方向，可取值为： start middle end
             fill: '#666', // 文本的颜色
             fontSize: '12', // 文本大小
             fontWeight: 'bold', // 文本粗细
             rotate: 0 * Math.PI / 180, // 文本旋转 30 度，需要将 30 度转化为弧度，2.3.0 及以上版本只支持弧度设置
             textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
           }, // 设置坐标轴文本的显示样式，如果值为 null，则不显示坐标轴文本
           autoRotate: true // 是否需要自动旋转
         },

       });
      //chart.changeSize(600,500)
      chart.render();
      chart.on('tooltipchange',function(ev){
        var item = ev.items[0]; // 获取tooltip要显示的内容
        //console.log(item.value)
        item.value = toFixed2.formatCurrency(item.value)+'%';
      });
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
module.exports=BarchartPersent;
