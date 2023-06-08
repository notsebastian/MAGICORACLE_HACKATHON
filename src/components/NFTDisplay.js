import React from "react";
import { encode } from "js-base64";
import sleep from "../sleep";

class NFTDisplay extends React.Component {
  state = { question: null, response: null, svg: null, answer: null };

  async componentDidMount() {
    let keepTrying;
    let answer;
    let question;

    do {
      try {
        console.log("fetching question");
        question = await this.props.nftContract.requestIdToQuestion(
          this.props.requestId
        );

        keepTrying = false;
      } catch {
        console.log(
          `error fetching question ${this.props.index}, trying again in 3s`
        );
        await sleep(3000);

        keepTrying = true;
      }
    } while (keepTrying);

    do {
      try {
        console.log("fetching answer");
        answer = await this.props.vrfContract.requestIdToTextResponse(
          this.props.requestId
        );
        keepTrying = false;
      } catch {
        console.log(
          `error fetching answer ${this.props.index}, trying again in 3s`
        );
        await sleep(3000);

        keepTrying = true;
      }
    } while (keepTrying);

    const buildSvg = `<svg class = 'svgText' width='350' height='350' viewBox='0 0 350 350' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width= '350' height='350' rx='10' class='svgBody'/><text class= 'large' x='20' y='40'>&lt;-&gt;</text><text x='15' y='70' class='small'>
    ${this.props.account}
    </text><text class='' x='30' y='100' >asks...</text><foreignObject class='svgText' x='30' y='120' width='300' height='74'><p  class='svgText' style='color: #3FA0F1' xmlns='http://www.w3.org/1999/xhtml'>${question}</p></foreignObject><text x='25' y='220' >The Magic Oracle repsonds...</text><text class='medium' x='30' y='260' >${answer}</text><text class= 'large' x='20' y='310' >&lt;/&gt;</text><style>.svgBody {fill: #ffffff; stroke: #3FA0F1; stroke-width:5} .svgText {font-family: 'monospace'; fill: #3FA0F1; font-weight: bold} .small {font-size: 12px} .large {font-size: 26; font-weight: bold; fill: black; font-family: 'monospace'} .medium {font-size: 16px}</style></svg>`;
    this.setState({ svg: buildSvg });
  }

  render() {
    return (
      <div>
        <a
          style={{ color: "black" }}
          href={`/question/${this.props.requestId}`}
        >
          <img
            style={{ height: "250px", boxShadow: "5px 5px #3d4556" }}
            src={`data:image/svg+xml;base64,${encode(this.state.svg)}`}
          />
        </a>
      </div>
    );
  }
}

export default NFTDisplay;
