import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://3ce6d32dc3d38efe0423220e0772c4a6@o4509436444278784.ingest.de.sentry.io/4509436451618896",
    tracesSampleRate: 1
})