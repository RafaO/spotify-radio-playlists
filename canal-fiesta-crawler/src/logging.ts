import Logger from "js-logger";
import { Toucan } from 'toucan-js';

export function initLogger(sentryDsn: string, ctx: ExecutionContext) {
    let sentry: Toucan;
    sentry = new Toucan({
        dsn: sentryDsn,
        context: ctx,
        environment: "spotify-canal-fiesta",
    });

    Logger.useDefaults({
        defaultLevel: Logger.DEBUG,
        formatter: function (messages, context) {
            if (context.level == Logger.ERROR) {
                sentry.captureException(messages[0]);
            }
        }
    });
}
