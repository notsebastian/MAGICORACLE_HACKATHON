import React from "react";
import "../css/minter.css";
import { Segment, Container, Button } from "semantic-ui-react";
import Cube from "./Cube";
import { signer } from "../web3";
import { ethers } from "ethers";
import Typewriter from "typewriter-effect";
import sleep from "../sleep";

class Minter extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    account: "",
    answer: null,
    requestId: null,
    isAnswered: false,
    numberResponse: null,
    disabled: true,
  };

  async componentDidMount() {}

  async componentDidUpdate() {
    if (this.props.userRequestId !== null && this.state.isAnswered === false) {
      await this.getAnswer();
    }
  }
  mintResponse = async () => {
    const nftWithSigner = this.props.nftContract.connect(signer);
    await nftWithSigner.finishMint(this.props.userRequestId, {
      gasLimit: 3000000,
      value: ethers.utils.parseEther("0"),
    });
  };

  getAnswer = async () => {
    //ETHERSJS OR ARBITRUM PROBLEM, EVENTS NOT WORKING
    // console.log("listening for RequestFulfilled");
    // console.log(this.props.userRequestId);

    // //create event listener for RequestFulfilled event
    // const filterByRequestId = this.props.vrfContract.filters.RequestFulfilled(
    //   this.props.userRequestId
    // );
    // //wait for event to be emitted
    // await this.props.vrfContract.on(
    //   filterByRequestId,
    //   async (requestId, randomWords) => {
    //     console.log("RequestFulfilled event emitted");
    //     this.setState({
    //       isAnswered: true,
    //     });
    //     this.props.isAnswered(true);
    //     //get number response from oracle
    //     const numberResponse = await this.props.vrfContract.getNumberResponse(
    //       this.props.userRequestId
    //     );
    //     //pass to cube component
    //     this.setState({ numberResponse: numberResponse });
    //     //get text response from oracle
    //     const textResponse = await this.props.vrfContract.getTextResponse(
    //       this.props.userRequestId
    //     );
    //     //pass to state
    //     this.setState({ answer: textResponse });
    //     //enable mint button
    //     this.setState({ disabled: false });
    //   }
    // );
    let fulfilled = false;
    do {
      try {
        console.log(`checking for requestId fulfillment...`);
        fulfilled = await this.props.vrfContract.s_requests(
          this.props.userRequestId
        );
        if (!fulfilled.fulfilled) {
          console.log("requestId not fulfilled, trying again in 5s");
          await sleep(5000);
        }
      } catch {
        console.log(
          `error checking fulfillment of requestId, trying again in 5s`
        );
        await sleep(5000);
      }
    } while (!fulfilled.fulfilled);

    //answer recieved from oracle
    console.log("RequestFulfilled event emitted");
    this.setState({
      isAnswered: true,
    });
    this.props.isAnswered(true);
    //get number response from oracle
    const numberResponse = await this.props.vrfContract.getNumberResponse(
      this.props.userRequestId
    );
    //pass to cube component
    this.setState({ numberResponse: numberResponse });
    //get text response from oracle
    const textResponse = await this.props.vrfContract.getTextResponse(
      this.props.userRequestId
    );
    //pass to state
    this.setState({ answer: textResponse });
    //enable mint button
    this.setState({ disabled: false });
  };

  displayAnswer = () => {
    if (this.state.answer !== null) {
      return (
        <Typewriter
          options={{
            strings: this.state.answer,
            autoStart: true,
            delay: 75,
          }}
        />
      );
    }
  };
  displayQuestion = () => {
    if (this.props.question !== null) {
      return (
        <Typewriter
          options={{
            strings: this.props.question,
            autoStart: true,
            delay: 75,
          }}
        />
      );
    }
  };
  render() {
    return (
      <div>
        <Container style={{ marginTop: "15px" }}>
          <div className="content-box">
            <Cube
              answered={this.state.isAnswered}
              numberResponse={this.state.numberResponse}
            />
          </div>
          <Segment
            style={{ display: "grid", placeItems: "center", fontSize: "20px" }}
            className="content-box"
          >
            <div className="chainlinkFont" style={{ display: "flex" }}>
              QUESTION: &nbsp; {this.displayQuestion()}
            </div>
            <div className="chainlinkFont" style={{ display: "flex" }}>
              ANSWER: &nbsp; {this.displayAnswer()}
            </div>
            <Button
              id="chainlinkFont"
              className="web3-button"
              style={{ marginTop: "15px" }}
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

export default Minter;
