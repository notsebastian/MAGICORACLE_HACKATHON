import React from "react";
import Header2 from "./Header2";
import Question from "./Question";
import Minter from "./Minter";
import Status from "./Status";
import Footer from "./Footer";
import MyAccount from "./MyAccount";
import Cube2 from "./Cube2";
import About from "./About";
import { ethers } from "ethers";
import vrfabi from "../contracts/abis/VRFConsumer";
import nftabi from "../contracts/abis/MagicOracleNFT";
import { provider } from "../web3";
import "../css/app.css";
import { Container } from "semantic-ui-react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends React.Component {
  state = {
    nftAddress: "0x3A43f0105dFf90A47585dA206Eaa5a2202eD4728",
    vrfAddress: "0x4b4F7104e89cf3914199C9127b3e513ef4b1813F",
    nftContract: new ethers.Contract(
      "0x3A43f0105dFf90A47585dA206Eaa5a2202eD4728",
      nftabi,
      provider
    ),
    vrfContract: new ethers.Contract(
      "0x4b4F7104e89cf3914199C9127b3e513ef4b1813F",
      vrfabi,
      provider
    ),
    requestId: null,
    question: null,
    requestSent: false,
    isAnswered: false,
    account: null,
  };

  handleDataFromChild = (data) => {
    this.setState({ requestId: data });
  };
  getQuestion = (data) => {
    this.setState({ question: data });
  };
  requestSent = (data) => {
    this.setState({ requestSent: data });
  };
  isRequestFulfilled = (data) => {
    this.setState({ isAnswered: data });
  };

  render() {
    return (
      <div className="app-container">
        <Container className="box">
          <Router>
            <div
              style={{
                minHeight: "calc(100vh - 65px)",
              }}
            >
              <Header2 />
              <Routes>
                <Route
                  path="/"
                  exact
                  element={
                    <div>
                      <Question
                        nftContract={this.state.nftContract}
                        requestId={this.handleDataFromChild}
                        question={this.getQuestion}
                        requestSent={this.requestSent}
                      />
                      <Status
                        question={this.state.question}
                        requestId={this.state.requestId}
                        isAnswered={this.state.isAnswered}
                      />
                      <Minter
                        nftContract={this.state.nftContract}
                        vrfContract={this.state.vrfContract}
                        requestId={this.handleDataFromChild}
                        userRequestId={this.state.requestId}
                        question={this.state.question}
                        isAnswered={this.isRequestFulfilled}
                      />
                    </div>
                  }
                />

                <Route
                  path="/account/:account"
                  element={
                    <MyAccount
                      nftContract={this.state.nftContract}
                      vrfContract={this.state.vrfContract}
                    />
                  }
                />
                <Route
                  path="/question/:requestId"
                  element={
                    <Cube2
                      nftContract={this.state.nftContract}
                      vrfContract={this.state.vrfContract}
                    />
                  }
                />
                <Route path="/about" exact element={<About />} />
              </Routes>
            </div>
            <Footer
              nftContract={this.state.nftContract}
              vrfContract={this.state.vrfContract}
            />
          </Router>
        </Container>
      </div>
    );
  }
}

export default App;
