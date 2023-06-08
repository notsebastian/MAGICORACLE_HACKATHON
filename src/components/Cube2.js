import React, { Component } from "react";
import Typewriter from "typewriter-effect";
import { Container, Button, Segment } from "semantic-ui-react";
import * as THREE from "three";
import { provider, signer } from "../web3";
import truncateEthAddress from "truncate-eth-address";

import { ethers } from "ethers";
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

let materialArray2;
class Cube extends Component {
  state = {
    numberResponse: null,
    requestId: null,
    isMinted: false,
    disabled: false,
    sender: null,
    loaded: false,
    question: null,
  };
  async componentDidMount() {
    //get requestId from URL
    const requestId = await window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    this.setState({ requestId });

    //get current user
    let currentUser;
    if (window.ethereum) {
      const account = await provider.send("eth_requestAccounts", []);
      currentUser = account[0];
    }

    //get sender of requestId
    const sender = await this.props.nftContract.requestIdToSender(requestId);
    this.setState({ sender });

    //get response from oracle
    const numberResponse = await this.props.vrfContract.getNumberResponse(
      requestId
    );
    this.setState({ numberResponse }, () => {
      materialArray2 = [
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
          map: loader.load(answerArray[parseInt(numberResponse._hex)]),
          transparent: true,
        }), //front side
        new THREE.MeshBasicMaterial({
          map: loader.load(textFace),
          transparent: true,
        }), //back side
      ];

      this.sceneSetup();
      this.addCustomSceneObjects();
      this.startAnimationLoop();
    });

    //get question from oracle
    const question = await this.props.nftContract.requestIdToQuestion(
      requestId
    );
    this.setState({ question });

    window.addEventListener("resize", this.handleWindowResize);

    //check if requstId is minted
    const isMinted = await this.props.nftContract.requestIdToMinted(requestId);
    this.setState({ disabled: isMinted });

    if (currentUser !== sender.toLowerCase()) {
      this.setState({ disabled: true });
    }

    this.setState({ loaded: true });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  mintResponse = async () => {
    const nftWithSigner = this.props.nftContract.connect(signer);
    await nftWithSigner.finishMint(this.state.requestId, {
      gasLimit: 3000000,
      value: ethers.utils.parseEther("0"),
    });
    this.setState({ disabled: true });
  };

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

    this.cube = new THREE.Mesh(geometry, materialArray2);
    this.scene.add(this.cube);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.cube.rotation.x = 0.5;

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  startAnimationLoop = () => {
    //console.log(this.camera.position);

    this.cube.rotation.y = 0.5 * Math.sin(Date.now() / 1000);

    this.renderer.render(this.scene, this.camera);

    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  };

  displayQuestion = () => {
    if (this.state.question) {
      return (
        <Container style={{ marginTop: "15px" }}>
          <Segment
            className="content-box chainlinkFont"
            style={{
              fontSize: "20px",
              textAlign: "center",
              wordWrap: "break-word",
            }}
          >
            <Typewriter
              className=""
              style={{ display: "inline-block" }}
              options={{
                strings: `<a href="/account/${
                  this.state.sender
                }">${truncateEthAddress(this.state.sender)}</a> asks... <br> ${
                  this.state.question
                }`,
                autoStart: true,
                delay: 35,
              }}
            />
          </Segment>
        </Container>
      );
    }
  };

  render() {
    if (this.state.sender) {
      return (
        <div>
          {this.displayQuestion()}
          <Container style={{ marginTop: "15px" }}>
            <div className="content-box">
              <div>
                <div style={style} ref={(ref) => (this.mount = ref)} />
              </div>
            </div>
          </Container>
          <Container style={{ marginTop: "15px" }}>
            <Segment
              className="content-box chainlinkFont"
              style={{ fontSize: "20px", textAlign: "center" }}
            >
              <Button
                id="chainlinkFont"
                className="web3-button"
                disabled={this.state.disabled}
                onClick={this.mintResponse}
              >
                Mint!
                <div style={{ marginTop: "4px", fontSize: "12px" }}></div>
              </Button>
            </Segment>
          </Container>
        </div>
      );
    }
  }
}

export default Cube;
