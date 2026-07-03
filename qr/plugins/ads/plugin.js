class Plugin{

    run(){

        document.body.innerHTML=`

        <div class="ads">

            <img src="assets/logo.png" class="logo">

            <h1>Silverhawk</h1>

            <h2>Smart Digital Solution</h2>

            <p>

            Website

            AI

            Programming

            QR System

            </p>

            <button id="skip">

            Skip

            </button>

        </div>

        `;

        document
        .getElementById("skip")
        .onclick=()=>{

            this.gotoWA();

        };

        setTimeout(()=>{

            this.gotoWA();

        },5000);

    }

    gotoWA(){

        const phone="6285158822803";

        const msg=`Halo pak.Teddy
Nama saya :

tolong kirim lokasi terkini Bapak ya.
saya perlu tahu seberapa jauh dari saya.

(this feature is powered by https://silverhawk.web.id)`;

        location.href=

        "https://wa.me/"

        +phone

        +"?text="

        +encodeURIComponent(msg);

    }

}
