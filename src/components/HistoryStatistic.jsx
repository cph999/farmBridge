import React, { useEffect, useState } from "react";
import instance from "../utils/api";
import ReactEcharts from "echarts-for-react";
import "./HistoryStatistic.css";
import { NavBar } from 'react-vant';

const HistoryStatistic = ({ setActiveTab }) => {
    const [statisticData, setStatisticData] = useState([]);
    useEffect(() => {
        instance.post("/history")
            .then((res) => {
                const dataArray = Object.values(res.data.datas || {});
                setStatisticData(dataArray);
            })
            .catch((error) => {
                console.error("获取历史统计数据失败：", error);
            });
    }, []);

    // ECharts 配置
    const getOption = () => {
        const dates = statisticData.map((item) => item.updateTime);
        const prices = statisticData.map((item) => item.bidPrice);

        return {
            title: {
                text: "历史成交均价趋势",
                left: "center",
            },
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "category",
                data: dates,
                axisLabel: {
                    rotate: 45,
                    interval: 0,
                },
            },
            yAxis: {
                type: "value",
                name: "日均价",
            },
            series: [
                {
                    data: prices,
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        color: "#007bff",
                    },
                },
            ],
        };
    };

    return (
        <div>
            <NavBar
                leftText="返回"
                onClickLeft={() => { setActiveTab("publish") }}
            />
            <div className="history-statistic">
                <ReactEcharts option={getOption()} style={{ height: "400px", marginBottom: "20px" }} />
                {statisticData.length === 0 ? (
                    <p>暂无数据</p>
                ) : (
                    <table className="statistic-table">
                        <thead>
                            <tr>
                                <th>日期</th>
                                <th>日均价</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statisticData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.updateTime}</td>
                                    <td>{item.bidPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HistoryStatistic;
