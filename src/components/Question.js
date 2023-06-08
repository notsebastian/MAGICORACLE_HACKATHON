import React from "react";
import "../css/question.css";
import { Segment, Input, Container, Button, Label } from "semantic-ui-react";
import { provider, signer } from "../web3";
import { ethers } from "ethers";
import Typewriter from "typewriter-effect";
import sleep from "../sleep";

class Question extends React.Component {
  state = { question: null, requestId: null, disabled: false, price: "" };

  askQuestion = async () => {
    if (window.ethereum) {
      //get user account
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      //get network
      const networkId = await provider.getNetwork();
      //switch to goerli if not on goerli
      if (networkId.chainId !== 421613) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x66eed" }],
        });
      }

      //look for RequestSent event from msg.sender
      const filterForRequestId =
        this.props.nftContract.filters.RequestSent(account);

      //connect to nft contract
      const nftWithSigner = await this.props.nftContract.connect(signer);

      //call askQuestion function
      await nftWithSigner.askQuestion(this.state.question, {
        gasLimit: 300000,
      });
      this.setState({ disabled: true });

      //send question to parent component
      this.props.question(this.state.question);

      //get block number
      const blockNumber = await provider.getBlockNumber();

      // //wait for event to be emitted
      // await this.props.nftContract.on(
      //   "RequestSent",
      //   async (sender, requestId, question) => {
      //     console.log("RequestSent event emitted");
      //     requestId = requestId.toString();
      //     console.log(`requestId found: \n ${requestId}`);
      //     //set requestId to state and pass it to parent component
      //     this.setState({
      //       requestId,
      //     });
      //     this.props.requestId(requestId);
      //   }
      // );
      let questionLog;
      do {
        try {
          console.log(`checking for requestId...`);
          questionLog = await this.props.nftContract.queryFilter(
            filterForRequestId,
            blockNumber,
            "latest"
          );
          console.log(questionLog);
          if (questionLog.length === 0) {
            console.log("requestId not found, trying again in 5s");
            await sleep(5000);
          }
        } catch {
          console.log(`error checking for requestId, trying again in 5s`);
          await sleep(5000);
        }
      } while (questionLog.length === 0);
      let requestId = questionLog[0].args[1].toString();

      console.log(`requestId found: \n ${requestId}`);
      //set requestId to state and pass it to parent component
      this.setState({
        requestId,
      });
      this.props.requestId(requestId);
    } else {
      alert("Please install MetaMask to continue!");
    }
  };

  charCount = () => {
    return (
      <Label
        className="chainlinkFont"
        style={{ backgroundColor: "#8399e2", color: "white" }}
      >
        {this.state.question ? this.state.question.length : 0}/64
      </Label>
    );
  };

  async componentDidMount() {
    let price = await this.props.nftContract.questionPrice();
    this.setState({ price: ethers.utils.formatEther(price) });
  }
  render() {
    return (
      <div style={{ marginTop: "10px" }}>
        <Container>
          <Segment
            style={{
              display: "grid",
              placeItems: "center",
            }}
            className="content-box"
          >
            <div
              className="chainlinkFont"
              style={{
                minWidth: "70%",
                paddingBottom: "10px",
                paddingTop: "10px",
                fontSize: "16px",
              }}
            >
              <Typewriter
                className="chainlinkFont"
                options={{
                  strings: "Welcome. Ask a yes/no question...",
                  autoStart: true,
                  delay: 50,
                }}
              />
            </div>
            <div className="input-question">
              <Input
                id="chainlinkFont"
                fluid
                placeholder="Ask a question..."
                focus
                size="large"
                style={{
                  minWidth: "70%",
                }}
                onChange={(e) => this.setState({ question: e.target.value })}
                maxLength="64"
                label={this.charCount()}
                labelPosition="right"
              />
            </div>

            <Button
              className="web3-button"
              id="chainlinkFont"
              style={{ marginTop: "10px" }}
              onClick={this.askQuestion}
              disabled={this.state.disabled}
            >
              Ask the Oracle!
              <div style={{ marginTop: "4px", fontSize: "12px" }}>
                {/* ({this.state.price} ETH */} ( FREE! )
              </div>
            </Button>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default Question;
