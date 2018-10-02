import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
// Elements
import {
 Image, View, Text, Button, TouchableOpacity
} from 'react-native';
import CustomFormInput from '../components/CustomFormInput';
import styles from '../styles/SignInStyle';
import { defaultMinLength } from '../constants/dimens';
// Actions
import * as loginActions from '../reducers/auth/actions';
import {
  SIGNED, NOT_CONNECTED, ON_CONSENT, CONNECTED
} from '../reducers/nav/actionTypes'
// Strings
import {
  LabelSignIn, LabelRegister, LabelFind, PlaceholderId, PlaceholderPassword, ErrorMsgId, ErrorMsgPassword, ErrorMsgLogin
} from '../constants/string';
import { mainColor } from '../constants/color';

class SignInScreen extends Component{
  static navigationOptions = {
    header: null,
    headerBackTitle: null
  };

  constructor(props){
    super(props)
    this.state= {
      id:'',
      password:'',
      idError:false,
      pwError:false,
    }
  }
  
  // Functions
  _login = () => {
    const { LoginActions } = this.props;
    this.setState({idError:false, pwError:false})

    if(this.state.id.length >= 8 && this.state.password.length >= 8){ // Check Id and Password
      try{
        LoginActions.login(this.state.id, this.state.password);
      }catch(e){}
    } else if(this.state.id.length < defaultMinLength){
      this.setState({idError: true})
    } else if(this.state.password.length < defaultMinLength){
      this.setState({pwError: true})
    }
  }

  _find = () => {

  }

  // LifeCycle
  componentWillReceiveProps(nextProps) {
    const { goToMain, isLoggedIn } = nextProps;

    if(isLoggedIn){
      goToMain();   // Go to MainScreen
    } 
  }

  render(){
    const { error, goToConsent } = this.props;

    return(
      <View style={styles.container}>
        
        {/* Logo */}
        <Image
          style= {styles.image} 
          source={require('../../assets/logo.png')} 
        />

        {/* Error Message */}
        <View style={{height:20}}>
        {error && <Text style={styles.error}>{ErrorMsgLogin}</Text>}
        </View>
        
       {/* ID Form */}
        <CustomFormInput 
          style={styles.input}
          iconStyle={styles.icon}
          type="ID"
          placeholder={PlaceholderId}
          onChangeText={(id) => this.setState({id})}
          maxLength={20}
          clearButtonMode="never"
          error={this.state.idError}
          errorMsg={ErrorMsgId}
        />

        {/* PW Form */}
        <CustomFormInput
          style={styles.input}
          iconStyle={styles.icon}
          type="PW"
          placeholder={PlaceholderPassword}
          onChangeText={(password) => this.setState({password})}
          maxLength={20}
          clearButtonMode="always"
          secureTextEntry={true}
          error={this.state.pwError}
          errorMsg={ErrorMsgPassword}
        />

        {/* SignIn Button */}
        <View style={(this.state.id.length==0 && this.state.password.length==0) ? styles.loginDisable : styles.loginEnable}>
          <TouchableOpacity
            disabled={(this.state.id.length==0 && this.state.password.length==0)}
            onPress={() => this._login()}>
            <Text
              style={{fontWeight: 'bold', color: 'white', fontSize: 20}}
              pointerEvents='none'>
            {LabelSignIn}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Find Button */}
        <View style={styles.find}> 
          <TouchableOpacity 
            onPress={() => this._find()}>
            <Text
              style={{textDecorationLine: 'underline', color: mainColor, fontSize: 15}}
              pointerEvents='none'>
            {LabelFind}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Register Button */}
        <View style={styles.register}>
          <TouchableOpacity
            onPress={goToConsent}>
            <Text
              style={{fontWeight: 'bold', color: mainColor, fontSize: 20}}
              pointerEvents='none'>
            {LabelRegister}
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

// Redux Connect
export default connect(
  (state) => ({
    loading: state.auth.pending,
    isLoggedIn : state.auth.isLoggedIn,
    error: state.auth.error
  }),
  (dispatch) => ({
      LoginActions: bindActionCreators(loginActions, dispatch),
      goToMain: () => dispatch({ type: SIGNED}),
      goToBluetooth: () => dispatch({ type: NOT_CONNECTED}),
      goToConsent: () => dispatch({ type: ON_CONSENT}),
  })
)(SignInScreen);