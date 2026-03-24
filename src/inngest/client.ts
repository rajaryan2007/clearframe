import { Inngest } from "inngest";


export const inngest = new Inngest({
    id: "clearframe",
    eventKey: process.env.INNGEST_EVENT_KEY,
});