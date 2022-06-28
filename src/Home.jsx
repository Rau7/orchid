import "./App.css";
import IMAGES from "./photos";
import METADATA from "./metadata";
import logo from "./images/xspectar.png";
import { FaHeart, FaPlusCircle, FaSearch, FaBars, FaTh } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import LikedImages from "./LikedImages";
import MODAL_ARR from "./modal_arr";

function Home() {
  const [preLoad, setPreLoad] = useState("d-none");
  const [mainLoad, setMainLoad] = useState("");
  const [passText, setPassText] = useState("Password");
  const [passStyle, setPassStyle] = useState("at-first");

  const [images, setImages] = useState([]);
  const [traits, setTraits] = useState([]);
  const [imageCount, setImageCount] = useState(0);

  const [filterArr, setFilterArr] = useState([]);
  const [filteredImgs, setFilteredImages] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [pass, setPass] = useState("");

  const [clickedImage, setClickedImage] = useState("");

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20);
  const [loadDis, setLoadDis] = useState("");
  const [loadBeforeDis, setLoadBeforeDis] = useState("d-none");
  const [coloring, setColoring] = useState("");

  /*Listing Icons */
  const [gridList, setGridList] = useState("");
  const [gridIcon, setGridIcon] = useState("showing");
  const [listList, setListList] = useState("d-none");
  const [listIcon, setListIcon] = useState("not-showing");

  /*Modal Open Close */
  const [modalArr, setModalArr] = useState(MODAL_ARR);

  const handlePass = (e) => {
    e.preventDefault();
    setPass(e.target.value);
  };

  const checkPassword = () => {
    if (pass === "orchid") {
      setPreLoad("d-none");
      setMainLoad("");
    } else {
      setPassStyle("at-last");
      setPassText("Wrong Password !");
    }
  };

  const handleImageClick = (e) => {
    setClickedImage(e);
  };

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
      setImageCount(uniqueArray.length);
    }
  }, [searchText]);

  function traitDisplay(attributes) {
    let display_str = "";

    attributes.forEach((attr) => {
      display_str += attr.trait_type + ": " + attr.value + ", ";
    });
    display_str = display_str.slice(0, -2);

    return <div>{display_str}</div>;
  }

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

  function convertToGrid() {
    setGridIcon("showing");
    setGridList("");
    setListIcon("not-showing");
    setListList("d-none");
    setEndIndex(20);
  }

  function convertToList() {
    setGridIcon("not-showing");
    setGridList("d-none");
    setListIcon("showing");
    setListList("");
    setEndIndex(20);
  }

  function closeModal(image_id) {
    let newArr = [...modalArr];
    newArr[image_id] = false;
    setModalArr(newArr);
  }

  function openModal(image_id) {
    let newArr = [...modalArr];
    newArr[image_id] = true;
    setModalArr(newArr);
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

  async function scrollPage(num) {
    document.getElementById(num).scrollIntoView({ block: "center" });
  }

  function colorTheFirstCol(id) {
    setColoring(`color-area`);
  }

  return (
    <>
      <div className="App">
        <div
          className={`pre-loader d-flex justify-content-center align-items-center ${preLoad}`}
        >
          <div className="login-form">
            <div className="xspectar-image">
              <img src={logo} className="thelogoX" alt="The Logo"></img>
            </div>
            <div className="login-area">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className={`form-label ${passStyle}`}
                >
                  {passText}
                </label>
                <input
                  onChange={handlePass}
                  type="password"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter Password"
                  value={pass}
                />
                <div className="enter-button d-flex justify-content-center mt-5">
                  <button
                    onClick={checkPassword}
                    type="button"
                    className="btn btn-secondary align-content-center"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`row ${mainLoad}`}>
          <div className="col-xl-3 col-lg-4 sidebar padding-0">
            <div className="logo-area d-flex justify-content-center">
              <img src={logo} className="thelogo" alt="The Logo"></img>
            </div>
            <div className="liked-images-link d-flex justify-content-center">
              <Link to="/liked_images" className="navigation-button">
                Liked Images
              </Link>
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
                          {`${item.trait_type} (${item.attributes.length})`}
                        </button>
                      </h2>
                      <div
                        id={`collapseOne${item.trait_type}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`headingOne${item.trait_type}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            {item.attributes &&
                              item.attributes.map((att) => (
                                <div className="col-md-12 attrs-list" key={att}>
                                  <div className="form-check mt-3">
                                    <label
                                      className="form-check-label"
                                      htmlFor={`flexCheckDefault${att}`}
                                    >
                                      {att}

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
                                    </label>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-8 content padding-0">
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
            <div className="move-buttons">
              <div className="move-btn">
                <button
                  className="cstm-btn"
                  onClick={() => {
                    expandAndScroll(150).then((e) => {
                      scrollPage(150).then((f) => {
                        colorTheFirstCol(150);
                      });
                    });
                  }}
                >
                  150
                </button>
              </div>
              <div className="move-btn">
                <button
                  className="cstm-btn"
                  onClick={() => {
                    expandAndScroll(300).then((e) => {
                      scrollPage(300).then((f) => {
                        colorTheFirstCol(300);
                      });
                    });
                  }}
                >
                  300
                </button>
              </div>
              <div className="move-btn">
                <button
                  className="cstm-btn"
                  onClick={() => {
                    expandAndScroll(450).then((e) => {
                      scrollPage(450).then((f) => {
                        colorTheFirstCol(450);
                      });
                    });
                  }}
                >
                  450
                </button>
              </div>
              <div className="move-btn">
                <button
                  className="cstm-btn"
                  onClick={() => {
                    expandAndScroll(600).then((e) => {
                      scrollPage(600).then((f) => {
                        colorTheFirstCol(600);
                      });
                    });
                  }}
                >
                  600
                </button>
              </div>
              <div className="move-btn">
                <button
                  className="cstm-btn"
                  onClick={() => {
                    expandAndScroll(750).then((e) => {
                      scrollPage(750).then((f) => {
                        colorTheFirstCol(750);
                      });
                    });
                  }}
                >
                  750
                </button>
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
            <div className="col-lg-12 main-area container">
              <div className="main-area-header">{imageCount} Items Listed</div>
              <div className="list-buttons d-none">
                <button
                  className="btn list-button"
                  onClick={() => convertToGrid()}
                >
                  <FaTh className={`list-icon ${gridIcon}`} />
                </button>
                <button
                  className="btn list-button"
                  onClick={() => convertToList()}
                >
                  <FaBars className={`list-icon ${listIcon}`} />
                </button>
              </div>
              <div
                className={`load-area d-flex justify-content-center mt-5 ${loadBeforeDis}`}
              >
                <button className="load-more" onClick={() => loadBefore()}>
                  Load Before
                </button>
              </div>
              <div className="filter-section">
                <div className="row">
                  {filterArr &&
                    filterArr.map((item) => (
                      <div className="" key={item}>
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
                <div className={`row ${gridList}`}>
                  {filteredImgs.length !== 0 ? (
                    filteredImgs.slice(startIndex, endIndex).map((item) => (
                      <div
                        className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 d-flex"
                        key={item.name}
                        id={item.name}
                        onClick={() => openModal(item.name)}
                      >
                        <div className="nft-card">
                          <div className="nft-image-area">
                            <img
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
                    ))
                  ) : (
                    <div className="nothing-to-show">Nothing To Show</div>
                  )}
                </div>
                <div className={`row ${listList}`}>
                  {filteredImgs.length !== 0 ? (
                    filteredImgs.slice(0, endIndex).map((item) => (
                      <div className="col-12 nft-listing" key={item.name}>
                        <div className="row nft-list-area">
                          <div className="col-md-3 nft-list-image-area">
                            <img
                              src={IMAGES[item.name]}
                              className="nft-list-image"
                              alt="NFT ALT Text"
                            />
                          </div>
                          <div className="col-md-9">
                            <div className="nft-list-text">
                              <ul>
                                {METADATA[item.name].attributes
                                  .filter((attri) => attri.value !== "Nothing")
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
        {/*<Modals imageList={images} clickedId={clickedImage} />*/}
        {filteredImgs.slice(startIndex, endIndex).map((item) => (
          <div
            className={`modal d-flex justify-content-center align-items-center ${
              modalArr[item.name] === false ? "d-none" : ""
            }`}
          >
            <div className="modal-area">
              <div className="modal-card">
                <div className="nft-image-area">
                  <img
                    src={IMAGES[item.name]}
                    className="modal-image"
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
                  <div className="close-area">
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => closeModal(item.name)}
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
