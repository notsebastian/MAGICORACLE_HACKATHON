import React from "react";
import { Container, Segment, Grid } from "semantic-ui-react";
import "../css/footer.css";
import { ethers, BigNumber } from "ethers";
import Marquee from "react-fast-marquee";
import { profanity } from "@2toad/profanity";
import sleep from "../sleep";

class Footer extends React.Component {
  state = {
    marquee: [],
  };

  async componentDidMount() {
    let keepTrying = true;
    let mostRecent;

    //loop to deal with unreliable RPCs
    do {
      try {
        console.log(`fetching 10 most recent mints for footer...`);
        mostRecent = await this.props.nftContract.getMints();
        keepTrying = false;
      } catch {
        console.log(`error fetching most recent mints, trying again in 5s...`);
        await sleep(5000);
      }
    } while (keepTrying);

    let marquee = [];
    //get 10 most recent questions
    for (let i = 0; i < mostRecent.length; i++) {
      if (mostRecent[i].question) {
        marquee.push(
          <a
            key={i}
            style={{ color: "black" }}
            href={`/question/${mostRecent[i].requestId}`}
          >
            &#62;{profanity.censor(mostRecent[i].question)} &#160; &#160; &#160;
            &#160; &#160;
          </a>
        );

        this.setState({ marquee });
      }
    }
  }

  render() {
    return (
      <div>
        <Container>
          <Segment
            id="footer"
            className="content-box marquee"
            style={{ backgroundColor: "green" }}
          >
            <span
              className="chainlinkFont "
              style={{ backgroundColor: "#f5f7fd" }}
            >
              Recent Mints:&#160;&#160;&#160;&#160;
            </span>

            <Marquee
              className="chainlinkFont "
              style={{ width: "100%", backgroundColor: "#f5f7fd" }}
              speed="20"
              gradientWidth="50"
              gradientColor={[245, 247, 253]}
              pauseOnHover="true"
            >
              {this.state.marquee}
            </Marquee>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default Footer;
