window.addEventListener("message", (event) => {
  //流程2
  //如果是指定源来的消息就去处理
  if (event.origin === "http://127.0.0.1:5500") {
    if (event.data.action == "去获取礼物数据") {
      getData();
    }
  }
});

function getData() {
  //流程3
  //向扩展程序的service发送消息，并获取返回的数据
  chrome.runtime.sendMessage({ action: "get_gift_data" }, (res) => {
    //流程5
    //回调中有了list 数据，向http://127.0.0.1:5500这个窗口发送消息，
    window.postMessage(
      { data: res, code: "获取的结果数据" },
      "http://127.0.0.1:5500"
    );
  });
}
