import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField, Partials } from "discord.js";
import { Client } from "discordx";
import * as dotenv from "dotenv";

import { generateInviteLink } from "./utils";

dotenv.config();

export const bot = new Client({
  // To only use global commands (use @Guild for specific guild command), comment this line
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessageReactions,
  ],

  // Partials
  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],

  // Debug logs are disabled in silent mode
  silent: false,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "!",
  },
});

bot.once("ready", async () => {
  // Make sure all guilds are cached
  await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  )

  console.log("Bot started");

  const inviteLink = generateInviteLink();
  if (inviteLink) {
    console.log("Invite the bot to your server with the following link");
    console.log(inviteLink);
  }

  // set bot activity
  if (bot.user) {
    const activity = process.env.BOT_ACTIVITY;
    if (activity) {
      bot.user.setActivity(activity);
    }
  }
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  // Import commands/events
  await importx(dirname(import.meta.url) + "/{events,commands}/**/*.cmd.{ts,js}");

  // Let's start the bot
  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  // Log in with your bot token
  await bot.login(process.env.BOT_TOKEN);
}

run();
