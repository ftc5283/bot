import chalk from 'chalk';

export default class Loger {
    public static log(level: number, message: string): void {
        switch(level) {
            case 0:
                console.error(chalk.red('FATAL') + '\t' + this.formatString(message));
                process.exit();
            case 1:
                console.error(chalk.redBright('ERORR') + '\t' + this.formatString(message));
                return void 0;
            case 2:
                console.warn(chalk.yellow('WARN') + '\t' + this.formatString(message));
                return void 0;
            case 3:
                console.log(chalk.blackBright('INFO') + '\t' + this.formatString(message));
                return void 0;
            case 4:
                console.log(chalk.grey('DEBUG') + '\t' + this.formatString(message));
                return void 0;
        }
        if(level > 4) this.log(4,message);

    }

    private static formatString(string: string): string {
        return `${chalk.grey(new Date().toISOString())}\t${string}`;
    }
}