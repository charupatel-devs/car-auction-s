import React, { memo, useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import {
  GetImagesFailure,
  GetImagesStart,
  GetImagesSuccess,
} from "../features/VehicleSlice";
import axios from "../utils/axios";

const ProductCarousel = memo(({ carId, rerenderTrigger, deleteParam }) => {
  const { isFetchingImage } = useSelector((state) => state.vehicle);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imageToDelete, setImageToDelete] = useState(null);

  const onChange = (index) => {
    setCurrentIndex(index);
  };

  const fetchImages = async () => {
    dispatch(GetImagesStart());
    try {
      const { data } = await axios.get(`/api/car/get-car-images/${carId}`, {
        headers: { Authorization: token },
      });
      setImages(data.images);
      dispatch(GetImagesSuccess(data));
    } catch (error) {
      dispatch(GetImagesFailure());
    }
  };

  useEffect(() => {
    fetchImages();
  }, [carId, token, rerenderTrigger, deleteParam]);

  const deleteImage = async (link) => {
    try {
      await axios.delete(`/api/car/delete-car-image/${carId}`, {
        data: { img: link },
        headers: { Authorization: `${token}` },
      });

      fetchImages();
    } catch (error) {
      // console.error("Error deleting image:", error);
    }
  };

  const openDeleteModal = (image) => {
    setImageToDelete(image);
  };

  const handleDelete = async (image) => {
    const confirmed = window.confirm("Do you want to delete the image?");
    if (confirmed) {
      await deleteImage(image);
    }
  };

  return (
    <ReactPlaceholder
      type="media"
      color="#F0F0F0"
      showLoadingAnimation
      rows={5}
      ready={!isFetchingImage}
      style={{ width: "80%" }}
    >
      <Carousel className="product-carousel" showThumbs={true}>
        {images.map((image, index) => (
          <div key={index}>
            <img className="d-block" src={image} alt={`Slide ${index}`} />
            {deleteParam && (
              <button
                style={{
                  position: "relative",
                  bottom: "30px",
                }}
                onClick={() => handleDelete(image)}
              >
                <i className="fa-solid fa-trash" />
              </button>
            )}
          </div>
        ))}
      </Carousel>
    </ReactPlaceholder>
  );
});

export default ProductCarousel;
