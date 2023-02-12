import { Discord, Slash } from 'discordx'
import type { CommandInteraction } from 'discord.js'

@Discord()
export class PingCommand {
  @Slash({ name: "ping", description: "ping the bot" })
  async ping(int: CommandInteraction) {
    await int.reply({ content: "Pong!", ephemeral: true })
  }
}
