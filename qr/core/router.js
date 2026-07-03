/**
 * Router
 */

class Router {

    static async redirect(url, delay = 0) {

        setTimeout(() => {

            window.location.href = url;

        }, delay);

    }

}
