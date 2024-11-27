import { Event, Firehose } from "@atproto/sync";
import { IdResolver } from "@atproto/identity";
import { Redis } from "ioredis";

const redis = new Redis();

const handleEvent = async (event: Event) => {
    if (event.event == "create" && event.record["$type"] == "app.bsky.feed.post") {
        const score = randScore(-100, 100);
        const did = event.uri.host;

        await redis.incrby(userScoreKey(did), score);
        console.log(`Gave ${did} ${score} points`);
    }
}

const randScore = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const userScoreKey = (did: string): string => {
    return `${did}_score`;
}

const idResolver = new IdResolver();
const firehose = new Firehose({
    idResolver,
    handleEvent,
    onError: (_err: Error) => { }
});


firehose.start();
