import React from "react";
import { provider } from "../web3";
import "../css/header.css";

import { Container, Header, Menu, Segment, Icon } from "semantic-ui-react";
import Typewriter from "typewriter-effect";
class NavBar extends React.Component {
  state = {
    account: null,
    connectedIcon: <Icon name="cancel" color="red" />,
    networkIcon: <Icon name="cancel" color="red" />,
  };

  async componentDidMount() {
    //check if wallet is connected
    let accounts = await provider.listAccounts();
    this.setState({ account: accounts[0] });
    if (accounts.length > 0) {
      this.setState({ connectedIcon: <Icon name="check" color="green" /> });
    }
    //get network
    const networkId = await provider.getNetwork();
    if (networkId.chainId === 421613 && window.ethereum) {
      this.setState({ networkIcon: <Icon name="check" color="green" /> });
    }
  }

  connectWallet = async () => {
    if (window.ethereum) {
      //get account
      const account = await provider.send("eth_requestAccounts", []);
      this.setState({ account: account[0] });
      //get network
      const networkId = await provider.getNetwork();
      //switch to goerli if not on goerli
      if (networkId.chainId !== 421613) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x66eed" }],
        });
      }
      window.location.reload();
    } else {
      alert("Please download MetaMask to continue");
    }
  };

  render() {
    return (
      <>
        <Container>
          <Segment className="content-box">
            <Header as="h1" textAlign="center">
              <div
                style={{
                  fontSize: "32px",
                  marginTop: "15px",
                  display: "inline-flex",
                }}
                className="banner chainlinkFont"
              >
                <Typewriter
                  options={{
                    strings: "MAGICORACLE.LINK",
                    autoStart: true,
                    delay: 75,
                  }}
                />
              </div>
            </Header>
            <div
              className="chainlinkFont"
              style={{
                minWidth: "25%",
                float: "right",
                lineHeight: "0.1",
              }}
            >
              Wallet:
              {this.state.connectedIcon}
              <br />
              Network:
              {this.state.networkIcon}
            </div>

            <Menu style={{ fontFamily: "chainlinkFont" }} fluid widths={4}>
              <Menu.Item className="menu-button">
                <a style={{ display: "block", color: "black" }} href="/">
                  <span className="span-button"></span>
                  Home
                </a>
              </Menu.Item>
              <Menu.Item className="menu-button">
                <a style={{ color: "black" }} href={`/about`}>
                  <span className="span-button"></span>
                  About
                </a>
              </Menu.Item>
              <Menu.Item className="menu-button">
                <a
                  style={{ color: "black" }}
                  href={`/account/${this.state.account}`}
                >
                  <span className="span-button"></span>
                  My Account
                </a>
              </Menu.Item>
              <Menu.Item className="menu-button" onClick={this.connectWallet}>
                <p style={{ color: "black" }}>Connect Wallet</p>
              </Menu.Item>
            </Menu>
          </Segment>
        </Container>
      </>
    );
  }
}

export default NavBar;
