import React from "react";
import { ethers } from "ethers";
import NFTDisplay from "./NFTDisplay";
import { Grid } from "semantic-ui-react";
import sleep from "../sleep";
import { Container, Segment } from "semantic-ui-react";

class MyAccount extends React.Component {
  state = {
    account: null,
    requestIdCount: null,
    requestIds: [],
    loaded: false,
  };
  async componentDidMount() {
    let keepTrying = true;
    let requestIdCount;

    //get account
    const account = await window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    this.setState({ account: account });
    //get requestId count
    //loop to deal with unreliable RPCs
    do {
      try {
        console.log("fetching requestId count");
        requestIdCount = await this.props.nftContract.userRequestIdCounter(
          account
        );
        requestIdCount = requestIdCount.toString();
        this.setState({ requestIdCount });
        keepTrying = false;
      } catch {
        console.log("error fetching requestId count, trying again in 3s");
        await sleep(3000);

        keepTrying = true;
      }
    } while (keepTrying);

    let requestIds = [];
    let fulfilled = [];
    let promises = [];
    let promises2 = [];

    const getRequestIds = async (_) => {
      for (let i = 0; i < requestIdCount; i++) {
        promises.push(
          new Promise(async (resolve) => {
            do {
              try {
                console.log(`fetching requestId ${i}`);
                requestIds[i] = await this.props.nftContract.userRequestIds(
                  account,
                  i
                );
                this.setState({ requestIdCount });

                keepTrying = false;
              } catch {
                console.log(
                  `error fetching requestId ${i}, trying again in 3s`
                );
                await sleep(3000);

                keepTrying = true;
              }
            } while (keepTrying);
            resolve();
          })
        );
      }
      await Promise.all(promises).catch((err) => {
        console.log(err);
      });
      for (let i = 0; i < requestIdCount; i++) {
        promises2.push(
          new Promise(async (resolve) => {
            do {
              try {
                console.log(`checking if requestId ${i} is fulfilled`);
                fulfilled[i] = await this.props.vrfContract.s_requests(
                  requestIds[i]
                );
                if (!fulfilled[i].fulfilled) {
                  console.log(`requestId ${i} is not fulfilled`);
                }
                keepTrying = false;
              } catch {
                console.log(
                  `error checking fulfillment of requestId ${i}, trying again in 3s`
                );
                await sleep(3000);

                keepTrying = true;
              }
            } while (keepTrying);
            resolve();
          })
        );
      }
      await Promise.all(promises2);
    };

    await getRequestIds();
    var joined = [];
    for (let i = 0; i < requestIdCount; i++) {
      if (fulfilled[i].fulfilled) {
        //add to array of requestIds to display
        joined = joined.concat(requestIds[i].toString());

        this.setState({ requestIds: joined });
      }
    }

    this.setState({ loaded: true });
  }

  render() {
    let questions = this.state.requestIds.map((requestId, i) => {
      return (
        <Grid.Column
          style={{ display: "flex", justifyContent: "center" }}
          key={i}
        >
          <NFTDisplay
            requestId={requestId}
            key={i}
            index={i}
            nftContract={this.props.nftContract}
            vrfContract={this.props.vrfContract}
            account={this.state.account}
          />
        </Grid.Column>
      );
    });

    if (!ethers.utils.isAddress(this.state.account)) {
      return (
        <div>
          <Container style={{ marginTop: "10px" }}>
            <Segment className="content-box">
              <h2 className="chainlinkFont" style={{ textAlign: "center" }}>
                Invalid address
              </h2>
            </Segment>
          </Container>
        </div>
      );
    } else if (!this.state.loaded) {
      return (
        <Container style={{ marginTop: "10px" }}>
          <Segment
            style={{ height: "200px", alignItems: "center" }}
            className="content-box"
          >
            <div style={{ margin: "auto" }} className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p style={{ marginTop: "15px" }} className="chainlinkFont">
              Loading...
            </p>
          </Segment>
        </Container>
      );
    } else if (this.state.requestIds.length > 0) {
      return (
        <div>
          <Container style={{ marginTop: "10px" }}>
            <Segment className="content-box">
              <p
                className="chainlinkFont"
                style={{
                  alignItems: "center",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                }}
              >
                Click on a previous question to inspect or mint{" "}
              </p>
              <Grid stackable columns={3}>
                {questions.reverse()}
              </Grid>
            </Segment>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <Container style={{ marginTop: "10px" }}>
            <Segment className="content-box">
              <h2 className="chainlinkFont" style={{ textAlign: "center" }}>
                No questions yet :(
              </h2>
            </Segment>
          </Container>
        </div>
      );
    }
  }
}

export default MyAccount;
