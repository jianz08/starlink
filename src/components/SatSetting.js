import React, { Component } from 'react';
import {Form, Button, InputNumber} from 'antd';

class SatSettingForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        //responsive layout
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 11},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 13},
            },
        };
        return (
            <Form {...formItemLayout} className="sat-setting" onSubmit={this.showSatellite}>
                <Form.Item label="Longitude(degrees)">
                    {
                        getFieldDecorator("longitude", {
                            rules:[
                                {
                                    required:true,
                                    message:"Please input your Longitude",
                                }
                            ],
                            initialValue: -120
                        })(<InputNumber min={-180} max={180}
                            style={{width: "100%"}}
                            placeholder="Please input Longitude"
                            />)
                    }
                </Form.Item>
                <Form.Item label="Latitude(degrees)">
                    {
                        getFieldDecorator("latitude", {
                            rules:[
                                {
                                    required:true,
                                    message:"Please input your Latitude",
                                }
                            ],
                            initialValue: 30
                        })(<InputNumber min={-90} max={90}
                            style={{width: "100%"}}
                            placeholder="Please input Latitude"
                            />)
                    }
                </Form.Item>
                <Form.Item label="Elevation(meters)">
                    {
                        getFieldDecorator("elevation", {
                            rules:[
                                {
                                    required:true,
                                    message:"Please input your Elevation",
                                }
                            ],
                            initialValue: 0
                        })(<InputNumber min={-413} max={8850}
                            style={{width: "100%"}}
                            placeholder="Please input Elevation"
                            />)
                    }
                </Form.Item>
                <Form.Item label="Altitude(degrees)">
                    {
                        getFieldDecorator("altitude", {
                            rules:[
                                {
                                    required:true,
                                    message:"Please input your Altitude",
                                }
                            ],
                            initialValue: 90
                        })(<InputNumber min={0} max={90}
                            style={{width: "100%"}}
                            placeholder="Please input Altitude"
                            />)
                    }
                </Form.Item>
                <Form.Item label="Duration(secs)">
                    {
                        getFieldDecorator("duration", {
                            rules:[
                                {
                                    required:true,
                                    message:"Please input your Duration",
                                }
                            ],
                            initialValue: 10
                        })(<InputNumber min={0} max={90}
                            style={{width: "100%"}}
                            placeholder="Please input Duration"
                            />)
                    }
                </Form.Item>
                <Form.Item className="show-nearby">
                    <Button type="primary" htmlType="submit" style={{textAlign:"center"}}>
                        Find Nearby Satellite
                    </Button>
                </Form.Item>
            </Form>            
        );
    }
    showSatellite = e => {
        //??????????????????????????????????????????????????????
        // form???????????????????????????????????????GET?????? method="get"
        // URL?????????????????????,???????????????
        // http://localhost:3000/?
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //????????????????????????main
                this.props.onShow(values);
            }
        });
    }
}
//Form.create()?????????????????????????????????????????????component????????????component
//name????????????
//????????????call SatSettingForm????????????this.props.form
//????????????????????????Form???????????????????????????????????????
const SatSetting = Form.create({name: 'satellite-setting'})(SatSettingForm)
export default SatSetting;


// Form.create(SatSettingForm) {
//     return class SatSetting extends React.Component {
//         render() {
//             return  <SatSettingForm {form}/>
//         }
//     }

// }