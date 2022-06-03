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
  const [traits, setTraits] = useState([]);

  const [filterArr, setFilterArr] = useState([]);

  useEffect(() => {
    axios
      .get(`https://admin.reblium.com/get_xspectar_images_fav`)
      .then((res) => {
        const imgs = res.data;
        setImages(imgs);
      });

    axios.get(`https://admin.reblium.com/attrs_traits`).then((res) => {
      const trts = res.data;
      setTraits(trts);
    });
  }, []);

  function addDropFav(imageId) {
    axios
      .post(`https://admin.reblium.com/add_drop_image_fav/?image_id=${imageId}`)
      .then((response) => {
        let newArr = [...images];
        newArr[imageId - 1].faved = response.data;
        setImages(newArr);
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
        console.error("There was an error!", error);
      });
    /*axios
      .get(`https://admin.reblium.com/get_xspectar_images_fav`)
      .then((res) => {
        const imgs = res.data;
        setImages(imgs);
      });*/
  }

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
              <div className="main-area-header">88 Items Listed</div>
              <div className="filter-section">
                <div className="row">
                  {filterArr &&
                    filterArr.map((item) => (
                      <div className="col-md-3" key={item}>
                        <div className="filter-item">{item}</div>
                      </div>
                    ))}
                </div>
              </div>
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
                              alt="NFT Picture"
                            ></img>
                          </div>
                          <div className="nft-info">
                            <div className="nft-image-name">{`Item ${item.id}`}</div>
                            <div className="nft-image-description">
                              Lorem, ipsum dolor sit amet consectetur
                              adipisicing elit. Ullam, iure.
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
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*images &&
        images.slice(0, 8).map((item) => (
          <div
            className={`modal fade`}
            id={`#exampleModal${item.id}`}
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {`Item ${item.id}`}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">...</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))*/}
      </div>
    </>
  );
}

export default App;
