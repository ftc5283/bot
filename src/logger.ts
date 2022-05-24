import dateFormat from 'dateformat';
import chalk from 'chalk';


export default class Loger {
    public static log(level: number, message: string): void {
        switch(level) {
            case 0:
                console.error(chalk.red('FATAL') + '\t' + this.formatString(message));
                return void 0;
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
                console.log(chalk.red('DEBUG') + '\t' + this.formatString(message));
                return void 0;
        }
        if(level > 4) this.log(2,'Logging level cannot be greater than 5');

    }

    private static formatString(string: string): string {
        return `${chalk.grey(dateFormat(new Date(),'UTC:mm/dd/yy hh:MM:ss'))}\t${string}`;
    }
}