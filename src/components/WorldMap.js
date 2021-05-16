import React, { Component } from 'react';
import { feature } from 'topojson-client';
import axios from 'axios';
import { Spin } from "antd";
import { geoKavrayskiy7 } from 'd3-geo-projection';
import { geoGraticule, geoPath } from 'd3-geo';
import { select as d3Select} from 'd3-selection';
import { schemeCategory10 } from 'd3-scale-chromatic';
import * as d3Scale from 'd3-scale';
import { timeFormat as d3TimeFormat } from 'd3-time-format';

import { 
    WORLD_MAP_URL,
    SATELLITE_POSITION_URL,
    SAT_API_KEY,
} from "../constants";

const width = 960;
const height = 600;

class WorldMap extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            isDrawing: false
        };
        //isLoading: 获取Position数据
        //isDrawing: 画position
        this.map = null;
        //设置卫星颜色
        this.color = d3Scale.scaleOrdinal(schemeCategory10);
        this.refTrack = React.createRef();//轨迹
        this.refMap = React.createRef();//地图
    }
    componentDidMount() {
        //在didMount获取world map data
        axios.get(WORLD_MAP_URL)
            .then(res => {
                const { data } = res;  
                console.log(data)              
                const land = feature(data, data.objects.countries).features;
                //console.log(land)
                this.generateMap(land);
            })
            .catch(e => console.log('err in fetch world map data', e.message))
    }
    generateMap(land) {
        // => world map
        //设置projection
        const projection = geoKavrayskiy7()
                .scale(170)
                .translate([width / 2, height / 2])
                .precision(.1);
        //最外面的边界        
        const graticule = geoGraticule();

        // find canvas
        // d3选择器
        // 指定宽高
        //console.log(this.refMap)
        const canvas = d3Select(this.refMap.current)
            .attr("width", width)
            .attr("height", height);        
        
        //得到画布context
        let context = canvas.node().getContext("2d");
        //console.log(context)

        //track canvas
        const canvas2 = d3Select(this.refTrack.current)
            .attr("width", width)
            .attr("height", height);

        let context2 = canvas2.node().getContext("2d");

        //画笔
        let path = geoPath()
            .projection(projection)
            .context(context);

        //console.log(land.length)
        land.forEach(ele => {
            //地图填充
            context.fillStyle = '#B3DDEF';//填充色
            context.strokeStyle = '#000';//边界色
            context.globalAlpha = 0.7;
            context.beginPath();
            path(ele);
            context.fill();//填充
            context.stroke();//划线

            //画经纬度
            context.strokeStyle = `rgba(220, 220, 220, 0.1)`;
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            //画最外面的边界
            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();
        });
        this.map = {
            projection: projection,
            graticule: graticule,
            context: context,
            context2: context2,
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //props 发生变化
        if (prevProps.satData !== this.props.satData) {
            console.log(this.props.observerData)
            const {
                latitude, longitude, elevation, duration
            } = this.props.observerData;            
            const endTime = duration * 60;
            this.setState({
                isLoading: true,
            });

            const urls = this.props.satData.map(sat => {
                const { satid } = sat;
                const url =`/${SATELLITE_POSITION_URL}/${satid}/${latitude}/${longitude}/${elevation}/${endTime}/&apiKey=${SAT_API_KEY}`;
                //console.log(url)
                return axios.get(url);
            });
            console.log(urls);
            Promise.all(urls)
            .then(res => {
                console.log("position data")
                console.log(res)
                const arr = res.map(sat => sat.data);
                // draw
                // case 1: isDrawing = true => cannot track
                // case 2: is Drawing = false => track
                this.setState({
                    isLoading: false,
                    isDrawing: true,
                });
                if (!prevState.isDrawing) {
                    this.track(arr);
                } else {
                    //提醒
                    const oHint = document.getElementsByClassName("hint")[0];
                    oHint.innerHTML = "Please wait for these satellites animation to finish before select new ones!";
                }
            }).catch(e => {
                console.log("err in fetch satellite position -> ", e.message);
            });
        }
    }
    //画轨迹
    track = data => {
        if (!data[0].hasOwnProperty("positions")) {
            throw new Error("no position data");
        }
        const len = data[0].positions.length;
        //const { duration } = this.props.observerData;
        //get track convas
        const { context2 } = this.map;

        // record current time
        let now = new Date();
        let i = 0;

        let timer = setInterval(()=>{
            let ct = new Date();

            let timePassed = i === 0 ? 0 : ct - now;
            //地图上显示的时间
            let time = new Date(now.getTime() + 60 * timePassed);

            //清除上一次的轨迹和时间， 参数是清除范围
            context2.clearRect(0, 0, width, height);

            //显示时间
            context2.font = "bold 14px sans-serif";
            context2.fillStyle = "#333";
            context2.textAlign = "center";
            context2.fillText(d3TimeFormat(time), width / 2, 10);

            //when to stop drawing
            if (i >= len) {
                //stop Interval
                clearInterval(timer);
                this.setState({isDrawing: false});
                const oHint = document.getElementsByClassName("hint")[0];
                oHint.innerHTML = "";
                return;
            }
            // draw every position for each satellite
            data.forEach(sat => {
                const { info, positions } = sat;
                this.drawSat(info, positions[i]);
            });
            i += 60;
        }, 1000);
    };

    //画每个卫星的轨迹
    drawSat = (sat, pos) => {
        const { satlongitude, satlatitude } = pos;
        if (!satlongitude || !satlatitude) return;

        const { satname } = sat;
        //卫星编号
        //console.log(satname)
        const nameWithNumber = satname.match(/\d+/g).join("");

        const { projection, context2 } = this.map;
        //把经纬度转换成在canvas上的位置
        const xy = projection([satlongitude, satlatitude]);

        //d3-scale 把卫星数字变成颜色
        context2.fillStyle = this.color(nameWithNumber);
        context2.beginPath();
        //显示圆圈
        context2.arc(xy[0], xy[1], 4, 0, 2 * Math.PI);
        context2.fill();

        //显示卫星编号
        context2.font = "bold 11px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1] + 14);

    }
    
    render() {
        const { isLoading } = this.state;
        return (
            <div className="map-box">
                {isLoading ? (
                    <div className="spinner">
                        <Spin tip="Loading..." size="large" />
                    </div>
                ) : null}
                <canvas className="map" ref={this.refMap} />
                <canvas className="track" ref={this.refTrack} />
                <div className="hint" />
            </div>
        );
    }
}

export default WorldMap;