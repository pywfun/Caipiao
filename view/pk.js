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
//var url = "http://www.1396p.com/xync/ajax?ajaxhandler=getxyncawarddata";
var url ="http://www.1396p.com/pk10/ajax?ajaxhandler=getpk10awarddata";
//http://www.1396p.com/shishicai/ajax?ajaxhandler=getcqsscawarddata
var backupDx=[],backupDs=[],backupWdx=[],backupHs=[];
var result , countDownTime ;
var awardInfo =[];
var showQiuORNot=[],LastWin=[],ZCOrN = [], NShow = [];
var awardResult=[],beforeAward=[];
var QIUNUMBER=10;
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

class pk extends Component{

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
      backupShow:[],
      xintouzhu:[],
      yiqianjieguo:'',
    };
  }
  componentDidMount() {
    this.getDateFormServer();

  }
  NGetArray(arr,times){
    let length ,useArry, select;
    let items=new Array(),result=new Array();
    for(let i=0;i<times;i++)
    {
      length = arr.length ;
      useArry = Math.ceil(Math.random()*length);
      select = (arr)[useArry-1];
      (arr).splice(useArry-1,1);
      items.push(select);
    }

    for(let j=0;j<global.shoucicishu;j++)
    {
      length = items.length ;
      useArry = Math.ceil(Math.random()*length);
      select = (items)[useArry-1];
      (items).splice(useArry-1,1); 
      result.push(select);     
    }
    //let newArry = this.removeItem(arr,arr[useArry]);
    return result;
  }   
  geOneArray(){
    let length = (global.jiangchi).length ;
    if(length==0)
    {
      global.jiangchi = (global.jiangchiBackup).slice();
      global.jiangchiBackup=[];
      length = (global.jiangchi).length ;
    }
    let useArry = Math.ceil(Math.random()*length);
    let select = (global.jiangchi)[useArry-1];
    (global.jiangchi).splice(useArry-1,1);
    //let newArry = this.removeItem(arr,arr[useArry]);
    return select;
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
          if(result==undefined||result==null||responseData.current.periodNumber===result.current.periodNumber)
            result = responseData;
          else{
            result = responseData;
            this.setState({updating:false});
           // alert("结果更新");
           this.state.serverResult = responseData;
           // if(result.current.periodNumber!=this.state.jieguoqishu)
             // this.award(result.current.awardNumbers);
          }
          countDownTime = result.next.awardTimeInterval/1000;
          this.setState({
            serverResult: responseData,
            countDownTime:Number.parseInt(countDownTime),
            jieguoqishu:result.current.periodNumber,
          });
          this.countDown();
        })
        .done();    
  }
    prefix(num, val) {
      return (new Array(num).join('0') + val).slice(-num);
  }  
  makeNshowArray()
  {
    let Max=Math.pow(2,global.bhpushu); 
    let result = new Array();
    var temp = [0,0,0,0,0,0,0];
    for(let i=0;i<Max;i++)
    {
      let num = this.prefix(global.bhpushu,i.toString(2));
      temp = num.split("");
      result.push(temp);     
    }

    if(global.bhpushu>7){
      return this.NGetArray(result,60);
    }
    else
       return this.NGetArray(result,30);   
  }  
  refreshDate(){
    this.timer && clearTimeout(this.timer); 
    this.timer2 && clearTimeout(this.timer2); 
    this.getDateFormServer();  
  }
  makeTRUEArray()
  {
    let temp=[];
    for(let i=0;i<QIUNUMBER;i++)
    {
      if(i<QIUNUMBER/2)
        temp[i]={dx:true,ds:true,hs:true};
      else
        temp[i]={dx:true,ds:true};
    }
    return temp;
  }
  gotoAward(awardNumbers){
    if(true)
    {
      if(this.state.qishu=='1'||this.state.qishu!=this.state.serverResult.current.periodNumber)
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
    this.state.qishu = this.state.serverResult.current.periodNumber;    
    let tempShow=new Array();
    let award = awardNumbers;
    let localAward = (this.state.show).slice();
    let daxiaoA,danshuangA,heshuA;
    let ndx = new Array(),nds= new Array(),nhs= new Array();
    award = award.split(',');
    let ying=0,xiadan=0;
    let newDx,newDs,newWdx,newHs;
    if(localAward.length==0)
    {
      Alert.alert("请先开始");
      return;
    }      
    if(!this.state.stop)
      tempShow = this.makeTRUEArray();
    else
      tempShow = LastWin.slice();
    for(let p=0;p<QIUNUMBER;p++)
    {
      award[p] = Number.parseInt(award[p]);
    }
    awardResult.push(award);
    awardResult.splice(0,1);
    this.clcBResult();    
    for(let i=0;i<QIUNUMBER;i++)
    {
      ndx =(localAward[i]['dx']).slice();
      nds = (localAward[i]['ds']).slice();


      let awardNum = Number.parseInt(award[i]);
      let awardNum2 = Number.parseInt(award[QIUNUMBER-i-1]);
      let dx = awardNum<=5?0:1;
      let ds = awardNum%2==1?1:0;
      let hs;
      if(i<QIUNUMBER/2)
      {
          nhs = (localAward[i]['hs']).slice();
          hs=awardNum>awardNum2?1:0;
      }
      let info = '第'+this.state.serverResult.current.periodNumber+'期第'+(i+1)+'名:';
      let zhong1="",zhong2="",zhong3="",zhong4="";      
      newDx = NShow[i]['dx'];
      newDs = NShow[i]['ds'];
      newHs = NShow[i]['hs'];   

      if(ZCOrN[i]['dx']===0)
      {
          let tempArry = newDx;
          let sumArray = this.sumArray(tempArry);
          let bencixiadn = Math.abs(sumArray)*this.state.xintouzhu[global.bhpushu-(tempArry[0]).length];

          xiadan += bencixiadn;
          if((sumArray>0&&dx==1)||(sumArray<0&&dx==0)||(sumArray==0))//买
          {
            ying +=  bencixiadn*global.peilv;
            zhong1 = (dx==1?'大':'小')+bencixiadn+'('+Math.abs(sumArray)+'X'+this.state.xintouzhu[global.bhpushu-(tempArry[0]).length]+')中,  ';
          }
          else
          {
              zhong1 = (dx==0?'大':'小')+bencixiadn+'('+Math.abs(sumArray)+'X'+this.state.xintouzhu[global.bhpushu-(tempArry[0]).length]+')不中,  ';
          }
          for(let i=tempArry.length-1;i>=0;i--)
          {
            if(tempArry[i][0]==dx)
            {
              tempArry.splice(i,1);
            }
          }

          if(tempArry.length>0&&(tempArry[0]).length>1)
          {
            for(let i=0;i<tempArry.length;i++)
            {
              (tempArry[i]).splice(0,1);
            }
          }
          else  //特殊的结束
          {
            tempShow[i]['dx']=false;
            ZCOrN[i]['dx'] = 1;
            if(this.state.stop)
            {
              ndx=[undefined];
              if((this.state.backupShow[i]['dx']).length!=0)
              {
                (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
                this.state.backupShow[i]['dx']=[]; 
              } 
            }
            else if(global.zcpushu===0)
            {
              ZCOrN[i]['dx'] = 0;
              NShow[i]['dx'] = this.makeNshowArray();

            }            
            else
            {
              ndx = this.arrayAward(beforeAward[i]['dx']);
              (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
              this.state.backupShow[i]['dx'] = ndx.slice(); 
            }           
          }          
      }            
      else if(Number.parseInt(localAward[i]['dx'][0])==dx||tempShow[i]['dx']==false)
      {
          if(tempShow[i]['dx']==false&&this.state.stop)
          {
            ndx=[undefined];
            if((this.state.backupShow[i]['dx']).length!=0)
            {
              (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
              this.state.backupShow[i]['dx']=[]; 
            } 
          }
          else
          {
            zhong1 = (dx==1?'大':'小')+this.state.touzhu[global.pushu-ndx.length]+'中,   ';
            xiadan = xiadan+this.state.touzhu[global.pushu-ndx.length];
            ying +=  this.state.touzhu[global.pushu-ndx.length] * global.peilv;
            tempShow[i]['dx']=false;
            if(this.state.stop)
            {
              ndx=[undefined];
              (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
              this.state.backupShow[i]['dx']=[];  
            }
            else
            {
              ndx = this.arrayAward(beforeAward[i]['dx']);
              (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
              this.state.backupShow[i]['dx'] = ndx.slice();
            }
          }    
      }
      else
      {
        if(ndx[0]!=undefined)
        {
          xiadan = xiadan+this.state.touzhu[global.pushu-ndx.length];
          zhong1 = (dx==0?'大':'小')+this.state.touzhu[global.pushu-ndx.length]+'不中,  ';
        }
        else
        {
          tempShow[i]['dx']=false;
        }
        // if(global.pushu==ndx.length)
        //   tempShow[i]['dx']=false;  
        //let zhong =':'+(dx==0?'大':'小')+this.state.touzhu[global.pushu-ndx.length]+'不中';
        //awardInfo.push('第'+this.state.serverResult.current.periodNumber+'期第'+(i+1)+'名'+zhong);
        if((ndx).length>1)
        {
          if(ndx.length>(global.pushu - global.zcpushu)+1)
            ndx.splice(0,1);
          else
          {
            ZCOrN[i]['dx'] = 0;
            NShow[i]['dx'] = this.makeNshowArray();
          }
        }
        else{
              ndx = this.arrayAward(beforeAward[i]['dx']);
              (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
              this.state.backupShow[i]['dx'] = ndx.slice();
        }        
      }




      if(ZCOrN[i]['ds']===0)
      {
          let tempArry = newDs;
          let sumArray = this.sumArray(tempArry);
          let bencixiadn = Math.abs(sumArray)*this.state.xintouzhu[global.bhpushu-(tempArry[0]).length];

          xiadan += bencixiadn;
          if((sumArray>0&&ds==1)||(sumArray<0&&ds==0)||(sumArray==0))//买
          {
            ying +=  bencixiadn*global.peilv;
            zhong2 = (ds==1?'单':'双')+bencixiadn+'('+Math.abs(sumArray)+'X'+this.state.xintouzhu[global.bhpushu-(tempArry[0]).length]+')中,  ';
          }
          else
          {
              zhong2 = (ds==0?'单':'双')+bencixiadn+'('+Math.abs(sumArray)+'X'+this.state.xintouzhu[global.bhpushu-(tempArry[0]).length]+')不中,  ';
          }
          for(let i=tempArry.length-1;i>=0;i--)
          {
            if(tempArry[i][0]==ds)
            {
              tempArry.splice(i,1);
            }
          }

          if(tempArry.length>0&&(tempArry[0]).length>1)
          {
            for(let i=0;i<tempArry.length;i++)
            {
              (tempArry[i]).splice(0,1);
            }
          }
          else  //特殊的结束
          {
            tempShow[i]['ds']=false;
            ZCOrN[i]['ds'] = 1;
            if(this.state.stop)
            {
              nds=[undefined];
              if((this.state.backupShow[i]['ds']).length!=0)
              {
                (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());
                this.state.backupShow[i]['ds']=[]; 
              } 
            }
            else if(global.zcpushu===0)
            {
              ZCOrN[i]['ds'] = 0;
              NShow[i]['ds'] = this.makeNshowArray();

            }             
            else
            {
              nds = this.arrayAward(beforeAward[i]['ds']);
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());
              this.state.backupShow[i]['ds'] = nds.slice(); 
            }           
          }          
      }    
      else if(Number.parseInt(localAward[i]['ds'][0])==ds||tempShow[i]['ds']==false)
      {
          if(tempShow[i]['ds']==false&&this.state.stop)
          {
            nds=[undefined];
            if((this.state.backupShow[i]['ds']).length!=0)
            {
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());
              this.state.backupShow[i]['ds']=[]; 
            }  
          }
          else
          {
            //console.log('第'+(i+1)+'球大小中奖');
         //   let zhong =':中' +(ds==1?'单':'双')+this.state.touzhu[global.pushu-nds.length];
            zhong2 = (ds==1?'单':'双')+this.state.touzhu[global.pushu-nds.length]+'中,   ';
            xiadan = xiadan+this.state.touzhu[global.pushu-nds.length];
            ying +=  this.state.touzhu[global.pushu-nds.length] * global.peilv;
            tempShow[i]['ds']=false;
          //  awardInfo.push('第'+this.state.serverResult.current.periodNumber+'期第'+(i+1)+'球'+zhong);
            if(this.state.stop)
            {
              nds=[undefined];
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());  
              this.state.backupShow[i]['ds']=[]; 
            }
            else
            {
              nds = this.arrayAward(beforeAward[i]['ds']);
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());
              this.state.backupShow[i]['ds'] = nds.slice();
            }                
          }    
      }
      else
      {
        if(nds[0]!=undefined)
        {
        xiadan = xiadan+this.state.touzhu[global.pushu-nds.length];
        zhong2 = (ds==0?'单':'双')+this.state.touzhu[global.pushu-nds.length]+'不中,  ';
        }
        else
        {
          tempShow[i]['ds']=false;
        }
        // if(global.pushu==nds.length)
        //   tempShow[i]['ds']=false;  
        //  let zhong =':' +(ds==0?'单':'双')+this.state.touzhu[global.pushu-nds.length]+'不中';
        //  awardInfo.push('第'+this.state.serverResult.current.periodNumber+'期第'+(i+1)+'名'+zhong);
        if(nds.length>1)
        {
          if(nds.length>(global.pushu - global.zcpushu)+1)
            nds.splice(0,1);
          else
          {
            ZCOrN[i]['ds'] = 0;
            NShow[i]['ds'] = this.makeNshowArray();
          }
        }
        else{
              nds = this.arrayAward(beforeAward[i]['ds']);
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());
              this.state.backupShow[i]['ds'] = nds.slice(); 
        }        
      }
      if(i<QIUNUMBER/2)
      {
        if(ZCOrN[i]['hs']===0)
        {
            let tempArry = newHs;
            let sumArray = this.sumArray(tempArry);
            let bencixiadn = Math.abs(sumArray)*this.state.xintouzhu[global.bhpushu-(tempArry[0]).length];

            xiadan += bencixiadn;
            if((sumArray>0&&hs==1)||(sumArray<0&&hs==0)||(sumArray==0))//买
            {
              ying +=  bencixiadn*global.peilv;
              zhong4 = (hs==1?'龙':'虎')+bencixiadn+'('+Math.abs(sumArray)+'X'+this.state.xintouzhu[global.bhpushu-(tempArry[0]).length]+')中,  ';
            }
            else
            {
                zhong4 = (hs==0?'龙':'虎')+bencixiadn+'('+Math.abs(sumArray)+'X'+this.state.xintouzhu[global.bhpushu-(tempArry[0]).length]+')不中,  ';
            }
            for(let i=tempArry.length-1;i>=0;i--)
            {
              if(tempArry[i][0]==hs)
              {
                tempArry.splice(i,1);
              }
            }

            if(tempArry.length>0&&(tempArry[0]).length>1)
            {
              for(let i=0;i<tempArry.length;i++)
              {
                (tempArry[i]).splice(0,1);
              }
            }
            else  //特殊的结束
            {
              tempShow[i]['hs']=false;
              ZCOrN[i]['hs'] = 1;
              if(this.state.stop)
              {
                nhs=[undefined];
                if((this.state.backupShow[i]['hs']).length!=0)
                {
                  (global.jiangchiBackup).push((this.state.backupShow[i]['hs']).slice());
                  this.state.backupShow[i]['hs']=[]; 
                } 
              }
            else if(global.zcpushu===0)
            {
              ZCOrN[i]['hs'] = 0;
              NShow[i]['hs'] = this.makeNshowArray();

            }                
              else
              {
                nhs = this.arrayAward(beforeAward[i]['hs']);
                (global.jiangchiBackup).push((this.state.backupShow[i]['hs']).slice());
                this.state.backupShow[i]['hs'] = nhs.slice(); 
              }           
            }          
        }
        else if(Number.parseInt(localAward[i]['hs'][0])==hs||tempShow[i]['hs']==false)
        {
            if(tempShow[i]['hs']==false&&this.state.stop)
            {
              nhs=[undefined];
              if((this.state.backupShow[i]['hs']).length!=0)
              {
                (global.jiangchiBackup).push((this.state.backupShow[i]['hs']).slice());
                this.state.backupShow[i]['hs']=[]; 
              }              
            }
            else
            {
              zhong4 =(hs==1?'龙':'虎')+this.state.touzhu[global.pushu-nhs.length]+'中';
              xiadan = xiadan+this.state.touzhu[global.pushu-nhs.length];
              ying +=  this.state.touzhu[global.pushu-nhs.length] * global.peilv;
              tempShow[i]['hs']=false;
              if(this.state.stop)
              {
                nhs=[undefined];
                (global.jiangchiBackup).push((this.state.backupShow[i]['hs']).slice());
                this.state.backupShow[i]['hs']=[];  
              }
              else
              {
                nhs = this.arrayAward(beforeAward[i]['hs']);
                (global.jiangchiBackup).push((this.state.backupShow[i]['hs']).slice());
                this.state.backupShow[i]['hs'] = nhs.slice();
              }             
            }     
        }
        else
        {
          if(nhs[0]!=undefined)
          {
          xiadan = xiadan+this.state.touzhu[global.pushu-nhs.length];
            //let zhong =':'+(hs==0?'龙':'虎')+this.state.touzhu[global.pushu-nhs.length]+'不中';
            zhong4 =(hs==0?'龙':'虎')+this.state.touzhu[global.pushu-nhs.length]+'不中';
          }
        else
        {
          tempShow[i]['hs']=false;
        }
        // if(global.pushu==nhs.length)
        //   tempShow[i]['hs']=false;             
           // awardInfo.push('第'+this.state.serverResult.current.periodNumber+'期第'+(i+1)+'名'+zhong);        
          if(nhs.length>1)
          {
            if(nhs.length>(global.pushu - global.zcpushu)+1)
              nhs.splice(0,1);
            else
            {
              ZCOrN[i]['hs'] = 0;
              NShow[i]['hs'] = this.makeNshowArray();
            }
          }
          else{
              nhs = this.arrayAward(beforeAward[i]['hs']);
              (global.jiangchiBackup).push((this.state.backupShow[i]['hs']).slice());
              this.state.backupShow[i]['hs'] = nhs.slice();
          }        
        }
      }
      if(ndx ==undefined||nds == undefined ||nhs==undefined)
        alert('出错了');
      if(i<QIUNUMBER/2)
        localAward[i] = {dx:ndx,ds:nds,hs:nhs};
      else
        localAward[i] = {dx:ndx,ds:nds};
      // this.state.daxiao=daxiaoA;  
      // this.state.danshuang=danshuangA; 
      // this.state.weidaxiao=weidaxiaoA; 
      // this.state.heshu=heshuA; 
      awardInfo.push(info+zhong1+zhong2+zhong3+zhong4);                      
    }
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
            this.timer2 = setTimeout(()=>{this.getDateFormServer()},12*1000);
          }
        }
      },  
      1000  
    );    
  }
  inputSucc2(input,num){
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
      this.setState({xintouzhu:touzhu});
      return true;
    }else
    {
      return false;
    }

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
  clcBResult(){
    let dxA=[],dsA=[],wdxA=[],hsA=[];
    beforeAward = [];
    for(let i=0;i<QIUNUMBER;i++)
    {
      dxA=[];dsA=[];wdxA=[];hsA=[];
      for(let j=0;j<global.pushu;j++)
      {
        let awardNum = awardResult[j][i];
        let awardNum2 = awardResult[j][QIUNUMBER-i-1];//Number.parseInt(award[QIUNUMBER-i-1]);
        let dx = awardNum<=5?0:1;
        let ds = awardNum%2==1?1:0;
        let hs;
        if(i<QIUNUMBER/2)
        {
            hs=awardNum>awardNum2?1:0;
            hsA.push(hs);
        }
        dxA.push(dx);dsA.push(ds);
      }
      let temp =[];
      if(i<QIUNUMBER/2)
         temp = {dx:dxA,ds:dsA,hs:hsA};
      else
         temp = {dx:dxA,ds:dsA};
      beforeAward.push(temp);  
    }
  }
  arrayAward(arr){
    for(let i=0;i<(global.base).length;i++)
    {
      if((global.base)[i].toString()===arr.toString())
        return (global.baseAward)[i];
    }
    return [undefined];
  }      
  _gotoWork(){
    let tempShow=[],tempShowQiu=[],backupShow=[];
    if(global.peilv==0)
    {
      alert('请先设置赔率！');
      return ;      
    }
    if(global.jiner==undefined||global.jiner==''||!this.inputSucc(global.jiner,global.pushu))
    {
      alert('请按格式输入！');
      return ;
    }
    if(awardResult.length<7)
    {
       alert('请先输入前7扑结果！');
      return ;     
    }
    this.inputSucc2(global.xinjiner,global.bhpushu);
    if(!this.state.showing)
    {
      backupDx=[];backupDs=[];backupHs=[];ZCOrN=[],NShow=[];
      this.clcBResult();
      for(let i=0;i<QIUNUMBER;i++)
      {
        let dx = this.arrayAward(beforeAward[i]['dx']);
       // backupDx.push(dx);
        //var daxiao = this.removeItem(this.state.daxiao,dx);
        let ds = this.arrayAward(beforeAward[i]['ds']);
       // backupDs.push(ds);
       // var danshuang = this.removeItem(this.state.danshuang,ds);
        //var wdx = this.geOneArrayFrom(this.state.weidaxiao);
       // backupWdx.push(wdx);
        //var weidaxiao = this.removeItem(this.state.weidaxiao,wdx);

       // backupHs.push(hs);
       // var heshu = this.removeItem(this.state.heshu,hs);
        var qiu,backupQiu; 
        var showqiu; 
        if(i<QIUNUMBER/2)
        {
          let hs = this.arrayAward(beforeAward[i]['hs']);
          qiu = {dx:dx,ds:ds,hs:hs};
          backupQiu = {dx:dx,ds:ds,hs:hs};
          showqiu = {dx:true,ds:true,hs:true};
            if(global.zcpushu===0)
          {
            ZCOrN[i]={dx:0,ds:0,hs:0};
            NShow[i]={dx:this.makeNshowArray(),ds:this.makeNshowArray(),hs:this.makeNshowArray()};
          }
          else
          {
              ZCOrN[i]={dx:1,ds:1,hs:1};
              NShow[i]={dx:[],ds:[],hs:[]};
          }          
        }
        else
        {
          qiu = {dx:dx,ds:ds};
          backupQiu = {dx:dx,ds:ds};
          showqiu = {dx:true,ds:true};  
            if(global.zcpushu===0)
          {
            ZCOrN[i]={dx:0,ds:0};
            NShow[i]={dx:this.makeNshowArray(),ds:this.makeNshowArray()};
          }
          else
          {
              ZCOrN[i]={dx:1,ds:1};
              NShow[i]={dx:[],ds:[]};
          }       
        }
        tempShow[i]=qiu;
        backupShow[i]=backupQiu;
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
        backupShow:backupShow,
        showing:true,
        stop:false,
        showQiuORNot:showQiuORNot
      });
    }
  }
  _setResult(){
    if(!this.inputResultSucc(this.state.yiqianjieguo,QIUNUMBER))
    {
      alert('请按格式输入！');
      return ;
    }
    let result = (this.state.yiqianjieguo).split('..');
    for(let i=0;i<result.length;i++)
    {
      result[i]=Number.parseInt(result[i]);
    }
    awardResult.push(result);
    this.setState({yiqianjieguo:''});


  }  
  _gotoResult(){
    if(!this.inputResultSucc(this.state.jieguo,QIUNUMBER))
    {
      alert('请按格式输入！');
      return ;
    }
    this.state.jieguoqishu=this.state.serverResult.next.periodNumber;
    let jieguo = this.state.jieguo;
    jieguo = jieguo.replace(/\.\./g,',');
    this.award(jieguo);

  }
  _gotoStop(){

    this.state.stop = true;
    let show = this.state.show;
    for(let i=0;i<QIUNUMBER;i++)
    {
      if(LastWin[i]['dx']==false)
        show[i]['dx']=[undefined];
      if(LastWin[i]['ds']==false)
        show[i]['ds']=[undefined];
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
  showArray(i,text)
  {
    let backupShow = this.state.backupShow;
   if(ZCOrN[i][text]==0)
    {
      let sumArrayShow = NShow[i][text];
      sumArrayShow = sumArrayShow.join("\n");
      if(text=='dx')
      {
        sumArrayShow = (sumArrayShow).replace(new RegExp(/(0)/g),'小');
        sumArrayShow = (sumArrayShow).replace(new RegExp(/(1)/g),'大');
      }
      else if(text=='ds')
      {
        sumArrayShow = (sumArrayShow).replace(new RegExp(/(0)/g),'双');
        sumArrayShow = (sumArrayShow).replace(new RegExp(/(1)/g),'单');
      }
      else if(text=='hs')
      {
        sumArrayShow = (sumArrayShow).replace(new RegExp(/(0)/g),'龙');
        sumArrayShow = (sumArrayShow).replace(new RegExp(/(1)/g),'虎');
      }       
      Alert.alert(sumArrayShow);
    }
    else    
      if((backupShow).length>0)
      {
        backupShow = backupShow[i];
        if(text=='dx')
        {
          backupShow = (backupShow[text]).join("-");
          backupShow = (backupShow).replace(new RegExp(/(0)/g),'小');
          backupShow = (backupShow).replace(new RegExp(/(1)/g),'大');
        }
        else if(text=='ds')
        {
          backupShow = (backupShow[text]).join("-");
          backupShow = (backupShow).replace(new RegExp(/(0)/g),'双');
          backupShow = (backupShow).replace(new RegExp(/(1)/g),'单');
        }
        else if(text=='hs')
        {
          backupShow = (backupShow[text]).join("-");
          backupShow = (backupShow).replace(new RegExp(/(0)/g),'虎');
          backupShow = (backupShow).replace(new RegExp(/(1)/g),'龙');
        }            
        Alert.alert(backupShow);
      }
  }
  sumArray(arr)
  {
    let one=0,zore=0;
    for(let i=0;i<arr.length;i++)
    {
      if(arr[i][0]==1)
        one++;
      else
        zore++;
    }

    return one - zore;
  }    
  makeItems(){
    let items=[];
    let item;
    for(let i = 0;i<QIUNUMBER;i++)
    {
      let show = this.state.show;
      let xiazhu = this.state.touzhu;
      let xinxiazhu = this.state.xintouzhu;
      let dx=[],ds=[],hs=[];
      let newDx,newDs,newHs;
      if(show.length>0)
      {
         dx = show[i]['dx'];
         ds = show[i]['ds'];
         hs = show[i]['hs'];
      }
      if(NShow.length>0)
      {
        newDx = NShow[i]['dx'];
        newDs = NShow[i]['ds'];
        newHs = NShow[i]['hs'];
      }
      if(i<QIUNUMBER/2)
      item = (
          <View style={styles.inText} key={i}>
            <View style={styles.inText3}>
              <Text style={[styles.Text2]}>第{i+1}名</Text>
            </View>
            <View style={styles.inText2}>
              <TouchableOpacity onPress={()=>this.showArray(i,'dx')}>
              <View style={styles.Text}><Text>大小</Text></View>
              </TouchableOpacity>
              <View style={[styles.Text3]}>{ZCOrN[i]===undefined?null:ZCOrN[i]['dx']==1?<Text style={[styles.RText,dx[0]==1?{color:'red'}:{}]}>{dx[0]==undefined?null:(dx[0]==1?'大':'小')}{dx[0]==undefined?null:'('+xiazhu[global.pushu-dx.length]+')'}</Text>:
              <Text style={[styles.RText,this.sumArray(newDx)>0?{color:'red'}:{}]}>{this.sumArray(newDx)==0?null:this.sumArray(newDx)>0?'大':'小'}{'('+Math.abs(this.sumArray(newDx))*xinxiazhu[global.bhpushu-(newDx[0]).length]+')'}</Text>}</View>
            </View>
            <View style={styles.inText2}>
            <TouchableOpacity onPress={()=>this.showArray(i,'ds')}>
              <View style={styles.Text}><Text>单双</Text></View>
            </TouchableOpacity>  
              <View style={[styles.Text3]}>{ZCOrN[i]===undefined?null:ZCOrN[i]['ds']==1?<Text style={[styles.RText,ds[0]==1?{color:'red'}:{}]}>{ds[0]==undefined?null:(ds[0]==1?'单':'双')}{ds[0]==undefined?null:'('+xiazhu[global.pushu-ds.length]+')'}</Text>:
              <Text style={[styles.RText,this.sumArray(newDs)>0?{color:'red'}:{}]}>{this.sumArray(newDs)==0?null:this.sumArray(newDs)>0?'单':'双'}{'('+Math.abs(this.sumArray(newDs))*xinxiazhu[global.bhpushu-(newDs[0]).length]+')'}</Text>}</View>
            </View>
            <View style={styles.inText2}>
            <TouchableOpacity onPress={()=>this.showArray(i,'hs')}>
              <View style={styles.Text}><Text>龙虎</Text></View>
              </TouchableOpacity>
              <View style={[styles.Text3]}>{ZCOrN[i]===undefined?null:ZCOrN[i]['hs']==1?<Text style={[styles.RText,hs[0]==1?{color:'red'}:{}]}>{hs[0]==undefined?null:(hs[0]==1?'龙':'虎')}{hs[0]==undefined?null:'('+xiazhu[global.pushu-hs.length]+')'}</Text>:
              <Text style={[styles.RText,this.sumArray(newHs)>0?{color:'red'}:{}]}>{this.sumArray(newHs)==0?null:this.sumArray(newHs)>0?'龙':'虎'}{'('+Math.abs(this.sumArray(newHs))*xinxiazhu[global.bhpushu-(newHs[0]).length]+')'}</Text>}</View>
          </View>
          </View>  );       
      else
      {
        item = (
          <View style={styles.inText} key={i}>
            <View style={styles.inText3}>
              <Text style={[styles.Text2]}>第{i+1}名</Text>
            </View>
            <View style={styles.inText2}>
              <TouchableOpacity onPress={()=>this.showArray(i,'dx')}>
              <View style={styles.Text}><Text>大小</Text></View>
              </TouchableOpacity>
              <View style={[styles.Text3]}>{ZCOrN[i]===undefined?null:ZCOrN[i]['dx']==1?<Text style={[styles.RText,dx[0]==1?{color:'red'}:{}]}>{dx[0]==undefined?null:(dx[0]==1?'大':'小')}{dx[0]==undefined?null:'('+xiazhu[global.pushu-dx.length]+')'}</Text>:
              <Text style={[styles.RText,this.sumArray(newDx)>0?{color:'red'}:{}]}>{this.sumArray(newDx)==0?null:this.sumArray(newDx)>0?'大':'小'}{'('+Math.abs(this.sumArray(newDx))*xinxiazhu[global.bhpushu-(newDx[0]).length]+')'}</Text>}</View>
            </View>
            <View style={styles.inText2}>
            <TouchableOpacity onPress={()=>this.showArray(i,'ds')}>
              <View style={styles.Text}><Text>单双</Text></View>
            </TouchableOpacity>  
              <View style={[styles.Text3]}>{ZCOrN[i]===undefined?null:ZCOrN[i]['ds']==1?<Text style={[styles.RText,ds[0]==1?{color:'red'}:{}]}>{ds[0]==undefined?null:(ds[0]==1?'单':'双')}{ds[0]==undefined?null:'('+xiazhu[global.pushu-ds.length]+')'}</Text>:
              <Text style={[styles.RText,this.sumArray(newDs)>0?{color:'red'}:{}]}>{this.sumArray(newDs)==0?null:this.sumArray(newDs)>0?'单':'双'}{'('+Math.abs(this.sumArray(newDs))*xinxiazhu[global.bhpushu-(newDs[0]).length]+')'}</Text>}</View>
            </View>
            </View>);        
      }               
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
      currentPerioDate = this.state.serverResult.current.periodNumber;
      awardNumbers = this.state.serverResult.current.awardNumbers;
      nextAwardTime = this.state.serverResult.next.awardTime;
    }

    return(
      <View style={styles.container}>
        <View style={styles.result}>
        <View style={{flexDirection:'row'}}>
             <Button
              color="#798BDA"   
              onPress={() => this.refreshDate()}
              label="刷新结果"
            />
          <Text>          扑数:{global.pushu}     第 {global.zcpushu} 扑开始分散下注   首次分成 {global.shoucicishu} 次   每次 {global.bhpushu} 扑        
          </Text>
        </View>      
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
              editable={false} 
              keyboardType={'numbers-and-punctuation'}
              defaultValue={global.peilv?global.peilv+'':null}
              onChangeText={(peilv) => {this.setState({peilv});global.peilv=peilv}}/> 
              <Text>    </Text>
            <Text>    </Text>            
          <Text style={styles.textContent}>投注金额:           
          </Text>
            <TextInput style={styles.style_user_input}
              placeholder='1..2..3..4..与扑数相同'
              numberOfLines={1}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign='center'
              editable={false} 
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
        <Text style={styles.textContent}>     分多次后新的金额是：{global.xinjiner}    </Text>
        <View style = {{flex:1}}>
          <Text style={{width:300,height:30}}>第1期</Text>
          <View style={styles.Excel}>
            {this.makeItems()} 
          </View>
          <View style = {{marginTop:0,flexDirection:'row'}}>
          <Text style = {{fontSize:20}}>总输赢金额:</Text>
          <Text style = {{fontSize:20,color:global.win>0?"#ff0000":"#00ff00"}}>{(global.win).toFixed(1)}</Text>
          </View>
          <ScrollView style={{flex:1,marginTop:15}}>
          {this.makeText()}
          </ScrollView>          
          { awardResult.length<7?         
          <View style={styles.container3}> 
            <Text style={styles.textContent}>手动输入前7扑结果(已有{awardResult.length}):          
            </Text>
              <TextInput style={styles.style_user_input}
                placeholder='1..2..3..4..5..6..7..8..9..10'
                numberOfLines={1}
                autoFocus={false}
                underlineColorAndroid={'transparent'}
                textAlign='center'
                keyboardType={'numbers-and-punctuation'}          
                defaultValue={this.state.yiqianjieguo}          
                onChangeText={(yiqianjieguo) => this.setState({yiqianjieguo})}/> 
                <Text>         </Text>
            <Button
                color="#798BDA"   
                onPress={() => this._setResult()}
                label="确定"
              />
            </View>:null  
            }                  
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
    height:40

  },
  container3:{
    flexDirection:'row',
    marginBottom:80,
    height:40

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
    paddingBottom:0,
    marginLeft:20,
    height:160,
    width:130,
  },
  inText2: {
    flexDirection:'row',
    alignItems:'center',
    paddingTop:0,
    paddingBottom:0,
    height:40,
    justifyContent:"center"
  },
  inText3: {
    flexDirection:'row',
    alignItems:'center',
    paddingTop:0,
    paddingBottom:0,
    height:20
  },  
  Text: {
    backgroundColor:'#fff',
    borderColor:'#D4D4D4',
    borderWidth:0.5,
    paddingVertical:3,
    paddingHorizontal:5,
    width:40,
    height:40,
    justifyContent:"center",
    alignItems:'center',
  },
  Text3: {
    backgroundColor:'#fff',
    borderColor:'#D4D4D4',
    borderWidth:0.5,
    paddingVertical:3,
    paddingHorizontal:5,
    width:90,
    height:40,
    justifyContent:"center",
    alignItems:'center',
  },
  Text2: {
    fontSize:18,
    textAlign:"center",
    backgroundColor:'#fff',
    borderColor:'#D4D4D4',
    borderWidth:0.5,
    paddingVertical:3,
    paddingHorizontal:5,
    width:130,
  },
  RText: {
    fontSize:14,
    textAlign:"center",
  }, 
});
module.exports = pk;