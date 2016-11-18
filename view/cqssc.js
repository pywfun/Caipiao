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
//var url ="http://www.1396p.com/pk10/ajax?ajaxhandler=getpk10awarddata";
var url="http://www.1396p.com/shishicai/ajax?ajaxhandler=getcqsscawarddata";
var backupDx=[],backupDs=[],backupWdx=[],backupHs=[];
var result , countDownTime ;
var awardInfo =[];
var showQiuORNot=[],LastWin=[];
var QIUNUMBER=5;
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

class cqssc extends Component{

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
    };
  }
  componentDidMount() {
 
    this.getDateFormServer();

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
          if(result==undefined||result==null||responseData.current.periodDate===result.current.periodDate)
            result = responseData;
          else{
            result = responseData;
            this.setState({updating:false});
           // alert("结果更新");
           this.state.serverResult = responseData;
            //if(result.current.periodDate!=this.state.jieguoqishu)
              //this.award(result.current.awardNumbers);
          }
          countDownTime = result.next.awardTimeInterval/1000;
          this.setState({
            serverResult: responseData,
            countDownTime:Number.parseInt(countDownTime),
            jieguoqishu:result.current.periodDate,
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
    for(let i=0;i<QIUNUMBER+1;i++)
    {
        temp[i]={dx:true,ds:true};
    }
    return temp;
  }
  getAwardSum(awardNumbers)
  {
    let award = awardNumbers;
    let sum=0;
    for(let i=0;i<award.length;i++)
    {
      sum+=Number.parseInt(award[i]);
    }
    return sum;
  }
  gotoAward(awardNumbers){
    if(true)
    {
      if(this.state.qishu=='1'||this.state.qishu!=this.state.serverResult.current.periodDate)
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
    this.state.qishu = this.state.serverResult.current.periodDate; 
    let tempShow=new Array();
    let award = awardNumbers;
    let localAward = (this.state.show).slice();
    let daxiaoA,danshuangA,heshuA;
    let ndx = new Array(),nds= new Array();
    award = award.split(',');
    let awardSum = this.getAwardSum(award);
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
    for(let i=0;i<QIUNUMBER+1;i++)
    {
      ndx =(localAward[i]['dx']).slice();
      nds = (localAward[i]['ds']).slice();

      let info = '第'+this.state.serverResult.current.periodDate+'期第'+(i+1)+'球:';
      let zhong1="",zhong2="",zhong3="",zhong4="";

      let awardNum = Number.parseInt(award[i]);
      let dx = awardNum<=4?0:1;
      let ds = awardNum%2==1?1:0;
      if(i==QIUNUMBER)
      {
          dx=awardSum<=22?0:1;
          ds=awardSum%2==1?1:0;
          info = '第'+this.state.serverResult.current.periodDate+'期总和:';
      }
      
      if(Number.parseInt(localAward[i]['dx'][0])==dx||tempShow[i]['dx']==false)
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
            zhong1 = (dx==1?'大':'小')+this.state.touzhu[global.pushu-ndx.length]+'中，   ';
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
              ndx = this.geOneArray();
              (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
              this.state.backupShow[i]['dx'] = ndx.slice();
            }
          }    
      }
      else
      {
        xiadan = xiadan+this.state.touzhu[global.pushu-ndx.length];
        // let xianshi;
        // if(i<QIUNUMBER)
        //   xianshi = '期第'+(i+1)+'球';
        // else
        //   xianshi = '期总和';
        //let zhong =':'+(dx==0?'大':'小')+this.state.touzhu[global.pushu-ndx.length]+'不中';
        zhong1 = (dx==0?'大':'小')+this.state.touzhu[global.pushu-ndx.length]+'不中,  ';
        //awardInfo.push('第'+this.state.serverResult.current.periodDate+xianshi+zhong);
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
              ndx = this.geOneArray();
              (global.jiangchiBackup).push((this.state.backupShow[i]['dx']).slice());
              this.state.backupShow[i]['dx'] = ndx.slice();
        }        
      }
      if(Number.parseInt(localAward[i]['ds'][0])==ds||tempShow[i]['ds']==false)
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
            zhong2 = (ds==1?'单':'双')+this.state.touzhu[global.pushu-nds.length]+'中';
            xiadan = xiadan+this.state.touzhu[global.pushu-nds.length];
            ying +=  this.state.touzhu[global.pushu-nds.length] * global.peilv;
            tempShow[i]['ds']=false;
          //  awardInfo.push('第'+this.state.serverResult.current.periodDate+'期第'+(i+1)+'球'+zhong);
            if(this.state.stop)
            {
              nds=[undefined];
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());  
              this.state.backupShow[i]['ds']=[]; 
            }
            else
            {
              nds = this.geOneArray();
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());
              this.state.backupShow[i]['ds'] = nds.slice();
            }               
          }    
      }
      else
      {
        xiadan = xiadan+this.state.touzhu[global.pushu-nds.length];
        // let xianshi;
        // if(i<QIUNUMBER)
        //   xianshi = '期第'+(i+1)+'球';
        // else
        //   xianshi = '期总和';
        //   let zhong =':' +(ds==0?'单':'双')+this.state.touzhu[global.pushu-nds.length]+'不中';
          zhong2 = (ds==0?'单':'双')+this.state.touzhu[global.pushu-nds.length]+'不中';
        // awardInfo.push('第'+this.state.serverResult.current.periodDate+xianshi+zhong);
        if((nds).length>1)
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
              nds = this.geOneArray();
              (global.jiangchiBackup).push((this.state.backupShow[i]['ds']).slice());
              this.state.backupShow[i]['ds'] = nds.slice(); 
        }        
      }
      if(ndx ==undefined||nds == undefined)
        alert('出错了');

        localAward[i] = {dx:ndx,ds:nds};
        awardInfo.push(info+zhong1+zhong2);
      // this.state.daxiao=daxiaoA;  
      // this.state.danshuang=danshuangA; 
      // this.state.weidaxiao=weidaxiaoA; 
      // this.state.heshu=heshuA;                       
    }
    // console.log('ying',ying);
    // console.log('xiadan',xiadan);
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
        if(!touzhu[i]&&touzhu[i]!=0)
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
        if(!(touzhu[i]>=0&&touzhu[i]<=9))
          return false;
      }
      return true;
    }else
    {
      return false;
    }

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

    if(!this.state.showing)
    {
      backupDx=[];backupDs=[];backupHs=[];
      for(let i=0;i<QIUNUMBER+1;i++)
      {
        let dx = this.geOneArray();
       // backupDx.push(dx);
        //var daxiao = this.removeItem(this.state.daxiao,dx);
        let ds = this.geOneArray();
       // backupDs.push(ds);
       // var danshuang = this.removeItem(this.state.danshuang,ds);
        //var wdx = this.geOneArrayFrom(this.state.weidaxiao);
       // backupWdx.push(wdx);
        //var weidaxiao = this.removeItem(this.state.weidaxiao,wdx);
        //var hs = this.geOneArrayFrom(this.state.heshu);
       // backupHs.push(hs);
       // var heshu = this.removeItem(this.state.heshu,hs);
        let qiu; 
        let showqiu; 

          qiu = {dx:dx,ds:ds};
          showqiu = {dx:true,ds:true};
        let backupQiu = {dx:dx,ds:ds};
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
  _gotoResult(){
    if(!this.inputResultSucc(this.state.jieguo,QIUNUMBER))
    {
      alert('请按格式输入！');
      return ;
    }
    this.state.jieguoqishu=this.state.serverResult.next.periodDate;
    let jieguo = this.state.jieguo;
    jieguo = jieguo.replace(/\.\./g,',');
    this.award(jieguo);

  }
  _gotoStop(){

    this.state.stop = true;
    let show = this.state.show;
    for(let i=0;i<QIUNUMBER+1;i++)
    {
      if(LastWin[i]['dx']==false)
        show[i]['dx']=[undefined];
      if(LastWin[i]['ds']==false)
        show[i]['ds']=[undefined];    
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
      Alert.alert(backupShow);
    }
  }  
  makeItems(){
    let items=[];
    let item;
    for(let i = 0;i<QIUNUMBER+1;i++)
    {
      let show = this.state.show;
      let xiazhu = this.state.touzhu;
      let dx=[],ds=[],hs=[];
      if(show.length>0)
      {
         dx = show[i]['dx'];
         ds = show[i]['ds'];
      }
      if(i<QIUNUMBER)
        item = (
          <View style={styles.inText} key={i}>
            <View style={styles.inText3}>
              <Text style={[styles.Text2]}>第{i+1}球</Text>
            </View>
            <View style={styles.inText2}>
              <TouchableOpacity onPress={()=>this.showArray(i,'dx')}>
              <View style={styles.Text}><Text>大小</Text></View>
              </TouchableOpacity>
              <View style={[styles.Text3]}><Text style={[styles.RText,dx[0]==1?{color:'red'}:{}]}>{dx[0]==undefined?null:(dx[0]==1?'大':'小')}{dx[0]==undefined?null:'('+xiazhu[global.pushu-dx.length]+')'}</Text></View>
            </View>
            <View style={styles.inText2}>
            <TouchableOpacity onPress={()=>this.showArray(i,'ds')}>
              <View style={styles.Text}><Text>单双</Text></View>
            </TouchableOpacity>  
              <View style={[styles.Text3]}><Text style={[styles.RText,ds[0]==1?{color:'red'}:{}]}>{ds[0]==undefined?null:(ds[0]==1?'单':'双')}{ds[0]==undefined?null:'('+xiazhu[global.pushu-ds.length]+')'}</Text></View>
            </View>
          </View>  ); 
      else
      {
        item = (
            <View style={styles.inText} key={i}>
              <View style={styles.inText3}>
                <Text style={[styles.Text2]}>总和</Text>
              </View>
            <View style={styles.inText2}>
              <TouchableOpacity onPress={()=>this.showArray(i,'dx')}>
              <View style={styles.Text}><Text>大小</Text></View>
              </TouchableOpacity>
              <View style={[styles.Text3]}><Text style={[styles.RText,dx[0]==1?{color:'red'}:{}]}>{dx[0]==undefined?null:(dx[0]==1?'大':'小')}{dx[0]==undefined?null:'('+xiazhu[global.pushu-dx.length]+')'}</Text></View>
            </View>
            <View style={styles.inText2}>
            <TouchableOpacity onPress={()=>this.showArray(i,'ds')}>
              <View style={styles.Text}><Text>单双</Text></View>
            </TouchableOpacity>  
              <View style={[styles.Text3]}><Text style={[styles.RText,ds[0]==1?{color:'red'}:{}]}>{ds[0]==undefined?null:(ds[0]==1?'单':'双')}{ds[0]==undefined?null:'('+xiazhu[global.pushu-ds.length]+')'}</Text></View>
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
        <Text style={{fontSize:20,marginTop:3,color:i%2==1?"#325e5a":"#000000"}} key={'text'+i}>{awardInfo[i]}</Text>
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
      currentPerioDate = this.state.serverResult.current.periodDate;
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
                      <Text>          扑数:{global.pushu}           
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
              placeholder='1..2..3..4..与扑数相同'
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
          <View style = {{marginTop:0,flexDirection:'row'}}>
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
                placeholder='1..2..3..4..5'
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
    height:200
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
    height:200,
    width:160,
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
    width:60,
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
    width:100,
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
    width:160,
  },
  RText: {
    fontSize:14,
    textAlign:"center",
  }, 
});
module.exports = cqssc;