import { Route, Routes } from "react-router-dom";
import "./App.css";
import { publicRoutes, privateRoutes } from "./routes";
import { Fragment } from "react";
import AuthRoute from "./routes/AuthRoute";
import Authenticate from "./components/Authenticate";
import "antd/dist/reset.css"; // Ant Design css
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/authenticate" element={<Authenticate />} />
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          const Layout = route.layout || Fragment;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        {/* privateRoutes */}
        <Route path="/admin" element={<AuthRoute />}>
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout || Fragment;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}

export default App;
