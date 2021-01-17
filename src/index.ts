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
      access_token: '',
      secret: ''
    }
    _webhookUrl: string
    constructor(_initData: InitData){
      const { access_token, secret } = _initData
      const timestamp = new Date().getTime()
      const sign = this.signFn(secret,`${timestamp}\n${secret}`) 
      this._webhookUrl = `https://oapi.dingtalk.com/robot/send?access_token=${access_token}&timestamp=${timestamp}&sign=${sign}`
    }

    signFn = (secret, content) =>{
      const str = crypto.createHmac('sha256', secret).update(content)
      .digest()
      .toString('base64');
      return encodeURIComponent(str);
    }

    send (json = defaultOptions){
        try {
            
            let options = {
                headers,
                json
              };
            request.post(this._webhookUrl, options, function(_error, _response, body){
                console.log(`send msg, response: ${JSON.stringify(body)}`);
            });
        }
        catch(err) {
            console.error(err);
            return false;
        }        
    }
}

module.exports = Bot