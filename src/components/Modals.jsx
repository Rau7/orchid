import IMAGES from "../photos";
import METADATA from "../metadata";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import React, { useState, useEffect } from "react";
import _ from "lodash";

function Modals({ imageList, clickedId }) {
  const [images, setImages] = useState(imageList);

  function addDropFav(imageId) {
    axios
      .post(`https://admin.reblium.com/add_drop_image_fav/?image_id=${imageId}`)
      .then((response) => {
        let newArr = [...images];
        let b = _.findIndex(newArr, function (el) {
          return el.name === imageId;
        });
        newArr[b].faved = response.data;
        setImages(newArr);
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
        console.error("There was an error!", error);
      });
  }

  if (clickedId === "") {
    return "";
  } else {
    return (
      <div className="modals-area">
        <div className="modal-content d-flex justify-content-center align-items-center">
          <div className="row d-flex justify-content-center">
            <div className="col-md-5">
              <div className="modal-nft-card">
                <div className="modal-nft-image-area">
                  <img
                    src={IMAGES[clickedId]}
                    className="modal-nft-image"
                    alt="NFT Text"
                  ></img>
                </div>
                <div className="modal-nft-info">
                  <div className="modal-nft-image-name">{`Item ${clickedId}`}</div>
                  <div className="modal-nft-image-description">
                    {/*Description : {METADATA[clickedId].description}*/}
                    <div className="modal-attr-trts">
                      <div className="row">
                        <div className="col-6">
                          {METADATA[clickedId].attributes
                            .slice(0, 11)
                            .map((attr) => (
                              <div className="each-attribute">
                                <span className="trait-name">
                                  {attr.trait_type}
                                </span>{" "}
                                : {attr.value}
                              </div>
                            ))}
                        </div>
                        <div className="col-6">
                          {METADATA[clickedId].attributes
                            .slice(12, 22)
                            .map((attr) => (
                              <div className="each-attribute">
                                <span className="trait-name">
                                  {attr.trait_type}
                                </span>{" "}
                                : {attr.value}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="nft-like-area d-flex justify-content-center">
                  <button
                    className="btn like-button"
                    onClick={() => addDropFav(clickedId)}
                  >
                    <FaHeart
                      className={`like-icon ${
                        images[clickedId].faved === "1" ? "faved" : "not-faved"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modals;
