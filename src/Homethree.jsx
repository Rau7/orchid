import "./App.css";
import "./Homenew.css";
import IMAGES from "./photos";
import METADATA from "./metadata";
import logo1 from "./images/1.png";
import { FaHeart, FaPlusCircle, FaSearch, FaBars, FaTh } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import Modals from "./components/Modals";
import ATRAITS from "./attrs_traits";

function Homethree() {
  const [images, setImages] = useState(METADATA);
  const [traits, setTraits] = useState(ATRAITS);
  const [imageCount, setImageCount] = useState(0);
  const [favs, setFavs] = useState([]);

  const [filterArr, setFilterArr] = useState([]);
  const [filteredImgs, setFilteredImages] = useState(METADATA);

  const [searchText, setSearchText] = useState("");

  const [clickedImage, setClickedImage] = useState("");

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20);
  const [loadDis, setLoadDis] = useState("");
  const [loadBeforeDis, setLoadBeforeDis] = useState("d-none");
  const [coloring, setColoring] = useState("");

  const [pageNo, setPageNo] = useState(1);

  const [range, setRange] = useState(2);
  const [rangeValxxl, setRangeValxxl] = useState(2);
  const [rangeValxl, setRangeValxl] = useState(3);
  const [rangeVallg, setRangeVallg] = useState(4);
  const [rangeValmd, setRangeValmd] = useState(6);
  const [rangeValsm, setRangeValsm] = useState(12);
  const [rangeVal, setRangeVal] = useState(12);

  const [trt, setTrt] = useState("two");

  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(19);

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(20);

  /* 1st PAGE IS LANDED
  get images metadata
  setImages 
  setFilteredImages (all_images as default)
  */
  useEffect(() => {
    axios.get(`https://admin.reblium.com/get_xspectar_favs`).then((res) => {
      setFavs(res.data);
    });
    setImageCount(images.length - 1);
  }, []);

  /* 
    LIKE IMAGE OR DISLIKE THE IMAGE
  */
  function addDropFav(imageId) {
    axios
      .post(`https://admin.reblium.com/add_drop_image_fav/?image_id=${imageId}`)
      .then((response) => {
        let newArr = [...favs];
        newArr[imageId - 1].faved = response.data;
        setFavs(newArr);
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
      setMin(1);
      setMax(20);
      setStartIndex(min);
      setEndIndex(max);
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
      setMin(1);
      setMax(uniqueArray.length);
      setStartIndex(min);
      setEndIndex(max);
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

  window.addEventListener("scroll", loadMore);

  function loadMore() {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement.scrollHeight
    ) {
      var newIndex = endIndex + 20;
      if (newIndex >= 8888) {
        newIndex = 8888;
        setLoadDis("d-none");
      }
      setMin(1);
      setMax(newIndex);
      setEndIndex(newIndex);
    }
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
    setMin(1);
    setMax(20);
    setStartIndex(min);
    setEndIndex(max);
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
    setImageCount(19);
    setMin(1);
    setMax(20);
    setStartIndex(min);
    setEndIndex(max);
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
    setMin(1);
    setMax(20);
    setStartIndex(min);
    setEndIndex(max);
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
  }

  function showUnique() {
    let normal_counter = 0;
    let filter_counter = 0;
    let lastArr = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i]["description"] === "Unique") {
        lastArr[normal_counter] = images[i];
        normal_counter++;
      }
    }
    setMin(1);
    setMax(20);
    setStartIndex(min);
    setEndIndex(max);
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
  }

  function showRare() {
    let normal_counter = 0;
    let filter_counter = 0;
    let lastArr = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i]["description"] === "Rare") {
        lastArr[normal_counter] = images[i];
        normal_counter++;
      }
    }
    setMin(1);
    setMax(20);
    setStartIndex(min);
    setEndIndex(max);
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
  }

  function showCommon() {
    let normal_counter = 0;
    let filter_counter = 0;
    let lastArr = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i]["description"] === "Common") {
        lastArr[normal_counter] = images[i];
        normal_counter++;
      }
    }
    setMin(1);
    setMax(lastArr.length);
    setStartIndex(min);
    setEndIndex(max);
    setFilteredImages(lastArr);
    setImageCount(lastArr.length);
  }

  const handleRange = (e) => {
    setRange(e.target.value);

    if (e.target.value == 1) {
      setRangeValxxl(1);
      setRangeValxl(1);
      setRangeVallg(2);
      setRangeValmd(2);
      setRangeValsm(3);
      setRangeVal(3);
      setTrt("one");
    } else if (e.target.value == 2) {
      setRangeValxxl(2);
      setRangeValxl(2);
      setRangeVallg(2);
      setRangeValmd(2);
      setRangeValsm(3);
      setRangeVal(3);
      setTrt("two");
    } else if (e.target.value == 3) {
      setRangeValxxl(3);
      setRangeValxl(3);
      setRangeVallg(3);
      setRangeValmd(3);
      setRangeValsm(3);
      setRangeVal(3);
      setTrt("three");
    } else if (e.target.value == 4) {
      setRangeValxxl(4);
      setRangeValxl(4);
      setRangeVallg(4);
      setRangeValmd(4);
      setRangeValsm(4);
      setRangeVal(4);
      setTrt("four");
    } else if (e.target.value == 5) {
      setRangeValxxl(6);
      setRangeValxl(6);
      setRangeVallg(6);
      setRangeValmd(6);
      setRangeValsm(6);
      setRangeVal(6);
      setTrt("five");
    } else if (e.target.value == 6) {
      setRangeValxxl(12);
      setRangeValxl(12);
      setRangeVallg(12);
      setRangeValmd(12);
      setRangeValsm(12);
      setRangeVal(12);
      setTrt("six");
    }
  };

  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
    setStartIndex(e.minValue);
    setEndIndex(e.maxValue);
  };

  const handleStart = (e) => {
    setMin(e.target.value);
  };

  const handleEnd = (e) => {
    setMax(e.target.value);
  };

  const showRange = () => {
    setStartIndex(min);
    setEndIndex(max);
  };

  return (
    <>
      <div className="App">
        <div className={`row`}>
          <div className="logo-area d-flex justify-content-center">
            <a href="https://xspectar.com/" target="_blank">
              <img src={logo1} className="thelogo" alt="The Logo"></img>
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
            <div className="filter-section container">
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
            <div className="row d-flex align-items-center justify-content-center container cont">
              <div className="col-md-6 searchbar">
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
              <div className="col-md-2 col-sm-3 col-6">
                <div className="main-area-header text-center">
                  {imageCount} Items Listed
                </div>
              </div>
              <div className="col-md-2 col-sm-3 col-6">
                <div className="liked-images-link d-flex justify-content-center">
                  <Link to="/approved_images" className="navigation-button">
                    Approved Images
                  </Link>
                </div>
              </div>
            </div>
            <div className="row range-area">
              <div className="col-md-2 col-sm-6 d-flex justify-content-start align-items-center">
                <div className="range">
                  <label htmlFor="customRange2" className="form-label">
                    Zoom
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min={1}
                    max={6}
                    value={range}
                    id="customRange2"
                    onChange={(e) => {
                      handleRange(e);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3 col-sm-6 d-flex align-items-center justify-content-start">
                <div className="row ranger">
                  <div className="col-3">
                    <div className="start-area">
                      <input
                        type="number"
                        className="range-input"
                        value={min}
                        onChange={(e) => {
                          handleStart(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="end-area">
                      <input
                        type="number"
                        className="range-input"
                        value={max}
                        onChange={(e) => {
                          handleEnd(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="sbmt-btn">
                      <button
                        type="button"
                        className="btn btn-primary apply"
                        onClick={() => {
                          showRange();
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 filterz">
                <div className="row">
                  <div className="col-sm-2 col-3 filter-btnz">
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
                  </div>
                  <div className="col-sm-2 col-3 filter-btnz">
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
                  </div>
                  <div className="col-sm-2 col-3 filter-btnz">
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
                  <div className="col-sm-2 col-3 filter-btnz">
                    <div className="liked-images-link d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          showUnique();
                        }}
                      >
                        Unique
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-2 col-3 filter-btnz">
                    <div className="liked-images-link d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          showRare();
                        }}
                      >
                        Rare
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-2 col-3 filter-btnz">
                    <div className="liked-images-link d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          showCommon();
                        }}
                      >
                        Common
                      </button>
                    </div>
                  </div>
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
            <div className="col-lg-12 main-area">
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
                    filteredImgs.slice(startIndex - 1, endIndex).map((item) => (
                      <div
                        className={`col-xxl-${rangeValxxl} col-xl-${rangeValxl} col-lg-${rangeVallg} col-md-${rangeValmd} col-sm-${rangeValsm} col-${rangeVal} d-flex`}
                        key={item.name}
                        id={item.name}
                      >
                        <div className="card-area">
                          <div className="nft-image-area">
                            <img
                              onClick={() => openNewModal(item.name)}
                              src={IMAGES[item.name - 1]}
                              className={`nft-image ${
                                coloring + "-" + item.name
                              }`}
                              alt="NFT Text"
                            ></img>
                            <div className={`nft-image-name ${trt}`}>
                              #{padLeadingZeros(item.name, 4)}
                            </div>
                            <div className={`nft-like-area ${trt}`}>
                              <button
                                className="btn like-button"
                                onClick={() => addDropFav(item.name)}
                              >
                                <FaHeart
                                  className={`like-icon ${
                                    favs[item.name - 1]?.faved === "1"
                                      ? "faved"
                                      : "not-faved"
                                  } ${favs}`}
                                />
                              </button>
                            </div>
                          </div>
                          <div className={`nft-card ${trt}`}>
                            <div className="nft-info">
                              <div className="nft-image-description">
                                {/*Description : {METADATA[item.name].description}*/}
                                <div className="each-attribute">
                                  <ul className="trait-lists">
                                    {METADATA[item.name - 1].attributes
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
                  className={`load-area d-flex justify-content-center mt-5 d-none`}
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
          faved={favs[clickedImage - 1]}
          faving={() => addDropFav(clickedImage)}
          click_img_fn={() => setClickedImage()}
        />
      </div>
    </>
  );
}

export default Homethree;
