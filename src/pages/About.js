import React from "react";
import Layout from "../components/Layout/Layout/Layout";
import PageHeading from "../components/Layout/PageHeading";

const About = () => {
  const pageTitle = "About";
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Layout>
      <PageHeading title={pageTitle} />
      <section className="who-is">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="left-content">
                <div className="heading">
                  <h2>Who is the auction?</h2>
                  <span>Irony distillery fashion axe</span>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus sed est sed orcit elit auctor ullamcorper et
                    imperdiet lectus. Vivamus gravida metus vitae nunc sempe
                    lacinia est pulvinar. Ut sit amet lacus luctus, iaculis
                    turpis sit amet.
                    <br />
                    <br />
                    Maecenas eros mi, lacinia eu ultricies vel, elementum et
                    justo. Ut at tortor a odio vestib suscipit non sit amet
                    dolor. Morbi molestie magna nec metus facilisis, at iaculis
                    adipiscing. Praesent ac diam velit. Curabitur lacinia
                    tristique velit ut laoreet. Nam pretium id risuse fermentum.
                    Aenean eu euismod justo.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="right-content">
                <img src="assets/images/car3.jpg" alt="Car" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
