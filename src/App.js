import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import News from "./News.js";
import Profile from "./Profile.js";
import Loginpage from "./Loginpage.js";
import { Provider } from "react-redux";
import store, { persistor } from "./Redux/Store.js";
import Container from "./Redux/Container.js";
import Notification from "./Notification.js";
import Calender from "./Calender.js";
import Notification_setting from "./Notification_setting.js";
import "./App.css";
import { PersistGate } from "redux-persist/integration/react";
import Centres from "./Centres.js";
import Project from "./Project.js";
import Application from "./Application.js";
import Projects from "./Projects.js";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Loginpage />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/centres/:centerId" element={<Centres />}></Route>
              <Route path="/project/:projectId" element={<Project />}></Route>
              <Route path="/application" element={<Application />}></Route>
              <Route path="/projects" element={<Projects />}></Route>

              <Route path="/profile" element={<Profile />}></Route>
              {/* <Route path='/dashboard-admin' element={<DashboardA/>}></Route>
              <Route path='/dashboard-super' element={<DashboardS/>}></Route>
              <Route path='/dashboard-management' element={<DashboardM/>}></Route>
              <Route path='/enduser' element={<EndUser/>}></Route>
              <Route path='/stock' element={<Stock/>}></Route>
              <Route path='/maintenance' element={<Maintenance/>}></Route>
              <Route path='/filepage/:heading/:folder_name' element={<Filepage/>}></Route>
              <Route path='/report' element={<Report/>}></Route>
              <Route path='/news' element={<News/>}></Route>
              <Route path='/services/:heading' element={<Services/>}></Route>
              <Route path='/departments/:heading' element={<Departments/>}></Route>
              <Route path='/container' element={<Container/>}></Route>
              <Route path='/ticket' element={<Ticket/>}></Route>
              <Route path='/notification' element={<Notification/>}></Route>
              <Route path='/calender' element={<Calender/>}></Route>
              <Route path='/noti_setting' element={<Notification_setting/>}></Route> */}
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
