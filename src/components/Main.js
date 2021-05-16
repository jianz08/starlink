import React, { Component } from 'react';
import {Row, Col} from 'antd';
import axios from 'axios';

import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';

import { NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY } from "../constants";


class Main extends Component {
    constructor() {
        super();
        this.state = {
            satInfo: null,
            satList: null,
            setting: null,
            isLoadingList: false,
        };
    }
    showNearbySatellite = (setting) => {
        //setting从SatSetting Form表单获取
        //fetch回来的satInfo传给SatelliteList
        console.log(setting)
        this.setState({
            setting: setting
        })
        //fetch satellite data
        this.fetchSatellite(setting);
    }
    fetchSatellite = (setting) => {
        //getFieldDecorator("longitude"
        //对应getFieldDecorator里的key
        const {latitude, longitude, elevation, altitude} = setting;
        const url = `${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        console.log(url)
        this.setState({
            isLoadingList: true,
        });
        //make request
        axios.get(url)
        .then(response=>{
            console.log(response)
            this.setState({
                satInfo: response.data,
                isLoadingList: false,
            })
        })
        .catch(error=>{
            this.setState({
                isLoadingList: false,
            })
            console.log(`err in fetch satellite -> `, error);
        })
    }
    showMap = (selected) => {
        console.log('show selected satellites on map');
        console.log(selected)
        this.setState(preState => ({
            ...preState,
            satList: [...selected],
        }));
    }
    render() {
        const { satInfo, satList, setting, isLoadingList } = this.state;
        return (
            <Row className='main'>
                <Col span={8}>
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={satInfo}
                    isLoad={isLoadingList}
                    onShowMap={this.showMap}/>
                </Col>
                <Col span={16} className='right-side'>
                    <WorldMap satData={satList} observerData={setting}/>
                </Col>
            </Row>               
        )
    }
}

export default Main;