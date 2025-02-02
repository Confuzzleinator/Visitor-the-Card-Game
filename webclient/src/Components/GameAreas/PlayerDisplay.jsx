import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Textfit from "react-textfit";
import { connect } from "react-redux";

import "../../css/StateDisplay.css";
import "../../css/Utils.css";
import { mapDispatchToProps } from "../Redux/Store";
import { withFirebase } from "../Firebase";
import { withHandlers } from "../MessageHandlers/HandlerContext";

const mapStateToProps = state => {
  return {
    playerId: state.extendedGameState.game.player.id,
    playerName: state.username,
    playerVoid: state.extendedGameState.game.player.void,
    playerHealth: state.extendedGameState.game.player.health,
    opponentId: state.extendedGameState.game.opponent.id,
    opponentUserId: state.extendedGameState.game.opponent.userId,
    opponentName: state.extendedGameState.opponentUsername,
    opponentVoid: state.extendedGameState.game.opponent.void,
    opponentHealth: state.extendedGameState.game.opponent.health,
    selectedCards: state.extendedGameState.selectedCards,
    selectablePlayers: state.extendedGameState.selectablePlayers,
    displayTargets: state.extendedGameState.targets,
    phase: state.extendedGameState.phase,
    selectCountMax: state.extendedGameState.selectCountMax
  };
};

class PlayerDisplay extends React.Component {
  componentDidMount() {
    const {
      isPlayer,
      opponentName,
      opponentUserId,
      firebase,
      updateExtendedGameState
    } = this.props;
    if (!isPlayer && opponentName === "") {
      firebase.setOpponentUsername(opponentUserId, updateExtendedGameState);
    }
  }

  render() {
    const {
      isPlayer,
      playerId,
      opponentId,
      playerName,
      opponentName,
      playerVoid,
      opponentVoid,
      playerHealth,
      opponentHealth,
      selectedCards,
      selectablePlayers,
      displayTargets,
      phase,
      selectCountMax,
      updateExtendedGameState
    } = this.props;

    const id = isPlayer ? playerId : opponentId;
    const name = isPlayer ? playerName : opponentName;
    const void_ = isPlayer ? playerVoid : opponentVoid;
    const health = isPlayer ? playerHealth : opponentHealth;
    const selectable = selectablePlayers.includes(id);
    const selected = selectedCards.includes(id);
    const targeted = displayTargets.includes(id);

    let voidOnClick = event => {
      updateExtendedGameState({
        dialog: {
          open: true,
          title: `${name}'s Void`,
          cards: void_
        }
      });
    };

    let select = event => {
      let maxCount = selectCountMax;
      let selected = [...selectedCards];
      if (selected.length < maxCount) {
        selected.push(id);
        this.props.updateExtendedGameState({ selectedCards: selected });
      }
      if (selected.length === maxCount) {
        this.props.gameHandler.SelectDone(phase, selected);
      }
    };

    let unselect = event => {
      let selected = [...selectedCards];

      if (selected.includes(id)) {
        selected.splice(selected.indexOf(id), 1);
        this.props.updateExtendedGameState({
          selectedCards: selected
        });
      }
    };

    let borderColor = "white";
    let clickHandler = undefined;
    if (targeted) {
      borderColor = "yellow";
    } else if (selectable) {
      clickHandler = select;
      borderColor = "green";
    } else if (selected) {
      borderColor = "magenta";
      clickHandler = unselect;
    }

    return (
      <Grid container spacing={8} style={{ height: "100%" }}>
        <Grid item xs={12} className="grid-elem">
          {/*<div
            style={{
              backgroundColor: borderColor,
              width: "100%", height: "100%",
            }}
            onClick={clickHandler}
          >
            <img
              src={
                process.env.PUBLIC_URL +
                "/img/" +
                (isPlayer ? "Player" : "Opponent") +
                ".png"
              }
              style={{ maxWidth: "100%", maxHeight: "100%", margin: "%3" }}
              alt=""
            /> 
            </div> */}
        </Grid>
        <Grid item xs={12} className="grid-elem">
          <Paper className="player-display">
            <Grid container spacing={0} style={{ height: "100%" }}>
              <Grid item xs={12} className="grid-elem" style={{backgroundColor: borderColor}} onClick={clickHandler}>
                <Textfit
                  mode="single"
                  forceSingleModeWidth={false}
                  style={{ padding: "0 5% 0 5%", height: "100%"}}
                >
                  {name}
                </Textfit>
              </Grid>
              <Grid item xs={12} className="grid-elem">
                <Textfit
                  mode="single"
                  forceSingleModeWidth={false}
                  style={{ padding: "0 5% 0 5%", height: "100%" }}
                >
                  Health: {health}
                </Textfit>
              </Grid>
              <Grid item xs={6} className="grid-elem" onClick={voidOnClick}>
                <Textfit
                  mode="single"
                  forceSingleModeWidth={false}
                  style={{ padding: "0 5% 0 5%", height: "100%" }}
                >
                  Void: {void_.length}
                </Textfit>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withHandlers(withFirebase(PlayerDisplay)));
