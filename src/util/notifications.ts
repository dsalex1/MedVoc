//experimental features used here, extended declaration to make tsc happy
declare global {
    interface NotificationOptions {
        showTrigger: TimestampTrigger;
    }
    interface TimestampTrigger {
        timestamp: number;
    }
    const TimestampTrigger: {
        new (value: number): TimestampTrigger;
    };
    interface GetNotificationOptions {
        includeTriggered: boolean;
    }
    interface Notification {
        readonly showTrigger: TimestampTrigger | null;
    }
}

import moment from "moment";
import * as API from "../API";

export const updatingScheduledNotifications = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return alert("The service worker has not been registered properly, cannot schedule notifications.");

    console.log("updating notifications");
    const notifications = await registration.getNotifications({ includeTriggered: true });
    const weeklyLength = API.getCurrentWeek()?.indicies?.length || 0;
    //if (weeklyLength > 4) {
    const sat = moment()
        .add(1, "week")
        .isoWeekday(6)
        .hours(19)
        .startOf("hour")
        .valueOf(); //next saturday at 18:00

    //if there is no notification scheduled for next saturday, schedule
    //if (!notifications.some(n => n.showTrigger?.timestamp == sat)) { //if not neccessary because of tag magic?
    console.log("scheduled weekly review");
    registration?.showNotification(`Weekly Vocab Review (${weeklyLength} sets)`, {
        tag: "weekly|" + sat,
        body: "Review The Vocabulary you have learned this week.",
        showTrigger: new TimestampTrigger(sat)
    });
    //} else console.log("weekly review already scheduled");
    //}
    for (let day = moment().isoWeekday(); day < 14; day++) {
        const timestamp = moment()
            .isoWeekday(1)
            .add(day, "days")
            .hours(18)
            .startOf("hour")
            .valueOf(); //the day'th day of this week at 18:00
        if (!notifications.some(n => n.showTrigger?.timestamp == timestamp)) {
            console.log("scheduled daily for " + new Date(timestamp));
            registration?.showNotification("Daily Vocabulary", {
                tag: "daily|" + timestamp,
                body: "Learn some new vocabulary every day!",
                showTrigger: new TimestampTrigger(timestamp)
            });
        }
    }
};
