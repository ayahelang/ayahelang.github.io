/**
 * Scheduler Engine
 */

class Scheduler {

    constructor(rules) {

        this.rules = rules;

    }

    getCurrentRule() {

        const day = Utils.dayName();

        const time = Utils.time();

        let active = null;

        for (const rule of this.rules) {

            if (!rule.enabled)
                continue;

            if (!rule.days.includes(day))
                continue;

            if (time < rule.start)
                continue;

            if (time > rule.end)
                continue;

            if (!active)
                active = rule;

            else if (rule.priority > active.priority)
                active = rule;

        }

        return active;

    }

}
