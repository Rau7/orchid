import IMAGES from "../photos";
import METADATA from "../metadata";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import MODAL_ARR from "../modal_arr";

function Modals({ image_id, faved, faving, click_img_fn }) {
  const [modalArr, setModalArr] = useState(MODAL_ARR);
  const [imageID, setImageID] = useState(image_id);
  const [imageFaved, setImageFaved] = useState(0);
  const [favState, setFavState] = useState();
  document.onkeydown = skip;

  useEffect(() => {
    if (typeof faved === "undefined") {
      setImageFaved(0);
    } else {
      setImageFaved(faved.faved);
    }
    setImageID(image_id);
  }, [image_id]);

  function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  function closeModal() {
    setImageID("");
    click_img_fn("");
  }

  function favornot() {
    setImageFaved(imageFaved === "0" ? "1" : "0");
    faving(imageID);
  }

  function skip(e) {
    if (e.keyCode == "37") {
      if (imageID <= 1) {
        setImageID(1);
      } else {
        let imgd = imageID;
        setImageID(imgd - 1);
      }
    } else if (e.keyCode == "39") {
      if (imageID >= 8888) {
        setImageID(8888);
      } else {
        let imgd = imageID;
        setImageID(imgd + 1);
      }
    } else if (e.keyCode == "27") {
      closeModal();
    }
  }

  return (
    <div>
      <div
        className={`modal d-flex justify-content-center align-items-center ${
          imageID === "" || typeof imageID === "undefined" ? "d-none" : ""
        }`}
      >
        <div
          className="modal-area"
          onKeyPress={(e) => {
            skip(e);
          }}
        >
          <div className="modal-card">
            <div className="nft-image-area">
              <img
                src={IMAGES[imageID - 1]}
                className="modal-image"
                alt="NFT Text"
              ></img>
              <div className="nft-image-name">
                #{padLeadingZeros(imageID, 4)}
              </div>
              <div className="nft-like-area">
                <button
                  className="btn like-button"
                  onClick={() => {
                    favornot();
                  }}
                >
                  <FaHeart
                    className={`like-icon ${
                      imageFaved === "1" ? "faved" : "not-faved"
                    }`}
                  />
                </button>
              </div>
              <div className="close-area">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => closeModal(imageID)}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modals;
