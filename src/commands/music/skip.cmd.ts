import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

import { Music } from "./music";

@Discord()
export class SkipCommand extends Music {
  @Slash({ description: "skip track" })
  skip(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction);
    if (!validate) {
      return;
    }

    const { queue } = validate;

    queue.skip();
    interaction.reply("Skipped current track");
  }
}
