import "./App.css";
import IMAGES from "./photos";
import METADATA from "./metadata";
import logo from "./images/xspectar.png";
import { FaHeart, FaPlusCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import axios from "axios";
import _, { filter } from "lodash";
import { motion } from "framer-motion";

function App() {
  window.onload = passwordCheck;
  function passwordCheck() {
    var password = prompt("Please enter the password.");
    if (password !== "bello") {
      passwordCheck();
    }
  }

  const [images, setImages] = useState([]);
  const [traits, setTraits] = useState([]);
  const [imageCount, setImageCount] = useState(0);

  const [filterArr, setFilterArr] = useState([]);
  const [filteredImgs, setFilteredImages] = useState([]);

  /* 1st PAGE IS LANDED
  get images metadata
  setImages 
  setFilteredImages (all_images as default)
  */
  useEffect(() => {
    axios
      .get(`https://admin.reblium.com/get_xspectar_images_info`)
      .then((res) => {
        const imgs = res.data;
        setImages(imgs);
        setFilteredImages(imgs);
        setImageCount(imgs.length);
      });

    axios.get(`https://admin.reblium.com/attrs_traits`).then((res) => {
      const trts = res.data;
      setTraits(trts);
    });
  }, []);

  /* 
    LIKE IMAGE OR DISLIKE THE IMAGE
  */
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

  /*
  SET FILTER ARRAY ADD AND DROP
  */
  function addDropFilterList(filterName) {
    let index = filterArr.indexOf(filterName);
    if (index === -1) {
      setFilterArr((filterArr) => [...filterArr, filterName]);
    } else {
      setFilterArr([
        ...filterArr.slice(0, index),
        ...filterArr.slice(index + 1, filterArr.length),
      ]);
    }
  }

  useEffect(() => {
    let normal_counter = 0;
    let filter_counter = 0;
    let lastArr = [];
    for (let i = 0; i < images.length; i++) {
      filter_counter = 0;
      for (let j = 0; j < images[i]["attributes"].length; j++) {
        for (let k = 0; k < filterArr.length; k++) {
          let attr = filterArr[k].substring(filterArr[k].lastIndexOf(" ") + 1);
          if (attr === images[i]["attributes"][j]["value"]) {
            filter_counter++;
          }
        }
      }
      if (filterArr.length == filter_counter) {
        lastArr[normal_counter] = images[i];
        normal_counter++;
      }
    }
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
  }, [filterArr]);

  return (
    <>
      <div className="App">
        <div className="row">
          <div className="col-xl-2 sidebar ">
            <div className="logo-area d-flex justify-content-center">
              <img src={logo} className="thelogo" alt="The Logo"></img>
            </div>
            <div className="traits-area traits-area-md">
              <div className="accordion" id="accordionExample">
                {traits &&
                  traits.map((item) => (
                    <div className="accordion-item" key={item.trait_type}>
                      <h2
                        className="accordion-header"
                        id={`headingOne${item.trait_type}`}
                      >
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseOne${item.trait_type}`}
                          aria-expanded="false"
                          aria-controls={`collapseOne${item.trait_type}`}
                        >
                          {item.trait_type}
                        </button>
                      </h2>
                      <div
                        id={`collapseOne${item.trait_type}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`headingOne${item.trait_type}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          {item.attributes &&
                            item.attributes.map((att) => (
                              <div className="form-check" key={att}>
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {att}
                                </label>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  defaultValue
                                  id="flexCheckDefault"
                                  checked={
                                    filterArr.indexOf(
                                      item.trait_type + " : " + att
                                    ) === -1
                                      ? ""
                                      : "checked"
                                  }
                                  onChange={() =>
                                    addDropFilterList(
                                      item.trait_type + " : " + att
                                    )
                                  }
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
              <div className="main-area-header">{imageCount} Items Listed</div>
              <div className="filter-section">
                <div className="row">
                  {filterArr &&
                    filterArr.map((item) => (
                      <div className="col-md-3" key={item}>
                        <div className="filter-item d-flex justify-content-between align-items-center">
                          {item}
                          <div className="filter-remove-button">
                            <FaPlusCircle
                              className="filter-close-button"
                              onClick={() => addDropFilterList(item)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="main-area-content">
                <div className="row">
                  {filteredImgs.length != 0 ? (
                    filteredImgs.map((item) => (
                      <div className="col-xl-3 col-lg-4 col-md-6" key={item.id}>
                        <div className="nft-card">
                          <div className="nft-image-area">
                            <img
                              src={IMAGES[item.id]}
                              className="nft-image"
                              alt="NFT Text"
                            ></img>
                          </div>
                          <div className="nft-info">
                            <div className="nft-image-name">{`Item ${item.id}`}</div>
                            <div className="nft-image-description">
                              Description : Rare
                            </div>
                          </div>
                          <div className="nft-like-area d-flex justify-content-center">
                            <button
                              className="btn like-button"
                              onClick={() => addDropFav(item.id)}
                            >
                              <FaHeart
                                className={`like-icon ${
                                  item.faved === "1" ? "faved" : "not-faved"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Nothing To Show</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
