import React from 'react';
import Table from '@gag/table-web';
import Row from '@gag/row-web';
import Col from '@gag/col-web';
import List from '../../components/list';
import Icon from '@gag/icon-web';
import Modal from '@gag/modal-web';

const listData=[
  {label:'火锅',value:1,},
  {label:'火锅',value:2,},
  {label:'火锅',value:3,},
  {label:'火锅',value:4,},
  {label:'火锅',value:5,},
  {label:'火锅',value:6,},
  {label:'火锅',value:7,},
  {label:'火锅',value:8,},
  {label:'火锅',value:9},
  {label:'火锅',value:10,},
  {label:'火锅',value:11,},
  {label:'火锅',value:12,},
  {label:'火锅',value:13,},
  {label:'火锅',value:14,},
  {label:'火锅',value:15,},
  {label:'火锅',value:16,disable:true},
];

class TablePrice extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      { title: '店铺名称', key:'1', width: 100, dataIndex: 'shopEntityName',},
      { title: '业态', key:'2', width: 50, dataIndex: 'shopEntityTypeRoot', },
      { title: '楼层', key:'3', dataIndex: 'storey',  width: 150},
      { title: '净销售额',  key:'4', dataIndex: 'recommendAmount',  width: 150},
      { title: '结账单',  key:'5', dataIndex: 'billCount',  width: 150 },
      {
        title: '价格区间',
        key: 'operation',
        width: 100,
        render: () => <div  onClick={this.props.showModal}><a ><Icon type="eye"></Icon></a></div>,
      },
    ];
    this.state = {
      size: "default",
      visible: false,
      tableList: [],
    };
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

  render() {
    const { size, visible,tableList } = this.state;

    return (
      <div>

        <Table columns={this.columns} dataSource={this.props.tableList} pageSize={20}/>
          <Modal
            title={`价格区间分布----${this.state.size}`}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={800}
            footer={null}
          >
          <Row>
          <Col span={6}>
            <div className="list" style={{maxHeight:500,overflow:'auto'}}>
            <List listData={listData} selItem={listData[0]}></List>
            </div>
          </Col>
          <Col span={18}>col-6 col-pull-18</Col>
        </Row>
          </Modal>
      </div>
    );
  }
}
module.exports= TablePrice;
