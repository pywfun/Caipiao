'use strict';

import React, { Component} from 'react';

import {
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';

//var url = "http://www.1396p.com/gdkl10/ajax?ajaxhandler=getgdkl10awarddata";
var url = "http://www.1396p.com/xync/ajax?ajaxhandler=getxyncawarddata";
//http://www.1396p.com/pk10/ajax?ajaxhandler=getpk10awarddata
//http://www.1396p.com/shishicai/ajax?ajaxhandler=getcqsscawarddata
var backupDx=[],backupDs=[],backupWdx=[],backupHs=[];
var result , countDownTime ;
var awardInfo =[];
var showQiuORNot=[],LastWin=[];
class Button extends Component{
  render() {
    return (
      <TouchableHighlight
        underlayColor={"#556AC3"}//触摸的时候显示出来的底层颜色
        style={[styles.button,{backgroundColor:this.props.color}]}
        onPress={this.props.onPress}>
        <Text style={styles.buttonLabel}>
          {this.props.label}
        </Text>
      </TouchableHighlight>
    );
  }
}

class luckfram extends Component{

  constructor(props) {
    super(props);
    this.state = {
      qishu:'1',
      jiner:'',
      daxiao:[],
      danshuang:[],
      weidaxiao:[],
      heshu:[],
      show:[],
      showing:false,
      serverResult:{},
      countDownTime:0,
      updating:false,
      touzhu:[],
      jieguo:'',
      jieguoqishu:'',
      stop:false,
      peilv:1,
      zongxiadan:0,
      ying:0,
      showQiuORNot:[],
    };
  }
  componentDidMount() {
    this.createResult();
    this.getDateFormServer();

  }
  createResult(){
    let Min='0000000';
    let Max='1111111'; 
    let result = new Array(),result1=new Array(),result2=new Array(),result3=new Array();
    var temp = [0,0,0,0,0,0,0];
    for(let i=Number.parseInt(Min,2);i<=Number.parseInt(Max,2);i++)
    {
      let num = this.prefix(7,i.toString(2));
      temp = num.split("");
      result.push(temp);     
    }
    result1 = result.slice();
    result2 = result.slice();
    result3 = result.slice();
    this.setState({
      daxiao:result,
      danshuang:result1,
      weidaxiao:result2,
      heshu:result3      
    })

  }
  prefix(num, val) {
      return (new Array(num).join('0') + val).slice(-num);
  }
  removeItem(ArrayName,date){
    let arr = ArrayName;
    var index = arr.indexOf(date);
    if(index>-1)
       arr.splice(index,1);

    return arr
  }  
  geOneArrayFrom(arr){
    let length = arr.length ;
    let useArry = Math.ceil(Math.random()*length);
    //let newArry = this.removeItem(arr,arr[useArry]);
    return arr[useArry-1];
  }
  getDateFormServer(){
      fetch(url)
        .then((response) => response.json())
        .catch((error) => {
          
          Alert.alert("提示","无法获取结果，请检查网络");
        })
        .then((responseData) => {
          console.log(responseData);
          if(responseData==undefined||responseData==''||responseData.current==undefined||responseData.current=='')
          {
            this.getDateFormServer();
            return;
          }
          if(result==undefined||result==null||responseData.current.period===result.current.period)
            result = responseData;
          else{
            result = responseData;
            this.setState({updating:false});
           // alert("结果更新");f
           this.state.serverResult = responseData;
           // if(result.current.period!=this.state.jieguoqishu)
             // this.award(result.current.awardNumbers);
          }
          countDownTime = result.next.awardTimeInterval/1000;
          this.setState({
            serverResult: responseData,
            countDownTime:Number.parseInt(countDownTime),
            jieguoqishu:result.current.period,
          });
          this.countDown();
        })
        .done();    
  }
  refreshDate(){
    this.timer && clearTimeout(this.timer); 
    this.timer2 && clearTimeout(this.timer2); 
    this.getDateFormServer();  
  }
  makeTRUEArray()
  {
    let temp=[];
    for(let i=0;i<8;i++)
    {
      temp[i]={dx:true,ds:true,wdx:true,hs:true};
    }
    return temp;
  }
  gotoAward(awardNumbers){
    if(true)
    {
      if(this.state.qishu=='1'||this.state.qishu!=this.state.serverResult.current.period)
        this.award(awardNumbers);
      else
        Alert.alert('提示','这次获奖号码的期数跟上次的一样，是否继续？',[
          {text:'继续' ,onPress:()=>this.award(awardNumbers)},
          {text:'取消'}
          ]);
    }else
    {
      Alert.alert("请先开始");
    }

  }  
  award(awardNumbers){
    this.state.qishu = this.state.serverResult.current.period;
    let tempShow=new Array();
    let award = awardNumbers;
    let localAward = (this.state.show).slice();
    let daxiaoA,danshuangA,weidaxiaoA,heshuA;
    let ndx = new Array(),nds= new Array(),nwdx= new Array(),nhs= new Array();
    award = award.split(',');
    let ying=0,xiadan=0;
    if(localAward.length==0)
    {
      Alert.alert("请先开始");
      return;
    }  
    if(!this.state.stop)
      tempShow = this.makeTRUEArray();
    else
      tempShow = LastWin.slice();
    for(let i=0;i<8;i++)
    {
      ndx =(localAward[i]['dx']).slice();
      nds = (localAward[i]['ds']).slice();
      nwdx = (localAward[i]['wdx']).slice();
      nhs = (localAward[i]['hs']).slice();
      let awardNum = Number.parseInt(award[i]);
      let dx = awardNum<=10?0:1;
      let ds = awardNum%2==1?1:0;
      let wdx = (awardNum-(Number.parseInt(awardNum/10)*10))<=4?0:1;
      let hs = (awardNum-(Number.parseInt(awardNum/10)*9))%2==1?1:0;
      
      if(Number.parseInt(localAward[i]['dx'][0])==dx||tempShow[i]['dx']==false)
      {
          if(tempShow[i]['dx']==false&&this.state.stop)
          {
            ndx=[undefined];
          }
          else
          {
            xiadan = xiadan+this.state.touzhu[7-ndx.length];
            ying +=  this.state.touzhu[7-ndx.length] * global.peilv;
            tempShow[i]['dx']=false;
            if((this.state.daxiao).length!=0)
            {
             // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
             // console.log('backupDx 还有',backupDx.length);
              ndx = this.geOneArrayFrom(this.state.daxiao);
             // backupDx.push(ndx);
             // daxiaoA = this.removeItem(this.state.daxiao,ndx);
              //localAward[i]['dx'] = ndx;
            }
            else{
             // console.log('this.state.daxiao 用完！！！！！！！！！！！！！！');
             // console.log('backupDx 还有',backupDx.length);
             // this.state.daxiao = backupDx;
             // backupDx=[];
              ndx = this.geOneArrayFrom(this.state.daxiao);            
            //  backupDx.push(ndx);
            //  daxiaoA = this.removeItem(this.state.daxiao,ndx);
              //localAward[i]['dx'] = ndx;
             // console.log('localAward dx',localAward[i]['dx']);            
            }
            if(this.state.stop)
              ndx=[undefined];  
          }    
      }
      else
      {
        xiadan = xiadan+this.state.touzhu[7-ndx.length];
        let zhong =':'+(dx==0?'大':'小')+this.state.touzhu[7-ndx.length]+'不中';
        awardInfo.push('第'+this.state.serverResult.current.period+'期第'+(i+1)+'球'+zhong);
        if((ndx).length>1)
        {
         // console.log('第'+(i+1)+'球大小没中奖');
         // console.log(localAward[i]['dx']);
          //let tempdx = ndx;
          ndx.splice(0,1);
         // ndx = tempdx;
         // console.log(localAward[i]['dx']);
        //  daxiaoA = this.state.daxiao;
        }
        else{
          if((this.state.daxiao).length!=0)
          {
           // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
           // console.log('backupDx 还有',backupDx.length);
            ndx = this.geOneArrayFrom(this.state.daxiao);
           // backupDx.push(ndx);
           // daxiaoA = this.removeItem(this.state.daxiao,ndx);
            //localAward[i]['dx'] = ndx;
          }
          else{
           // this.state.daxiao = backupDx;
           // backupDx=[];
            ndx = this.geOneArrayFrom(this.state.daxiao);
            //backupDx.push(ndx);
            //daxiaoA = this.removeItem(this.state.daxiao,ndx);
           // localAward[i]['dx'] = ndx; 
           // console.log('localAward dx',localAward[i]['dx']);             
          }
        }        
      }
      if(Number.parseInt(localAward[i]['ds'][0])==ds||tempShow[i]['ds']==false)
      {
          if(tempShow[i]['ds']==false&&this.state.stop)
          {
            nds=[undefined];
          }
          else
          {
            //console.log('第'+(i+1)+'球大小中奖');
         //   let zhong =':中' +(ds==1?'单':'双')+this.state.touzhu[7-nds.length];
            xiadan = xiadan+this.state.touzhu[7-nds.length];
            ying +=  this.state.touzhu[7-nds.length] * global.peilv;
            tempShow[i]['ds']=false;
          //  awardInfo.push('第'+this.state.serverResult.current.period+'期第'+(i+1)+'球'+zhong);
            if((this.state.danshuang).length!=0)
            {
             // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
             // console.log('backupDx 还有',backupDx.length);
              nds = this.geOneArrayFrom(this.state.danshuang);
             // backupDs.push(nds);
           //   danshuangA = this.removeItem(this.state.danshuang,nds);
              //localAward[i]['dx'] = ndx;
            }
            else{
             // console.log('this.state.daxiao 用完！！！！！！！！！！！！！！');
             // console.log('backupDx 还有',backupDx.length);
           //   this.state.danshuang = backupDs;
             // backupDs=[];
              nds = this.geOneArrayFrom(this.state.danshuang);            
             // backupDs.push(nds);
             // danshuangA = this.removeItem(this.state.danshuang,nds);
              //localAward[i]['dx'] = ndx;
             // console.log('localAward dx',localAward[i]['dx']);            
            }
            if(this.state.stop)
              nds=[undefined];               
          }    
      }
      else
      {
        xiadan = xiadan+this.state.touzhu[7-nds.length];
          let zhong =':' +(ds==0?'单':'双')+this.state.touzhu[7-nds.length]+'不中';
          awardInfo.push('第'+this.state.serverResult.current.period+'期第'+(i+1)+'球'+zhong);
        if((localAward[i]['ds']).length>1)
        {
         // console.log('第'+(i+1)+'球大小没中奖');
         // console.log(localAward[i]['dx']);
          //let tempdx = ndx;
          nds.splice(0,1);
         // ndx = tempdx;
         // console.log(localAward[i]['dx']);
        //  danshuangA = this.state.danshuang;
        }
        else{
          if((this.state.danshuang).length!=0)
          {
           // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
           // console.log('backupDx 还有',backupDx.length);
            nds = this.geOneArrayFrom(this.state.danshuang);
          //  backupDs.push(nds);
          //  danshuangA = this.removeItem(this.state.daxiao,nds);
            //localAward[i]['dx'] = ndx;
          }
          else{
          //  this.state.danshuang = backupDs;
          //  backupDs=[];
            nds = this.geOneArrayFrom(this.state.danshuang);
          //  backupDs.push(nds);
          //  danshuangA = this.removeItem(this.state.danshuang,nds);
           // localAward[i]['dx'] = ndx; 
           // console.log('localAward dx',localAward[i]['dx']);             
          }
        }        
      }
      if(Number.parseInt(localAward[i]['wdx'][0])==wdx||tempShow[i]['wdx']==false)
      {
          if(tempShow[i]['wdx']==false&&this.state.stop)
          {
            nwdx=[undefined];
          }
          else
          {
           // let zhong =':中尾'+(wdx==1?'大':'小')+this.state.touzhu[7-nwdx.length];
            xiadan = xiadan+this.state.touzhu[7-nwdx.length];
            ying +=  this.state.touzhu[7-nwdx.length] * global.peilv;
            tempShow[i]['wdx']=false;
           // awardInfo.push('第'+this.state.serverResult.current.period+'期第'+(i+1)+'球'+zhong);
            if((this.state.weidaxiao).length!=0)
            {
             // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
             // console.log('backupDx 还有',backupDx.length);
              nwdx = this.geOneArrayFrom(this.state.weidaxiao);
            //  backupWdx.push(nwdx);
            //  weidaxiaoA = this.removeItem(this.state.weidaxiao,nwdx);
              //localAward[i]['dx'] = ndx;
            }
            else{
             // console.log('this.state.daxiao 用完！！！！！！！！！！！！！！');
             // console.log('backupDx 还有',backupDx.length);
             // this.state.weidaxiao = backupWdx;
             // backupWdx=[];
              nwdx = this.geOneArrayFrom(this.state.weidaxiao);            
             // backupWdx.push(nwdx);
             // weidaxiaoA = this.removeItem(this.state.weidaxiao,nwdx);
              //localAward[i]['dx'] = ndx;
             // console.log('localAward dx',localAward[i]['dx']);            
            }
            if(this.state.stop)
              nwdx=[undefined];     
          }     
      }
      else
      {
        xiadan = xiadan+this.state.touzhu[7-nwdx.length];
          let zhong =':尾'+(wdx==0?'大':'小')+this.state.touzhu[7-nwdx.length]+'不中';
          awardInfo.push('第'+this.state.serverResult.current.period+'期第'+(i+1)+'球'+zhong);        
        if((localAward[i]['wdx']).length>1)
        {
         // console.log('第'+(i+1)+'球大小没中奖');
         // console.log(localAward[i]['dx']);
          //let tempdx = ndx;
          nwdx.splice(0,1);
         // ndx = tempdx;
         // console.log(localAward[i]['dx']);
        //  weidaxiaoA = this.state.weidaxiao;
        }
        else{
          if((this.state.weidaxiao).length!=0)
          {
           // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
           // console.log('backupDx 还有',backupDx.length);
            nwdx = this.geOneArrayFrom(this.state.weidaxiao);
         //   backupWdx.push(nwdx);
         //   weidaxiaoA = this.removeItem(this.state.weidaxiao,nwdx);
            //localAward[i]['dx'] = ndx;
          }
          else{
         //   this.state.weidaxiao = backupWdx;
           // backupWdx=[];
            nwdx = this.geOneArrayFrom(this.state.weidaxiao);
           // backupWdx.push(nwdx);
           // weidaxiaoA = this.removeItem(this.state.weidaxiao,nwdx);
           // localAward[i]['dx'] = ndx; 
           // console.log('localAward dx',localAward[i]['dx']);             
          }
        }        
      }
      if(Number.parseInt(localAward[i]['hs'][0])==hs||tempShow[i]['hs']==false)
      {
          if(tempShow[i]['hs']==false&&this.state.stop)
          {
            nhs=[undefined];
          }
          else
          {
            xiadan = xiadan+this.state.touzhu[7-nhs.length];
            ying +=  this.state.touzhu[7-nhs.length] * global.peilv;
            tempShow[i]['hs']=false;
            if((this.state.heshu).length!=0)
            {
             // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
             // console.log('backupDx 还有',backupDx.length);
              nhs = this.geOneArrayFrom(this.state.heshu);
             // backupHs.push(nhs);
             // heshuA = this.removeItem(this.state.heshu,nhs);
              //localAward[i]['dx'] = ndx;
            }
            else{
             // console.log('this.state.daxiao 用完！！！！！！！！！！！！！！');
             // console.log('backupDx 还有',backupDx.length);
            //  this.state.heshu = backupHs.slice();
            //  backupHs=[];
              nhs = this.geOneArrayFrom(this.state.heshu);            
              //backupHs.push(nhs);
              //heshuA = this.removeItem(this.state.heshu,nhs);
              //localAward[i]['dx'] = ndx;
             // console.log('localAward dx',localAward[i]['dx']);            
            }
            if(this.state.stop)
              nhs=[undefined];             
          }     
      }
      else
      {
        xiadan = xiadan+this.state.touzhu[7-nhs.length];
          let zhong =':合'+(hs==0?'单':'双')+this.state.touzhu[7-nhs.length]+'不中';
          awardInfo.push('第'+this.state.serverResult.current.period+'期第'+(i+1)+'球'+zhong);        
        if((localAward[i]['hs']).length>1)
        {
         // console.log('第'+(i+1)+'球大小没中奖');
         // console.log(localAward[i]['dx']);
          //let tempdx = ndx;
          nhs.splice(0,1);
         // ndx = tempdx;
         // console.log(localAward[i]['dx']);
        //  heshuA = this.state.heshu;
        }
        else{
          if((this.state.heshu).length!=0)
          {
           // console.log('this.state.daxiao 还有',(this.state.daxiao).length);
           // console.log('backupDx 还有',backupDx.length);
            nhs = this.geOneArrayFrom(this.state.heshu);
         //   backupHs.push(nhs);
          //  heshuA = this.removeItem(this.state.heshu,nhs);
            //localAward[i]['dx'] = ndx;
          }
          else{
          //  this.state.heshu = backupHs.slice();
          //  backupHs=[];
            nhs = this.geOneArrayFrom(this.state.heshu);
          //  backupHs.push(nhs);
          //  heshuA = this.removeItem(this.state.heshu,nhs);
           // localAward[i]['dx'] = ndx; 
           // console.log('localAward dx',localAward[i]['dx']);             
          }
        }        
      }
      if(ndx ==undefined||nds == undefined ||nwdx==undefined||nhs==undefined)
        alert('出错了');
      localAward[i] = {dx:ndx,ds:nds,wdx:nwdx,hs:nhs};
      // this.state.daxiao=daxiaoA;  
      // this.state.danshuang=danshuangA; 
      // this.state.weidaxiao=weidaxiaoA; 
      // this.state.heshu=heshuA;                       
    }
    console.log('ying',ying);
    console.log('xiadan',xiadan);
    global.win = global.win+(ying-xiadan);
    LastWin = tempShow;
    this.setState({show:localAward});
  }
  countDown(){
    this.timer && clearTimeout(this.timer); 
    this.timer2 && clearTimeout(this.timer2); 
     this.timer = setInterval(  
      () => {
        if(this.state.countDownTime>0){
          this.setState({countDownTime:this.state.countDownTime-1});
        }
        else{
          this.timer && clearTimeout(this.timer); 
          console.log(result.next.delayTimeInterval);
          if(!this.state.stop)
          {
            this.setState({updating:true});
            this.timer2 = setTimeout(()=>{this.getDateFormServer()},20*1000);
          }
        }
      },  
      1000  
    );    
  }
  inputSucc(input,num){
    let touzhu = input;
        if(touzhu==undefined||touzhu=='')
      return false;
    touzhu = touzhu.split('..');
    if(touzhu.length == num)
    {
      for (let i = 0; i < touzhu.length; i++) {
        touzhu[i]=Number.parseInt(touzhu[i]);
        if(!touzhu[i])
          return false;
      }
      this.setState({touzhu:touzhu});
      return true;
    }else
    {
      return false;
    }

  }
  inputResultSucc(input,num){
    let touzhu = input;
        if(touzhu==undefined||touzhu=='')
      return false;
    touzhu = touzhu.split('..');
    if(touzhu.length == num)
    {
      for (let i = 0; i < touzhu.length; i++) {
        touzhu[i]=Number.parseInt(touzhu[i]);
        if(!touzhu[i])
          return false;
      }
      return true;
    }else
    {
      return false;
    }

  }     
  _gotoWork(){
    let tempShow=[],tempShowQiu=[];
    if(global.peilv==0)
    {
      alert('请先设置赔率！');
      return ;      
    }
    if(global.jiner==undefined||global.jiner==''||!this.inputSucc(global.jiner,7))
    {
      alert('请按格式输入！');
      return ;
    }

    if(!this.state.showing)
    {
      backupDx=[];backupDs=[];backupWdx=[];backupHs=[];
      for(let i=0;i<8;i++)
      {
        var dx = this.geOneArrayFrom(this.state.daxiao);
       // backupDx.push(dx);
        //var daxiao = this.removeItem(this.state.daxiao,dx);
        var ds = this.geOneArrayFrom(this.state.danshuang);
       // backupDs.push(ds);
       // var danshuang = this.removeItem(this.state.danshuang,ds);
        var wdx = this.geOneArrayFrom(this.state.weidaxiao);
       // backupWdx.push(wdx);
        //var weidaxiao = this.removeItem(this.state.weidaxiao,wdx);
        var hs = this.geOneArrayFrom(this.state.heshu);
       // backupHs.push(hs);
       // var heshu = this.removeItem(this.state.heshu,hs);
        var qiu = {dx:dx,ds:ds,wdx:wdx,hs:hs};
        var showqiu = {dx:true,ds:true,wdx:true,hs:true};
        tempShow[i]=qiu;
        showQiuORNot[i]=showqiu;
        // this.setState({
        //   daxiao:daxiao,
        //   danshuang:danshuang,
        //   weidaxiao:weidaxiao,
        //   heshu:heshu
        // });
      }
      //LastWin=showQiuORNot.slice();
      this.setState({
        show:tempShow,
        showing:true,
        stop:false,
        showQiuORNot:showQiuORNot
      });
    }
  }
  _gotoResult(){
    if(!this.inputResultSucc(this.state.jieguo,8))
    {
      alert('请按格式输入！');
      return ;
    }
    this.state.jieguoqishu=this.state.serverResult.next.period;
    let jieguo = this.state.jieguo;
    jieguo = jieguo.replace(/\.\./g,',');
    this.award(jieguo);

  }
  _gotoStop(){

    this.state.stop = true;
    let show = this.state.show;
    for(let i=0;i<8;i++)
    {
      if(LastWin[i]['dx']==false)
        show[i]['dx']=[undefined];
      if(LastWin[i]['ds']==false)
        show[i]['ds']=[undefined];
      if(LastWin[i]['wdx']==false)
        show[i]['wdx']=[undefined];
      if(LastWin[i]['hs']==false)
        show[i]['hs']=[undefined];      
    }
    this.setState({
      showing:false,
      show:show
    });
    Alert.alert("开始结束！");
  }
  _gotoSet(){

    global.peilv = Number.parseFloat(this.state.peilv);
    alert("赔率设置成功");


  }
  prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }
  makeItems(){
    let items=[];
    let item;
    for(let i = 0;i<8;i++)
    {
      let show = this.state.show;
      let xiazhu = this.state.touzhu;
      let dx=[],ds=[],wdx=[],hs=[];
      if(show.length>0)
      {
         dx = show[i]['dx'];
         ds = show[i]['ds'];
         wdx = show[i]['wdx'];
         hs = show[i]['hs'];
      }
      item = (
          <View style={styles.inText} key={i}>
            <View style={styles.inText2}>
              <Text style={[styles.Text2]}>第{i+1}球</Text>
            </View>
            <View style={styles.inText2}>
              <Text style={styles.Text}>大小</Text>
              <Text style={[styles.Text3,dx[0]==1?{color:'red'}:{}]}>{dx[0]==undefined?null:(dx[0]==1?'大':'小')}{dx[0]==undefined?null:'('+xiazhu[7-dx.length]+')'}</Text>
            </View>
            <View style={styles.inText2}>
              <Text style={styles.Text}>单双</Text>
              <Text style={[styles.Text3,ds[0]==1?{color:'red'}:{}]}>{ds[0]==undefined?null:(ds[0]==1?'单':'双')}{ds[0]==undefined?null:'('+xiazhu[7-ds.length]+')'}</Text>
            </View>
            <View style={styles.inText2}>
              <Text style={styles.Text}>尾大小</Text>
              <Text style={[styles.Text3,wdx[0]==1?{color:'red'}:{}]}>{wdx[0]==undefined?null:(wdx[0]==1?'尾大':'尾小')}{wdx[0]==undefined?null:'('+xiazhu[7-wdx.length]+')'}</Text>
            </View>
            <View style={styles.inText2}>
              <Text style={styles.Text}>合数</Text>
              <Text style={[styles.Text3,hs[0]==1?{color:'red'}:{}]}>{hs[0]==undefined?null:(hs[0]==1?'合单':'合双')}{hs[0]==undefined?null:'('+xiazhu[7-hs.length]+')'}</Text>
            </View>
          </View>  );         
      items.push(item);
        
    }
    return items;
  }
  makeText(){
    let items=[];
    for(let i=0;i<awardInfo.length;i++){
      items.push(
        <Text style={{fontSize:18,marginTop:3}} key={'text'+i}>{awardInfo[i]}</Text>
        );
    }
    return items;
  }
  dateFarmot(time)
  {
      let Time = new Date(time);
      let day = this.prefixInteger(Time.getDate(),2);
      let month = Time.getMonth()+1;
      let year = Time.getFullYear();
      let hours = Time.getHours();
      let minutes = Time.getMinutes();
      let seconds = Time.getSeconds();
      Time = year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds; 
      return Time;   
  }
  render(){
    let time,awardTime,currentAwardTime,currentPerioDate,awardNumbers,nextAwardTime;
    if(this.state.serverResult.time)
    {
      time = this.dateFarmot(this.state.serverResult.time);
      awardTime = (this.state.serverResult.current.awardTime);
      currentAwardTime = this.state.serverResult.current.awardTime;
      currentPerioDate = this.state.serverResult.current.period;
      awardNumbers = this.state.serverResult.current.awardNumbers;
      nextAwardTime = this.state.serverResult.next.awardTime;
    }

    return(
      <View style={styles.container}>
        <View style={styles.result}>
             <Button
              color="#798BDA"   
              onPress={() => this.refreshDate()}
              label="刷新结果"
            />       
          <Text style={styles.inRText}>本次数据获取时服务器时间：{time}</Text>
          <View style = {{flexDirection:'row'}}>     
          <Text style={styles.inRText}>第{currentPerioDate}期结果：</Text>
          <Text style={[{fontSize:23,paddingTop:5,color:"#ff0000"}]}>{awardNumbers}</Text>
            <View style={{marginLeft:20}}>
            <Button
              color="#798BDA"   
              onPress={() => this.gotoAward(awardNumbers)}
              label="确认结果"
            />
            </View>        
          <Text style={styles.inRText}>  开奖时间是{awardTime}</Text>
          
          </View>
          <Text style={styles.inRText}>下次开奖时间：{nextAwardTime}   距离开奖还有{this.state.countDownTime}秒  {this.state.updating?'数据获取中':''}{this.state.stop?'停止':''}</Text>
        </View>
        <View style={styles.container2}>
          <Text style={styles.textContent}>赔率:           
          </Text>
            <TextInput style={styles.style_user_input1}
              placeholder='1'
              numberOfLines={1}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign='center'
              keyboardType={'numbers-and-punctuation'}
              defaultValue={global.peilv?global.peilv+'':null}
              onChangeText={(peilv) => {this.setState({peilv});global.peilv=peilv}}/> 
              <Text>    </Text>
            <Button
              color="#798BDA"   
              onPress={() => this._gotoSet()}
              label="设置"
            />
            <Text>    </Text>            
          <Text style={styles.textContent}>投注金额:           
          </Text>
            <TextInput style={styles.style_user_input}
              placeholder='1..2..3..4..5..6..7'
              numberOfLines={1}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign='center'
              keyboardType={'numbers-and-punctuation'}
              defaultValue={global.jiner}
              onChangeText={(jiner) => {this.setState({jiner});global.jiner = jiner}}/> 
              <Text>         </Text>
          <Button
              color="#798BDA"   
              onPress={() => this._gotoWork()}
              label="开始"
            />
            <Text>         </Text>
          <Button
              color="#798BDA"   
              onPress={() => this._gotoStop()}
              label="结束"
            />                    
        </View>
        <View style = {{flex:1}}>
          <Text style={{width:300,height:30}}>第1期</Text>
          <View style={styles.Excel}>
            {this.makeItems()} 
          </View>
          <View style = {{marginTop:88,flexDirection:'row'}}>
          <Text style = {{fontSize:20}}>总输赢金额:</Text>
          <Text style = {{fontSize:20,color:global.win>0?"#ff0000":"#00ff00"}}>{(global.win).toFixed(1)}</Text>
          </View>
          <ScrollView style={{flex:1,marginTop:15}}>
          {this.makeText()}
          </ScrollView>          
          <View style={styles.container2}> 
            <Text style={styles.textContent}>手动输入结果:           
            </Text>
              <TextInput style={styles.style_user_input}
                placeholder='1..2..3..4..5..6..7..8'
                numberOfLines={1}
                autoFocus={false}
                underlineColorAndroid={'transparent'}
                textAlign='center'
                keyboardType={'numbers-and-punctuation'}          
                onChangeText={(jieguo) => this.setState({jieguo})}/> 
                <Text>         </Text>
            <Button
                color="#798BDA"   
                onPress={() => this._gotoResult()}
                label="确定"
              />
            </View>                  
        </View>                            
      </View> 
    );
  }  

}

var styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop:64,
  },
  container2:{
    flexDirection:'row',
    marginTop:10,
    height:80

  },
  result:{
    flexDirection:'column',
    marginTop:10,
    height:110
  },
  textContent:{
    fontSize:20,
    lineHeight:32,
    height:44
  },
  style_user_input:{
    backgroundColor:'#f0f0f0',
    height:30,
    width:280
  },
  style_user_input1:{
    backgroundColor:'#f0f0f0',
    height:30,
    width:50
  },  
  button: {
    width: 60,
    height:30,
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
   buttonLabel: {
    color: '#fff',
  },
  Excel:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'flex-start',
    paddingTop:0,
  },
  inRText: {
    alignItems:'center',
    flexWrap:'wrap',
    paddingTop:10,
    marginLeft:30
  },
  inText: {
    flexDirection:'column',
    alignItems:'center',
    flexWrap:'wrap',
    paddingTop:0,
    paddingBottom:30,
    marginLeft:10
  },
  inText2: {
    flexDirection:'row',
    alignItems:'center',
    flexWrap:'wrap',
    paddingTop:0,
    paddingBottom:0,
    marginLeft:10
  },
  Text: {
    fontSize:14,
    textAlign:"center",
    backgroundColor:'#fff',
    borderColor:'#D4D4D4',
    borderWidth:0.5,
    paddingVertical:3,
    paddingHorizontal:5,
    width:60,
    height:30
  },
  Text3: {
    fontSize:14,
    textAlign:"center",
    backgroundColor:'#fff',
    borderColor:'#D4D4D4',
    borderWidth:0.5,
    paddingVertical:3,
    paddingHorizontal:5,
    width:100,
    height:30
  },
  Text2: {
    fontSize:18,
    textAlign:"center",
    backgroundColor:'#fff',
    borderColor:'#D4D4D4',
    borderWidth:0.5,
    paddingVertical:3,
    paddingHorizontal:5,
    width:160,
    height:30
  },
});
module.exports = luckfram;