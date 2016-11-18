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
;
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
    if(global.pushu>=7)
      this.props.navigator.resetTo({
        component:Main,
        params:{
        }
      });
    else
      Alert.alert("设置扑数不能小于7！");
  }
  render(){
    return(
      <View style = {styles.container}>
      <View style = {styles.container2}>
          <Text style={styles.textContent}>扑数:           
          </Text>
            <TextInput style={styles.style_user_input}
              placeholder='1'
              numberOfLines={1}
              autoFocus={false}
              underlineColorAndroid={'transparent'}
              textAlign='center'
              keyboardType={'numeric'}
              onChangeText={(pushu) => {this.setState({pushu});global.pushu =Number.parseInt(pushu)}}/> 
              <Text>         </Text>
          <Button
              color="#798BDA"   
              onPress={() => this._gotoStart()}
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
    flexDirection:'row',
    alignItems:'center',
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
});

AppRegistry.registerComponent('CaipiaoProject', () => CaipiaoProject);
