import React from 'react';
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import G2 from 'g2';
import toFixed2 from '../../../../utils/common';

class ThermodynamicChart extends React.Component{
  constructor(props) {
    super(props);
      // new object ref
  }
  render() {
      const{chartData}=this.props;
      var dayData = [];
      if(chartData.yCoordinate){
        chartData.yCoordinate.map((item) => {
          dayData.push(item.substring(4,11))
        })
      }
      var data = [[0, 0, 0], [0, 1, 5], [0, 2, 8], [0, 3, 11], [0, 4, 6], [1, 0, 9], [1, 1, 5], [1, 2, 7], [1, 3, 11], [1, 4, 4], [2, 0, 3], [2, 1, 1], [2, 2, 3], [2, 3, 4], [2, 4, 2], [3, 0, 7], [3, 1, 12], [3, 2, 11], [3, 3, 9], [3, 4, 6], [4, 0, 3], [4, 1, 5], [4, 2, 8], [4, 3, 7], [4, 4, 11], [5, 0, 8], [5, 1, 3], [5, 2, 2], [5, 3, 6], [5, 4, 10], [6, 0, 13], [6, 1, 4], [6, 2, 8], [6, 3, 8], [6, 4, 6], [7, 0, 1], [7, 1, 1], [7, 2, 2], [7, 3, 3], [7, 4, 0], [8, 0, 8], [8, 1, 7], [8, 2, 13], [8, 3, 4], [8, 4, 4], [9, 0, 4], [9, 1, 14], [9, 2, 1], [9, 3, 4], [9, 4, 1],[10, 0, 10], [10, 1, 1], [10, 2, 8], [10, 3, 4], [10, 4, 7],[11, 0, 10], [11, 1, 1], [11, 2, 8], [11, 3, 4], [11, 4, 7], [12, 0, 2], [12, 1, 5], [12, 2, 8], [12, 3, 11], [12, 4, 8], [13, 0, 5], [13, 1, 5], [13, 2, 1], [13, 3, 4], [13, 4, 5],[14, 0, 10], [14, 1, 9], [14, 2, 8], [14, 3, 4], [14, 4, 7], [15, 0, 2], [15, 1, 5], [15, 2, 8], [15, 3, 11], [15, 4, 8], [16, 0, 3], [16, 1, 1], [16, 2, 13], [16, 3, 4], [16, 4, 2],[17, 0, 1], [17, 1, 9], [17, 2, 8], [17, 3, 4], [17, 4, 7], [18, 0, 9], [18, 1, 8], [18, 2, 7], [18, 3, 7], [18, 4, 4], [19, 0, 3], [19, 1, 5], [19, 2, 3], [19, 3, 6], [19, 4, 5],[20, 0, 10], [20, 1, 9], [20, 2, 8], [20, 3, 4], [20, 4, 6], [21, 0, 2], [21, 1, 5], [21, 2, 8], [21, 3, 11], [21, 4, 8], [22, 0, 5], [22, 1, 5], [22, 2, 3], [22, 3, 4], [22, 4, 2],[23, 0, 1], [23, 1, 19], [23, 2, 8], [23, 3, 24], [23, 4, 67]];
      var source = [];
      if(chartData.saleHourByDims){
        for(var i = 0; i < chartData.saleHourByDims.length; i ++) {
           var item = chartData.saleHourByDims[i];
           var obj = {};
           obj.name = item.xCoorValue;
           obj.day = item.yCoorValue;
           obj.amount = toFixed2.formatCurrency(item.billAmount);
           obj.group = item.billAmountGroup;
           source.push(obj);
         }
      }
       this.state = {
         data: source,
         forceFit: true,
         width: 500,
         height: 450,
         plotCfg: {
            margin: [20, 80, 60, 85]
         },
       };
       const Chart = createG2(chart => {
         chart.animate(false);
         chart.tooltip({
           offset: 10, // 设置 tooltip 显示位置时距离当前鼠标 x 轴方向上的距离
           map: { // 用于指定 tooltip 内显示内容同原始数据字段的映射关系
             name: 'day', // 为数据字段名时则显示该字段名对应的数值，常量则显示常量
           }
         });
         chart.col('name', {
           type: 'cat',
           values: ['1', '2', '3', '4', '5', '6', '7', '8',  '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23','24',]
         });
         chart.col('day', {
           type: 'cat',
           values: dayData,
           min: 0,
           max: 2000
         });
         chart.axis('name', {
           title: null,
           grid: {
             line: {
               stroke: '#d9d9d9',
               lineWidth: 1,
               lineDash: [2, 2]
             }
           }
         });
         chart.axis('day', {
           title: null,
           labelOffset: 10,
           labels: {
             autoRotate: false, // 文本是否允许自动旋转
             label: {
               //textAlign: 'left', // 文本对齐方向，可取值为： left center right
               fill: '#404040', // 文本的颜色
               fontSize: '12', // 文本大小
               //fontWeight: 'bold', // 文本粗细
               //rotate: 10 // 文本旋转角度
             }
           }
         });
         chart.legend(false);
         chart.polygon().position('name*day')
         .color('group', '#f6f6f6-#F1DE9E-#BF444C')
         .label('group', {
           offset: -2,
           label: {
             fill: '#444',
             fontWeight: 'bold'
           }
         })
         .style({
           lineWidth: 1,
           stroke: '#fff'
         });
         chart.render();
         chart.on('tooltipchange',function(ev){
           var item = ev.items[0]; // 获取tooltip要显示的内容
           item.value = item.point._origin.amount + '元'
           item.name = item.name + '销售额'
         });
       })
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
export default ThermodynamicChart;
