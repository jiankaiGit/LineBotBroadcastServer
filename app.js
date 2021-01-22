
// 引用linebot SDK
var linebot = require('linebot');
var WebSocketServer = require('ws').Server;

var ws = new WebSocketServer({
    port: 3001,//监听的端口
    verifyClient: socketverify //(可选)用于验证连接的函数
});

var mWsocket = null;
function socketverify(info) {
    //做一些事情来验证连接合法性，如果允许连接则return true，否则return false，如下例子
    // var origin=info.origin.match(/^(:?.+\:\/\/)([^\/]+)/);
    // if (origin.length>=3 && origin[2]=="blog.luojia.me") {
    //     return true;//如果是来自blog.luojia.me的连接，就接受
    // }
    // return false;//否则拒绝
 
    //传入的info参数会包括这个连接的很多信息，你可以在此处使用console.log(info)来查看和选择如何验证连接
    return true;
}

ws.on('connection',
function(wsocket) {
  mWsocket = wsocket;
    wsocket.on('message',message);
    mWsocket.send("Link Start-------------");
    wsocket.on('close',close);
    wsocket.on('error',error);
    wsocket.on('open',open);
});
 
function message(msg){
    //对接收到的消息做些什么
    console.log(msg);
}
function error(err){
    //处理错误
    console.log(err);
}
function close(){
    //连接关闭时做些什么
    mWsocket = null;
    console.log('close');
}
function open(){
    //此链接开启后做些什么
        console.log('open');
}

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: 'your_id',
  channelSecret: 'your_secret',
  channelAccessToken: 'your_token'
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  event.source.profile().then(function (profile){
      console.log(profile.displayName);
      console.log(profile.userId);
      console.log(profile);
  });
  if(mWsocket != null){
      mWsocket.send(event.message.text);
    }
  event.reply(event.message.text).then(function (data) {
    // 當訊息成功回傳後的處理
  }).catch(function (error) {
    // 當訊息回傳失敗後的處理
  });
});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 3000, function () {
    console.log('[BOT已準備就緒]');
});
