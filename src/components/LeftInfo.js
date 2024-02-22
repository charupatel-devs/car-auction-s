import React, { memo } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import ReactPlaceholder from "react-placeholder";
import { useSelector } from "react-redux";
import Timer from "./Timer.js";
const LeftInfo = memo(
  ({
    auction,
    timer,
    handleRefresh,
    amount,
    handleBidChange,
    isPlacingBid,
    handleBid,
    formData,
    handleChange,
    contact,
    price,
    reserve_flag,
    vehicle_type,
    selectedAmount,
    setSelectedAmount,
    handleButtonClick,
    setPreviewAmount,
    previewAmount,
  }) => {
    const { isFetching } = useSelector((state) => state.vehicle);
    const hasAuctionEnded =
      timer.days <= 0 &&
      timer.hours <= 0 &&
      timer.minutes <= 0 &&
      timer.seconds <= 0;
    return (
      <div id="left-info" className="col-md-4">
        <div className="details">
          <div className="status-tooltip" style={{ zIndex: "1" }}>
            <div
              style={{ right: "0px" }}
              className={`status-popup ${
                auction?.status === "active"
                  ? "Ongoing"
                  : auction?.status === "inactive"
                  ? "NotStarted"
                  : "Closed"
              }`}
            >
              {auction?.status === "active"
                ? "Ongoing "
                : auction?.status === "inactive"
                ? "Not Started"
                : "Closed"}
            </div>
          </div>
          <div className="p-3 ">
            <div className="up-content clearfix d-flex  ">
              <h1>{auction?.car?.model}</h1>
            </div>
            <hr />
            <Timer timer={timer} status={auction?.status} />
            <div className="f-direc-col d-flex  align-content-center justify-content-between">
              <div>
                {hasAuctionEnded ? (
                  <p className="m-0">
                    HIGHEST BID{" "}
                    <i
                      className="fas fa-sync refresh-icon justify-self-end"
                      onClick={handleRefresh}
                    />
                  </p>
                ) : (
                  <p className="m-0">
                    CURRENT BID{" "}
                    <i
                      className="fas fa-sync refresh-icon justify-self-end"
                      onClick={handleRefresh}
                    />
                  </p>
                )}

                <div className="pricetag">$ {price} </div>
              </div>
              <div>
                {isFetching ? (
                  <div className="">
                    <p className="text-info font-weight-bold">Hold on !</p>
                  </div>
                ) : (
                  <>
                    <p>
                      <>
                        {auction?.show_hide_price ? (
                          <>
                            <span className="text-info font-weight-bold">
                              ASKING PRICE{" "}
                            </span>
                            <span> $ {auction?.asking_price}</span>
                            <br />
                          </>
                        ) : (
                          <>
                            <p>
                              <p className="text-primary font-weight-bold text-uppercase">
                                {reserve_flag}
                                <OverlayTrigger
                                  placement="left"
                                  overlay={
                                    <Tooltip>
                                      "The reserve represents a predetermined
                                      amount chosen by the seller. When the
                                      reserve is reached, it will be highlighted
                                      in green, and the top bidder at that point
                                      will secure the item."
                                    </Tooltip>
                                  }
                                >
                                  <span className="ml-2">
                                    <i className="fas fa-info-circle text-dark"></i>
                                  </span>
                                </OverlayTrigger>
                              </p>
                            </p>
                          </>
                        )}
                      </>
                    </p>
                  </>
                )}
              </div>
            </div>
            <br />
            <p className="text-mute">
              Price does not include a $100 Buyer Administrative Fee. Any
              additional Credit Card / PayPal surcharges are not covered and
              will be applied.Bid should be of atleast of $50 increment
            </p>

            {auction?.status === "inactive" ||
              (!hasAuctionEnded && (
                <>
                  <p className="text-danger">
                    Suggested Bid i.e ${previewAmount}
                  </p>
                  <form
                    className="f-direc-col d-flex justify-content-between mb-3"
                    onSubmit={handleBid}
                  >
                    <div
                      className="d-flex justify-content-between align-content-center"
                      style={{ flexWrap: "wrap-reverse" }}
                    >
                      <input
                        className="text-center place-input"
                        type="number"
                        name="bid_amount"
                        placeholder="Price"
                        value={amount}
                        onChange={handleBidChange}
                        required
                      />

                      <div>
                        {!isPlacingBid ? (
                          <ReactPlaceholder
                            type="text"
                            color="#F0F0F0"
                            showLoadingAnimation
                            rows={5}
                            style={{ width: "80%" }}
                            ready={!isPlacingBid}
                          >
                            <button type="submit" className="advanced-button">
                              Place Bid
                            </button>
                          </ReactPlaceholder>
                        ) : (
                          <div className="advanced-button text-center">
                            <Spinner
                              width={{ width: "10px", height: "10px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </>
              ))}
            {auction?.status === "inactive" ||
              (!hasAuctionEnded && (
                <div className="d-flex justify-content-between">
                  <button
                    className={`btn ${
                      selectedAmount === 50 ? "btn-info" : "btn-secondary"
                    }`}
                    onClick={() => handleButtonClick(50)}
                  >
                    $50
                  </button>
                  <button
                    className={`btn ${
                      selectedAmount === 100 ? "btn-info" : "btn-secondary"
                    }`}
                    onClick={() => handleButtonClick(100)}
                  >
                    $100
                  </button>
                  <button
                    className={`btn ${
                      selectedAmount === 200 ? "btn-info" : "btn-secondary"
                    }`}
                    onClick={() => handleButtonClick(200)}
                  >
                    $200
                  </button>
                  <button
                    className={`btn ${
                      selectedAmount === 500 ? "btn-info" : "btn-secondary"
                    }`}
                    onClick={() => handleButtonClick(500)}
                  >
                    $500
                  </button>
                  <button
                    className={`btn ${
                      selectedAmount === 1000 ? "btn-info" : "btn-secondary"
                    }`}
                    onClick={() => handleButtonClick(1000)}
                  >
                    $1000
                  </button>
                </div>
              ))}
            <hr />
          </div>
          <div className="head-side-bar">
            <h4>{vehicle_type} Details</h4>
          </div>
          <div className="list-info">
            <ul>
              {auction?.car?.manufacture_company && (
                <li>
                  <span>Make:</span>
                  {auction?.car?.manufacture_company}
                </li>
              )}
              {auction?.car?.manufacture_year && (
                <li>
                  <span>Manufacturing Year:</span>
                  {auction?.car?.manufacture_year}
                </li>
              )}
              {auction?.car?.fuel_type && (
                <li>
                  <span>Fuel Type:</span>
                  {auction?.car?.fuel_type}
                </li>
              )}
              {auction?.car?.color && (
                <li>
                  <span>Color:</span> {auction?.car?.color}
                </li>
              )}
              {auction?.car?.odometer_reading && (
                <li>
                  <span>Odometer:</span>
                  {auction?.car?.odometer_reading}
                </li>
              )}
              {auction?.car?.unique_identification_number && (
                <li>
                  <span>Vin No:</span>
                  {auction?.car?.unique_identification_number}
                </li>
              )}
              {auction?.car?.num_of_cylinders && (
                <li>
                  <span>No of Cylinders</span> {auction?.car?.num_of_cylinders}
                </li>
              )}
              {auction?.car?.transmission_type && (
                <li>
                  <span>Transmission:</span> {auction?.car?.transmission_type}
                </li>
              )}
              {auction?.car?.body_type && (
                <li>
                  <span>Body Type:</span> {auction?.car?.body_type}
                </li>
              )}
              {auction?.car?.vehicle_type === "Truck" && (
                <>
                  {auction?.car?.engine_power && (
                    <li>
                      <span>Engine Power:</span> {auction?.car?.engine_power}
                    </li>
                  )}
                  {auction?.car?.gvm && (
                    <li>
                      <span>GVM:</span> {auction?.car.gvm}
                    </li>
                  )}
                  {auction?.car?.axle_configuration && (
                    <li>
                      <span>Axle Configuration:</span>{" "}
                      {auction?.car?.axle_configuration}
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
);
export default LeftInfo;
