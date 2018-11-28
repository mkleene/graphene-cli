import * as Color from "./color";
import { Command } from "./command";

import { CloseCommand } from "./commands/close";
import { HashCommand } from "./commands/hash";
import { ModuleCommand } from "./commands/module";
import { ObjectCommand } from "./commands/object";
import { SlotCommand } from "./commands/slot";
import { TestCommand } from "./commands/test";
import { VersionCommand } from "./commands/version";

import * as c from "./const";

export class Application extends Command {

    public name = "graphene";
    public description = "The graphene-cli is a cross-platform command line tool for working with PKCS#11 devices";

    constructor() {
        super();

        this.commands.push(new VersionCommand(this));
        this.commands.push(new CloseCommand(this));
        this.commands.push(new ModuleCommand(this));
        this.commands.push(new SlotCommand(this));
        this.commands.push(new ObjectCommand(this));
        this.commands.push(new HashCommand(this));
        this.commands.push(new TestCommand(this));
    }

    public async run(args: string[]): Promise<Command> {
        const commands = args[2]
            && args[2].split("\\n").map(((l) => l.split(" ")))
            || [];
        let repeat = true;
        while (repeat) {
            const args2 = commands.shift() || await c.readline.prompt();
            try {
                const command = await super.run(args2);
                if (command instanceof CloseCommand) {
                    repeat = false;
                }
            } catch (e) {
                const lastCommand = commands[commands.length - 1];
                if (args.length >= 2 && Array.isArray(lastCommand) && lastCommand[0] === "exit") {
                    console.error(e);
                    process.exit(1);
                }
                console.error(`\n${Color.FgRed}Error${Color.Reset}`, e.message);
                const command = this.getCommand(args2);
                command.showHelp();
            }
        }
        return this;
    }

    protected async onRun(args: string[]): Promise<Command> {
        this.showHelp();
        return this;
    }

}
