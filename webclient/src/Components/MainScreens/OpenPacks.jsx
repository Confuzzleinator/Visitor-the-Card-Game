import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Button from "../Primitives/Button";
import { connect } from "react-redux";
import Center from "react-center";

import { withFirebase } from "../Firebase/index";
import CardDisplay from "../Card/CardDisplay";
import { mapDispatchToProps } from "../Redux/Store";
import { withHandlers } from "../MessageHandlers/HandlerContext";
import { fullCollection } from "../Helpers/Constants";

const mapStateToProps = state => {
  return {
    userId: state.authUser.user.uid,
    packs: state.packs
  };
};

class OpenPacks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generatedPack: [],
      show: false
    };
  }

  openPack = packName => {
    const { packs, userId, firebase, updateState } = this.props;
    if (packs[packName] > 0) {
      let genPack = this.generatePack(5, true);
      this.setState({ generatedPack: genPack });
      let cards = {};
      genPack.forEach(card => {
        cards[card.name] = 1;
      });
      firebase.openPack(userId, packName, cards);
      packs[packName] -= 1;
      updateState({ packs: packs });
      this.setState({ show: true });
    }
  };

  generateRandomCard = () => {
    const collection = Object.values(fullCollection);
    if (collection) {
      return collection[Math.floor(Math.random() * collection.length)];
    }
  };

  generatePack = (size, unique) => {
    var result = [];
    for (var i = 0; i < size; i++) {
      let c = this.generateRandomCard();
      if (unique && result.includes(c)) {
        i--;
      } else {
        result.push(c);
      }
    }
    return result;
  };

  hideDialog = () => {
    this.setState({ generatedPack: [], show: false });
  };

  render() {
    const { packs } = this.props;
    const { show, generatedPack } = this.state;

    return (
      <div>
        {show && (
          <Dialog fullScreen open={show} scroll="body">
            <Grid
              container
              alignContent="space-around"
              justify="flex-start"
              spacing={8}
            >
              {generatedPack.map((card, i) => (
                <Grid item key={i} xs={3}>
                  <CardDisplay {...card} />
                </Grid>
              ))}
            </Grid>
            <Button onClick={this.hideDialog} text="Done" />
          </Dialog>
        )}
        <Button onClick={this.props.back} text="Back" />
        <Grid
          container
          alignContent="space-around"
          justify="flex-start"
          spacing={8}
        >
          {Object.keys(packs).map(key => {
            return (
              <Grid item xs key={key}>
                <Center>
                  <img
                    src={process.env.PUBLIC_URL + "/img/CardBack.png"}
                    style={{ width: "250px" }}
                    onClick={event => this.openPack(key)}
                    alt=""
                  />
                </Center>
                <Center>
                  <span style={{ color: "black" }}>
                    {"" + key + ": " + packs[key]}
                  </span>
                </Center>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withHandlers(withFirebase(OpenPacks)));
