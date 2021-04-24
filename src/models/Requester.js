/*
 * The model to manage requests
 */
import axios from "axios";
import log from "loglevel";

const CancelToken = axios.CancelToken;

export default class Requester{
  constructor(){
    this.source = undefined;
  }

  async request(options){
    log.info("request:", options);
    //before request, cancel previous one
    this.source && this.source.cancel("clean previous request");
    this.source = CancelToken.source();
    try{
      const response = await axios.request({
        ...options,
        cancelToken: this.source.token,
      });
      return response.data;
    }catch(e){
      log.warn("get error when request", e);
      if(axios.isCancel(e)){
        //change to handle cancel
        log.log("request canceled because of:", e.message);
      }else{
        log.log("request failed", e);
        throw e;
      }
    }
  }

  
}
