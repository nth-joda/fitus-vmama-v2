import React from "react";
import Chart from "react-apexcharts";
import Product_Data from "../../assets/MOCK_Chart_Products.json";
import Staff_Data from "../../assets/MOCK_Chart_Staff.json";
const chartData = {
  options: {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: Product_Data.map((item) => item.productName),
    },
  },
  series: [
    {
      name: "Số lượng",
      data: Product_Data.map((item) => item.soldAmount),
    },
  ],
};

const staffChartData = {
  options: {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: Staff_Data.map((item) => item.tenNv),
    },
  },
  series: [
    {
      name: "Số giao dịch",
      data: Staff_Data.map((item) => item.soGiaoDich),
    },
  ],
};

const TestChart = () => {
  return (
    <div>
      <p>Số lượng các sản phẩm tham gia khuyến mãi trong quý 3:</p>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width="600"
      />

      <p>
        Thống kê nhân viên theo số lượt thực hiện giao dịch khuyến mãi trong quý
        3:
      </p>
      <Chart
        options={staffChartData.options}
        series={staffChartData.series}
        type="bar"
        width="600"
      />
      <p>
        Thống kê nhân viên theo số lượt thực hiện giao dịch khuyến mãi trong năm
        (biểu đồ line)
      </p>
      <p> ----------------------- </p>
      <p>Thống kê quà tặng</p>
    </div>
  );
};

export default TestChart;
