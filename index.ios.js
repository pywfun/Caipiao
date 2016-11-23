/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  NavigatorIOS,
  Navigator,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  TextInput,
  TouchableHighlight,
  Alert
} from 'react-native';

var Main = require('./view/main');
global.pushu ,global.zcpushu = 0 ,global.bhpushu = 0,global.peilv=0,global.shoucicishu;
// global.pushu = 7 ,global.zcpushu = 1 ,global.bhpushu = 7,global.peilv=2,global.shoucicishu=15,global.jiner='1..2..3..4..5..6..7';
// global.xinjiner = '11..22..33..44..55..66..77';
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


class seting extends Component{
 constructor(props) {
    super(props);
    this.state = {
    pushu:1,
    };
  }
  _gotoStart(){
    if(global.pushu>=6 && global.zcpushu>0&&global.bhpushu>0&&global.peilv>0)
      this.props.navigator.resetTo({
        component:Main,
        params:{
        }
      });
    else
      Alert.alert("设置扑数不能小于6！,正常扑数要大于0！变化加正常要大于总！");
  }
  check(){
    if(global.pushu<6)
    {
      Alert.alert("总扑数不能小于6!");
      return ;
    }
    if(!this.inputResultSucc(global.jiner,global.pushu))
    {
      Alert.alert("投注金额不对!");
      return ;
    }    
    if(global.zcpushu<1)
    {
      Alert.alert("正常扑数要大于0！");
      return ;
    }
    if(global.bhpushu<5)
    {
      Alert.alert("新扑数要大于5！");
      return ;      
    }
    if(global.bhpushu+global.zcpushu<global.pushu)
    {
      Alert.alert("正常扑数加新扑数要大于总扑数！");
      return ;
    }
    if(!this.inputResultSucc(global.xinjiner,global.bhpushu))
    {
      Alert.alert("新投注金额不对!");
      return ;
    } 
    if(!(global.shoucicishu>0))
    {
      Alert.alert("请设置新的首次投注次数！");
      return ;
    }         
    if(!(global.peilv>0))
    {
      Alert.alert("请设置赔率");
      return ;
    }    
      this.props.navigator.resetTo({
        component:Main,
        params:{
        }
      });
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
  render(){
    return(
      <View style = {styles.container}>
        <View style = {styles.container2}>
          <View style = {styles.container3}>
            <Text style={styles.textContent}>总扑数:           
            </Text>
              <TextInput style={styles.style_user_input}
                placeholder='0'
                numberOfLines={1}
                autoFocus={false}
                underlineColorAndroid={'transparent'}
                textAlign='center'
                keyboardType={'numeric'}
                defaultValue={global.pushu}
                onChangeText={(pushu) => {global.pushu =Number.parseInt(pushu)}}/> 
          <Text style={styles.textContent}>投注金额:           
          </Text>
            <TextInput style={styles.style_user_input2}
              placeholder='1..2..3..4..与总扑数相同'
              numberOfLines={1}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign='center'
              keyboardType={'numbers-and-punctuation'}
              defaultValue={global.jiner}
              onChangeText={(jiner) => {global.jiner = jiner}}/>                 
            </View>
          <View style = {styles.container3}>
              <Text style={styles.textContent}>前多少扑正常:           
              </Text>
                <TextInput style={styles.style_user_input}
                  placeholder='0'
                  numberOfLines={1}
                  autoFocus={false}
                  underlineColorAndroid={'transparent'}
                  textAlign='center'
                  keyboardType={'numeric'}
                  onChangeText={(pushu) => {global.zcpushu =Number.parseInt(pushu)}}/> 
              </View> 
          <View style = {styles.container3}>
              <Text style={styles.textContent}>新的扑数:           
              </Text>
                <TextInput style={styles.style_user_input}
                  placeholder='0 大于5'
                  numberOfLines={1}
                  autoFocus={false}
                  underlineColorAndroid={'transparent'}
                  textAlign='center'
                  keyboardType={'numeric'}
                  onChangeText={(pushu) => {global.bhpushu =Number.parseInt(pushu)}}/>
              <Text style={styles.textContent}>新投注金额:           
              </Text>
                <TextInput style={styles.style_user_input2}
                  placeholder='1..2..3..4..与变化扑数相同'
                  numberOfLines={1}
                  autoFocus={false}
                  underlineColorAndroid={'transparent'}
                  textAlign='center'
                  keyboardType={'numbers-and-punctuation'}
                  defaultValue={global.xinjiner}
                  onChangeText={(jiner) => {global.xinjiner = jiner}}/>                    
          </View> 
          <View style = {styles.container3}>
              <Text style={styles.textContent}>变化之后首次分多少次投注:           
              </Text>
                <TextInput style={styles.style_user_input}
                  placeholder='0'
                  numberOfLines={1}
                  autoFocus={false}
                  underlineColorAndroid={'transparent'}
                  textAlign='center'
                  keyboardType={'numeric'}
                  defaultValue={global.shoucicishu}
                  onChangeText={(shoucicishu) => {global.shoucicishu =Number.parseInt(shoucicishu)}}/> 
          </View>           
          <View style = {styles.container3}>
          <Text style={styles.textContent}>赔率:           
          </Text>
            <TextInput style={styles.style_user_input}
              placeholder='0'
              numberOfLines={1}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign='center'
              keyboardType={'numbers-and-punctuation'}
              defaultValue={global.peilv?global.peilv+'':null}
              onChangeText={(peilv) => {global.peilv = Number.parseFloat(peilv)}}/>  
          </View>                             
          <Button
              color="#798BDA"   
              onPress={() => this.check()}
              label="设置"
            />
            </View>
      </View>
      )
  }
}

export default class CaipiaoProject extends Component {
 constructor(props) {
    super(props);
    this.state = {
    selectedTab:'xuexi'
    };
  }
  componentDidMount() {
    //this.createResult();

  }
  render() {
    return (
       <Navigator
      initialRoute={{ name: 'index', component: seting }}
      configureScene={(route) => {
          return {...Navigator.SceneConfigs.HorizontalSwipeJump,gestures:{}};
      }}
      renderScene={(route, navigator) => {
      let Component = route.component;
      return <Component {...route.params} navigator={navigator}/>
      }} 
  />
    );
  }
}

const styles = StyleSheet.create({
 pageView:{
    backgroundColor: '#fff',
    flex:1
  },
  container:{
    flex:1,
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'center',
  },
  container2:{
    flex:1,
    backgroundColor:'#fff',
    flexDirection:'column',
    alignItems:'center',
    justifyContent: 'center',
  }, 
  container3:{
    flexDirection:'row',
    justifyContent: 'center',
  },    
  containerList:{
    flex:1,
    backgroundColor:'#556AC3',
  },
  textContent:{
    fontSize:20,
    lineHeight:32,
    height:44
  },
  style_user_input:{
    backgroundColor:'#f0f0f0',
    height:30,
    width:80
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
  style_user_input2:{
    backgroundColor:'#f0f0f0',
    height:30,
    width:280
  },   
});

AppRegistry.registerComponent('CaipiaoProject', () => CaipiaoProject);
