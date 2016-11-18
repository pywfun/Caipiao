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
} from 'react-native';

var Happy10 = require('./happy10');
var LuckFram = require('./luckfram');
var Pk10 = require('./pk');
var CQSSC = require('./cqssc');
global.win=0;
global.peilv;
global.jiner;
global.jiangchi=[];
global.jiangchiBackup=[];
class main extends Component {
 constructor(props) {
    super(props);
    this.state = {
    selectedTab:'xuexi'
    };
  }
  componentDidMount() {
    this.createResult();

  }
  prefix(num, val) {
      return (new Array(num).join('0') + val).slice(-num);
  }  
  createResult(){

    let Max=Math.pow(2,global.pushu); 
    let result = new Array();
    var temp = [0,0,0,0,0,0,0];
    for(let i=0;i<Max;i++)
    {
      let num = this.prefix(global.pushu,i.toString(2));
      temp = num.split("");
      result.push(temp);     
    }
    global.jiangchi = result; 
  }    
  changeTab(tabName){
    this.setState({
      selectedTab:tabName
    });
  }  
  render() {
    return (
 <TabBarIOS tintColor='#F87887' itemPositioning='fill'>
        <TabBarIOS.Item
          title = "广东快乐十分"
          icon = {require('./img/tabBar_1.png')}
          renderAsOriginal = {true}
          selectedIcon = {require('./img/tabBar_1a.png')}
          onPress = {()=> this.changeTab('xuexi')}
          selected = { this.state.selectedTab === 'xuexi'}>
          <NavigatorIOS 
            style={styles.containerList}
            initialRoute={{
            title: '广东快乐十分',
            component: Happy10,
            navigator:this.props.navigator,
            }}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title = "幸运农场"
          icon = {require('./img/tabBar_4.png')}
          renderAsOriginal = {true}
          selectedIcon = {require('./img/tabBar_4a.png')}
          onPress = {()=> this.changeTab('xinyun')}
          selected = { this.state.selectedTab === 'xinyun'}>
          <NavigatorIOS 
            style={styles.containerList}
            initialRoute={{
            title: '幸运农场',
            component: LuckFram,
            navigator:this.props.navigator,
            }}
          />
        </TabBarIOS.Item>  
        <TabBarIOS.Item
          title = "北京赛车"
          icon = {require('./img/tabBar_3.png')}
          renderAsOriginal = {true}
          selectedIcon = {require('./img/tabBar_3a.png')}
          onPress = {()=> this.changeTab('paihang')}
          selected = { this.state.selectedTab === 'paihang'}>
          <NavigatorIOS navigator={this.props.navigator}
            style={styles.container}
            initialRoute={{
            title: '北京赛车',
            component: Pk10,
            navigator:this.props.navigator
            }}
          />
        </TabBarIOS.Item>              
        <TabBarIOS.Item
          title = "重庆时时彩"
          icon = {require('./img/tabBar_2.png')}
          renderAsOriginal = {true}
          selectedIcon = {require('./img/tabBar_2a.png')}
          onPress = {()=> this.changeTab('huodong')}
          selected = { this.state.selectedTab === 'huodong'}>
          <NavigatorIOS
            style={styles.container}
            initialRoute={{
            title: '重庆时时彩',
            component: CQSSC,
            }}
          />
        </TabBarIOS.Item>
      </TabBarIOS>
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
  },
  containerList:{
    flex:1,
    backgroundColor:'#556AC3',
  },

});

module.exports = main;