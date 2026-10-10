/**
 * Utils
 */

class Utils {

    static now() {

        return new Date();

    }

    static dayName() {

        return [

            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"

        ][new Date().getDay()];

    }

    static time() {

        const d = new Date();

        return d.toLocaleTimeString(
            "en-GB",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }

}
