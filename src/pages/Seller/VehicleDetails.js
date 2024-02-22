import React, { useEffect, useState } from "react";
import { Card, NavLink } from "react-bootstrap";
import ReactPlaceholder from "react-placeholder";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SellerLayout from "../../components/Layout/Layout/SellerLayout";
import ImageUploadModal from "../../components/Modal/ImageUploadModal";
import {
  GetCarsFailure,
  GetCarsStart,
  GetCarsSuccess,
  UploadImageFailure,
  UploadImageStart,
  UploadImageSuccess,
} from "../../features/VehicleSlice";
import axios from "../../utils/axios";

import { toast } from "react-toastify";
import ProductCarousel from "../../components/VehicleCarousel";
import { parseError } from "../../utils/parseError";
import PageNotFound from "../PageNotFound";

const ErrorToastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};
const successToastOptions = {
  position: "top-center",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};
const VehicleDetails = () => {
  const [modalShow, set_modal_show] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const { isFetching, isUploading } = useSelector((state) => state.vehicle);
  const { token } = useSelector((state) => state.auth);
  const { carId } = useParams();
  const [car, setCar] = useState([]);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDetails = async () => {
      dispatch(GetCarsStart());
      try {
        const { data } = await axios.get(`/api/car/get-car-details/${carId}`, {
          headers: { Authorization: token },
        });
        // console.log(data);
        setCar(data.car);
        dispatch(GetCarsSuccess(data));
      } catch (error) {
        dispatch(GetCarsFailure());
        setFetchError(true);
      }
    };

    fetchDetails();
  }, []);
  const handleEditClick = () => {
    navigate(`/dashboard/user/edit-car-details/${carId}`);
  };
  const handleCreateAuction = () => {
    navigate(`/dashboard/user/create-auction/${carId}`);
  };
  const handleImageUpload = async (formData) => {
    dispatch(UploadImageStart());

    try {
      // Check if there are no images selected

      const { data } = await axios.patch(
        `/api/car/push-more-images/${carId}`,
        formData,
        {
          headers: { Authorization: `${token}` },
        }
      );
      dispatch(UploadImageSuccess(data));
      set_modal_show(false);
      setRerenderTrigger((prevState) => !prevState);

      if (!formData.has("image")) {
        set_modal_show(false);
        toast.error("No images selected", ErrorToastOptions);
        return;
      } else {
        toast.success("Uploaded!", successToastOptions);
      }
    } catch (error) {
      const errorMessage = parseError(error);
      toast.error(errorMessage, ErrorToastOptions);
      dispatch(UploadImageFailure(errorMessage));
    }
  };

  return (
    <SellerLayout>
      {fetchError ? (
        <PageNotFound />
      ) : (
        <>
          {" "}
          <h3>Update Vehicle Details</h3>
          <ReactPlaceholder
            type="text"
            color="#F0F0F0"
            showLoadingAnimation
            rows={5}
            style={{ width: "80%" }}
            ready={!isFetching}
          >
            <div className="container mt-5">
              <Card className="seller-Car-card">
                <div
                  className=" Edit-box text-end"
                  onClick={() => set_modal_show(true)}
                >
                  <span className="mr-1 ">Add More Images</span>
                  <ImageUploadModal
                    show={modalShow}
                    onImageUpload={handleImageUpload}
                  />
                  <i className="fas fa-add " />
                </div>
                <div className="seller-vehicle-head">
                  <ProductCarousel
                    carId={car._id}
                    key={rerenderTrigger}
                    deleteParam={true}
                  />
                  <div className="car-details">
                    <div className="up-content clearfix">
                      <h1>{car.model}</h1>
                      <NavLink
                        className=" Edit-box text-end"
                        onClick={handleEditClick}
                      >
                        <span className="mr-1 ">Edit</span>
                        <i className="fas fa-edit "></i>
                      </NavLink>
                      {!car.isAuction_created && (
                        <>
                          {" "}
                          <span>
                            <NavLink
                              className="btn btn-bid"
                              style={{ width: 100 }}
                              onClick={() => handleCreateAuction()}
                            >
                              Create Auction
                            </NavLink>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="details">
                  <div className="head-side-bar">
                    <h4>Vehicle Details</h4>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="list-info">
                        <ul>
                          <li>
                            <span>Manufacturing Year:</span>
                            {car.manufacture_year}
                          </li>
                          <li>
                            <span>Fuel Type:</span>
                            {car.fuel_type}
                          </li>
                          <li>
                            <span>No of Cylinders</span> {car.num_of_cylinders}
                          </li>
                          <li>
                            <span>Transmission Type:</span>{" "}
                            {car.transmission_type}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="list-info">
                        <ul>
                          <li>
                            <span>Color:</span> {car.color}
                          </li>
                          <li>
                            <span>Engine Capacity:</span> {car.engine_capacity}
                          </li>
                          <li>
                            <span>Odometer Reading:</span>
                            {car.odometer_reading}
                          </li>
                          <li>
                            <span>VIN No:</span>{" "}
                            {car.unique_identification_number}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="details">
                  <div className="head-side-bar">
                    <h4>Vehicle Location</h4>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="list-info">
                        <ul>
                          <li>
                            <span>Complete Address:</span>
                            {car.car_address}
                          </li>{" "}
                          <li>
                            <span>City:</span>
                            {car.car_city}
                          </li>{" "}
                          <li>
                            <span>Suburb:</span>
                            {car.car_shuburb}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="list-info">
                        <ul>
                          <li>
                            <span>State:</span>
                            {car.car_state}
                          </li>
                          <li>
                            <span>Postal Code:</span>
                            {car.car_postal_code}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                <div className="details">
                  <div className="head-side-bar">
                    <h4>Description</h4>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="list-info">
                        <p>{car.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </ReactPlaceholder>
        </>
      )}
    </SellerLayout>
  );
};

export default VehicleDetails;
