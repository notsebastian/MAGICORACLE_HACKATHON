import React, { Component } from "react";

import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import logo from "../img/chainlink_logo.png";
import lockFace from "../img/test2.png";
import chainlinkFace from "../img/cube_top2.png";
import blankFace from "../img/cube_bottom2.png";
import textFace from "../img/cube_front2.png";
import answer01 from "../img/01.png";
import answer02 from "../img/02.png";
import answer03 from "../img/03.png";
import answer04 from "../img/04.png";
import answer05 from "../img/05.png";
import answer06 from "../img/06.png";
import answer07 from "../img/07.png";
import answer08 from "../img/08.png";
import answer09 from "../img/09.png";
import answer10 from "../img/10.png";
import answer11 from "../img/11.png";
import answer12 from "../img/12.png";
import answer13 from "../img/13.png";
import answer14 from "../img/14.png";
import answer15 from "../img/15.png";
import answer16 from "../img/16.png";
import answer17 from "../img/17.png";
import answer18 from "../img/18.png";
import answer19 from "../img/19.png";
import answer20 from "../img/20.png";

const style = {
  height: 500,
  backgroundImage: `url(${logo})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "contain",
  position: "relative",
};

const loader = new THREE.TextureLoader();

let faceChanged = false;

let stopRotate = false;

const answerArray = [
  answer01,
  answer02,
  answer03,
  answer04,
  answer05,
  answer06,
  answer07,
  answer08,
  answer09,
  answer10,
  answer11,
  answer12,
  answer13,
  answer14,
  answer15,
  answer16,
  answer17,
  answer18,
  answer19,
  answer20,
];

const materialArray1 = [
  new THREE.MeshBasicMaterial({
    map: loader.load(lockFace),
    transparent: true,
  }), //right side
  new THREE.MeshBasicMaterial({
    map: loader.load(lockFace),
    transparent: true,
  }), //left side
  new THREE.MeshBasicMaterial({
    map: loader.load(chainlinkFace),
    transparent: true,
  }), //top
  new THREE.MeshBasicMaterial({
    map: loader.load(blankFace),
    transparent: true,
  }), //bottom
  new THREE.MeshBasicMaterial({
    map: loader.load(textFace),
    transparent: true,
  }), //front side
  new THREE.MeshBasicMaterial({
    map: loader.load(textFace),
    transparent: true,
  }), //back side
];

class Cube extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  sceneSetup = () => {
    // get container dimensions and use them for scene sizing
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    this.camera.position.z = 10;
    this.camera.position.y = 0;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor("#1a2b6b", 0);
    this.mount.appendChild(this.renderer.domElement); // mount using React ref
  };

  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  addCustomSceneObjects = () => {
    const geometry = new THREE.BoxGeometry(5, 5, 5);

    this.cube = new THREE.Mesh(geometry, materialArray1);
    this.scene.add(this.cube);
    this.cube.rotation.x = 0.6;
    this.cube.rotation.y = 50;

    this.tween = new TWEEN.Tween(this.cube.rotation)
      .to({ x: 0.6, y: 0, z: 0 }, 1000)
      .onUpdate(() => {});

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  changeFace = () => {
    if (this.props.numberResponse) {
      materialArray1[4] = new THREE.MeshBasicMaterial({
        map: loader.load(answerArray[parseInt(this.props.numberResponse._hex)]),
        transparent: true,
      });
      faceChanged = true;
    }
  };

  stopRotation = () => {
    stopRotate = true;
    this.tween.start();

    //this.controls.enabled = true;
  };

  startAnimationLoop = () => {
    if (stopRotate === false) {
      this.cube.rotation.y += -0.01;
    }
    //CHROME FIX: need to call resize here to make sure the camera aspect is correct
    this.handleWindowResize();

    TWEEN.update();
    this.renderer.render(this.scene, this.camera);

    // to update an animation before the next repaint
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    if (this.props.answered === true && faceChanged === false) {
      console.log("Answer Recieved");
      console.log(this.props.answered);
      console.log(faceChanged);
      console.log(this.props.numberResponse);
      this.stopRotation();
      this.changeFace();
    }
  };

  handleWindowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  };

  render() {
    return (
      <div>
        <div style={style} ref={(ref) => (this.mount = ref)} />
      </div>
    );
  }
}

export default Cube;
