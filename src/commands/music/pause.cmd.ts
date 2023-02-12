import type { CommandInteraction } from "discord.js"
import { Discord, Slash } from "discordx"
import { Music } from './music'

@Discord()
export class PauseCommand extends Music {
  @Slash({ description: "pause music" })
  pause(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction)
    if (!validate) {
      return
    }

    const { queue } = validate

    if (queue.isPause) {
      interaction.reply("Already paused")
      return
    }

    queue.pause()
    interaction.reply("Paused music")
  }
}
