import type { CommandInteraction } from "discord.js"
import { ApplicationCommandOptionType } from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"
import { Music } from './music'

@Discord()
export class SeekCommand extends Music {
  @Slash({ description: "seek music" })
  seek(
    @SlashOption({
      description: "seek time in seconds",
      name: "time",
      type: ApplicationCommandOptionType.Number,
    })
    time: number,
    interaction: CommandInteraction
  ): void {
    const validate = this.validateInteraction(interaction)
    if (!validate) {
      return
    }

    const { queue } = validate

    if (!queue.isPlaying || !queue.currentTrack) {
      interaction.reply("Currently not playing any song")
      return
    }

    const state = queue.seek(time * 1e3)
    if (!state) {
      interaction.reply("Could not seek")
      return
    }
    interaction.reply("Current music seeked")
  }
}
