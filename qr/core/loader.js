/**
 * SilverQR Loader
 */

class Loader {

    static async json(path) {

        const response = await fetch(path + "?t=" + Date.now());

        if (!response.ok)
            throw new Error(path);

        return await response.json();

    }

}
