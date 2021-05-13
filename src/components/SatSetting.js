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
        //阻止一些默认行为，比如向后端发送请求
        // form组件提交时默认会向后端发送GET请求 method="get"
        // URL后面会加一个？,页面会刷新
        // http://localhost:3000/?
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //传递数据给父组件main
                this.props.onShow(values);
            }
        });
    }
}
//Form.create()的返回值是一个高阶组件，输入是component，输出是component
//name可有可无
//高阶组件call SatSettingForm时传入了this.props.form
//把重复的代码放到Form里，通过包装给其他组件使用
const SatSetting = Form.create({name: 'satellite-setting'})(SatSettingForm)
export default SatSetting;


// Form.create(SatSettingForm) {
//     return class SatSetting extends React.Component {
//         render() {
//             return  <SatSettingForm {form}/>
//         }
//     }

// }