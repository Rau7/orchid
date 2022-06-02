import "./App.css";
import IMAGES from "./photos";
import logo from "./images/xspectar.png";
import { FaHeart } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  window.onload = passwordCheck;
  function passwordCheck() {
    var password = prompt("Please enter the password.");
    if (password !== "bello") {
      passwordCheck();
    }
  }

  const [images, setImages] = useState([]);
  const [fav, setFav] = useState(0);

  useEffect(() => {
    axios
      .get(`https://admin.reblium.com/get_xspectar_images_fav`)
      .then((res) => {
        const imgs = res.data;
        setImages(imgs);
      });
  }, []);

  function addDropFav(imageId) {
    axios
      .post(`https://admin.reblium.com/add_drop_image_fav/?image_id=${imageId}`)
      .then((response) => console.log(response))
      .catch((error) => {
        this.setState({ errorMessage: error.message });
        console.error("There was an error!", error);
      });
    axios
      .get(`https://admin.reblium.com/get_xspectar_images_fav`)
      .then((res) => {
        const imgs = res.data;
        setImages(imgs);
      });
  }

  return (
    <div className="App">
      <div className="row">
        <div className="col-xl-2 sidebar ">
          <div className="logo-area d-flex justify-content-center">
            <img src={logo} className="thelogo" alt="The Logo"></img>
          </div>
          <div className="traits-area traits-area-md">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="false"
                    aria-controls="collapseOne"
                  >
                    Avatar
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <div className="form-check">
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        Option 1
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="flexCheckDefault"
                      />
                    </div>
                    <div className="form-check">
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        Option 2
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="flexCheckDefault"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Back
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <strong>This is the second item's accordion body.</strong>{" "}
                    It is hidden by default, until the collapse plugin adds the
                    appropriate classes that we use to style each element. These
                    classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions. You can modify any
                    of this with custom CSS or overriding our default variables.
                    It's also worth noting that just about any HTML can go
                    within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Background
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <strong>This is the third item's accordion body.</strong> It
                    is hidden by default, until the collapse plugin adds the
                    appropriate classes that we use to style each element. These
                    classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions. You can modify any
                    of this with custom CSS or overriding our default variables.
                    It's also worth noting that just about any HTML can go
                    within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-10 content">
          <div className="col-lg-12 searchbar container">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search by name or trait.."
                aria-label="Search some"
                aria-describedby="button-addon2"
              />
              <button
                className="btn btn-outline-primary search-button"
                type="button"
                id="button-addon2"
              >
                Search
              </button>
            </div>
          </div>
          <div className="col-lg-12 main-area container">
            <div className="main-area-header">88 Items Listed</div>
            <div className="main-area-content">
              <div className="row">
                {images &&
                  images.slice(0, 8).map((item) => (
                    <div className="col-xl-3 col-lg-4 col-md-6" key={item.id}>
                      <div className="nft-card">
                        <div className="nft-image-area">
                          <img
                            src={IMAGES[item.id - 1]}
                            className="nft-image"
                          ></img>
                        </div>
                        <div className="nft-info">
                          <div className="nft-image-name">{`Item ${item.id}`}</div>
                          <div className="nft-image-description">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Ullam, iure.
                          </div>
                        </div>
                        <div className="nft-like-area d-flex justify-content-center">
                          <button
                            className="btn like-button"
                            onClick={() => addDropFav(item.id)}
                          >
                            <FaHeart
                              className={`like-icon ${
                                item.faved == 1 ? "faved" : "not-faved"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
