import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GetCarsFailure,
  GetCarsStart,
  GetCarsSuccess,
} from "../features/VehicleSlice.js";
import { sendQuery } from "../features/apiCall";
import { placebid } from "../features/apiCall.js";
import axios from "../utils/axios.js";
import LeftInfo from "./LeftInfo.js";
import RightInfo from "./RightInfo.js";
import ProductCarousel from "./VehicleCarousel.js";

const ErrorToastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};
const ProductDetail = ({ auctionId }) => {
  const location = useLocation();
  const [CarDetails, setCarDetails] = useState(null);

  const [carId, setCarId] = useState("null]");
  const [amount, setAmount] = useState("");
  const [previewAmount, setPreviewAmount] = useState("");
  const [auction, setAuction] = useState([]);
  const [price, setPrice] = useState(null);
  const [reserveFlag, setReserveFlag] = useState(null);
  const [activeTab, setActiveTab] = useState("tab2");
  const { isFetching } = useSelector((state) => state.vehicle);
  const { isPlacingBid } = useSelector((state) => state.bid);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [vehicle_type, setVehicle_type] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleBidChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(value);

    if (price != "No Bid") {
      const increment = 50;

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout to wait for 2 seconds after the user stops typing
      const newTimeoutId = setTimeout(() => {
        // Ensure the value is a number
        if (!isNaN(value)) {
          // Round off to the nearest multiple of 50 greater than the current price
          const roundedValue =
            Math.ceil((value - price) / increment) * increment + price;

          // Update the state with the rounded value
          setPreviewAmount(roundedValue.toString());
        }
      });

      // Update the timeoutId state
      setTimeoutId(newTimeoutId);
    } else {
      if (value > 50) {
        const v = Math.ceil(value / 50) * 50; // Round off to the nearest greater multiple of 50
        const newTimeoutId = setTimeout(() => {
          setPreviewAmount(v);
        });
      } else {
        const v = 50; // Set v to 50 when the value is less than 50
        const newTimeoutId = setTimeout(() => {
          setPreviewAmount(v);
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const roundToNearestMultiple = (value, multiple) => {
    const roundedValue = Math.round(value / multiple) * multiple;
    return Math.max(roundedValue, multiple); // Ensure the rounded value is greater than the multiple
  };
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  const fetchDetails = async () => {
    console.log("calling get details api");
    dispatch(GetCarsStart());
    try {
      const { data } = await axios.get(
        `/api/auction/get-auction-details/${auctionId}`,
        {
          headers: { Authorization: token },
        }
      );
      setAuction(data?.auction);
      setCarDetails(data?.auction?.car);
      setVehicle_type(data?.auction?.car?.vehicle_type);
      const highestBidAmount =
        data.auction?.highest_bid === 0 ? "No Bid" : data.auction?.highest_bid;
      setPrice(highestBidAmount);
      setReserveFlag(data?.auction?.reserve_flag);
      const fetchedCarId = data?.auction?.car?._id;
      setCarId(fetchedCarId);
      const auctionEndTime = new Date(data?.auction?.auction_end);
      const auctionStartTime = new Date(data?.auction?.auction_start);
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        let timeDifference;
        if (data.auction?.status == "inactive") {
          timeDifference = auctionStartTime - currentTime;
        } else {
          timeDifference = auctionEndTime - currentTime;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setTimer({
          days,
          hours,
          minutes,
          seconds,
        });
        if (timeDifference <= 0) {
          clearInterval(intervalId);
          fetchDetails();
        }
      }, 1000);

      setIntervalId(intervalId);
      dispatch(GetCarsSuccess(data));
    } catch (error) {
      dispatch(GetCarsFailure());
    }
  };

  const handleBid = async (e) => {
    e.preventDefault();
    if (!token) {
      toast("Login to Place Bid", ErrorToastOptions);
      navigate("/login");
    } else {
      const increment = 50;
      if (typeof price === "number" && !isNaN(price)) {
        if (amount - price >= 50 && (amount - price) % 50 === 0) {
          let bid_amount = amount;
          try {
            let bool = await placebid(dispatch, { bid_amount, auctionId });
            if (bool === true) {
              setPrice(amount);
              fetchDetails();
            }
          } catch (error) {
            toast.error("Try Again Later!", ErrorToastOptions);
          }

          console.log("Condition met!");
        } else {
          toast.error(
            `Bid should be a multiple of $50, You can Bid $${previewAmount}`,
            ErrorToastOptions
          );
        }
      } else {
        if (amount % 50 === 0) {
          let bid_amount = amount;
          try {
            let success = await placebid(dispatch, { bid_amount, auctionId });
            if (success) {
              setPrice(amount);
              fetchDetails();
            }
          } catch (error) {
            toast.error("Try Again Later!", ErrorToastOptions);
          }

          console.log("Condition met!");
        } else {
          toast.error(
            `Bid should be a multiple of $50, You can Bid $${previewAmount}`,
            ErrorToastOptions
          );
        }
      }
    }
  };

  useEffect(() => {
    fetchDetails();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch, token, auctionId]);

  const contact = async () => {
    const { name, email, phone, message } = formData;
    try {
      const uploadSuccess = await sendQuery(dispatch, {
        name,
        email,
        phone,
        message,
      });
      if (uploadSuccess) {
        // console.log("Form data before clearing:", formData);
        // Clear form data only if the submission was successful
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        // console.log("Form data after clearing:", formData);
      }
    } catch (error) {
      // console.error("Error submitting query:", error);
      toast.error(
        "Error submitting query. Please try again.",
        ErrorToastOptions
      );
    }
  };
  const handleRefresh = () => {
    fetchDetails();
    console.log("Refresh icon clicked!");
  };

  const hasAuctionEnded =
    timer.days <= 0 &&
    timer.hours <= 0 &&
    timer.minutes <= 0 &&
    timer.seconds <= 0;
  // if (hasAuctionEnded) {
  //   fetchDetails();
  // }
  const hasAuctionStarted =
    timer.days <= 0 &&
    timer.hours <= 0 &&
    timer.minutes <= 0 &&
    timer.seconds <= 0;

  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleButtonClick = (amount) => {
    console.log(amount);

    setSelectedAmount(amount);
    if (price !== "No Bid") {
      setAmount(price + amount);
    } else {
      setAmount(amount);
    }
    setPreviewAmount(amount);

    // Add any other logic you want to perform with the selected amount here
  };
  return (
    <section className="car-details">
      <div className="container">
        <div className="row">
          <div id="single-car" className="col-md-8">
            <ProductCarousel carId={carId} />
            <RightInfo
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              vehicleType={vehicle_type}
              auction={auction}
            />
          </div>
          <LeftInfo
            auction={auction}
            timer={timer}
            handleRefresh={handleRefresh}
            amount={amount}
            handleBidChange={handleBidChange}
            isPlacingBid={isPlacingBid}
            handleBid={handleBid}
            formData={formData}
            handleChange={handleChange}
            contact={contact}
            price={price}
            reserve_flag={reserveFlag}
            vehicle_type={vehicle_type}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            handleButtonClick={handleButtonClick}
            setPreviewAmount={setPreviewAmount}
            previewAmount={previewAmount}
          />

          <div className="contact-details-conta">
            <div className="head-side-bar">
              <h4>Contact Admin</h4>
            </div>
            <Form
              className="contact-form"
              onSubmit={() => {
                contact();
              }}
            >
              <Row>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col sm={6}>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col sm={6}>
                  {" "}
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Write message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
              {/* <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              /> */}
              <Row>
                {isPlacingBid ? (
                  <button className="advanced-button pl-3 m-auto mt-4" disabled>
                    Sending...
                  </button>
                ) : (
                  <button
                    className="advanced-button pl-3 m-auto mt-4"
                    type="submit"
                  >
                    Send enquiry <i className="fa fa-paper-plane" />
                  </button>
                )}
              </Row>
            </Form>
            <div className="subhead-side-bar m-4">
              <h4>Ask a question</h4>
            </div>
            <div className="check-boxes">
              <ul>
                <li>
                  <label htmlFor="c1">Can I book a test drive?</label>
                </li>
                <li>
                  <label htmlFor="c2">
                    What is your adress and opening hours?
                  </label>
                </li>
                <li>
                  <label htmlFor="c3">Other?</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
