import { Event, Firehose } from "@atproto/sync";
import { IdResolver } from "@atproto/identity";

const handleEvent = async (event: Event) => {
    if (event.event == "create" && event.record["$type"] == "app.bsky.feed.post") {
        console.log(`${event.uri.host}: ${event.record.text}`);
    }
}

const idResolver = new IdResolver();
const firehose = new Firehose({
    idResolver,
    handleEvent,
    onError: (_err: Error) => { }
});


firehose.start();
