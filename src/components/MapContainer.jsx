import { useEffect } from "react";
import styles from "./MapContainer.css";
import AMapLoader from "@amap/amap-jsapi-loader";

export default function MapContainer() {
    let map = null;

    useEffect(() => {
        AMapLoader.load({
            key: "41c19f48e6f78755143116e83cec5d86", // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.Geolocation", "AMap.Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
            .then((AMap) => {
                map = new AMap.Map("container", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                    center: [116.397428, 39.90923], // 初始化地图中心点位置
                });

                var toolbar = new AMap.ToolBar(); //创建工具条插件实例
                map.addControl(toolbar); //添加工具条插件到页面
                var scale = new AMap.Scale();
                map.addControl(scale);

                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认：true
                    timeout: 10000, // 设置定位超时时间，默认：无穷大
                    offset: [10, 20],  // 定位按钮的停靠位置的偏移量
                    zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    position: 'RB' //  定位按钮的排放位置,  RB表示右下
                })

                geolocation.getCurrentPosition(function (status, result) {
                    if (status == 'complete') {
                        onComplete(result)
                    } else {
                        onError(result)
                    }
                });

                function onComplete(data) {
                    // data是具体的定位信息
                    console.log("定位成功", data)
                }

                function onError(data) {
                    // 定位出错
                    console.log("定位出错", data)

                }
                map.addControl(geolocation)

            })
            .catch((e) => {
                console.log(e);
            });

        return () => {
            map?.destroy();
        };
    }, []);

    return (
        <div
            id="container"
            className={styles.container}
            style={{ height: "800px" }}
        ></div>
    );
}
