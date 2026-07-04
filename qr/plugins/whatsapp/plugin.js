class Plugin{

    run(){

        const phone="6285158822803";

        const msg=`Halo pak.Teddy
Nama saya :

tolong kirim lokasi terkini Bapak ya.
saya perlu tahu seberapa jauh dari saya.

(this feature is powered by https://silverhawk.web.id)`;

        const url=
        "https://wa.me/"
        +phone
        +"?text="
        +encodeURIComponent(msg);

        location.href=url;

    }

}
window.Plugin = Plugin;
