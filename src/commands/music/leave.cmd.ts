import type { CommandInteraction } from "discord.js"
import { Discord, Slash } from "discordx"
import { Music } from './music'

@Discord()
export class LeaveCommand extends Music {
  @Slash({ description: "stop music" })
  leave(interaction: CommandInteraction): void {
    const validate = this.validateInteraction(interaction)
    if (!validate) {
      return
    }

    const { queue } = validate
    queue.leave()
    interaction.reply("Stopped music")
  }
}
