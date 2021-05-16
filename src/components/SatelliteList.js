import React, { Component } from 'react';
import { List, Avatar, Button, Checkbox, Spin } from 'antd';
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends Component {
    constructor() {
        super();
        this.state = {
            selected: [],
            isLoad: false,
        }
    }
    onChange = e => {
        console.log(e.target);
        //dataInfo是指哪一个卫星
        const { dataInfo, checked } = e.target;
        const { selected } = this.state;
        //add or remove satellite from selected array
        const list = this.addOrRemove(dataInfo, checked, selected);
        //update selected state
        this.setState({selected: list})
    }
    addOrRemove = (item, status, list) => {
        // case 1： check is true
        //       -> item not in the list => add it
        //       -> item in the list => do nothing
        // case 2: check is false
        //       -> item in the list => remove it
        //       -> item not in the list => do nothing

        //The some() method tests whether at least one element in the array passes the test implemented by the provided function.
        const found = list.some(entry=>entry.satid === item.satid);
        
        // check is true and item not in list
        //add item to list
        if (status && !found) {
            //list.push(item)
            list = [...list, item]
        }
        //The filter() method creates a new array with all elements that pass the test implemented by the provided function.
        
        // check is false and item in list
        // remove item from list
        if (!status && found) {
            list = list.filter(entry => {return entry.satid !== item.satid});
        }
        return list;
    }
    onShowMap = () => {
        //把selected传给main
        this.props.onShowMap(this.state.selected);
    }
    render() {
        //satList is an array
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const { isLoad } = this.props;
        const { selected } = this.state;

        return (
            <div className="sat-list-box">
                <div className="btn-container">
                    <Button className="sat-list-btn"
                    size="large"
                    disabled={ selected.length === 0}
                    onClick={this.onShowMap}
                    >Track on the map</Button>
                </div>
                <hr/>
                {
                    isLoad ?
                        <div className="spin-box">
                        <Spin tip="Loading..." size="large"/>
                        </div>
                        :
                        <List className="sat-list"
                        itemLayout="horizontal"
                        size="small"
                        dataSource={satList}
                        renderItem={
                            item=>(
                                //actions is an array
                                //给checkbox一个props dataInfo，这样点击时从知道是哪一个卫星
                                <List.Item actions={[<Checkbox dataInfo={item} onChange={this.onChange}/>]}>
                                    <List.Item.Meta
                                    avatar={<Avatar size={50} src={satellite}/>}
                                    title={<p>{item.satname}</p>}
                                    description={`Launch Date: ${item.launchDate}`}/>
                                </List.Item>
                            )
                        }
                        />
                }
            </div>
        )
    }
}

export default SatelliteList;