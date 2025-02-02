import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { connect } from "react-redux";
import { TextField, Grid, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@material-ui/core";

import { GamePhases } from "../Helpers/Constants";
import { mapDispatchToProps } from "../Redux/Store";
import { withFirebase } from "../Firebase";

const mapStateToProps = state => {
  return {
    phase: state.extendedGameState.phase,
    win: state.extendedGameState.win,
    gameId: state.extendedGameState.game.id,
    userId: state.authUser.user.uid
  };
};

class EndGameDialog extends Component {
  state = {
    verdict: "",
    bestAspects: "",
    worstAspects: "",
    potential: "",
    replay: "",
    other: ""
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  back = () => {
    const { updateExtendedGameState, back } = this.props;
    updateExtendedGameState({
      gameInitialized: false,
      phase: GamePhases.NOT_STARTED
    });
    back();
  };

  submit = event => {
    const { firebase, gameId, userId } = this.props;
    firebase.submitFeedback({
      userId: userId,
      gameId: gameId,
      ...this.state
    });
    this.setState({
      verdict: "",
      bestAspects: "",
      worstAspects: "",
      potential: "",
      replay: "",
      other: ""
    });
    this.back();
  };


  render = () => {
    const { phase, win } = this.props;
    const {verdict, bestAspects, worstAspects, potential, replay, } = this.state;

    const open = phase === GamePhases.GAME_END;

    const submitDisabled = 
      verdict === "" ||
      bestAspects === "" ||
      worstAspects === "" ||
      potential === "" ||
      replay === "";


    return (
      <Dialog open={open} scroll="body">
        <DialogTitle>{win ? "You Win!" : "You Lose..."}</DialogTitle>
        <DialogTitle>{"Please Provide Feedback"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TextField
                multiline
                name="verdict"
                label="What is your overall verdict of Visitor?"
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                name="bestAspects"
                label="What are the best aspects?"
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                name="worstAspects"
                label="What are the worst aspects?"
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Do you think Visitor has a potential?
                </FormLabel>
                <RadioGroup
                  aria-label="Potential"
                  name="potential"
                  value={potential}
                  onChange={this.onChange}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio/>} label="No" />
                  <FormControlLabel
                    value="maybe"
                    control={<Radio />}
                    label="Maybe"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Would you like to play Visitor again in the future?
                </FormLabel>
                <RadioGroup
                  aria-label="Replay"
                  name="replay"
                  value={replay}
                  onChange={this.onChange}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  <FormControlLabel
                    value="maybe"
                    control={<Radio />}
                    label="Maybe"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                name="other"
                label="Do you have other comments?"
                onChange={this.onChange}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" disabled={submitDisabled} onClick={this.submit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <Button type="submit" variant="contained" onClick={this.back}>
          Back
        </Button>
      </Dialog>
    );
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebase(EndGameDialog));
