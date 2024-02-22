import React from "react";
import Layout from "../components/Layout/Layout/Layout";
import PageHeading from "../components/Layout/PageHeading";

const Services = () => {
  const pageTitle = "Services";
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Layout>
      <PageHeading title={pageTitle} />
      <section className="why-us">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="left-content">
                <div className="heading-section">
                  <h2>Why choose us?</h2>
                  <span>
                    Vivamus gravida magna massa in cursus mi vehicula at. Nunc
                    sem quam suscipit
                  </span>
                  <div className="line-dec" />
                </div>
                <div className="services d-flex flex-wrap">
                  <div className="col-md-6">
                    <div className="service-item">
                      <i className="fa fa-bar-chart-o" />
                      <div className="tittle">
                        <h2>Results of Drivers</h2>
                      </div>
                      <p>
                        Integer nec posuere metus, at feugiat. Sed sodales
                        venenat malesuada.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service-item">
                      <i className="fa fa-gears" />
                      <div className="tittle">
                        <h2>upgrades performance</h2>
                      </div>
                      <p>
                        Integer nec posuere metus, at feugiat. Sed sodales
                        venenat malesuada.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service-item second-row">
                      <i className="fa fa-pencil" />
                      <div className="tittle">
                        <h2>product sellers</h2>
                      </div>
                      <p>
                        Integer nec posuere metus, at feugiat. Sed sodales
                        venenat malesuada.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="service-item second-row last-service">
                      <i className="fa fa-wrench" />
                      <div className="tittle">
                        <h2>Fast Service</h2>
                      </div>
                      <p>
                        Integer nec posuere metus, at feugiat. Sed sodales
                        venenat malesuada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="right-img">
                <img src="assets/images/car3.jpg" alt="Car" />
                <div className="img-bg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
