import * as BotActions from '../action/bot';
import { IBot } from 'botframework-emulator-shared/built/types/botTypes';

export interface IBotState {
  activeBot: string;
  bots: IBot[];
}

export type BotAction = {
  type: 'BOT/CREATE';
  payload: IBot;
} | {
  type: 'BOT/LOAD_BOTS_RESPONSE',
  payload: any
} | {
  type: 'BOT/OPEN';
  payload: IBot;
} | {
  type: 'BOT/PATCH',
  payload: any;
};

const DEFAULT_STATE: IBotState = {
  activeBot: null,
  bots: []
};

export const bot: any = (state: IBotState = DEFAULT_STATE, action: BotAction) => {

  switch(action.type) {
    case BotActions.CREATE:
    case BotActions.OPEN: {
      // set active bot and add bot to bots list
      const bots = [...state.bots, action.payload];
      state = setBotsState(bots, state);
      state = setActiveBot(action.payload.botId, state);
      break;
    }

    case BotActions.PATCH: {
      const botIndex = state.bots.findIndex(bot => bot.botId === action.payload.botId);
      const patchedBot = {
        ...state.bots[botIndex],
        ...action.payload.bot
      };
      const bots = [...state.bots];
      bots[botIndex] = patchedBot;
      state = setBotsState(bots, state);
      state = setActiveBot(patchedBot.botId, state);
      break;
    }

    default: break;
  }
  return state;
}

function setActiveBot(botId, state) {
  let newState = Object.assign({}, state);

  newState.activeBot = botId;
  return newState;
}

function setBotsState(botsState, state) {
  let newState = Object.assign({}, state);

  newState.bots = botsState;
  return newState;
}