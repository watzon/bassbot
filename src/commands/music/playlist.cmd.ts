import type { CommandInteraction } from "discord.js"
import { ApplicationCommandOptionType, GuildMember } from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"
import { Music } from './music'

@Discord()
export class PlaylistCommand extends Music {
  @Slash({ description: "play a playlist" })
  async playlist(
    @SlashOption({
      description: "playlist name",
      name: "playlist",
      type: ApplicationCommandOptionType.String,
    })
    playlistName: string,
    interaction: CommandInteraction
  ): Promise<void> {
    if (!interaction.guild) {
      return
    }

    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      interaction.reply("You are not in the voice channel")
      return
    }

    await interaction.deferReply()
    const queue = this.queue(interaction.guild)
    if (!queue.isReady) {
      this.channel = interaction.channel ?? undefined
      await queue.join(interaction.member.voice.channel)
    }
    const status = await queue.playlist(playlistName)
    if (!status) {
      interaction.followUp("The playlist could not be found")
    } else {
      interaction.followUp("The requested playlist is being played")
    }
  }
}
