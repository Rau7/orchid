import "./App.css";
import "./Homenew.css";
import IMAGES from "./photos";
import METADATA from "./metadata";
import logo from "./images/xspectar.png";
import { FaHeart, FaPlusCircle, FaSearch, FaBars, FaTh } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import Modals from "./components/Modals";

function Hometwo() {
  const [images, setImages] = useState([]);
  const [traits, setTraits] = useState([]);
  const [imageCount, setImageCount] = useState(0);

  const [filterArr, setFilterArr] = useState([]);
  const [filteredImgs, setFilteredImages] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [clickedImage, setClickedImage] = useState("");

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20);
  const [loadDis, setLoadDis] = useState("");
  const [loadBeforeDis, setLoadBeforeDis] = useState("d-none");
  const [coloring, setColoring] = useState("");

  const [pageNo, setPageNo] = useState(1);

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
          let trtt = filterArr[k].substring(0, filterArr[k].indexOf(" "));
          if (
            attr === images[i]["attributes"][j]["value"] &&
            trtt === images[i]["attributes"][j]["trait_type"]
          ) {
            filter_counter++;
          }
        }
      }
      if (filterArr.length === filter_counter) {
        lastArr[normal_counter] = images[i];
        normal_counter++;
      }
    }
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
    setStartIndex(0);
    setLoadBeforeDis("d-none");
  }, [filterArr, images]);

  const handleTextChange = (e) => {
    e.preventDefault();
    setFilteredImages(images);
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (searchText === "") {
      setFilteredImages(images);
      setImageCount(images.length);
    } else {
      let lastArr = [];
      let normal_counter = 0;
      for (let i = 0; i < filteredImgs.length; i++) {
        if (
          filteredImgs[i]["name"]
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          lastArr[normal_counter] = filteredImgs[i];
          normal_counter++;
        }
        for (let j = 0; j < filteredImgs[i]["attributes"].length; j++) {
          if (
            filteredImgs[i]["attributes"][j]["value"]
              .toLowerCase()
              .includes(searchText.toLowerCase())
          ) {
            lastArr[normal_counter] = filteredImgs[i];
            normal_counter++;
          }
        }
      }
      const uniqueArray = lastArr.filter(
        (v, i, a) => a.findIndex((t) => t.name === v.name) === i
      );
      setFilteredImages(uniqueArray);
      setStartIndex(0);
      setLoadBeforeDis("d-none");
      setImageCount(uniqueArray.length);
    }
  }, [searchText]);

  function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  function loadMore() {
    var newIndex = endIndex + 20;
    if (newIndex >= 800) {
      newIndex = 800;
      setLoadDis("d-none");
    }
    setEndIndex(newIndex);
  }

  function loadBefore() {
    var newIndex = startIndex - 20;
    if (startIndex <= 0) {
      startIndex = 0;
      setLoadBeforeDis("d-none");
    } else {
      setLoadBeforeDis("");
    }
    setStartIndex(newIndex);
  }

  async function expandAndScroll(id) {
    loadForScroll(id);
  }

  async function topExpand() {
    setLoadBeforeDis("d-none");
    setStartIndex(0);
    setEndIndex(20);
  }

  function loadForScroll(id) {
    setLoadBeforeDis("");
    setStartIndex(id - 20);
    setEndIndex(id + 20);
  }

  function openNewModal(image_id) {
    setClickedImage(image_id);
  }

  function showAll() {
    setFilterArr([]);
    setFilteredImages(images);
    setImageCount(images.length);
  }

  function showFemale() {
    let normal_counter = 0;
    let filter_counter = 0;
    let lastArr = [];
    for (let i = 0; i < images.length; i++) {
      filter_counter = 0;
      for (let j = 0; j < images[i]["attributes"].length; j++) {
        if (
          images[i]["attributes"][j]["trait_type"] === "Gender" &&
          images[i]["attributes"][j]["value"] === "Female"
        ) {
          lastArr[normal_counter] = images[i];
          normal_counter++;
        }
      }
    }
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
  }

  function showMale() {
    let normal_counter = 0;
    let filter_counter = 0;
    let lastArr = [];
    for (let i = 0; i < images.length; i++) {
      filter_counter = 0;
      for (let j = 0; j < images[i]["attributes"].length; j++) {
        if (
          images[i]["attributes"][j]["trait_type"] === "Gender" &&
          images[i]["attributes"][j]["value"] === "Male"
        ) {
          lastArr[normal_counter] = images[i];
          normal_counter++;
        }
      }
    }
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
  }

  function decreasePageNumber() {
    if (pageNo <= 1) {
      setPageNo(1);
    } else {
      setPageNo(pageNo - 1);
    }
  }

  function increasePageNumber() {
    if (pageNo >= 23) {
      setPageNo(23);
    } else {
      setPageNo(pageNo + 1);
    }
  }

  return (
    <>
      <div className="App">
        <div className={`row`}>
          <div className="logo-area d-flex justify-content-center">
            <a href="https://xspectar.com/" target="_blank">
              <img src={logo} className="thelogo" alt="The Logo"></img>
            </a>
          </div>
          <div className="filterarea">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id={`headingOneTraits`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapseOneTraits`}
                    aria-expanded="false"
                    aria-controls={`collapseOneTraits`}
                  >
                    {`Filters`}
                  </button>
                </h2>
                <div
                  id={`collapseOneTraits`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`headingOneTraits`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <div className="trait-filters container">
                      {traits &&
                        traits.map((item) => (
                          <div className="dropdown" key={item.trait_type}>
                            <button
                              className="btn btn-secondary dropdown-toggle drop-btn"
                              type="button"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {`${item.trait_type}`}
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              {item.attributes &&
                                item.attributes.map((att) => (
                                  <li key={att} className="trait-list-item">
                                    <label
                                      className="form-check-label"
                                      htmlFor={`flexCheckDefault${att}`}
                                    >
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue
                                        id={`flexCheckDefault${att}`}
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
                                      {att}
                                    </label>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 searchbar container">
              <div className="input-group mb-3">
                <FaSearch className="search-icon" />
                <input
                  onChange={handleTextChange}
                  type="text"
                  className="form-control search-input"
                  placeholder="Search by item number or trait.."
                  aria-label="Search some"
                  aria-describedby="button-addon2"
                  value={searchText}
                />
              </div>
            </div>
            <div className="col-12 sidebar container">
              <div className="header-area container d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-start cont">
                  <div className="main-area-header">
                    {imageCount} Items Listed
                  </div>
                  <div className="liked-images-link d-flex justify-content-center">
                    <Link to="/liked_images" className="navigation-button">
                      Liked Images
                    </Link>
                  </div>
                  <div className="liked-images-link d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        showAll();
                      }}
                    >
                      All
                    </button>
                  </div>
                  <div className="liked-images-link d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        showFemale();
                      }}
                    >
                      Female
                    </button>
                  </div>
                  <div className="liked-images-link d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        showMale();
                      }}
                    >
                      Male
                    </button>
                  </div>
                </div>
                <div className="liked-images-link d-flex justify-content-end d-none">
                  <div className="page-area d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        decreasePageNumber();
                      }}
                    >
                      {`<`}
                    </button>
                    <div className="page-num">{pageNo}</div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        increasePageNumber();
                      }}
                    >
                      {`>`}
                    </button>
                  </div>
                </div>
              </div>
              <div className="filter-section">
                <div className="row">
                  {filterArr &&
                    filterArr.map((item) => (
                      <div className="filters-item" key={item}>
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
            </div>
          </div>

          <div className="col-12 content padding-0">
            <div className="go-top-area">
              <button
                className="cstm-btn"
                onClick={() => {
                  topExpand().then((e) => {
                    document.getElementById("root").scrollIntoView();
                  });
                }}
              >
                Top
              </button>
            </div>
            <div className="col-lg-12 main-area container">
              <div
                className={`load-area d-flex justify-content-center mt-5 ${loadBeforeDis}`}
              >
                <button className="load-more" onClick={() => loadBefore()}>
                  Load Before
                </button>
              </div>

              <div className="main-area-content">
                <div className={`row`}>
                  {filteredImgs.length !== 0 ? (
                    filteredImgs.slice(startIndex, endIndex).map((item) => (
                      <div
                        className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 d-flex"
                        key={item.name}
                        id={item.name}
                      >
                        <div className="card-area">
                          <div className="nft-image-area">
                            <img
                              onClick={() => openNewModal(item.name)}
                              src={IMAGES[item.name]}
                              className={`nft-image ${
                                coloring + "-" + item.name
                              }`}
                              alt="NFT Text"
                            ></img>
                            <div className="nft-image-name">
                              #{padLeadingZeros(item.name, 4)}
                            </div>
                            <div className="nft-like-area">
                              <button
                                className="btn like-button"
                                onClick={() => addDropFav(item.name)}
                              >
                                <FaHeart
                                  className={`like-icon ${
                                    item.faved === "1" ? "faved" : "not-faved"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="nft-card">
                            <div className="nft-info">
                              <div className="nft-image-description">
                                {/*Description : {METADATA[item.name].description}*/}
                                <div className="each-attribute">
                                  <ul className="trait-lists">
                                    {METADATA[item.name].attributes
                                      .filter(
                                        (attri) => attri.value !== "Nothing"
                                      )
                                      .map((attr) => (
                                        <li>
                                          <span className="trait-name">
                                            {attr.trait_type}
                                          </span>
                                          <span className="trait-attr">
                                            : {attr.value}
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="nothing-to-show">Nothing To Show</div>
                  )}
                </div>
                <div
                  className={`load-area d-flex justify-content-center mt-5 ${loadDis}`}
                >
                  <button className="load-more" onClick={() => loadMore()}>
                    Load More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modals
          image_id={clickedImage}
          faved={images[clickedImage - 1]}
          faving={() => addDropFav(clickedImage)}
          click_img_fn={() => setClickedImage()}
        />
      </div>
    </>
  );
}

export default Hometwo;
