'use strict';

import React from 'react';
import ReactNative from 'react-native';

const {
  AppRegistry,
  Text,
} = ReactNative;


export default class second extends React.Component { 
    constructor(props) { 
        super(props); 
    } 

    render() { 
      return (
        <Text> Welcome ! </Text>   
      );
    } 
}

AppRegistry.registerComponent('SecondActivity', () => second);
