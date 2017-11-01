# pikachu

## Dos
    皮卡丘工程构建服务.
    
## Code Style

英文版:https://github.com/airbnb/javascript
中文版:https://github.com/yuche/javascript

## Develop

```
sudo npm run dev
```
    绑定: 127.0.0.1 pd.test.goago.cn
    
    访问:pd.test.goago.cn

## Build

```
npm run build
```

## 规范

- 1.模块加载
    
    使用标准的CMD CommonJS模块加载规范.
    
    > CMD规范比较符合node的工具扩展,比较常规的规范,可以轻松移植老的模块,ES6模块规范在我们开发代码中没有优势,不推荐一个模块导出多个对象.
    
    
## 单元测试规范
    
    [atool-test](http://ant-tool.github.io/atool-test.html)
    
    atool-test 默认已集成 mocha + chai + sinon, 无需添加其他测试相关依赖
    
    >参数:
        
        -p, --port: 端口, 默认为 9876;
        --no-chai: 不含内置断言库;
        --no-coverage：不生成测试覆盖率;
        -k, --keep: 测试结束后保持进程, 方便在其他浏览器中打开 runner.html.
        
        