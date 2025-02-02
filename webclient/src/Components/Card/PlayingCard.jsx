import React from "react";
import { DragSource, DropTarget} from "react-dnd";
import { connect } from "react-redux";

import CardDisplay from "./CardDisplay";
import { ItemTypes } from "../Helpers/Constants";
import { cardSource, cardTarget } from "./PlayingCardDnd";

import proto from "../../protojs/compiled.js";
import { mapDispatchToProps } from "../Redux/Store";
import { withHandlers } from "../MessageHandlers/HandlerContext";
import { withSize } from "react-sizeme";

const mapStateToProps = state => {
  return {
    phase: state.extendedGameState.phase,
    playableCards: state.extendedGameState.game.canPlay,
    studyableCards: state.extendedGameState.game.canStudy,
    activatableCards: state.extendedGameState.game.canActivate,
    selectedCards: state.extendedGameState.selectedCards,
    selectableCards: state.extendedGameState.selectableCards,
    displayTargets: state.extendedGameState.targets,
    selectCountMax: state.extendedGameState.selectCountMax
  };
};

export class PlayingCard extends React.Component {
  onMouseEnter = event => {
    this.props.updateExtendedGameState({ targets: this.props.targets });
  };

  onMouseLeave = event => {
    this.props.updateExtendedGameState({ targets: [] });
  };

  select = event => {
    let id = this.props.id;
    let selected = [...this.props.selectedCards];
    let maxCount = this.props.selectCountMax;
    let phase = this.props.phase;

    if (selected.length < maxCount) {
      selected.push(id);
      this.props.updateExtendedGameState({ selectedCards: selected });
    }
    if (selected.length === maxCount) {
      this.props.gameHandler.SelectDone(phase, selected);
    }
  };

  unselect = event => {
    let id = this.props.id;
    let selected = [...this.props.selectedCards];

    if (selected.includes(id)) {
      selected.splice(selected.indexOf(id), 1);
      this.props.updateExtendedGameState({
        selectedCards: selected
      });
    }
  };


  render() {
    const {
      id,
      depleted,
      isOver,
      canDrop,
      isDragging,
      connectDragSource,
      selectableCards,
      selectedCards,
      displayTargets,
      activatableCards,
      playableCards,
      gameHandler
    } = this.props;

    const activatable = activatableCards.includes(id);
    const playable = playableCards.includes(id);
    const selectable = selectableCards.includes(id);
    const selected = selectedCards.includes(id);
    const targeted = displayTargets.includes(id);

    var opacity = 1,
      borderColor = "";
    let clickHandler = undefined;
    if (isDragging) {
      opacity = 0.5;
      borderColor = "yellow";
    } else if (canDrop && isOver) {
      borderColor = "red";
    } else if (targeted) {
      borderColor = "yellow";
    } else if (selected) {
      borderColor = "magenta";
      clickHandler = this.unselect;
    } else if (selectable) {
      clickHandler = this.select;
      borderColor = "green";
    } else if (activatable) {
      clickHandler = event => {
        gameHandler.ActivateCard(id);
      };
      borderColor = "blue";
    } else if (playable) {
      borderColor = "blue";
    }

    if (depleted) {
      opacity = 0.5;
    }

    const counterMap = {};
    counterMap[proto.Counter.CHARGE] = "C";

    return connectDragSource(
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={this.props.style}
      >

          <CardDisplay
            opacity={opacity}
            borderColor={borderColor}
            onClick={clickHandler}
            {...this.props}
          />
      </div>
    );
  }
}

PlayingCard = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))(PlayingCard);

PlayingCard = DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(PlayingCard);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withHandlers(withSize()(PlayingCard)));
