import React from "react";
import { Container, Segment, Icon } from "semantic-ui-react";

class Status extends React.Component {
  askingQuestion = () => {
    if (
      this.props.question &&
      !this.props.requestId &&
      !this.props.isAnswered
    ) {
      return (
        <Segment className="content-box">
          <div style={{ display: "flex", justifyContent: "center" }}>
            Don't refresh the page!
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Sending Question to Oracle...
            <Icon
              style={{ marginLeft: "5px" }}
              loading={true}
              name="spinner"
            ></Icon>
          </div>
          {this.waitingForResponse()}
        </Segment>
      );
    } else if (
      this.props.question &&
      this.props.requestId &&
      !this.props.isAnswered
    ) {
      return (
        <Segment className="content-box">
          <div style={{ display: "flex", justifyContent: "center" }}>
            Don't refresh the page!
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Sending Question to Oracle...
            <Icon
              style={{ marginLeft: "5px" }}
              name="check"
              color="green"
            ></Icon>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            Waiting for Oracle to respond...
            <Icon
              style={{ marginLeft: "5px" }}
              loading={true}
              name="spinner"
            ></Icon>
          </div>
        </Segment>
      );
    } else if (
      this.props.question &&
      this.props.requestId &&
      this.props.isAnswered
    ) {
      return (
        <Segment className="content-box">
          <div style={{ display: "flex", justifyContent: "center" }}>
            Don't refresh the page!
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Sending Question to Oracle...
            <Icon
              style={{ marginLeft: "5px" }}
              name="check"
              color="green"
            ></Icon>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            Waiting for Oracle to respond...
            <Icon
              style={{ marginLeft: "5px" }}
              name="check"
              color="green"
            ></Icon>
          </div>
        </Segment>
      );
    }
  };

  waitingForResponse = () => {};

  render() {
    return (
      <div className="chainlinkFont" style={{ marginTop: "10px" }}>
        <Container>{this.askingQuestion()}</Container>
      </div>
    );
  }
}

export default Status;
