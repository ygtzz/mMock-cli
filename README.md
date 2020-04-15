# mMock-cli
cli tool to mock data, supports mockjs and faker.js

## Usage

```bash
npm i -g mmock-cli

$ mmock //start the mock server
```

## Grammar

support [mockjs](http://mockjs.com/examples.html "mockjs") and [faker.js](https://github.com/marak/Faker.js/ "faker"), you can use it alone, or mix them

example:

```javascript
{
    "user|4":[{    //生成|num个如下格式名字的数据
        "id|+1": 1,  //数字从当前数开始后续依次加一
        "name": "@cname",    //名字为随机中文名字
        "ago|18-31": 25,    //年龄为18-28之间的随机数字
        "sex|1":["男","女"],    //性别是数组中的一个，随机的
        "job|1": ["js","css","node.js","vue"]    //工作是数组中的一个
        "email": "{{internet.email}}",  //email
        "website": "{{internet.url}}"   //url
    }]
}
```
