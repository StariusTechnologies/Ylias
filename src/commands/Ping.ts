import { Command } from '@sapphire/framework';

export default class PingCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Tests the latency.',
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder.setName(this.name).setDescription(this.description)
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        const response = await interaction.reply({ content: 'Ping...', fetchReply: true });
        const latency = response.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Pong! Took me ${latency}ms.`);
    }
}
