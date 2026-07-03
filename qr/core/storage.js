/**
 * SilverQR Storage Engine
 * Version : 1.0
 * Author  : Teddy Mulyana & ChatGPT
 */

const Storage = {

    prefix: "SilverQR.",

    save(key, value) {
        localStorage.setItem(
            this.prefix + key,
            JSON.stringify(value)
        );
    },

    load(key, defaultValue = null) {

        const data = localStorage.getItem(
            this.prefix + key
        );

        if (!data) return defaultValue;

        try {

            return JSON.parse(data);

        } catch {

            return defaultValue;

        }

    },

    remove(key) {

        localStorage.removeItem(
            this.prefix + key
        );

    },

    clear() {

        Object.keys(localStorage)

            .filter(k => k.startsWith(this.prefix))

            .forEach(k => localStorage.removeItem(k));

    }

};
