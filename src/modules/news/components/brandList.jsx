import React from 'react';
import Radio from '@gag/radio-web';
import Menu from '@gag/menu-web';
import Dropdown from '@gag/dropdown-web';
import Icon from '@gag/icon-web';
import Tag from '@gag/tag-web';
import Spin from '@gag/spin-web';
const CheckableTag = Tag.CheckableTag;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const tagsFromServer = ['Movies', 'Books', 'Music', 'Sports'];
const FORMAT = 'YYYY-MM-DD';
import Moment from 'moment';
import BrandSubscrib from './brandSubscrib';
class BrandList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'selectedTags':[],
      'articleId':'',
      'relate': 0,
      'score': 0,
      'vote':[{
        label: '非常负面',
        value: -2,
      },{
        label: '负面',
        value: -1,
      },{
        label: '中性',
        value: 0,
      },{
        label: '正面',
        value: 1,
      },{
        label: '非常正面',
        value: 2,
      }],
    };
  }

  _voteCurrerValue(id, value){
    let item = this.state;
    let params = {};
    this.setState({
      articleId: id,
      relate: 1,
      score: value.key
    });
    item['relate'] = 1;
    item['score'] = value.key;

    params['articleId'] = id;
    params['relate'] = 1;
    params['score'] = value.key;
    this.props.setArticleEvaluation(params);
  }

  _relateSeleceValue(id, e){
    let item = this.state;
    let params = {};
    this.setState({
      articleId: id,
      relate: e.target.value,
      score: ''
    });

    item['articleId'] = id;
    item['relate'] = e.target.value;
    item['score'] = '';

    params['articleId'] = id;
    params['relate'] = e.target.value;
    params['score'] = '';

    if(e.target.value == 0){
      this.props.setArticleEvaluation(params);
    }
  }

  _brandNameSearch(tag, checked){
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ?
      [...selectedTags, tag] :
      //selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: nextSelectedTags });
    let postData = {};
    postData['pageIndex'] = 1;
    postData['pageSize'] = 20;
    postData['brandIds'] = '';
    postData['brandName'] = tag;
    this.props.updateSearchParams(postData);
    this.props.getBrandList();
  }

  _renderViewBrandList(){
    const html = [];
    const voteMenu = [];
    this.state.vote.map(item => {
      voteMenu.push(
        <Menu.Item key={item.value}>{item.label}</Menu.Item>
      );
    });

    if(this.props.brandNews && this.props.brandNews.brandNewsList && this.props.brandNews.brandNewsList.length > 0){
      this.props.brandNews.brandNewsList.map((item, idx) => {
        if(this.props.layout.orgType == 'D'){
          html.push(<li>
            <div className="brand-list-name"><a href={item.link} target="_blank"><span dangerouslySetInnerHTML={{__html: item.title}}></span></a></div>
            <div className="brand-list-time">
              新闻来源：{item.source}  发布时间：{Moment(item.publishTime).format(FORMAT)}
            </div>
            <div className="brand-list-content">
              <p dangerouslySetInnerHTML={{__html: item.summary}}></p>
            </div>
            <div className="brand-list-property">
              <div className="property-label">
                <BrandSubscrib {...this.props} {...item}></BrandSubscrib>
              </div>
              <div className="property-vote">
                <RadioGroup onChange={this._relateSeleceValue.bind(this, item.id)}>
                  <RadioButton value={0}>不相关</RadioButton>

                  <Dropdown trigger="click" overlay={(<Menu onClick={this._voteCurrerValue.bind(this, item.id)}>{voteMenu}</Menu>)}>
                    <RadioButton value={1}>
                      <span className="ant-dropdown-link">相关性评价<Icon type="down" /></span>
                    </RadioButton>
                  </Dropdown>

                </RadioGroup>
              </div>
            </div>
          </li>);
        }else {
          html.push(<li>
            <div className="brand-list-name"><a href={item.link} target="_blank"><span dangerouslySetInnerHTML={{__html: item.title}}></span></a></div>
            <div className="brand-list-time">
              新闻来源：{item.source}  发布时间：{Moment(item.publishTime).format(FORMAT)}
            </div>
            <div className="brand-list-content">
              <p dangerouslySetInnerHTML={{__html: item.summary}}></p>
            </div>
            <div className="brand-list-property">
              <div className="property-label">
                <BrandSubscrib {...this.props} {...item}></BrandSubscrib>
              </div>
              <div className="property-vote">
              </div>
            </div>
          </li>);
        }

      });
    }else {
      html.push(<div className="no-data" style={{display:this.props.brandNews.loading?'none':'block'}}><Icon type="frown-o" /> 暂无数据</div>);
    }


    return html;
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    return (
      <Spin spinning={this.props.brandNews.loading} tip="Loading...">
      <div className="brand-list" style={{minHeight:'600px'}}>
        <ul>
          {this._renderViewBrandList()}
        </ul>
      </div>
      </Spin>
    );
  }
}
export default BrandList
