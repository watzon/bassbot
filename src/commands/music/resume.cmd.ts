import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { Music } from "./music";

@Discord()
export class ResumeCommand extends Music {
  @Slash({ description: "resume music" })
  resume(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;

    if (queue.isPlaying) {
      interaction.reply("Already playing");
      return;
    }

    queue.resume();
    interaction.reply("Resumed music");
  }
}
