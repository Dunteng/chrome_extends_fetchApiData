# chrome_extends_fetchApiData
chrome扩展程序跨域调用礼物面板接口数据并做数据清洗

**无视跨域从第三方接口获取数据**

第三方api地址：`http://kg.server.com/marisa/api/qza/request/query`


# 实现效果

在本地 127.0.0.0:8000页面内点击‘获取’按钮，将第三方接口的数据渲染到当前页面

# 核心原理

通过浏览器的跨源通信 `window.postMessage(message, targetOrigin, [transfer])`,将请求信息发送给常驻内容的chrome扩展程序(service.js,v2版本中是background.js),service.js内可以拿到第三方的cookie，然后后发起网络请求(这里就是无视跨域)将第三方接口的数据返回给页面