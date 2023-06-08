import React from "react";
import { Container, Segment, Grid } from "semantic-ui-react";
import arbImg from "../img/full-arbitrum-logo.svg";
class About extends React.Component {
  state = {
    account: "",
  };

  render() {
    return (
      <Container style={{ marginTop: "10px" }}>
        <Segment
          style={{
            alignItems: "center",
          }}
          className="content-box"
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: "170%",
              marginTop: "30px",
            }}
            className="chainlinkFont"
          >
            Congratulations, you've found the Magic Oracle! <br /> The Magic
            Oracle is the world's only 100% on-chain prophetic oracle, powered
            by Chainlink VRF.
            <br /> Ask a yes or no question, and Chainlink will respond with an
            answer. <br /> Mint the result as an NFT to preserve it forever and
            share with friends! <br /> <br />
            Currently deployed to Arbitrum Goerli Testnet. Check back later for
            mainnet!
          </p>
          <Grid stackable columns={3}>
            <Grid.Column>
              <a href="">
                <img
                  style={{
                    height: "100px",
                    maxWidth: "100%",
                    alignItems: "center",
                    margin: "auto",
                    display: "block",
                  }}
                  src="https://chain.link/badge-randomness-white"
                  alt="randomness secured with chainlink"
                ></img>
              </a>
            </Grid.Column>
            <Grid.Column
              className="chainlinkFont"
              style={{ textAlign: "center", lineHeight: "200%" }}
            ></Grid.Column>
            <Grid.Column>
              <a href="">
                <img
                  style={{
                    height: "100px",
                    maxWidth: "100%",
                    alignItems: "center",
                    margin: "auto",
                    display: "block",
                  }}
                  src={arbImg}
                ></img>
              </a>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}

export default About;
