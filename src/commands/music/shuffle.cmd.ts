import type { CommandInteraction } from "discord.js"
import { Discord, Slash } from "discordx"
import { Music } from './music'

@Discord()
export class ShuffleCommand extends Music {
  @Slash({ description: "shuffle tracks" })
  shuffle(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction)
    if (!validate) {
      return
    }

    const { queue } = validate

    queue.mix()
    interaction.reply("Mixed queue")
  }
}
