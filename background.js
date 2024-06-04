function cleanData(data) {
  let cleanedData = {
    mapFailRes: data.mapFailRes,
    mapSuccRes: {},
  };
  let specialKeys = {
    1112791: {
      GetInterval: 60,
      IncNum: 10,
      MaxNum: 100,
      RoomID: "39d9db83212d318f374774d7",
      isInGiftPanel: true,
      isQuickSendGift: true,
    },
    1112801: {
      GetInterval: 10,
      IncNum: 1,
      MaxNum: 100,
      RoomID: "39d9db83212d318f374774d7",
      isInGiftPanel: true,
      isQuickSendGift: false,
    },
    1112802: {
      GetInterval: 120,
      IncNum: 20,
      MaxNum: 100,
      RoomID: "39d9db83212d318f374774d7",
      isInGiftPanel: true,
      isQuickSendGift: false,
    },
  };
  for (let key in data.mapSuccRes) {
    if (key >= 1000000 && key < 5000000) {
      cleanedData.mapSuccRes[key] = {
        isQuickSendGift: true,
        isInGiftPanel: true,
        stPropsInfo: {
          strImage: data.mapSuccRes[key].stPropsInfo.strImage,
          strName: data.mapSuccRes[key].stPropsInfo.strName,
          uPropsId: data.mapSuccRes[key].stPropsInfo.uPropsId,
          uPropsType: data.mapSuccRes[key].stPropsInfo.uPropsType,
          uValidGapTime: data.mapSuccRes[key].stPropsInfo.uValidGapTime,
        },
        uStatus: data.mapSuccRes[key].uStatus,
        uType: data.mapSuccRes[key].uType,
      };
      if (specialKeys[key]) {
        for (let specialKey in specialKeys[key]) {
          cleanedData.mapSuccRes[key][specialKey] =
            specialKeys[key][specialKey];
        }
      }
    } else {
      cleanedData.mapSuccRes[key] = {
        stGiftInfo: {
          mapLogo: data.mapSuccRes[key].stGiftInfo.mapLogo,
          strGiftName: data.mapSuccRes[key].stGiftInfo.strGiftName,
          strLogo: data.mapSuccRes[key].stGiftInfo.strLogo,
          uGiftId: data.mapSuccRes[key].stGiftInfo.uGiftId,
          uOriginPrice: data.mapSuccRes[key].stGiftInfo.uOriginPrice,
          uPrice: data.mapSuccRes[key].stGiftInfo.uPrice,
        },
        uStatus: data.mapSuccRes[key].uStatus,
        uType: data.mapSuccRes[key].uType,
      };
    }
  }
  return cleanedData;
}
function MyFetch(url, method, data, headers, callback) {
  if (method === "get") {
    const params = new URLSearchParams(data);
    fetch(`${url}?${params}`, {
      headers: headers,
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (myJson) {
        callback(JSON.parse(myJson));
      });
  } else {
    fetch(url, {
      method: method,
      body: JSON.stringify(data),
      // mode: "no-cors",
      headers: headers,
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (myJson) {
        console.log(JSON.parse(myJson).data.data)
        callback(cleanData((JSON.parse(myJson).data.data)));
      });
  }
}


// vecGiftList: ['22', '4738', '7425', '7991', '8278', '8484', '8891', '1112791', '1112801', '1112802'] 测试环境
// vecGiftList: ['22', '1778', '4738', '7425', '7991', '8278', '8484', '8891', '1112791']

//流程4 无视跨域问题请求第三方接口 ，获取数据后执行回调
//第三方接口如果需要cookie这里也可以获取到
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "get_gift_data") {
    chrome.cookies.getAll({ domain: request.domain }, function (cookies) {
      const url = "http://kg.server.com/marisa/api/qza/request/query";
      let params = {
        value: {
          uUid: "927127603",
          strQua: "V1_IPH_KG_8.21.0_421_APP_A",
          vecGiftList: ['22','1778', '4738', '7425', '7991', '8278', '8484', '8891', '1112791', '1112801', '1112802']
        },
        scheme: {
          request: "proto_union_gift_info::QueryMultiUnionGiftInfoReq",
          response: "proto_union_gift_info::QueryMultiUnionGiftInfoRsp",
          address: "ip://30.183.228.34:16084", // 后端每次发外网ip会改变，注意更新
          // address: "ip://11.161.228.34:16084", 
          command: 153,
          subcommand: 2,
          uid: 1000001,
          project: "kg_jce"
        }
      }

      let ck = cookies.filter((e) => e.domain.indexOf("kg.server.com") != -1);
      let headers = {};
      MyFetch(url, "post", params, headers, (res) => {
        sendResponse({ cookies: ck, response: res });
      });
    });
  }
  return true; //这里要返回true,不然会报错：Unchecked runtime.lastError: The message port closed before a response was received
});
