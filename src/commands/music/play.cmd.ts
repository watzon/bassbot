import type { CommandInteraction } from "discord.js"
import { ApplicationCommandOptionType, GuildMember } from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"
import { getTrackData, SPOTIFY_TRACK_RE } from "../../utils"
import { Music } from './music'

@Discord()
export class PlayCommand extends Music {
  @Slash({ description: "play a song" })
  async play(
    @SlashOption({
      description: "song url or title",
      name: "song",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    songName: string,
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

    if (SPOTIFY_TRACK_RE.test(songName)) {
      const track = await getTrackData(songName)
      if (!track) {
        interaction.followUp("The requested Spotify track could not be found. Try entering the name of the song manually.")
        return
      }
      const artists = track.artists.map((a: any) => a.name).join(' and ')
      songName = `${track.name} by ${artists}`
    }

    console.log(`Queuing: ${songName}`)
    const status = await queue.play(songName)
    if (!status) {
      interaction.followUp("The song could not be found")
    } else {
      interaction.followUp("The requested song is being played")
    }
  }
}
