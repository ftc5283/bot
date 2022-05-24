import { APIUser, Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { parse, stringify } from 'yaml'
import fs from 'fs';

import Logger from './logger';

export default class Main {
    public static main (args: string[]): void {
        var configFile:string;
        try { 
            configFile = fs.readFileSync('./config.yml','utf-8');
        } catch(e) {
            Logger.log(0,'Could not read config.yml, exiting...');
            process.exit();
        }
        const rest:REST = new REST({version: '10'});
    }
}