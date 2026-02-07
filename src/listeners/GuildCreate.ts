import { Events, Guild, type MessageCreateOptions } from 'discord.js';
import { Listener } from '@sapphire/framework';
import { Emotion, Emotions } from '#lib/Emotion';
import Logger from '@lilywonhalf/pretty-logger';

export default class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: Events.GuildCreate,
        });
    }

    public async run(guild: Guild): Promise<void> {
        const mom = guild.client.users.cache.get(process.env.MOM as string);
        const owner = await guild.fetchOwner().catch(Logger.notice);
        const invites = await guild.invites.fetch().catch(Logger.notice);
        const inviteLinks = [];

        if (invites && invites.size > 0) {
            inviteLinks.push(...invites.map(invite => `#${invite.channel?.name ?? 'unknown'}: https://discord.gg/${invite.code}`));
        }

        const embed = Emotion.getEmotionEmbed(Emotions.SURPRISE)
            .setTitle('Just joined a server!')
            .setDescription(`**${guild.name}** owned by **${owner ? owner.user.tag : 'Unknown'}**`);
        const data: MessageCreateOptions = { embeds: [embed] };

        if (guild.vanityURLCode) {
            data.content = `https://discord.gg/${guild.vanityURLCode}`;
        } else if (inviteLinks.length > 0) {
            data.content = inviteLinks.slice(0, 10).join('\n');
        }

        await mom!.send(data);
    }
}
