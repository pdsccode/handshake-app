import DashboardItem from "./DashboardItem";

class Dashboard {
  static dashboard(data) {
    console.log('dashboard dashboard',);

    const result = Object.entries(data).map(([key, value]) => {
      console.log('key, value',key, value);
      return DashboardItem.dashboardItem(value);
    });

    console.log('dashboard', result);

    return result;
  }
}

export default Dashboard;
