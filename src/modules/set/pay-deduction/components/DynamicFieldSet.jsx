import React from 'react';
import ReactDOM from 'react-dom';
import Form from '@gag/form-web';
import Input from '@gag/input-web';
import Icon from '@gag/icon-web';
import Button from '@gag/button-web';
const FormItem = Form.Item;

let uuid = 0;
class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      analyzeData :this.props.analyzeData
    };
  }

  remove = (index) => {
    const { form } = this.props;
    //const keys = form.getFieldValue('keys');
    //console.log(form.getFieldsValue())
    const nextKeys = this.state.analyzeData;
    nextKeys.splice(index,1);
    this.setState({
      analyzeData:nextKeys
    });

  }

  add = () => {
    const { form } = this.props;
    const nextKeys = this.state.analyzeData.concat({name:'',weight:null,});
    this.setState({
      analyzeData:nextKeys
    });
  }
  payDeductionChange = (e) =>{
    if(e.target.value > 1){
      alert('系数填写错误，必须是0-1之间，请重新填写！')
    }
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { form } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: this.state.analyzeData });
    return (
      <Form  className='util-clearfix'>
        <div style={{display:'inline-block',width:'40%'}}>
          <div>
            支付方式：
          </div>
          <div style={{marginLeft:30}}>
            {this.state.analyzeData.map((item, index) => {
              return (
                <FormItem
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? '支付方式' : ''}
                  required={false}
                  key={index}
                >
                  {getFieldDecorator(`payAnalyze${index}`, {
                    initialValue:this.state.analyzeData[index].name
                  })(
                    <Input placeholder="支付方式" style={{ width: '80%', marginRight: 8 }} />

                  )}
                </FormItem>

              );
            })}
          </div>

        </div>
        <div style={{display:'inline-block',width:'40%'}}>
          <div>
            抵扣系数：
          </div>
          <div style={{marginLeft:30}}>
            {this.state.analyzeData.map((item, index) => {
              return (
                <FormItem
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? '抵扣系数' : ''}
                  required={false}
                  key={index}
                >
                  {getFieldDecorator(`payDeduction${index}`, {
                    initialValue:this.state.analyzeData[index].weight
                  })(
                    <Input placeholder="抵扣系数" style={{ width: '80%', marginRight: 8 }} onChange={this.payDeductionChange}/>
                  )}

                </FormItem>

              );
            })}
          </div>

        </div>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrappedDynamicFieldSet;
