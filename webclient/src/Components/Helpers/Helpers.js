import proto from "../../protojs/compiled.js";
import { ServerName, PrintDebug } from "../../Config.js";
import { fontMap, GamePhases, knowledgeMap, fullCollection } from "./Constants";

export function GetProfileURL(userId) {
  return `ws://${ServerName}/profiles/${userId}`;
}

export function GetGameURL(userId, gameID) {
  return `ws://${ServerName}/games/${gameID}/${userId}`;
}

export function debugPrint() {
  if (PrintDebug) {
    console.log(...arguments);
  }
}

export function spliceToSubarrays(arr, len) {
  let res = [];
  for (let i = 0; i * len < arr.length; i++) {
    res.push(arr.slice(i * len, (i + 1) * len));
  }
  return res;
}

export function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = typeof v === "object" ? copy(v) : v;
  }
  return output;
}

export function toIconString(s) {
  var line = "";
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    if (c in fontMap) {
      line += fontMap[c];
    } else {
      line += "?";
    }
  }
  return line;
}

export function getIconColor(knowledgeCost) {
  if (!knowledgeCost || knowledgeCost.length === 0) {
    return "gray";
  }
  var knowlString = toKnowledgeString(knowledgeCost);
  if (knowlString.startsWith("B")) {
    return "black";
  } else if (knowlString.startsWith("U")) {
    return "blue";
  } else if (knowlString.startsWith("R")) {
    return "red";
  } else if (knowlString.startsWith("G")) {
    return "green";
  } else if (knowlString.startsWith("Y")) {
    return "goldenrod";
  } else {
    return "beige";
  }
}

export function IsSelectCardPhase(phase) {
  return [
    GamePhases.SELECT_FROM_LIST,
    GamePhases.SELECT_FROM_PLAY,
    GamePhases.SELECT_FROM_HAND,
    GamePhases.SELECT_FROM_SCRAPYARD,
    GamePhases.SELECT_FROM_VOID,
    GamePhases.SELECT_FROM_STACK
  ].includes(phase);
}

export function toGamePhase(msgType, selectType) {
  switch (msgType) {
    case "SelectFrom":
      switch (selectType) {
        case proto.SelectFromType.LIST:
          return GamePhases.SELECT_FROM_LIST;
        case proto.SelectFromType.HAND:
          return GamePhases.SELECT_FROM_HAND;
        case proto.SelectFromType.PLAY:
          return GamePhases.SELECT_FROM_PLAY;
        case proto.SelectFromType.SCRAPYARD:
          return GamePhases.SELECT_FROM_SCRAPYARD;
        case proto.SelectFromType.VOID:
          return GamePhases.SELECT_FROM_VOID;
        case proto.SelectFromType.STACK:
          return GamePhases.SELECT_FROM_STACK;
        default:
          break;
      }
      break;
    case "UpdateGameState":
      return GamePhases.UPDATE_GAME;
    case "GameEnd":
      return GamePhases.GAME_END;
    case "OrderCards":
      return GamePhases.ORDER_CARDS;
    case "SelectXValue":
      return GamePhases.SELECT_X_VALUE;
    default:
      return GamePhases.NOT_STARTED;
  }
}

export function toSelectFromType(phase) {
  switch (phase) {
    case GamePhases.SELECT_FROM_LIST:
      return proto.SelectFromType.LIST;
    case GamePhases.SELECT_FROM_HAND:
      return proto.SelectFromType.HAND;
    case GamePhases.SELECT_FROM_PLAY:
      return proto.SelectFromType.PLAY;
    case GamePhases.SELECT_FROM_SCRAPYARD:
      return proto.SelectFromType.SCRAPYARD;
    case GamePhases.SELECT_FROM_VOID:
      return proto.SelectFromType.VOID;
    case GamePhases.SELECT_FROM_STACK:
      return proto.SelectFromType.STACK;
    default:
      return proto.SelectFromType.NONE;
  }
}

export function getCardColor(knowledgeCost) {
  if (!knowledgeCost || knowledgeCost.length === 0) {
    return "darkgray";
  }
  if (knowledgeCost.length > 1) {
    return "orange";
  }

  var knowlString = toKnowledgeString(knowledgeCost);
  if (knowlString.startsWith("B")) {
    return "dimgray";
  } else if (knowlString.startsWith("U")) {
    return "royalblue";
  } else if (knowlString.startsWith("R")) {
    return "firebrick";
  } else if (knowlString.startsWith("Y")) {
    return "goldenrod";
  } else if (knowlString.startsWith("G")) {
    return "forestgreen";
  } else {
    return "#e6e6e6";
  }
}

export function toKnowledgeString(knowledgeCost) {
  var str = "";
  if (!knowledgeCost){
    return str
  }

  for (var i = 0; i < knowledgeCost.length; i++) {
    for (var j = 0; j < knowledgeCost[i].count; j++) {
      str = str + knowledgeMap[knowledgeCost[i].knowledge];
    }
  }
  return str;
}

export function toKnowledgeCost(knowledgeString) {
  var cost = {};

  for (var i = 0; i < knowledgeString.length; i++) {
    var c = knowledgeString.charAt(i);
    if (c in knowledgeMap) {
      var v = knowledgeMap[c];
      if (v in cost) {
        cost[v] += 1;
      } else {
        cost[v] = 1;
      }
    }
  }

  var res = [];
  for (var k in cost) {
    res.push({ knowledge: parseInt(k), count: cost[k] });
  }
  return res;
}

export function delayClick(onClick, onDoubleClick, delay) {
  var timeoutID = null;
  delay = delay || 200;
  return event => {
    if (!timeoutID) {
      timeoutID = setTimeout(() => {
        if (onClick) {
          onClick(event);
        }
        timeoutID = null;
      }, delay);
    } else {
      timeoutID = clearTimeout(timeoutID);
      onDoubleClick(event);
    }
  };
}

export function compareCardsByKnowledge (a, b){
  if (toKnowledgeString(a.knowledgeCost) > toKnowledgeString(b.knowledgeCost)){
    return 1;
  } else if (toKnowledgeString(a.knowledgeCost) < toKnowledgeString(b.knowledgeCost)){
    return -1;
  } else {
    if (a.cost > b.cost){
      return 1;
    } else if (a.cost < b.cost){
      return -1;
    } else {
      if (a.name > b.name){
        return 1;
      } else if (a.name < b.name){
        return -1;
      } else {
        return 0;
      }
    }
  }
}

export function toFullCards(collection) {
  var col = {};
  Object.keys(collection).forEach(key => {
    col[key] = fullCollection[key];
  });
  return col;
}