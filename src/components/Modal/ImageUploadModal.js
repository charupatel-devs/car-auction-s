import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  UploadImageFailure,
  UploadImageStart,
  UploadImageSuccess,
} from "../../features/VehicleSlice";
import axios from "../../utils/axios";
import { parseError } from "../../utils/parseError";
import ImagesGallery from "../ImageGallery";

const ImageUploadModal = ({ show, onImageUpload }) => {
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [previousImages, setPreviousImages] = useState([]);
  const [image, setImage] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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

  const handleImageUpload = async (e) => {
    const formdata = new FormData();
    // if (!instructionModalShown) {
    //   setShowInstructionModal(true);
    //   setInstructionModalShown(true);
    // }
    const files = e.target.files;
    let allImages = [...previousImages];

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 1024 * 1024 * 5) {
        toast.error(
          "Image size too large! only 5mb allowed.",
          ErrorToastOptions
        );
        return;
      }
    }
    for (let i = 0; i < files.length; i++) {
      formdata.append("image", files[i]);
    }
    try {
      dispatch(UploadImageStart());
      const { data } = await axios.post(`/api/car/add-car-images`, formdata, {
        headers: { Authorization: `${token}` },
      });
      // alert(data.location);
      // Update the state with the new images
      setImages(data.location);
      // Update the previewImages state based on the existing state
      await setPreviewImages((prevImages) => {
        // Ensure prevImages is not null or undefined
        if (!prevImages) {
          return [...data.location];
        } else {
          // Append the new images to the existing previewImages state
          return [...prevImages, ...data.location];
        }
      });

      dispatch(UploadImageSuccess(data));
    } catch (error) {
      const errorMessage = parseError(error);
      toast.error(errorMessage, ErrorToastOptions);
      dispatch(UploadImageFailure(errorMessage));
    }
  };

  const handleRemoveImage = async (link) => {
    try {
      dispatch(UploadImageStart());
      const { data } = await axios.delete(`/api/car/remove-car-image`, {
        data: { img: link },
        headers: { Authorization: `${token}` },
      });
      setPreviewImages((prevImages) =>
        prevImages.filter((image) => image !== link)
      );
      setImages((prevImages) => prevImages.filter((image) => image !== link));
      dispatch(UploadImageSuccess(data));
    } catch (error) {
      const errorMessage = parseError(error);
      toast.error(errorMessage, ErrorToastOptions);
      dispatch(UploadImageFailure(errorMessage));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("started");

    if (images) {
      // Perform your image upload logic here
      // For example, you can use FormData to upload the image
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images_url", images[i]);
      }
      // Call the onImageUpload function with the formData
      await onImageUpload(formData);
    }
    // Close the modal
  };

  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title>Upload Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table className="form-table">
          <tbody>
            <tr>
              <td>
                <Form.Label className="font-weight-bold">
                  Upload Images
                  <sup className="text-danger font-weight-bold">*</sup>:
                </Form.Label>
              </td>
              <td>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  name="images"
                  multiple
                  accept="image/jpeg,image/heic,image/*"
                />

                <ImagesGallery
                  images={previewImages}
                  onRemove={handleRemoveImage}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Next
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageUploadModal;
