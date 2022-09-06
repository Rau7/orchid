import IMAGES from "./photos";
import METADATA from "./metadata";
import METAS from "./newmeta";
import logo1 from "./images/1.png";
import { FaHeart, FaPlusCircle, FaSearch, FaBars, FaTh } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import Modals from "./components/Modals";
import ATRAITS from "./attrs_traits_many";

function Statistics() {
  const [metadata, setMetadata] = useState(METADATA);
  const [traits, setTraits] = useState();
  const [attrs, setAttrs] = useState();
  const [reals, setReals] = useState(ATRAITS);

  useEffect(() => {
    let traits = [];
    let attrs = [];
    let attrs_many = [];
    let newMeta = [];

    metadata.forEach((element) => {
      newMeta.push(element);
    });

    newMeta.forEach((element) => {
      element.attributes.forEach((attr) => {
        traits.push(attr.trait_type);
      });
    });
    traits = [...new Set(traits)];

    setTraits(traits);

    let ctr = 0;
    let trait_ctr = 0;
    newMeta.forEach((element) => {
      traits.forEach((trt) => {
        trait_ctr = 0;
        ctr = 0;
        element.attributes.forEach((attr) => {
          if (trt === attr.trait_type) {
            attrs.push(attr.value + "+" + trt);
          }
        });
      });
    });

    attrs = [...new Set(attrs)];
    let counter = 0;
    attrs.forEach((e) => {
      let at = e.substring(0, e.indexOf("+"));
      let tr = e.substring(e.indexOf("+") + 1);
      counter = 0;
      newMeta.forEach((element) => {
        element.attributes.forEach((attr) => {
          if (attr.trait_type === tr && attr.value === at) {
            counter++;
          }
        });
      });
      attrs_many.push(e + "+" + counter);
    });

    let temp_rl = reals;

    temp_rl.forEach((rl) => {
      attrs_many.forEach((e) => {
        let at = e.substring(0, e.indexOf("+"));
        let tr = e.substring(e.indexOf("+") + 1, e.lastIndexOf("+"));
        let nmr = e.substring(e.lastIndexOf("+") + 1);
        if (tr === rl.trait_type) {
          rl.attributes.forEach((x) => {
            if (x === at) {
              rl.how_many.push(nmr);
            }
          });
        }
      });
    });
    attrs_many = [...new Set(attrs_many)];
    setAttrs(attrs_many);
    setReals(temp_rl);
  }, []);

  return <div>{JSON.stringify(attrs)}</div>;
}

export default Statistics;
