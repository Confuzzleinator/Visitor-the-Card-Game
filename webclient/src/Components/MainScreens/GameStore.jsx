import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Button from "../Primitives/Button";
import { connect } from "react-redux";
import Center from "react-center";

import { withFirebase } from "../Firebase/index";
import { mapDispatchToProps } from "../Redux/Store";
import { withHandlers } from "../MessageHandlers/HandlerContext";
import { packList, packCosts } from "../Helpers/Constants";

const mapStateToProps = state => {
  return {
    userId: state.authUser.user.uid,
    coins: state.coins,
    packs: state.packs
  };
};

class OpenPacks extends Component {
  state = {
    show: false
  };

  buyPack = (packName, cost) => event => {
    const { userId, firebase, updateState, packs, coins } = this.props;
    firebase.buyPack(userId, packName, cost);
    packs[packName] += 1;
    updateState({ packs: packs, coins: coins - cost });
    this.setState({ show: true });
  };

  hideDialog = () => {
    this.setState({ show: false });
  };

  render() {
    const { coins } = this.props;
    const { show } = this.state;

    return (
      <div>
        {show && (
          <Dialog
            open={show}
            scroll="body"
            onClose={this.hideDialog}
            maxWidth="xs"
            fullWidth
          >
            <Center>{"You successfuly bought a pack."}</Center>
          </Dialog>
        )}
        <Button onClick={this.props.back} text="Back" />
        <Grid
          container
          alignContent="space-around"
          justify="flex-start"
          spacing={8}
        >
          {packList.map(key => {
            return (
              <Grid item container xs spacing={8} key={key}>
                <Grid item xs={12}>
                <Center>
                  <span style={{ color: "black" }}>{key}</span>
                </Center>
                </Grid>
                <Grid item xs={12}>
                <Center>
                  <img
                    src={process.env.PUBLIC_URL + "/img/CardBack.png"}
                    style={{ width: "250px" }}
                    alt=""
                  />
                </Center>
                </Grid>
                <Grid item xs={12}>
                <Center>
                  <Button
                    onClick={this.buyPack(key, packCosts[key])}
                    text={"" + packCosts[key] + " Gold"}
                    disabled={coins < packCosts[key]}
                  />
                </Center>
                </Grid>
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
