import { React, useEffect, useState } from "react";
import "../styles/_crawler.scss";
import logoOriginal from "../images/taipeilogo.png";

import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import TwCitySelector from "../../node_modules/tw-city-selector/dist/tw-city-selector";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
  );

function Crawler() {
  const [data, setData] = useState([]);
  const [maleData, setMaleData] = useState([]);
  const [femaleData, setFemaleData] = useState([]);

  //取得縣市行政區API資料
  useEffect(() => {
    cityselect();
  }, []);

  function cityselect() {
    new TwCitySelector({
      el: ".my-selector-c",
      elCounty: ".county", // 在 el 裡查找 dom
      elDistrict: ".district", // 在 el 裡查找 dom
      countyValue: "台北市",
      only: [
        "台北市", // 台北市所有區域
      ],
    });
  }

  //取得api資料
  useEffect(() => {
    let getProfile = async () => {
      let response = await axios.get(
        "https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/109",
        {
          params: {
            COUNTY: "臺北市",
          },
        }
      );
      setData(response.data.responseData);
    };
    getProfile();
    setMaleData(maleData);
    setFemaleData(femaleData);
  }, [maleData, femaleData]);

  const handleChange = (e) => {
    let siteList = data.filter((item) => item.site_id.includes(e.target.value));

    //household_ordinary_m(共同生活戶_男)
    let household_ordinary_m_total = 0;
    let household_ordinary_m = siteList.map(
      (item) =>
        (household_ordinary_m_total += Number(item.household_ordinary_m))
    );

    //household_single_m(單獨生活戶_男)
    let household_single_m_total = 0;
    let household_single_m = siteList.map(
      (item) => (household_single_m_total += Number(item.household_single_m))
    );

    //household_ordinary_f(共同生活戶_女)
    let household_ordinary_f_total = 0;
    let household_ordinary_f = siteList.map(
      (item) =>
        (household_ordinary_f_total += Number(item.household_ordinary_f))
    );

    //household_single_f(單獨生活戶_女)
    let household_single_f_total = 0;
    let household_single_f = siteList.map(
      (item) => (household_single_f_total += Number(item.household_single_f))
    );

    setMaleData([household_ordinary_m_total, household_single_m_total]);
    setFemaleData([household_ordinary_f_total, household_single_f_total]);
  };

  //chart setup
  const labels = ["共同生活戶", "獨立生活戶"];

  const chartData = {
    labels,
    datasets: [
      {
        label: "男",
        data: maleData,
        backgroundColor: "rgba(63,131,191, 0.5)",
      },
      {
        label: "女",
        data: femaleData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className="card">
        <div className="card__header">
            <img src={logoOriginal} alt="" className="card__icon" />
          <div className="card__title">109年人口戶數及性別</div>
        </div>
        <div className="card__content">
          <div className="card__selector my-selector-c">
            <div>
              <select className="county"></select>
            </div>
            <div>
              <select className="district" onChange={handleChange}></select>
            </div>
          </div>
          <div className="card__barChart">
            <Bar data={chartData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Crawler;
