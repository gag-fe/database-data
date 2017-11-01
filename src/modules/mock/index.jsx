import { createContainer, createRootContainer } from 'Roof';
import Form from '@gag/form-web';
import Input from '@gag/input-web';
import Row from '@gag/row-web';
import Button from '@gag/button-web';
import Col from '@gag/col-web';
import Select from '@gag/select-web';
import InputNumber from '@gag/input-number-web';

import React from 'react';
import fetchData from './fetchData.js';
require('./style/index.css');

const Mock = React.createClass({
	mixins: [fetchData],
	getInitialState() {
	    return {
	        ajaxdata:{},
		    jsonpdata:{},
		    pageturndata:{}
	    };
	},

	buttonCilck_ajax(){
		this.ajaxRequest();
	},

  render() {
    return (
            <div>
                <h1>mock - AJAX</h1>
                <Input type="textarea" value="$('#J_SendRequest').on('click', function(e){
    $.ajax({
      url: 'x.do',
      type: 'GET',
      dataType: 'json'
    }).done(function (data, status, jqXHR) {
      $('#J_RequestContent').text(JSON.stringify(data, null, 4));
    })
  })" />
                <Input type="textarea" value="var name = {
        'id|+1': 1,
        'first': '@FIRST',
        'last': '@LAST',
      }
      module.exports = {
        'GET /x.do': Mock.mock({'name': '@Name'})
      };" />

                <Button type="primary" onClick={this.buttonCilck_ajax}>mock - AJAX</Button>
                <Input type="textarea" value="" />

                <h1>mock - JSONP</h1>
                <Input type="textarea" value="  $('#J_SendRequest_JSONP').on('click', function(e){
    $.ajax({
      url: 'y.do',
      jsonp: 'cb',
      dataType: 'jsonp'
    }).done(function (data, status, jqXHR) {
      console.log('JSONP',data, status, jqXHR);
      $('#J_RequestContent_JSONP').text(JSON.stringify(data, null, 4));
    })
  })" />
                <Input type="textarea" value="      var movie = {
        'id|+1': 1,
        'name': '@Name',
      };
      module.exports = {
        'GET /y.do': function (req, res) {
          res.status(200);
          res.jsonp(Mock.mock({'data': movie,'success': true}), 'cb');
        }
      };" />
                <Button type="primary" onClick={this.buttonCilck_jsonp}>mock - JSONP</Button>
                <Input type="textarea" value="" />

                <h1>mock - 简单分页</h1>
                <Input type="textarea" value="$('#J_Pagenator').jqPaginator({
      totalPages: 100,
      visiblePages: 10,
      currentPage: 1,
      onPageChange: function (num, type) {
        var pageSize = $('#J_PageSize').val();
        var data = {};
        data.pageSize = pageSize;
        data.currentPage = num;
        $.ajax({
          url: 'z.do',
          dataType: 'json',
          type: 'POST',
          data: data
        }).done(function (data, status, jqXHR) {
          console.log('post',data, status, jqXHR);
          var html = '';
          for(var i = 0; i < data.dataList.length; i++){
            html += '<tr><td>' + data.dataList[i].id + '</td><td>' + data.dataList[i].first + '</td><td>' + data.dataList[i].last + '</td></tr>';
          }
          $('#J_Table').find('tbody').html(html);
        });
      }
  });" />
                <Input type="textarea" value="var name = {
        'id|+1': 1,
        'first': '@FIRST',
        'last': '@LAST',
      };
      module.exports = {
        'POST /z.do': function (req, res) {
          var postData = Qs.parse(req.body);
          var pageSize = postData.pageSize;
          var currentPage = postData.currentPage;
          name['id|+1'] = pageSize * (currentPage - 1);
          var tmpl = {};
          tmpl['dataList|'+pageSize] = [name];
          tmpl['success'] = true;
          tmpl['pageSize'] = pageSize;
          tmpl['currentPage'] = currentPage;
          res.json(Mock.mock(tmpl));
        }
      };" />
                <Button type="primary" onClick={this.buttonCilck_page}>mock - 简单分页</Button>
                <Input type="textarea" value="123" />
        </div>);
  }
});

export default Mock;

