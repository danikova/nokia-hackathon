import { createCommand, LexicalCommand } from 'lexical';

export const LINK_SELECTOR = `[data-lexical-editor] a`;
export const OPEN_LINK_MENU_ID = 'open-link-menu';
export const TOGGLE_EDIT_LINK_MENU: LexicalCommand<undefined> = createCommand();
