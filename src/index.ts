const request = require('request');
const crypto = require('crypto');
import { InitData } from './types'
const headers= {
  "Content-Type": "application/json;charset=utf-8"
};

const defaultOptions = {
  msgtype: "text", 
  text: {
    content: 'hello~'
  }
}
// https://ding-doc.dingtalk.com/document/app/custom-robot-access
class Bot{
    _initData: InitData = {
      base_url:'',
      access_token: '',
      secret: ''
    }
    _webhookUrl: string
    constructor(_initData: InitData){
     this._initData = _initData;
    }
  
    webhookUrlFn = (_initData: InitData) =>{
      const { access_token, secret, base_url = 'https://oapi.dingtalk.com/robot/send' } = _initData
      const timestamp = new Date().getTime()
      const sign = this.signFn(secret,`${timestamp}\n${secret}`) 
      this._webhookUrl = `${base_url}?access_token=${access_token}&timestamp=${timestamp}&sign=${sign}`
    }

    signFn = (secret, content) =>{
      const str = crypto.createHmac('sha256', secret).update(content)
      .digest()
      .toString('base64');
      return encodeURIComponent(str);
    }

    send (json = defaultOptions){
      let options = {
        headers,
        json
      };
    this.webhookUrlFn(this._initData);
    return new Promise((resolve, reject)=>{
      request.post(this._webhookUrl, options, function(_error, _response, body){
        console.log(`send msg, response: ${JSON.stringify(body)}`);
        resolve(_response)
        reject(_error)
      }); 
     })      
    }
}

module.exports = Bot
