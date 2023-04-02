import type { Queue } from "@discordx/music";
import { Player } from "@discordx/music";
import type { CommandInteraction, Guild, TextBasedChannel } from "discord.js";
import { GuildMember } from "discord.js";

export class Music {
  player: Player;
  channel: TextBasedChannel | undefined;

  constructor() {
    this.player = new Player();

    this.player.on("onStart", ([, track]) => {
      if (this.channel) {
        const trackText = track.url ? `[${track.title}](${track.url})` : track.title;
        this.channel.send({
          embeds: [{
            color: 0,
            description: `**Playing** ${trackText}`,
          }]
        });
      }
    });

    this.player.on("onFinishPlayback", () => {
      if (this.channel) {
        this.channel.send(
          "All songs have been played, please queue up more songs :musical_note:"
        );
      }
    });

    this.player.on("onPause", () => {
      if (this.channel) {
        this.channel.send("Music paused");
      }
    });

    this.player.on("onResume", () => {
      if (this.channel) {
        this.channel.send("Music resumed");
      }
    });

    this.player.on("onError", ([, err, track]) => {
      if (this.channel) {
        this.channel.send(
          `Track: ${track.source}\nError: \`\`\`${err.message}\`\`\``
        );
      }
    });

    this.player.on("onFinish", ([, track]) => {
      if (this.channel) {
        this.channel.send(`Finished playing: ${track.title}`);
      }
    });

    this.player.on("onLoop", () => {
      if (this.channel) {
        this.channel.send("Music resumed");
      }
    });

    this.player.on("onRepeat", () => {
      if (this.channel) {
        this.channel.send("Music resumed");
      }
    });

    this.player.on("onSkip", () => {
      if (this.channel) {
        this.channel.send("Music resumed");
      }
    });

    this.player.on("onTrackAdd", ([, track]) => {
      if (this.channel) {
        this.channel.send(`Added tracks in queue: ${track.length}`);
      }
    });

    this.player.on("onLoopEnabled", () => {
      if (this.channel) {
        this.channel.send("Loop mode enabled");
      }
    });

    this.player.on("onLoopDisabled", () => {
      if (this.channel) {
        this.channel.send("Loop mode disabled");
      }
    });

    this.player.on("onRepeatEnabled", () => {
      if (this.channel) {
        this.channel.send("Repeat mode enabled");
      }
    });

    this.player.on("onRepeatDisabled", () => {
      if (this.channel) {
        this.channel.send("Repeat mode disabled");
      }
    });

    this.player.on("onMix", ([, tracks]) => {
      if (this.channel) {
        this.channel.send(`Mixed tracks: ${tracks.length}`);
      }
    });

    this.player.on("onVolumeUpdate", ([, volume]) => {
      if (this.channel) {
        this.channel.send(`Volume changed to: ${volume}`);
      }
    });
  }

  queue(guild: Guild): Queue {
    return this.player.queue(guild);
  }

  validateInteraction(
    interaction: CommandInteraction
  ): undefined | { guild: Guild; member: GuildMember; queue: Queue } {
    if (!interaction.guild || !(interaction.member instanceof GuildMember)) {
      interaction.reply("Could not process your request");
      return;
    }

    if (!interaction.member.voice.channel) {
      interaction.reply("You are not in the voice channel");
      return;
    }

    const queue = this.queue(interaction.guild);

    if (!queue.isReady) {
      interaction.reply("I'm not ready yet");
      return;
    }

    if (interaction.member.voice.channel.id !== queue.voiceChannelId) {
      interaction.reply("You are not in my voice channel");
      return;
    }

    return { guild: interaction.guild, member: interaction.member, queue };
  }
}
