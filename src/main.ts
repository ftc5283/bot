import { APIUser, Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { Client, DiscordAPIError, Intents, MessageAttachment } from 'discord.js';

import express from 'express';

import YAML from 'yaml'
import fs from 'fs';

import Logger from './logger';
import Config from './config';
import GroupMeMessage from './groupMeMessage';
import GroupMeAttachment from './groupMeAttachment';

export default class Main {
    public static main(args: string[]): void {
        var configFile: string;
        try {
            configFile = fs.readFileSync('./config.yml', 'utf-8');
        } catch (e) {
            Logger.log(0, 'Could not read config.yml, exiting...');
            return; // <-- This return will never actually run
        }

        const config: Config = YAML.parse(configFile);

        const commands: Object[] = [];

        const rest: REST = new REST({ version: '10' });

        (async () => {
            try {
                Logger.log(3, 'Starting the Discord Bot');

                if (commands.length > 0) {
                    Logger.log(3, 'Registering Slash Commands');

                    await rest.put(
                        Routes.applicationGuildCommands(config.clientID, config.guildID),
                        {
                            body: commands,
                        }
                    );

                    Logger.log(3, 'Registered Slash Commands into Discord');
                }

                var client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

                var app = express();
                app.use(express.json());

                app.post('/api/v1/push',(req,res) => {
                    let json: GroupMeMessage = req.body;
                    if(json.sender_type !== 'user') return;
                    if(json.attachments.length > 0 && json.attachments[0].type === "location") json.attachments = [];

                    // no attachments yet.

                    let discordMessage = {
                        content: json.text,
                        username: json.name,
                        avatar_url: json.avatar_url,
                    };

                    fetch(config.groupMeWebhook, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(discordMessage),
                    });

                    for(let i = 0; i < json.attachments.length; i++) {
                        let attachment = json.attachments[i];
                        let body = {
                            content: attachment.url,
                            username: json.name,
                            avatar_url: json.avatar_url,
                        }
                        
                        fetch(config.groupMeWebhook, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body),
                        });
                    }


                    // This doesn't work in Insomnia but I don't care enough to fix it.
                    req.pause();
                    res.status(200);
                    res.destroy();
                    res.end();
                });

                client.on('ready', () => {
                    Main.onReady(client)
                });

                client.on('messageCreate', (message) => {
                    if (message.channelId === config.groupMeChannelID) {
                        if (!message.author.bot) {
                            (async () => {
                                let attachments: any = await (async () => {
                                    const attachments: any[] = [];
                                    for (let attachment of message.attachments) {
                                        let attachmentContent: any = await fetch(attachment[1].url);
                                        if (attachmentContent.headers.get('Content-Type').indexOf('image/') !== -1) {
                                            let content = await attachmentContent.blob();
                                            let uploadedPicture = await fetch('https://image.groupme.com/pictures', {
                                                body: content,
                                                headers: {
                                                    'Content-Type': attachmentContent.headers.get('Content-Type')!,
                                                    'X-Access-Token': config.groupMeAccessToken
                                                },
                                                method: 'POST',
                                            });
                                            let pictureData = await uploadedPicture.json();
                                            attachments.push({
                                                type: 'image',
                                                url: pictureData.payload.url,
                                            });
                                        }
                                    }
                                    return attachments;
                                })();

                                let bodyData: string = JSON.stringify({
                                    bot_id: config.groupMeID,
                                    text: `${message.author.tag} ${message.cleanContent}`,
                                });
                                await fetch('https://api.groupme.com/v3/bots/post', {
                                    body: bodyData,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                });
                                for(let attachment of attachments) {
                                    await fetch('https://api.groupme.com/v3/bots/post', {
                                        body: JSON.stringify({
                                            bot_id: config.groupMeID,
                                            text: message.author.tag,
                                            attachments: [attachment],
                                        }),
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    });
                                }
                            })();
                        }
                    }
                });

                client.login(config.discordToken);

                Logger.log(3,'Starting the Web Service');
                app.listen(config.port, () => {
                    Logger.log(3,'Started the Web Service');
                });
            } catch (e: any) {
                Logger.log(1, e.toString());
            }
        })();
    }

    private static onReady(client: Client): void {
        Logger.log(3, 'Started the Discord Bot')
        Logger.log(3, `Bot is logged in as ${client.user!.tag}`);
    }
}