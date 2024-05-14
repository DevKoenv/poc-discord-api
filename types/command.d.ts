import type { EmbedData } from "discord.js";

export interface Field {
  name: string;
  value: string;
  inline?: boolean;
}

export interface Embed extends EmbedData {
  color: string;
}

export interface Button {
  type: 2;
  label: string;
  style: 1;
  customId: string;
}

export interface SelectMenuOption {
  label: string;
  value: string;
  description?: string;
  emoji?: string;
  default?: boolean;
}

export interface SelectMenu {
  type: 3;
  customId: string;
  minValues?: number;
  maxValues?: number;
  options: SelectMenuOption[];
}

export type Component = Button | SelectMenu;

export interface ResponseJson {
  content: string;
  embeds: Embed[];
  components: Component[][];
}