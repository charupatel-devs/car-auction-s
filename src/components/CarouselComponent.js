import React, { useState } from "react";
import { Carousel, NavLink } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CarouselComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleSelect = (selectedIndex, e) => {
    setCurrentIndex(selectedIndex);
    setLoaded(false);
  };

  const handleImageLoad = () => {
    setLoaded(true);
  };

  const carouselItems = [
    {
      backgroundImage: "/assets/images/car1.jpg",
      head: "BEST SITE OF VEHICLE",
      caption: "FIND USED Vehicles ,Visit all vehicles to see listing",
      button: "MORE OPPORUNITY",
      src: "/SeeAll",
    },
    {
      backgroundImage: "/assets/images/car2.jpg",
      head: "PUT YOUR CAR ON SALE ",
      caption: "Caption for Car 2",
      button: "CREATIVE PROFILE",
      src: "/dashboard/user/upload-product",
    },
    {
      backgroundImage: "/assets/images/car3.jpg",
      head: "PUT YOUR TRUCK ON SALE ",
      caption: "Caption for Car 3",
      button: "MORE OPPORUNITY",
      src: "/SeeAll",
    },
  ];
  const { token } = useSelector((state) => state.auth);
  const { isFetching } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await GetAuctions(dispatch, {
  //       selectedStatus: "active",
  //       currentPage,
  //       pageSize,
  //     });
  //     setAuctions(data?.auctions);
  //   };
  //   fetchData();
  // }, [token]);
  return (
    <div>
      <Carousel
        fade
        activeIndex={currentIndex}
        onSelect={handleSelect}
        pause={true}
        interval={8000}
      >
        {carouselItems.length > 0 &&
          carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <div
                className="d-block w-100 carousel-home"
                style={{
                  backgroundImage: `url(${item?.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  className="carousel-caption d-flex flex-column justify-content-around "
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "20px",

                    borderRadius: "10px",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <div className="">
                    <NavLink className="custom-button  m-auto" to="/SeeAll">
                      {item?.button}
                    </NavLink>

                    <h1 className="carousel-head">{item?.head}</h1>

                    <p className="carousel-p">{item?.caption}</p>
                  </div>
                  <div className="tp-caption slider-thumb d-flex start container hidden-xs hidden-sm"></div>
                </div>
              </div>
              <img
                src={item?.backgroundImage}
                style={{ display: "none" }}
                alt={`Preload ${item.caption}`}
                onLoad={handleImageLoad}
              />
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
